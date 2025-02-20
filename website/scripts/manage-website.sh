#!/usr/bin/env bash

set -euo pipefail

# Default values
PRINT_URL_ONLY=0
CLEANUP_ONLY=0
TEST_MODE=0
WEBSITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT=3000
PID_FILE="/tmp/website-dev-server.pid"
URL_FILE="/tmp/website-dev-server.url"

# Function to show usage
usage() {
    cat << EOF
Usage: $(basename "$0") [options]

Options:
    -p, --print-url    Only print the URL once server is running
    -c, --cleanup      Only cleanup any running server
    -t, --test         Run in test mode (start, verify, stop)
    -h, --help         Show this help message
EOF
    exit 1
}

# Function to check if a command exists
check_command() {
    local cmd="$1"
    if ! command -v "$cmd" &> /dev/null; then
        echo "Error: $cmd is not installed"
        return 1
    fi
    return 0
}

# Function to check and install dependencies
check_dependencies() {
    local deps=("node" "npm" "curl")
    local missing=()

    for dep in "${deps[@]}"; do
        if ! check_command "$dep"; then
            missing+=("$dep")
        fi
    done

    if [[ ${#missing[@]} -gt 0 ]]; then
        echo "Missing dependencies: ${missing[*]}"
        echo "Please install them first"
        exit 1
    fi
}

# Function to cleanup server
cleanup() {
    if [[ -f "$PID_FILE" ]]; then
        local pid
        pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            echo "Stopping server (PID: $pid)..."
            kill "$pid"
            rm -f "$PID_FILE" "$URL_FILE"
        fi
    fi
}

# Function to wait for server
wait_for_server() {
    local max_attempts=30
    local attempt=1
    local url="http://localhost:$PORT"

    echo "Waiting for server to start..."
    while [[ $attempt -le $max_attempts ]]; do
        if curl -s "$url" > /dev/null; then
            echo "$url" > "$URL_FILE"
            return 0
        fi
        sleep 1
        ((attempt++))
    done
    return 1
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--print-url)
            PRINT_URL_ONLY=1
            shift
            ;;
        -c|--cleanup)
            CLEANUP_ONLY=1
            shift
            ;;
        -t|--test)
            TEST_MODE=1
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            usage
            ;;
    esac
done

# Setup trap for cleanup
trap cleanup EXIT

# Handle cleanup-only mode
if [[ $CLEANUP_ONLY -eq 1 ]]; then
    cleanup
    exit 0
fi

# Check dependencies
check_dependencies

# Change to website directory
cd "$WEBSITE_DIR"

# Install npm dependencies if needed
if [[ ! -d "node_modules" ]]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the website
echo "Building website..."
npm run build

# Start the development server
if [[ -f "$PID_FILE" ]]; then
    cleanup
fi

echo "Starting development server..."
PORT=$PORT npm run dev > server.log 2>&1 & echo $! > "$PID_FILE"

# Wait for server to start
if ! wait_for_server; then
    echo "Error: Server failed to start"
    exit 1
fi

URL=$(cat "$URL_FILE")

if [[ $PRINT_URL_ONLY -eq 1 ]]; then
    echo "$URL"
elif [[ $TEST_MODE -eq 1 ]]; then
    echo "Testing server accessibility..."
    if curl -s "$URL" > /dev/null; then
        echo "Server is accessible at $URL"
        cleanup
    else
        echo "Error: Server is not accessible"
        exit 1
    fi
else
    echo "Opening $URL in browser..."
    if command -v xdg-open &> /dev/null; then
        xdg-open "$URL"
    else
        echo "xdg-open not found. Please visit $URL manually"
    fi
    echo "Press Ctrl+C to stop the server"
    wait
fi