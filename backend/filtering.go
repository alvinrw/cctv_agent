package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// DetectionInput represents the detection data coming from YOLOE engine.
type DetectionInput struct {
	Words     []string `json:"words"`
	X         float64  `json:"x"`
	Y         float64  `json:"y"`
	CamID     string   `json:"cam_id"`
	Timestamp float64  `json:"timestamp"`
}

// AlertOutput is the result produced when a detection matches a policy.
type AlertOutput struct {
	PolicyName string  `json:"policy_name"`
	CamID      string  `json:"cam_id"`
	Message    string  `json:"message"`
	Priority   string  `json:"priority"`
	Timestamp  float64 `json:"timestamp"`
	ClipFile   string  `json:"clip_file,omitempty"`
}

// Group maps cameras to their assigned policies.
type Group struct {
	ID            int      `json:"id"`
	Name          string   `json:"name"`
	Policies      []string `json:"policies"`
	CamAttachment []string `json:"cam_attachment"`
}

// Policy defines a detection rule with matching thresholds and cooldown.
type Policy struct {
	ID         int        `json:"id"`
	Name       string     `json:"name"`
	Priority   string     `json:"priority"`
	Cooldown   float64    `json:"cooldown"`
	Thresholds Thresholds `json:"thresholds"`
}

// Thresholds contains the matching criteria for a policy.
type Thresholds struct {
	Conf  *float64  `json:"conf"`
	Words []string  `json:"words"`
	Area  []Polygon `json:"area"`
}

// Polygon is a list of points defining a geofence area.
type Polygon []Point

// Point represents a 2D coordinate.
type Point struct {
	X float64
	Y float64
}

func (p *Point) UnmarshalJSON(data []byte) error {
	var pair []float64
	if err := json.Unmarshal(data, &pair); err != nil {
		return err
	}
	if len(pair) != 2 {
		return fmt.Errorf("point harus berisi [x, y], dapat %d nilai", len(pair))
	}

	p.X = pair[0]
	p.Y = pair[1]
	return nil
}

// FilterDetection checks detection input against all policies attached to the camera's group.
// It respects cooldown periods to avoid spamming alerts.
func FilterDetection(input DetectionInput, policyDir string, cooldown *CooldownState) ([]AlertOutput, error) {
	groups, err := loadGroups(filepath.Join(policyDir, "group.json"))
	if err != nil {
		return nil, err
	}

	var alerts []AlertOutput
	for _, group := range groups {
		if !containsString(group.CamAttachment, input.CamID) {
			continue
		}

		for _, policyName := range group.Policies {
			policy, err := loadPolicy(filepath.Join(policyDir, policyName+".json"))
			if err != nil {
				// Skip policies that don't have a JSON file (e.g. policy_traffic_violation)
				fmt.Fprintf(os.Stderr, "warning: skip policy %s: %v\n", policyName, err)
				continue
			}

			if policyMatches(input, policy) {
				// Check cooldown — if still in cooldown period, skip this alert
				if cooldown != nil && policy.Cooldown > 0 {
					if cooldown.IsCooldownActive(input.CamID, policy.Name, policy.Cooldown) {
						fmt.Fprintf(os.Stderr, "cooldown active: %s:%s (%.0fs remaining)\n",
							input.CamID, policy.Name, policy.Cooldown)
						continue
					}
					// Record this trigger so future alerts within cooldown are suppressed
					cooldown.RecordTrigger(input.CamID, policy.Name)
				}

				alerts = append(alerts, AlertOutput{
					PolicyName: policy.Name,
					CamID:      input.CamID,
					Message:    "alert",
					Priority:   policy.Priority,
					Timestamp:  input.Timestamp,
				})
			}
		}
	}

	return alerts, nil
}

