#!/bin/bash
set -e

echo "🧪 Starting build test..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next out
rm -f test-results.log

# Run the build
echo "🏗️ Building website..."
npm run build >> test-results.log 2>&1

# Check if build succeeded
if [ ! -d "out" ]; then
    echo "❌ Build failed: 'out' directory not found"
    cat test-results.log
    exit 1
fi

# Check for critical files
echo "🔍 Checking for critical files..."
REQUIRED_FILES=(
    "out/index.html"
    "out/404.html"
    "out/_next/static/chunks/main-e87eedc540b19515.js"
    "out/_next/static/chunks/polyfills-42372ed130431b0a.js"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing required file: $file"
        exit 1
    fi
done

# Validate HTML content
echo "✅ Validating HTML content..."
if ! grep -q "Simon Leischnig" "out/index.html"; then
    echo "❌ Content validation failed: 'Simon Leischnig' not found in index.html"
    exit 1
fi

if ! grep -q "Software Developer" "out/index.html"; then
    echo "❌ Content validation failed: 'Software Developer' not found in index.html"
    exit 1
fi

# Check directory structure
echo "📁 Checking directory structure..."
REQUIRED_DIRS=(
    "out/_next"
    "out/_next/static"
    "out/_next/static/chunks"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        echo "❌ Missing required directory: $dir"
        exit 1
    fi
done

echo "✨ All tests passed!"
echo "📊 Build output:"
du -sh out/
find out/ -type f | wc -l | xargs echo "Total files:"