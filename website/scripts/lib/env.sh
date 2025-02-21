#!/usr/bin/env bash

# Environment configuration for the website

# Function to detect if we're in a GitHub Pages environment
is_github_pages() {
    [[ -n "${GITHUB_ACTIONS:-}" ]] && return 0
    return 1
}

# Function to get the repository name from git config
get_repo_name() {
    # Always return "hi" as this is the fixed base path we want
    echo "hi"
}

# Function to get the base path for the website
get_base_path() {
    if is_github_pages || [[ "${NODE_ENV:-}" == "production" ]]; then
        echo "/$(get_repo_name)"
    else
        echo ""  # Empty for local development
    fi
}

# Function to get the base URL for the website
get_base_url() {
    if is_github_pages; then
        echo "https://simlei.github.io"
    else
        echo "http://localhost:${1:-3000}"
    fi
}

# Function to setup environment variables for Next.js
setup_next_env() {
    local env_file="${WEBSITE_DIR}/.env.local"
    local base_path
    local base_url
    
    base_path=$(get_base_path)
    base_url=$(get_base_url "$1")
    
    # Create or update .env.local
    cat > "$env_file" << EOF
NEXT_PUBLIC_BASE_PATH="${base_path}"
NEXT_PUBLIC_BASE_URL="${base_url}"
EOF
    
    # Export for current session
    export NEXT_PUBLIC_BASE_PATH="${base_path}"
    export NEXT_PUBLIC_BASE_URL="${base_url}"
}