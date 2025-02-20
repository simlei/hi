#!/usr/bin/env bash

set -euo pipefail

# Import common library
source "$(dirname "${BASH_SOURCE[0]}")/lib/common.sh"

# Parse arguments
PORT=$DEFAULT_PORT
PRINT_URL_ONLY=0

usage() {
    show_usage "$(basename "$0")" \
        "Start the development server" \
        "    -p, --port PORT    Port to run the server on (default: $DEFAULT_PORT)
    -u, --url-only    Only print the server URL
    -h, --help       Show this help message"
}

while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        -u|--url-only)
            PRINT_URL_ONLY=1
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

if [[ $PRINT_URL_ONLY -eq 1 ]]; then
    get_server_url "$PORT"
    exit 0
fi

run_server_with_cleanup "$PORT"