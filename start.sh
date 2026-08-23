#!/usr/bin/env bash

# Starts the Express API and Vite frontend together for local development.
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ ! -f "$PROJECT_DIR/backend/.env" ]]; then
  echo "Missing backend/.env. Copy the production values into that file first." >&2
  exit 1
fi

if [[ ! -d "$PROJECT_DIR/backend/node_modules" || ! -d "$PROJECT_DIR/frontend/node_modules" ]]; then
  echo "Dependencies are missing. Run npm ci in both backend and frontend first." >&2
  exit 1
fi

cleanup() {
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

(cd "$PROJECT_DIR/backend" && npm run dev) &
BACKEND_PID=$!

(cd "$PROJECT_DIR/frontend" && npm run dev -- --host 0.0.0.0) &
FRONTEND_PID=$!

echo "Starting backend and checking MongoDB connection..."
echo "Look for: ✓ MongoDB connected successfully"
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:5173 (or http://YOUR_SERVER_IP:5173)"
echo "Press Ctrl+C to stop both services."

wait "$BACKEND_PID" "$FRONTEND_PID"
