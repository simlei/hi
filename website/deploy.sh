#!/usr/bin/env bash
set -euo pipefail

# GitHub Pages Setup Instructions:
# 1. Go to repository Settings > Pages
# 2. Source: Deploy from a branch
# 3. Branch: gh-pages / root
# 4. Save
# 5. Wait for first deployment to complete

# Resolve paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEBSITE_DIR="$SCRIPT_DIR"
DEV_SCRIPT="$WEBSITE_DIR/scripts/dev.sh"
BUILD_HASH_FILE="$WEBSITE_DIR/.build-hash"

# Always use production for deployment
export NODE_ENV=production

# Function to show usage
usage() {
    cat << EOF
Usage: $(basename "$0") [options]

Options:
    -s, --skip-tests    Skip running tests before deployment
    --dry-run         Test the deployment process without pushing to GitHub
    -f, --force       Force rebuild even if no changes detected
    -h, --help         Show this help message
EOF
    exit 1
}

# Function to ensure dev.sh exists and is executable
check_dev_script() {
    if [[ ! -x "$DEV_SCRIPT" ]]; then
        echo "❌ Error: dev.sh script not found or not executable at $DEV_SCRIPT"
        exit 1
    fi
}

# Function to run a command through dev.sh
run_dev() {
    "$DEV_SCRIPT" exec "$@"
}

# Function to calculate hash of source files
calculate_source_hash() {
    find src pages public -type f -exec sha256sum {} \; 2>/dev/null | sort | sha256sum | cut -d' ' -f1
}

# Function to check if rebuild is needed
needs_rebuild() {
    if [[ ! -d "$WEBSITE_DIR/out" ]]; then
        echo "📦 No existing build found."
        return 0
    fi

    local current_hash
    current_hash=$(calculate_source_hash)
    
    if [[ ! -f "$BUILD_HASH_FILE" ]]; then
        echo "📦 No build hash found."
        return 0
    fi

    local stored_hash
    stored_hash=$(head -n1 "$BUILD_HASH_FILE" 2>/dev/null || echo "")

    if [[ "$current_hash" != "$stored_hash" ]]; then
        echo "📦 Source files changed since last build."
        return 0
    fi

    echo "✨ No changes detected, using existing build."
    return 1
}

# Parse arguments
SKIP_TESTS=0
DRY_RUN=0
FORCE_REBUILD=0
while [[ $# -gt 0 ]]; do
    case $1 in
        -s|--skip-tests)
            SKIP_TESTS=1
            shift
            ;;
        --dry-run)
            DRY_RUN=1
            shift
            ;;
        -f|--force)
            FORCE_REBUILD=1
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            usage
            ;;
    esac
done

echo "🚀 Starting deployment process..."

# Verify dev.sh is available
check_dev_script

# Change to website directory
cd "$WEBSITE_DIR"

# Clean .next directory to avoid stale artifacts
rm -rf .next

# Use dev.sh to handle dependencies
echo "📦 Setting up environment..."
run_dev npm ci

if [[ $SKIP_TESTS -eq 0 ]]; then
    # Run automated tests through dev.sh
    echo "🧪 Running automated tests..."
    "$DEV_SCRIPT" test || { echo "❌ Tests failed"; exit 1; }
fi

# Build only if needed or forced
if [[ $FORCE_REBUILD -eq 1 ]] || needs_rebuild; then
    # Build the site using dev.sh with GitHub Pages environment
    echo "🏗️ Building site..."
    run_dev npm run build || { echo "❌ Build failed"; exit 1; }
    
    # Store build hash
    calculate_source_hash > "$BUILD_HASH_FILE"
fi

# Create and switch to gh-pages branch
echo "🔄 Preparing gh-pages branch..."
git checkout -B gh-pages

# Move build output to root and clean up
echo "📦 Preparing files..."
# Ensure .nojekyll exists to prevent Jekyll processing
touch .nojekyll
# Copy all files from out directory
cp -r out/* .
# Clean up build artifacts
rm -rf out .next node_modules

# Add and commit
echo "💾 Committing changes..."
git add .
git commit -m "Deploy to GitHub Pages" || true

# Push to gh-pages branch if not dry run
if [[ $DRY_RUN -eq 0 ]]; then
    echo "⬆️ Pushing to GitHub..."
    git push -f origin gh-pages

    # Switch back to previous branch
    git checkout -

    echo "✨ Deployment complete!"
    echo "🌐 Site will be available at: https://simlei.github.io/hi"
    echo "⏳ Allow a few minutes for GitHub Pages to update"
else
    echo "✨ Dry run completed successfully!"
    echo "🔍 No changes were pushed to GitHub"
    
    # Switch back to previous branch
    git checkout -
fi