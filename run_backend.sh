#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==================================================="
echo "PAMAgents - Starting Backend Services"
echo "==================================================="

echo "[1/2] Starting Go Backend Server..."
(
  cd "$ROOT_DIR/backend"
  go run . --serve
) >"$ROOT_DIR/go-backend.log" 2>&1 &
GO_BACKEND_PID=$!

echo "[2/2] Starting Python AI Engine..."
(
  cd "$ROOT_DIR/backend/engine"
  if [ -f "$ROOT_DIR/.venv/bin/activate" ]; then
    # shellcheck disable=SC1091
    source "$ROOT_DIR/.venv/bin/activate"
  fi
  python main.py
) >"$ROOT_DIR/ai-engine.log" 2>&1 &
AI_ENGINE_PID=$!

echo "Both services have been launched in the background."
echo "Go backend PID: $GO_BACKEND_PID"
echo "AI engine PID: $AI_ENGINE_PID"
echo "Logs: $ROOT_DIR/go-backend.log and $ROOT_DIR/ai-engine.log"

wait "$GO_BACKEND_PID" "$AI_ENGINE_PID"