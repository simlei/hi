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

# Function to find process using a port
find_port_process() {
    local port="$1"
    lsof -ti ":$port" 2>/dev/null || true
}

# Function to kill process using a port
kill_port_process() {
    local port="$1"
    local pids
    pids=$(find_port_process "$port")
    if [[ -n "$pids" ]]; then
        log_step "Killing process(es) using port $port: $pids"
        for pid in $pids; do
            kill "$pid" 2>/dev/null || true
        done
        sleep 1
        
        # Double-check if port is still in use
        pids=$(find_port_process "$port")
        if [[ -n "$pids" ]]; then
            log_step "Forcefully killing remaining process(es): $pids"
            for pid in $pids; do
                kill -9 "$pid" 2>/dev/null || true
            done
            sleep 1
        fi
    fi
}

# Function to ensure port is available
ensure_port_available() {
    local port="$1"
    local max_attempts=3
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        # Check if port is in use
        if lsof -i ":$port" >/dev/null 2>&1; then
            log_step "Port $port is in use (attempt $attempt/$max_attempts)"
            kill_port_process "$port"
            sleep 1
        else
            return 0
        fi
        ((attempt++))
    done
    
    log_error "Failed to free port $port after $max_attempts attempts"
    return 1
}

# Function to wait for server
wait_for_server() {
    local port="$1"
    local max_attempts="${2:-30}"
    local attempt=1
    local url
    url=$(get_server_url "$port")

    log_step "Waiting for server to start on port $port..."
    while [[ $attempt -le $max_attempts ]]; do
        if curl --fail -s "$url" >/dev/null; then
            echo "$url" > "$URL_FILE"
            echo "$port" > "$PORT_FILE"
            return 0
        fi
        sleep 1
        ((attempt++))
        if [[ $attempt -gt 5 ]]; then
            log_step "Server not ready yet... attempt $attempt of $max_attempts"
        fi
    done
    return 1
}

# Function to start development server
start_dev_server() {
    local port="${1:-$DEFAULT_PORT}"
    local max_attempts=3
    local attempt=1
    
    # Kill any existing server
    if [[ -f "$PID_FILE" ]]; then
        stop_server
    fi
    
    # Ensure port is available
    if ! ensure_port_available "$port"; then
        return 1
    fi
    
    while [[ $attempt -le $max_attempts ]]; do
        log_step "Starting development server on port $port (attempt $attempt/$max_attempts)..."
        PORT=$port npm run dev > "${LOG_FILE}" 2>&1 & echo $! > "$PID_FILE"
        
        # Wait for server to start
        if wait_for_server "$port"; then
            echo "$port" > "$PORT_FILE"
            return 0
        fi
        
        # Check if it's a port conflict
        if grep -q "EADDRINUSE" "$LOG_FILE"; then
            log_step "Port $port is in use, trying to free it..."
            stop_server
            if ! ensure_port_available "$port"; then
                return 1
            fi
        else
            # Other error, show log and fail
            log_error "Server failed to start"
            cat "$LOG_FILE"
            stop_server
            return 1
        fi
        
        ((attempt++))
    done
    
    log_error "Failed to start server after $max_attempts attempts"
    cat "$LOG_FILE"
    return 1
}

# Function to stop server
stop_server() {
    # Stop by PID if we have it
    if [[ -f "$PID_FILE" ]]; then
        local pid
        pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            log_step "Stopping server (PID: $pid)..."
            kill "$pid"
        fi
    fi
    
    # Stop by port if we have it
    if [[ -f "$PORT_FILE" ]]; then
        local port
        port=$(cat "$PORT_FILE")
        kill_port_process "$port"
    fi
    
    cleanup_temp_files
}

# Function to run server with cleanup
run_server_with_cleanup() {
    local port="${1:-$DEFAULT_PORT}"
    local base_path
    base_path=$(get_server_base_path)
    
    trap stop_server EXIT
    if ! start_dev_server "$port"; then
        return 1
    fi
    
    # Show clear instructions
    port=$(cat "$PORT_FILE")
    log_success "Development server is running on port $port"
    log_step "Main website URL: $(get_server_url "$port")"
    if [[ -n "$base_path" ]]; then
        log_step "NOTE: This site uses a base path of '$base_path'"
        log_step "      The root URL (http://localhost:$port) will show a 404 page"
    fi
    log_step "Available pages:"
    log_step "  - Home:     $(get_server_url "$port")"
    log_step "  - CV:       $(get_server_url "$port" "/cv")"
    log_step "  - About:    $(get_server_url "$port" "/about")"
    
    wait $(cat "$PID_FILE") || {
        log_error "Server failed"
        cat "${LOG_FILE}"
        return 1
    }
}