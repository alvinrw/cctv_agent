package main

import (
	"encoding/json"
	"fmt"
	"os"
	"sync"
	"time"
)

// CooldownState tracks the last trigger time per camera+policy combination.
// Key format: "CAM-ID:policy_name"
type CooldownState struct {
	mu       sync.Mutex
	filePath string
	state    map[string]float64
}

// NewCooldownState creates a new CooldownState, loading existing state from file if available.
func NewCooldownState(filePath string) *CooldownState {
	cs := &CooldownState{
		filePath: filePath,
		state:    make(map[string]float64),
	}
	cs.load()
	return cs
}

// load reads the cooldown state from the JSON file.
func (cs *CooldownState) load() {
	data, err := os.ReadFile(cs.filePath)
	if err != nil {
		// File doesn't exist yet — that's fine, start fresh
		return
	}

	var loaded map[string]float64
	if err := json.Unmarshal(data, &loaded); err != nil {
		fmt.Fprintf(os.Stderr, "warning: gagal parse cooldown state %s: %v\n", cs.filePath, err)
		return
	}

	cs.state = loaded
}

// save writes the current cooldown state to the JSON file.
func (cs *CooldownState) save() error {
	data, err := json.MarshalIndent(cs.state, "", "  ")
	if err != nil {
		return fmt.Errorf("gagal encode cooldown state: %w", err)
	}
	return os.WriteFile(cs.filePath, data, 0644)
}

// cooldownKey builds the map key from camera ID and policy name.
func cooldownKey(camID, policyName string) string {
	return camID + ":" + policyName
}

// IsCooldownActive checks whether the cooldown period is still active for a given
// camera + policy combination. Returns true if the alert should be suppressed.
func (cs *CooldownState) IsCooldownActive(camID, policyName string, cooldownSeconds float64) bool {
	cs.mu.Lock()
	defer cs.mu.Unlock()

	key := cooldownKey(camID, policyName)
	lastTrigger, exists := cs.state[key]
	if !exists {
		return false
	}

	now := float64(time.Now().Unix())
	return (now - lastTrigger) < cooldownSeconds
}

// RecordTrigger updates the cooldown state with the current time for a camera + policy,
// and persists it to disk.
func (cs *CooldownState) RecordTrigger(camID, policyName string) {
	cs.mu.Lock()
	defer cs.mu.Unlock()

	key := cooldownKey(camID, policyName)
	cs.state[key] = float64(time.Now().Unix())

	if err := cs.save(); err != nil {
		fmt.Fprintf(os.Stderr, "warning: gagal simpan cooldown state: %v\n", err)
	}
}