// policyMatches checks if a detection input satisfies a policy's thresholds.
func policyMatches(input DetectionInput, policy Policy) bool {
	threshold := policy.Thresholds

	if len(threshold.Words) > 0 && !containsAllWords(input.Words, threshold.Words) {
		return false
	}

	if len(threshold.Area) == 0 {
		return true
	}

	point := Point{X: input.X, Y: input.Y}
	for _, polygon := range threshold.Area {
		if polygon.Contains(point) {
			return true
		}
	}

	return false
}

// Contains checks if a point lies inside a polygon using ray-casting algorithm.
func (polygon Polygon) Contains(point Point) bool {
	if len(polygon) < 3 {
		return false
	}

	inside := false
	j := len(polygon) - 1
	for i := 0; i < len(polygon); i++ {
		current := polygon[i]
		previous := polygon[j]

		if pointOnSegment(point, previous, current) {
			return true
		}

		intersects := (current.Y > point.Y) != (previous.Y > point.Y)
		if intersects {
			xAtY := (previous.X-current.X)*(point.Y-current.Y)/(previous.Y-current.Y) + current.X
			if point.X < xAtY {
				inside = !inside
			}
		}

		j = i
	}

	return inside
}

func pointOnSegment(point, a, b Point) bool {
	const epsilon = 0.0000001

	cross := (point.Y-a.Y)*(b.X-a.X) - (point.X-a.X)*(b.Y-a.Y)
	if cross < -epsilon || cross > epsilon {
		return false
	}

	minX, maxX := minMax(a.X, b.X)
	minY, maxY := minMax(a.Y, b.Y)
	return point.X >= minX-epsilon &&
		point.X <= maxX+epsilon &&
		point.Y >= minY-epsilon &&
		point.Y <= maxY+epsilon
}

func minMax(a, b float64) (float64, float64) {
	if a < b {
		return a, b
	}
	return b, a
}

func loadGroups(path string) ([]Group, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	clean := stripLineComments(data)

	var groups []Group
	if err := json.Unmarshal(clean, &groups); err == nil {
		return groups, nil
	}

	wrapped := append([]byte("["), clean...)
	wrapped = append(wrapped, ']')
	if err := json.Unmarshal(wrapped, &groups); err != nil {
		return nil, fmt.Errorf("parse group %s: %w", path, err)
	}

	return groups, nil
}

func loadPolicy(path string) (Policy, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return Policy{}, err
	}

	var policy Policy
	if err := json.Unmarshal(stripLineComments(data), &policy); err != nil {
		return Policy{}, fmt.Errorf("parse policy %s: %w", path, err)
	}

	return policy, nil
}

func stripLineComments(data []byte) []byte {
	lines := bytes.Split(data, []byte("\n"))
	for i, line := range lines {
		if index := bytes.Index(line, []byte("//")); index >= 0 {
			lines[i] = line[:index]
		}
	}
	return bytes.Join(lines, []byte("\n"))
}

func splitWords(value string) []string {
	parts := strings.Split(value, ",")
	words := make([]string, 0, len(parts))
	for _, part := range parts {
		word := strings.TrimSpace(part)
		if word != "" {
			words = append(words, word)
		}
	}
	return words
}

func uniqueWords(words []string) []string {
	seen := make(map[string]struct{}, len(words))
	unique := make([]string, 0, len(words))

	for _, word := range words {
		cleanWord := strings.TrimSpace(word)
		if cleanWord == "" {
			continue
		}

		key := strings.ToLower(cleanWord)
		if _, ok := seen[key]; ok {
			continue
		}

		seen[key] = struct{}{}
		unique = append(unique, cleanWord)
	}

	return unique
}

func containsAllWords(inputWords, policyWords []string) bool {
	wordSet := make(map[string]struct{}, len(inputWords))
	for _, word := range inputWords {
		wordSet[strings.ToLower(strings.TrimSpace(word))] = struct{}{}
	}

	for _, word := range policyWords {
		if _, ok := wordSet[strings.ToLower(strings.TrimSpace(word))]; !ok {
			return false
		}
	}

	return true
}

func containsString(values []string, target string) bool {
	for _, value := range values {
		if value == target {
			return true
		}
	}
	return false
}
