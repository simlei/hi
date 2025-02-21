#!/usr/bin/env bash

# Ensure we have absolute paths regardless of PWD
readonly SCRIPT_PATH="${BASH_SOURCE[0]}"
readonly SCRIPT_DIR="$(cd "$(dirname "${SCRIPT_PATH}")" && pwd)"
readonly WEBSITE_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
readonly SCRIPTS_DIR="${WEBSITE_DIR}/scripts"
readonly LIB_DIR="${SCRIPTS_DIR}/lib"

# Runtime files (using mktemp for safety)
readonly TEMP_DIR="$(mktemp -d)"
readonly PID_FILE="${TEMP_DIR}/website-dev-server.pid"
readonly URL_FILE="${TEMP_DIR}/website-dev-server.url"
readonly LOG_FILE="${TEMP_DIR}/website-dev-server.log"

# Configuration
readonly DEFAULT_PORT=3000

# Cleanup function
cleanup() {
    local exit_code=$?
    [[ -d "${TEMP_DIR}" ]] && rm -rf "${TEMP_DIR}"
    exit $exit_code
}
trap cleanup EXIT

# Import other modules
source "$LIB_DIR/log.sh"
source "$LIB_DIR/deps_advanced.sh"
source "$LIB_DIR/env.sh"

# Setup environment
setup_next_env "$DEFAULT_PORT"
source "$LIB_DIR/server.sh"

# Add .local paths to gitignore if not already there
if [[ -f "$WEBSITE_DIR/.gitignore" ]] && ! grep -q "^\.local/" "$WEBSITE_DIR/.gitignore"; then
    echo -e "\n# Local installations\n.local/" >> "$WEBSITE_DIR/.gitignore"
fi

# Function to get environment for local toolchain
get_local_env() {
    local env_vars=()
    
    # Add local bin to PATH
    env_vars+=("PATH=$LOCAL_BIN_DIR:$PATH")
    
    # Add local lib to various library paths
    [[ -n "${LD_LIBRARY_PATH:-}" ]] && env_vars+=("LD_LIBRARY_PATH=$LOCAL_LIB_DIR:$LD_LIBRARY_PATH")
    [[ -n "${LIBRARY_PATH:-}" ]] && env_vars+=("LIBRARY_PATH=$LOCAL_LIB_DIR:$LIBRARY_PATH")
    [[ -n "${PKG_CONFIG_PATH:-}" ]] && env_vars+=("PKG_CONFIG_PATH=$LOCAL_LIB_DIR/pkgconfig:$PKG_CONFIG_PATH")
    
    # Add node-specific paths
    [[ -n "${NODE_PATH:-}" ]] && env_vars+=("NODE_PATH=$LOCAL_LIB_DIR/node_modules:$NODE_PATH")
    env_vars+=("NPM_CONFIG_PREFIX=$LOCAL_INSTALL_DIR")
    
    # Return the environment string
    printf "%s " "${env_vars[@]}"
}

# Function to run a command with local environment
run_with_local_env() {
    local env_str
    env_str=$(get_local_env)
    
    # Use env to run the command with the local environment
    env $env_str "$@"
}

# Function to forward command to subcommand
forward_to_subcommand() {
    local subcommand="$1"
    shift
    
    local subcommand_path="$SCRIPTS_DIR/$subcommand.sh"
    if [[ -x "$subcommand_path" ]]; then
        run_with_local_env "$subcommand_path" "$@"
        return $?
    else
        log_error "Unknown subcommand: $subcommand"
        return 1
    fi
}

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