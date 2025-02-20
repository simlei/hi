#!/usr/bin/env bash

# Function to get server URL
get_server_url() {
    local port="${1:-$DEFAULT_PORT}"
    echo "http://localhost:$port"
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
        if curl -s "$url" > /dev/null; then
            echo "$url" > "$URL_FILE"
            return 0
        fi
        sleep 1
        ((attempt++))
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
    PORT=$port npm run dev > server.log 2>&1 & echo $! > "$PID_FILE"

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
    trap stop_server EXIT
    start_dev_server "$port"
    log_success "Server running at $(get_server_url "$port")"
    wait
}