#!/bin/bash
set -e

echo "🌐 Setting up website preview..."

# Create preview directory if it doesn't exist
PREVIEW_DIR="/workspace/cv-website/.preview"
mkdir -p "$PREVIEW_DIR"

# Add to .gitignore if not already there
if ! grep -q "^\.preview" .gitignore 2>/dev/null; then
    echo ".preview" >> .gitignore
    echo "Added .preview to .gitignore"
fi

# Build the website
echo "🏗️ Building website..."
npm run build

# Copy to preview directory
echo "📋 Copying to preview directory..."
rm -rf "$PREVIEW_DIR/*"
cp -r out/* "$PREVIEW_DIR/"

echo "
🌍 Website is available at:
   1. Development server (live updates): http://localhost:3001
   2. Static preview: $PREVIEW_DIR

To start the development server:
   npm run dev

To view the static build:
   cd $PREVIEW_DIR && python3 -m http.server 8000
   Then visit: http://localhost:8000
"