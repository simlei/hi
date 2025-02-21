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
# 3. Generate SSH key if needed: ssh-keygen -t ed25519 -C "openhands@all-hands.dev"
# 4. Add key to GitHub: Settings > SSH and GPG keys
# 5. Configure git:
#    git config --global user.name "openhands"
#    git config --global user.email "openhands@all-hands.dev"
# 6. Run this script
#
# Note: This script relies on ssh-agent for key management. Make sure to:
# - Start ssh-agent: eval "$(ssh-agent -s)"
# - Add your key: ssh-add ~/.ssh/id_ed25519
# The agent will prompt for the key password if needed.

# Resolve paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEBSITE_DIR="$SCRIPT_DIR"
DEV_SCRIPT="$WEBSITE_DIR/scripts/dev.sh"

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

# Parse arguments
SKIP_TESTS=0
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

echo "🚀 Starting deployment process..."

# Verify dev.sh is available
check_dev_script

# Change to website directory
cd "$WEBSITE_DIR"

# Use dev.sh to handle dependencies and environment
echo "📦 Setting up environment..."
run_dev npm ci

if [[ $SKIP_TESTS -eq 0 ]]; then
    # Run automated tests through dev.sh
    echo "🧪 Running automated tests..."
    "$DEV_SCRIPT" test || { echo "❌ Tests failed"; exit 1; }
fi

# Build the site using dev.sh with GitHub Pages environment
echo "🏗️ Building site..."
GITHUB_ACTIONS=true run_dev npm run build || { echo "❌ Build failed"; exit 1; }

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

# Get the actual site URL
REPO_NAME=$(cd "$WEBSITE_DIR" && git config --get remote.origin.url | sed -n 's/.*\/\([^/]*\)\.git$/\1/p')
echo "✨ Deployment complete!"
echo "🌐 Site will be available at: https://simlei.github.io/$REPO_NAME"
echo "⏳ Allow a few minutes for GitHub Pages to update"