package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"
	"time"
)

// AlertRecord is a persisted alert with clip file reference.
type AlertRecord struct {
	ID         string  `json:"id"`
	PolicyName string  `json:"policy_name"`
	CamID      string  `json:"cam_id"`
	Message    string  `json:"message"`
	Priority   string  `json:"priority"`
	Timestamp  float64 `json:"timestamp"`
	ClipFile   string  `json:"clip_file,omitempty"`
	CreatedAt  string  `json:"created_at"`
}

// AlertStore manages the in-memory and on-disk alert history.
type AlertStore struct {
	mu       sync.RWMutex
	filePath string
	alerts   []AlertRecord
}

// NewAlertStore creates a new alert store, loading existing alerts from disk.
func NewAlertStore(filePath string) *AlertStore {
	store := &AlertStore{
		filePath: filePath,
		alerts:   make([]AlertRecord, 0),
	}
	store.load()
	return store
}

func (s *AlertStore) load() {
	data, err := os.ReadFile(s.filePath)
	if err != nil {
		return
	}
	var alerts []AlertRecord
	if err := json.Unmarshal(data, &alerts); err != nil {
		fmt.Fprintf(os.Stderr, "warning: gagal parse alerts file: %v\n", err)
		return
	}
	s.alerts = alerts
}

func (s *AlertStore) save() error {
	data, err := json.MarshalIndent(s.alerts, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(s.filePath, data, 0644)
}

// Add appends a new alert record and persists to disk.
func (s *AlertStore) Add(record AlertRecord) {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.alerts = append([]AlertRecord{record}, s.alerts...)

	// Keep only the last 500 alerts to prevent unbounded growth
	if len(s.alerts) > 500 {
		s.alerts = s.alerts[:500]
	}

	if err := s.save(); err != nil {
		fmt.Fprintf(os.Stderr, "warning: gagal simpan alert: %v\n", err)
	}
}

// GetAll returns all stored alerts, newest first.
func (s *AlertStore) GetAll() []AlertRecord {
	s.mu.RLock()
	defer s.mu.RUnlock()

	result := make([]AlertRecord, len(s.alerts))
	copy(result, s.alerts)
	return result
}

// GetRecent returns the N most recent alerts.
func (s *AlertStore) GetRecent(n int) []AlertRecord {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if n > len(s.alerts) {
		n = len(s.alerts)
	}
	result := make([]AlertRecord, n)
	copy(result, s.alerts[:n])
	return result
}

// Server holds shared state for the HTTP API.
type Server struct {
	alertStore    *AlertStore
	cooldown      *CooldownState
	policyDir     string
	clipsDir      string
	videoSources  map[string]string // cam_id -> video file path
	engineBaseDir string            // base directory for resolving relative video paths
}

// NewServer creates a new HTTP server with all dependencies.
func NewServer(alertStore *AlertStore, cooldown *CooldownState, policyDir, clipsDir, engineBaseDir string, videoSources map[string]string) *Server {
	return &Server{
		alertStore:    alertStore,
		cooldown:      cooldown,
		policyDir:     policyDir,
		clipsDir:      clipsDir,
		videoSources:  videoSources,
		engineBaseDir: engineBaseDir,
	}
}

// corsMiddleware adds CORS headers to allow frontend dev server to connect.
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

// RegisterRoutes sets up all HTTP endpoints.
func (s *Server) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/api/detection", corsMiddleware(s.handleDetection))
	mux.HandleFunc("/api/alerts", corsMiddleware(s.handleGetAlerts))
	mux.HandleFunc("/api/policies", corsMiddleware(s.handleGetPolicies))
	mux.HandleFunc("/api/groups", corsMiddleware(s.handleGetGroups))
	mux.HandleFunc("/api/health", corsMiddleware(s.handleHealth))

	// Serve clip video files
	clipHandler := http.StripPrefix("/clips/", http.FileServer(http.Dir(s.clipsDir)))
	mux.HandleFunc("/clips/", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		clipHandler.ServeHTTP(w, r)
	}))
}

