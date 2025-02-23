#!/bin/bash

# Exit on error
set -e

# Default values
TEST_MODE=false
PRINT_URL=false
CLEANUP=false

# Parse arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --test) TEST_MODE=true ;;
    --print-url) PRINT_URL=true ;;
    --cleanup) CLEANUP=true ;;
    *) echo "Unknown parameter: $1"; exit 1 ;;
  esac
  shift
done

# Function to check dependencies
check_dependencies() {
  local missing=false
  for cmd in node npm curl; do
    if ! command -v $cmd &> /dev/null; then
      echo "Error: $cmd is required but not installed."
      missing=true
    fi
  done
  if $missing; then
    exit 1
  fi
}

# Function to install dependencies
install_dependencies() {
  if [ ! -d "node_modules" ]; then
    echo "Installing npm packages..."
    npm install
  fi
}

# Function to build website
build_website() {
  echo "Building website..."
  npm run build
}

# Function to start server
start_server() {
  echo "Starting development server..."
  npm run dev > server.log 2>&1 &
  echo $! > server.pid
}

# Function to verify server
verify_server() {
  local retries=30
  local url="http://localhost:3000"
  echo "Verifying server at $url..."
  while [ $retries -gt 0 ]; do
    if curl -s -f "$url" > /dev/null; then
      echo "Server is up!"
      return 0
    fi
    sleep 1
    ((retries--))
  done
  echo "Server verification failed"
  return 1
}

# Function to cleanup
cleanup() {
  if [ -f server.pid ]; then
    echo "Cleaning up server..."
    kill $(cat server.pid) 2>/dev/null || true
    rm server.pid
  fi
}

# Main execution
if $CLEANUP; then
  cleanup
  exit 0
fi

check_dependencies
install_dependencies
build_website

if $PRINT_URL; then
  echo "http://localhost:3000"
  exit 0
fi

start_server
verify_server

if $TEST_MODE; then
  cleanup
else
  echo "Server running at http://localhost:3000"
  echo "Press Ctrl+C to stop"
  wait
fi