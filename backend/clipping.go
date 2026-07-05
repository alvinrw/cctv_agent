package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// durationByPriority returns the clip radius (seconds before AND after the timestamp).
// Updated rule: low = 3s, medium = 5s, high = 10s
// Total clip duration = 2 * radius (unless start is clamped to 0).
func durationByPriority(priority string) (float64, bool) {
	switch strings.ToLower(strings.TrimSpace(priority)) {
	case "high":
		return 10, true
	case "medium":
		return 5, true
	case "low":
		return 3, true
	default:
		return 0, false
	}
}

// RunClipping creates a video clip around the given timestamp using FFmpeg.
// The clip duration is determined by priority level.
// If the calculated start time is negative, it is clamped to 0.
func RunClipping(inputVideo, priority string, centerSecond float64, outputPath string, fastCopy bool) error {
	radiusDuration, ok := durationByPriority(priority)
	if !ok {
		return fmt.Errorf("priority tidak valid: %s (gunakan high, medium, atau low)", priority)
	}

	if inputVideo == "" {
		return fmt.Errorf("input video path kosong")
	}

	// Calculate start time — clamp to 0 if negative
	start := centerSecond - radiusDuration
	if start < 0 {
		start = 0
	}

	totalDuration := (centerSecond + radiusDuration) - start
	if totalDuration <= 0 {
		return fmt.Errorf("durasi clip tidak valid (start=%.3f, duration=%.3f)", start, totalDuration)
	}

	// Generate output filename if not provided
	out := outputPath
	if out == "" {
		out = defaultOutputName(inputVideo, centerSecond, priority)
	}

	// Ensure output directory exists
	if dir := filepath.Dir(out); dir != "" && dir != "." {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return fmt.Errorf("gagal buat output directory: %w", err)
		}
	}

	args := buildFFmpegArgs(inputVideo, out, start, totalDuration, fastCopy)

	cmd := exec.Command("ffmpeg", args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	fmt.Printf("Clipping %s dari %.3f sampai %.3f detik -> %s\n", inputVideo, start, start+totalDuration, out)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("gagal menjalankan ffmpeg: %w", err)
	}

	return nil
}

func buildFFmpegArgs(input, output string, start, duration float64, fastCopy bool) []string {
	if fastCopy {
		return []string{
			"-y",
			"-ss", fmt.Sprintf("%.3f", start),
			"-i", input,
			"-t", fmt.Sprintf("%.3f", duration),
			"-c", "copy",
			"-avoid_negative_ts", "make_zero",
			output,
		}
	}

	return []string{
		"-y",
		"-i", input,
		"-ss", fmt.Sprintf("%.3f", start),
		"-t", fmt.Sprintf("%.3f", duration),
		"-c:v", "libx264",
		"-preset", "veryfast",
		"-crf", "18",
		"-c:a", "aac",
		"-b:a", "192k",
		"-avoid_negative_ts", "make_zero",
		output,
	}
}

func defaultOutputName(input string, centerSecond float64, priority string) string {
	ext := filepath.Ext(input)
	name := strings.TrimSuffix(filepath.Base(input), ext)
	dir := filepath.Dir(input)

	if ext == "" {
		ext = ".mp4"
	}

	filename := fmt.Sprintf("%s_clip_%gs_%s%s", name, centerSecond, priority, ext)
	return filepath.Join(dir, filename)
}
