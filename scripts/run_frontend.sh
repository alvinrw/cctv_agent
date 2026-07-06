#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo "==================================================="
echo "PAMAgents - Starting Frontend"
echo "==================================================="

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed or not available in PATH."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is not installed or not available in PATH."
  exit 1
fi

NODE_MAJOR="$(node -p "parseInt(process.versions.node)")"
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "Node.js 18 or newer is required to run this frontend."
  echo "Current version: $(node --version)"
  exit 1
fi

cd "$FRONTEND_DIR"

if [ "$#" -gt 0 ]; then
  npm run dev -- "$@"
else
  npm run dev
fi
