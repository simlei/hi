#!/usr/bin/env bash
set -euo pipefail

# GitHub Pages Setup Instructions:
# 1. Go to repository Settings > Pages
# 2. Source: Deploy from a branch
# 3. Branch: gh-pages / root
# 4. Save
# 5. Wait for first deployment to complete
#
# First-time setup:
# 1. Create repository: <username>.github.io
# 2. git remote add origin git@github.com:<username>/<username>.github.io.git
# 3. Generate SSH key if needed: ssh-keygen -t ed25519 -C "your_email@example.com"
# 4. Add key to GitHub: Settings > SSH and GPG keys
# 5. Run this script
#
# Note: This script is designed to work with the new Next.js static export
# configuration in next.config.js and the automated testing script in
# scripts/manage-website.sh

# Default values
SKIP_TESTS=0
WEBSITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to show usage
usage() {
    cat << EOF
Usage: $(basename "$0") [options]

Options:
    -s, --skip-tests    Skip running tests before deployment
    -h, --help         Show this help message
EOF
    exit 1
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -s|--skip-tests)
            SKIP_TESTS=1
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

# Cleanup function
cleanup() {
    echo "🧹 Cleaning up..."
    if [[ -f "/tmp/website-dev-server.pid" ]]; then
        "$WEBSITE_DIR/scripts/manage-website.sh" --cleanup
    fi
    rm -rf node_modules .next out
}

# Ensure cleanup on script exit
trap cleanup EXIT

echo "🚀 Starting deployment process..."

# Change to website directory
cd "$WEBSITE_DIR"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

if [[ $SKIP_TESTS -eq 0 ]]; then
    # Run automated tests
    echo "🧪 Running automated tests..."
    ./scripts/manage-website.sh --test || { echo "❌ Tests failed"; exit 1; }
fi

# Build the site
echo "🏗️ Building site..."
npm run build || { echo "❌ Build failed"; exit 1; }

# Create and switch to gh-pages branch
echo "🔄 Preparing gh-pages branch..."
git checkout -B gh-pages

# Move build output to root and clean up
echo "📦 Preparing files..."
cp -r out/* .
rm -rf out

# Add and commit
echo "💾 Committing changes..."
git add .
git commit -m "Deploy to GitHub Pages" || true

# Push to gh-pages branch
echo "⬆️ Pushing to GitHub..."
git push -f origin gh-pages

# Switch back to previous branch
git checkout -

echo "✨ Deployment complete!"
echo "🌐 Site will be available at: https://<username>.github.io"
echo "⏳ Allow a few minutes for GitHub Pages to update"