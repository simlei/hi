#!/usr/bin/env bash

# Common variables
WEBSITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SCRIPTS_DIR="$WEBSITE_DIR/scripts"
LIB_DIR="$SCRIPTS_DIR/lib"
PID_FILE="/tmp/website-dev-server.pid"
URL_FILE="/tmp/website-dev-server.url"
DEFAULT_PORT=3000

# Import other modules
source "$LIB_DIR/log.sh"
source "$LIB_DIR/deps_advanced.sh"
source "$LIB_DIR/server.sh"

# Add .local/bin to gitignore if not already there
if [[ -f "$WEBSITE_DIR/.gitignore" ]] && ! grep -q "^\.local/" "$WEBSITE_DIR/.gitignore"; then
    echo -e "\n# Local installations\n.local/" >> "$WEBSITE_DIR/.gitignore"
fi

# Function to show generic usage
show_usage() {
    local script_name="$1"
    local description="$2"
    local options="$3"
    
    cat << EOF
Usage: $script_name [options]

$description

Options:
$options
EOF
    exit 1
}

# Function to ensure we're in the website directory
ensure_website_dir() {
    cd "$WEBSITE_DIR"
}

# Function to run npm command with proper error handling
run_npm_cmd() {
    local cmd="$1"
    local error_msg="$2"
    
    if ! npm run "$cmd"; then
        log_error "$error_msg"
        exit 1
    fi
}

# Function to clean up temporary files
cleanup_temp_files() {
    rm -f "$PID_FILE" "$URL_FILE"
}