#!/bin/bash
set -e

# Get absolute paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEBSITE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
DEV_SCRIPT="${WEBSITE_DIR}/website/scripts/dev.sh"

echo "🌐 Setting up website preview..."

# Build and serve using dev.sh
echo "🏗️ Building and serving website..."

kill_port() {
    port=$1
    pid=$(lsof -t -i:$port)
    if [ -n "$pid" ]; then
      kill -9 $pid
    fi
}

kill_port 8000 || true
"$DEV_SCRIPT" server --port 8000

# The dev.sh script handles server management and cleanup
