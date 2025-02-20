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
check_dependencies
ensure_npm_deps

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

if curl -s "$URL" > /dev/null; then
    log_success "Server test passed"
    stop_server
else
    log_error "Server test failed"
    stop_server
    exit 1
fi