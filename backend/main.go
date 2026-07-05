package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

// CameraConfig mirrors the YOLOE engine's config.json camera entry.
type CameraConfig struct {
	CameraID    string `json:"camera_id"`
	VideoSource string `json:"video_source"`
}

// EngineConfig mirrors the YOLOE engine's config.json structure.
type EngineConfig struct {
	Cameras []CameraConfig `json:"cameras"`
}

// loadEngineConfig reads the YOLOE engine's config.json to build the cam_id -> video_source mapping.
func loadEngineConfig(configPath string) (map[string]string, error) {
	data, err := os.ReadFile(configPath)
	if err != nil {
		return nil, fmt.Errorf("gagal baca engine config %s: %w", configPath, err)
	}

	var config EngineConfig
	if err := json.Unmarshal(data, &config); err != nil {
		return nil, fmt.Errorf("gagal parse engine config: %w", err)
	}

	mapping := make(map[string]string, len(config.Cameras))
	for _, cam := range config.Cameras {
		mapping[cam.CameraID] = cam.VideoSource
	}

	return mapping, nil
}

type wordFlags []string

func (words *wordFlags) String() string {
	return strings.Join(*words, ",")
}

func (words *wordFlags) Set(value string) error {
	*words = append(*words, splitWords(value)...)
	return nil
}

func main() {
	// CLI mode flags (backwards-compatible with original filtering.go)
	var wordList wordFlags
	flag.Var(&wordList, "word", "kata hasil YOLOE, boleh dipakai berulang atau dipisah koma")
	xFlag := flag.Float64("x", 0, "koordinat x hasil YOLOE")
	yFlag := flag.Float64("y", 0, "koordinat y hasil YOLOE")
	camFlag := flag.String("cam", "", "camera id (CLI mode)")
	timestampFlag := flag.Float64("timestamp", -1, "timestamp detik detection (CLI mode)")

	// Directory flags
	policyDirFlag := flag.String("policy-dir", "policy", "folder policy dan group.json")
	clipsDir := flag.String("clips-dir", "clips", "folder output clip video")
	engineDir := flag.String("engine-dir", "engine", "folder engine (untuk resolve video path)")
	cooldownFile := flag.String("cooldown-file", "cooldown_state.json", "file cooldown state")

	// Clipping flags (CLI mode)
	clipFlag := flag.Bool("clip", true, "jalankan clipping untuk setiap alert (CLI mode)")
	fastCopyFlag := flag.Bool("fast-copy", false, "clip tanpa re-encode (CLI mode)")

	// Server mode
	serveFlag := flag.Bool("serve", false, "jalankan HTTP API server")
	portFlag := flag.Int("port", 8080, "port HTTP server")

	flag.Parse()

	// Initialize cooldown state
	cooldown := NewCooldownState(*cooldownFile)

	// Load video source mapping from engine config
	engineConfigPath := filepath.Join(*engineDir, "config.json")
	videoSources, err := loadEngineConfig(engineConfigPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "warning: %v (clipping mungkin tidak berfungsi)\n", err)
		videoSources = make(map[string]string)
	}

	fmt.Printf("Loaded %d camera(s) dari config:\n", len(videoSources))
	for camID, source := range videoSources {
		fmt.Printf("  %s -> %s\n", camID, source)
	}

	// ======= SERVER MODE =======
	if *serveFlag {
		alertStore := NewAlertStore(filepath.Join(*clipsDir, "alerts.json"))

		// Ensure clips directory exists
		os.MkdirAll(*clipsDir, 0755)

		server := NewServer(alertStore, cooldown, *policyDirFlag, *clipsDir, *engineDir, videoSources)

		mux := http.NewServeMux()
		server.RegisterRoutes(mux)

		addr := fmt.Sprintf(":%d", *portFlag)
		fmt.Printf("\n🚀 PamAgents Backend Server running on http://localhost%s\n", addr)
		fmt.Printf("   POST /api/detection   - Terima detection dari YOLOE\n")
		fmt.Printf("   GET  /api/alerts      - Lihat semua alert\n")
		fmt.Printf("   GET  /api/policies    - Lihat semua policy\n")
		fmt.Printf("   GET  /api/groups      - Lihat semua group\n")
		fmt.Printf("   GET  /api/health      - Health check\n")
		fmt.Printf("   GET  /clips/{file}    - Akses clip video\n")
		fmt.Println()

		if err := http.ListenAndServe(addr, mux); err != nil {
			fmt.Fprintf(os.Stderr, "server error: %v\n", err)
			os.Exit(1)
		}
		return
	}

	// ======= CLI MODE (backwards-compatible) =======
	if *camFlag == "" {
		fmt.Fprintln(os.Stderr, "Gunakan --serve untuk mode server, atau berikan parameter CLI:")
		fmt.Fprintln(os.Stderr, "  go run . -word human -word helmet -x 30 -y 30 -cam CAM-MALANG-01 -timestamp 30")
		fmt.Fprintln(os.Stderr, "  go run . --serve --port 8080")
		os.Exit(1)
	}

	if *timestampFlag < 0 {
		fmt.Fprintln(os.Stderr, "timestamp wajib diisi dan tidak boleh negatif")
		os.Exit(1)
	}

	input := DetectionInput{
		Words:     uniqueWords(wordList),
		X:         *xFlag,
		Y:         *yFlag,
		CamID:     *camFlag,
		Timestamp: *timestampFlag,
	}

	alerts, err := FilterDetection(input, *policyDirFlag, cooldown)
	if err != nil {
		fmt.Fprintf(os.Stderr, "gagal filter detection: %v\n", err)
		os.Exit(1)
	}

	if len(alerts) == 0 {
		fmt.Println("no alert")
		return
	}

	var clipErrors []string
	for _, alert := range alerts {
		data, err := json.Marshal(alert)
		if err != nil {
			fmt.Fprintf(os.Stderr, "gagal encode alert: %v\n", err)
			os.Exit(1)
		}
		fmt.Println(string(data))

		if *clipFlag {
			// Resolve video path from config
			videoPath := ""
			if source, ok := videoSources[alert.CamID]; ok {
				if !filepath.IsAbs(source) {
					videoPath = filepath.Join(*engineDir, source)
				} else {
					videoPath = source
				}
			}

			if videoPath == "" {
				clipErrors = append(clipErrors, fmt.Sprintf("%s: video source tidak ditemukan untuk %s", alert.PolicyName, alert.CamID))
				continue
			}

			os.MkdirAll(*clipsDir, 0755)
			output := filepath.Join(
				*clipsDir,
				fmt.Sprintf("%s_%s_%gs_%s.mp4", alert.CamID, alert.PolicyName, alert.Timestamp, alert.Priority),
			)

			if err := RunClipping(videoPath, alert.Priority, alert.Timestamp, output, *fastCopyFlag); err != nil {
				clipErrors = append(clipErrors, fmt.Sprintf("%s: %v", alert.PolicyName, err))
			}
		}
	}

	if len(clipErrors) > 0 {
		fmt.Fprintf(os.Stderr, "ada %d clipping yang gagal:\n", len(clipErrors))
		for _, clipErr := range clipErrors {
			fmt.Fprintf(os.Stderr, "- %s\n", clipErr)
		}
		os.Exit(1)
	}
}
