#!/usr/bin/env bash

# Local installation paths
LOCAL_BIN_DIR="$WEBSITE_DIR/.local/bin"
LOCAL_LIB_DIR="$WEBSITE_DIR/.local/lib"
LOCAL_INSTALL_DIR="$WEBSITE_DIR/.local"

# Version requirements
declare -A MIN_VERSIONS=(
    ["node"]="18.0.0"
    ["npm"]="9.0.0"
)

# Function to compare versions
version_compare() {
    local v1="$1"
    local v2="$2"
    
    # Remove any leading 'v' from version strings
    v1="${v1#v}"
    v2="${v2#v}"
    
    if [[ "$v1" == "$v2" ]]; then
        return 0
    fi
    
    local IFS=.
    local i ver1=($v1) ver2=($v2)
    
    # Fill empty positions with zeros
    for ((i=${#ver1[@]}; i<${#ver2[@]}; i++)); do
        ver1[i]=0
    done
    for ((i=${#ver2[@]}; i<${#ver1[@]}; i++)); do
        ver2[i]=0
    done
    
    for ((i=0; i<${#ver1[@]}; i++)); do
        if [[ -z ${ver2[i]} ]]; then
            ver2[i]=0
        fi
        if ((10#${ver1[i]} > 10#${ver2[i]})); then
            return 1
        fi
        if ((10#${ver1[i]} < 10#${ver2[i]})); then
            return 2
        fi
    done
    return 0
}

# Function to get command version
get_version() {
    local cmd="$1"
    local version
    
    case "$cmd" in
        node)
            version=$(node --version 2>/dev/null)
            ;;
        npm)
            version=$(npm --version 2>/dev/null)
            ;;
        *)
            return 1
            ;;
    esac
    
    echo "${version#v}"
    return 0
}

# Function to check version compatibility
check_version_compatibility() {
    local cmd="$1"
    local current_version
    local min_version="${MIN_VERSIONS[$cmd]}"
    
    if [[ -z "$min_version" ]]; then
        return 0
    fi
    
    current_version=$(get_version "$cmd")
    if [[ -z "$current_version" ]]; then
        return 1
    fi
    
    version_compare "$current_version" "$min_version"
    local result=$?
    
    if [[ $result -eq 2 ]]; then
        log_error "$cmd version $current_version is lower than required $min_version"
        return 1
    fi
    
    return 0
}

# Function to setup local installation directory
setup_local_dirs() {
    mkdir -p "$LOCAL_BIN_DIR" "$LOCAL_LIB_DIR"
    
    # Add local bin to PATH if not already there
    if [[ ":$PATH:" != *":$LOCAL_BIN_DIR:"* ]]; then
        export PATH="$LOCAL_BIN_DIR:$PATH"
    fi
}

# Function to check system vs local command
get_command_path() {
    local cmd="$1"
    local cmd_path
    
    # First check in local bin
    cmd_path="$LOCAL_BIN_DIR/$cmd"
    if [[ -x "$cmd_path" ]]; then
        echo "$cmd_path"
        return 0
    fi
    
    # Then check in system PATH
    cmd_path=$(command -v "$cmd")
    if [[ -n "$cmd_path" ]]; then
        echo "$cmd_path"
        return 0
    fi
    
    return 1
}

# Function to create a dependency checker
make_dependency_checker() {
    local name="$1"
    local min_version="${2:-}"
    local install_cmd="${3:-}"
    
    # Return a function (closure-like behavior)
    echo "
        check_${name}() {
            local cmd_path
            cmd_path=\$(get_command_path '$name')
            
            if [[ -z \"\$cmd_path\" ]]; then
                if [[ -n '$install_cmd' ]]; then
                    log_warning '$name not found, installing locally...'
                    setup_local_dirs
                    if ! ($install_cmd); then
                        log_error 'Failed to install $name'
                        return 1
                    fi
                else
                    log_error '$name is required but not found'
                    return 1
                fi
            fi
            
            if [[ -n '$min_version' ]]; then
                MIN_VERSIONS['$name']='$min_version'
                if ! check_version_compatibility '$name'; then
                    return 1
                fi
            fi
            
            return 0
        }
    "
}

# Create dependency checkers
eval "$(make_dependency_checker "node" "18.0.0")"
eval "$(make_dependency_checker "npm" "9.0.0")"
eval "$(make_dependency_checker "curl")"

# Function to check all project dependencies
check_project_deps() {
    local -a failed_deps=()
    
    # Check each dependency
    for checker in check_node check_npm check_curl; do
        if ! $checker; then
            failed_deps+=("${checker#check_}")
        fi
    done
    
    # If any dependencies failed, exit
    if [[ ${#failed_deps[@]} -gt 0 ]]; then
        log_error "Missing or incompatible dependencies: ${failed_deps[*]}"
        log_error "Please install/upgrade the required dependencies"
        return 1
    fi
    
    return 0
}

# Function to ensure npm dependencies in a specific directory
ensure_project_deps() {
    local project_dir="$1"
    
    if [[ ! -d "$project_dir/node_modules" ]]; then
        log_step "Installing project dependencies..."
        (cd "$project_dir" && npm ci) || {
            log_error "Failed to install project dependencies"
            return 1
        }
    fi
    
    return 0
}