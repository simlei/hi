#!/usr/bin/env bash

set -euo pipefail

# Get absolute paths
readonly DEV_SCRIPT_PATH="${BASH_SOURCE[0]}"
readonly DEV_SCRIPT_DIR="$(cd "$(dirname "${DEV_SCRIPT_PATH}")" && pwd)"
readonly DEV_LIB_DIR="${DEV_SCRIPT_DIR}/lib"

# Import common library (which will set up other paths)
source "${DEV_LIB_DIR}/common.sh"

# Parse arguments
PORT=$DEFAULT_PORT
COMMAND="server"
SKIP_BUILD=0

usage() {
    show_usage "$(basename "$0")" \
        "Development command dispatcher" \
        "    server [options]     Start development server (default)
    test [options]      Run tests
    exec <cmd>         Run command with local environment
    -h, --help        Show this help message

Common options:
    --skip-build      Skip build step

Server options:
    -p, --port PORT   Port to run the server on (default: $DEFAULT_PORT)"
}

# Parse command and options
while [[ $# -gt 0 ]]; do
    case $1 in
        server|test|exec)
            COMMAND="$1"
            shift
            break
            ;;
        --skip-build)
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

# Run build step unless skipped
if [[ $SKIP_BUILD -eq 0 ]]; then
    log_step "Running build step..."
    if ! run_npm_cmd "build" "Build failed"; then
        exit 1
    fi
    log_success "Build completed successfully"
fi

# Handle commands
case "$COMMAND" in
    server)
        # Start development server
        run_with_local_env "$SCRIPTS_DIR/server.sh" "$@"
        ;;
    test)
        # Run tests
        if [[ $SKIP_BUILD -eq 1 ]]; then
            run_with_local_env "$SCRIPTS_DIR/test.sh" --skip-build "$@"
        else
            run_with_local_env "$SCRIPTS_DIR/test.sh" "$@"
        fi
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