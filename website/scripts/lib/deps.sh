#!/usr/bin/env bash

# Function to check if a command exists
check_command() {
    local cmd="$1"
    if ! command -v "$cmd" &> /dev/null; then
        log_error "$cmd is not installed"
        return 1
    fi
    return 0
}

# Function to check all required dependencies
check_dependencies() {
    local deps=("node" "npm" "curl")
    local missing=()

    for dep in "${deps[@]}"; do
        if ! check_command "$dep"; then
            missing+=("$dep")
        fi
    done

    if [[ ${#missing[@]} -gt 0 ]]; then
        log_error "Missing dependencies: ${missing[*]}"
        log_error "Please install them first"
        exit 1
    fi
}

# Function to ensure npm dependencies are installed
ensure_npm_deps() {
    if [[ ! -d "$WEBSITE_DIR/node_modules" ]]; then
        log_step "Installing npm dependencies..."
        if ! npm install; then
            log_error "Failed to install npm dependencies"
            exit 1
        fi
    fi
}