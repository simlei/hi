#!/usr/bin/env bash

set -euo pipefail

# Import common library
source "$(dirname "${BASH_SOURCE[0]}")/lib/common.sh"

# Main script
ensure_website_dir

# Start server in background
log_step "Starting test server..."
PORT=3333
./scripts/dev.sh server --port $PORT > server.log 2>&1 &
SERVER_PID=$!
log_step "Server PID: $SERVER_PID"

# Function to cleanup server
cleanup() {
    kill $SERVER_PID 2>/dev/null || true
}
trap cleanup EXIT

# Wait for server to start
log_step "Waiting for server to start..."
for i in {1..30}; do
    if grep -q "Development server is running" server.log; then
        break
    fi
    log_step "DBG: attempt $i"
    # if server is down, print the log and remember exit code
    if kill -0 $SERVER_PID 2>/dev/null; then
        break;
    else
        if [[ $i -eq 30 ]]; then
            log_error "Server failed to start:"
            cat server.log >&2
            exit 1
        else
            sleep 1
            continue
        fi
    fi
done

log_step "Running runtime tests..."
# Check if current_error.txt exists and is empty
if [[ -f "/workspace/.oh/current_error.txt" ]]; then
    rm "/workspace/.oh/current_error.txt"
fi

# Make a request and wait for potential errors
curl -s "http://localhost:${PORT}" > /dev/null
sleep 5

# Check for runtime errors
if [[ -f "/workspace/.oh/current_error.txt" ]]; then
    log_error "Runtime error detected:"
    cat "/workspace/.oh/current_error.txt"
    exit 1
fi

log_success "Runtime tests passed"
