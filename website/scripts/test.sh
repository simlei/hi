#!/usr/bin/env bash

set -euo pipefail

# Import common library
source "$(dirname "${BASH_SOURCE[0]}")/lib/common.sh"

# Parse arguments
PORT=$DEFAULT_PORT
SKIP_BUILD=0

usage() {
    show_usage "$(basename "$0")" \
        "Run all tests" \
        "    -p, --port PORT    Port to run the server on (default: $DEFAULT_PORT)
    -s, --skip-build  Skip build test
    -h, --help       Show this help message"
}

while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        -s|--skip-build)
            SKIP_BUILD=1
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

# Main script
ensure_website_dir

# Check system dependencies with version requirements
if ! check_project_deps; then
    exit 1
fi

# Ensure project dependencies
if ! ensure_project_deps "$WEBSITE_DIR"; then
    exit 1
fi

# Run build test
if [[ $SKIP_BUILD -eq 0 ]]; then
    log_step "Running build test..."
    run_npm_cmd "build" "Build failed"
    log_success "Build test passed"
fi

# Run server test
log_step "Running server test..."
start_dev_server "$PORT"
URL=$(get_server_url "$PORT")

# Test main page
BASE_PATH=$(get_base_path)
log_step "Testing main page at $URL$BASE_PATH"
if ! curl --fail -s "$URL$BASE_PATH" > /dev/null; then
    log_error "Failed to access main page at $URL$BASE_PATH"
    log_error "HTTP response:"
    curl -v "$URL$BASE_PATH"
    stop_server
    exit 1
fi

# Test a few key pages
for path in "/about" "/cv"; do
    TEST_URL="$URL$BASE_PATH$path"
    log_step "Testing page at $TEST_URL"
    if ! curl --fail -s "$TEST_URL" > /dev/null; then
        log_error "Failed to access page at $TEST_URL"
        log_error "HTTP response:"
        curl -v "$TEST_URL"
        stop_server
        exit 1
    fi
done

log_success "All server tests passed"
stop_server