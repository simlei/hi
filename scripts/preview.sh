#!/bin/bash
set -e

echo "🌐 Setting up website preview..."

# Build the website
echo "🏗️ Building website..."
npm run build

# Start a local server to preview the build
echo "🚀 Starting preview server..."
cd out && python3 -m http.server 8000 &
SERVER_PID=$!

echo "
🌍 Website preview is available at:
   http://localhost:8000

Press Ctrl+C to stop the preview server.
"

# Wait for Ctrl+C
trap "kill $SERVER_PID" INT
wait $SERVER_PID