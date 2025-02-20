#!/usr/bin/env bash

set -euo pipefail

# Import common library
source "$(dirname "${BASH_SOURCE[0]}")/lib/common.sh"

# Parse arguments
PORT=$DEFAULT_PORT
COMMAND="server"

usage() {
    show_usage "$(basename "$0")" \
        "Development command dispatcher" \
        "    server [options]     Start development server (default)
    test [options]      Run tests
    exec <cmd>         Run command with local environment
    -h, --help        Show this help message

Server options:
    -p, --port PORT   Port to run the server on (default: $DEFAULT_PORT)

Test options:
    --skip-build      Skip build test"
}

# Parse command and options
while [[ $# -gt 0 ]]; do
    case $1 in
        server|test|exec)
            COMMAND="$1"
            shift
            break
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

# Handle commands
case "$COMMAND" in
    server)
        # Start development server
        run_with_local_env "$SCRIPTS_DIR/server.sh" "$@"
        ;;
    test)
        # Run tests
        run_with_local_env "$SCRIPTS_DIR/test.sh" "$@"
        ;;
    exec)
        # Execute command with local environment
        if [[ $# -eq 0 ]]; then
            log_error "No command specified for exec"
            exit 1
        fi
        run_with_local_env "$@"
        ;;
esac