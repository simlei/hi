#!/usr/bin/env bash

# Function to get base path from next.config.js
get_server_base_path() {
    # Use the base path from env.sh
    source "$LIB_DIR/env.sh"
    get_base_path
}

# Function to get server URL
get_server_url() {
    local port="${1:-$DEFAULT_PORT}"
    local path="${2:-}"
    local base_url="http://localhost:$port"
    local base_path
    base_path=$(get_server_base_path)
    
    if [[ -n "$path" ]]; then
        echo "${base_url}${base_path}${path}"
    else
        echo "${base_url}${base_path}"
    fi
}

# Function to wait for server
wait_for_server() {
    local port="${1:-$DEFAULT_PORT}"
    local max_attempts=30
    local attempt=1
    local url
    url=$(get_server_url "$port")

    log_step "Waiting for server to start..."
    while [[ $attempt -le $max_attempts ]]; do
        log_step "Checking server status... $url"
        if curl --fail -s "$url"; then
            echo "$url" > "$URL_FILE"
            return 0
        fi
        log_step "Server not ready yet... attempt nr. $attempt of $max_attempts"
        sleep 1
        ((attempt++))
        if [[ $attempt -gt 5 ]]; then
            log_step "Server not ready yet... attempt nr. $attempt of $max_attempts"
        fi
    done
    return 1
}

# Function to start development server
start_dev_server() {
    local port="${1:-$DEFAULT_PORT}"
    
    if [[ -f "$PID_FILE" ]]; then
        stop_server
    fi

    log_step "Starting development server..."
    PORT=$port npm run dev > "${LOG_FILE}" 2>&1 & echo $! > "$PID_FILE"

    if ! wait_for_server "$port"; then
        log_error "Server failed to start"
        stop_server
        exit 1
    fi
}

# Function to stop server
stop_server() {
    if [[ -f "$PID_FILE" ]]; then
        local pid
        pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            log_step "Stopping server (PID: $pid)..."
            kill "$pid"
            cleanup_temp_files
        fi
    fi
}

# Function to run server with cleanup
run_server_with_cleanup() {
    local port="${1:-$DEFAULT_PORT}"
    local base_path
    base_path=$(get_server_base_path)
    trap stop_server EXIT
    start_dev_server "$port"
    
    # Show clear instructions
    log_success "Development server is running"
    log_step "Main website URL: $(get_server_url "$port")"
    if [[ -n "$base_path" ]]; then
        log_step "NOTE: This site uses a base path of '$base_path'"
        log_step "      The root URL (http://localhost:$port) will show a 404 page"
    fi
    log_step "Available pages:"
    log_step "  - Home:     $(get_server_url "$port")"
    log_step "  - CV:       $(get_server_url "$port" "/cv")"
    log_step "  - About:    $(get_server_url "$port" "/about")"
    wait
}