// handleDetection processes incoming detection data from the YOLOE engine.
// POST /api/detection
// Body: {"camera_id": "CAM-MALANG-01", "timestamp": 30.5, "violations": [...]}
func (s *Server) handleDetection(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse the YOLOE detection result
	var detection struct {
		CameraID   string  `json:"camera_id"`
		Timestamp  float64 `json:"timestamp"`
		Violations []struct {
			PersonBbox []int    `json:"person_bbox"`
			MissingApd []string `json:"missing_apd"`
		} `json:"violations"`
	}

	if err := json.NewDecoder(r.Body).Decode(&detection); err != nil {
		http.Error(w, fmt.Sprintf("invalid JSON: %v", err), http.StatusBadRequest)
		return
	}

	fmt.Printf("[%s] Detection received: cam=%s timestamp=%.2f violations=%d\n",
		time.Now().Format("15:04:05"), detection.CameraID, detection.Timestamp, len(detection.Violations))

	var allAlerts []AlertOutput

	// Process each violation through the filtering pipeline
	for _, v := range detection.Violations {
		// Build words list from missing APD items
		words := make([]string, 0, len(v.MissingApd)+1)
		words = append(words, "human")
		for _, apd := range v.MissingApd {
			words = append(words, apd)
		}

		// Calculate center point of the person bounding box (normalized to 0-100)
		var x, y float64
		if len(v.PersonBbox) == 4 {
			x = float64(v.PersonBbox[0]+v.PersonBbox[2]) / 2
			y = float64(v.PersonBbox[1]+v.PersonBbox[3]) / 2
		}

		input := DetectionInput{
			Words:     words,
			X:         x,
			Y:         y,
			CamID:     detection.CameraID,
			Timestamp: detection.Timestamp,
		}

		alerts, err := FilterDetection(input, s.policyDir, s.cooldown)
		if err != nil {
			fmt.Fprintf(os.Stderr, "filter error: %v\n", err)
			continue
		}

		allAlerts = append(allAlerts, alerts...)
	}

	// Process clipping for each alert
	processedAlerts := make([]AlertRecord, 0, len(allAlerts))
	for _, alert := range allAlerts {
		// Resolve video source path
		videoPath := s.resolveVideoPath(alert.CamID)
		if videoPath == "" {
			fmt.Fprintf(os.Stderr, "warning: tidak ada video source untuk %s\n", alert.CamID)
			continue
		}

		// Generate clip output filename
		clipFilename := fmt.Sprintf("%s_%s_%.0fs_%s.mp4",
			alert.CamID, alert.PolicyName, alert.Timestamp, alert.Priority)
		clipFilename = strings.ReplaceAll(clipFilename, " ", "_")
		clipPath := filepath.Join(s.clipsDir, clipFilename)

		// Run clipping
		err := RunClipping(videoPath, alert.Priority, alert.Timestamp, clipPath, false)
		if err != nil {
			fmt.Fprintf(os.Stderr, "clipping error: %v\n", err)
			// Still record the alert even if clipping fails
			clipFilename = ""
		}

		record := AlertRecord{
			ID:         fmt.Sprintf("alert-%d", time.Now().UnixNano()),
			PolicyName: alert.PolicyName,
			CamID:      alert.CamID,
			Message:    alert.Message,
			Priority:   alert.Priority,
			Timestamp:  alert.Timestamp,
			ClipFile:   clipFilename,
			CreatedAt:  time.Now().Format(time.RFC3339),
		}

		s.alertStore.Add(record)
		processedAlerts = append(processedAlerts, record)

		fmt.Printf("  -> ALERT: policy=%s priority=%s clip=%s\n",
			alert.PolicyName, alert.Priority, clipFilename)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"alerts_generated": len(processedAlerts),
		"alerts":           processedAlerts,
	})
}

// handleGetAlerts returns the list of stored alerts.
// GET /api/alerts?limit=50
func (s *Server) handleGetAlerts(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	alerts := s.alertStore.GetAll()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(alerts)
}

// handleGetPolicies returns all available policy files.
// GET /api/policies
func (s *Server) handleGetPolicies(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	entries, err := os.ReadDir(s.policyDir)
	if err != nil {
		http.Error(w, fmt.Sprintf("gagal baca policy dir: %v", err), http.StatusInternalServerError)
		return
	}

	var policies []Policy
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasPrefix(entry.Name(), "policy_") {
			continue
		}

		policy, err := loadPolicy(filepath.Join(s.policyDir, entry.Name()))
		if err != nil {
			continue
		}
		policies = append(policies, policy)
	}

	// Sort by ID
	sort.Slice(policies, func(i, j int) bool {
		return policies[i].ID < policies[j].ID
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(policies)
}

// handleGetGroups returns all camera groups.
// GET /api/groups
func (s *Server) handleGetGroups(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	groups, err := loadGroups(filepath.Join(s.policyDir, "group.json"))
	if err != nil {
		http.Error(w, fmt.Sprintf("gagal baca groups: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(groups)
}

// handleHealth is a simple health check endpoint.
// GET /api/health
func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "ok",
		"timestamp": time.Now().Format(time.RFC3339),
		"cameras":   len(s.videoSources),
	})
}

// resolveVideoPath converts a camera ID to its actual video file path.
func (s *Server) resolveVideoPath(camID string) string {
	if path, ok := s.videoSources[camID]; ok {
		// If it's a relative path, resolve against engine base dir
		if !filepath.IsAbs(path) {
			return filepath.Join(s.engineBaseDir, path)
		}
		return path
	}
	return ""
}
