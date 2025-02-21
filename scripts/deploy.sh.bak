#!/bin/bash
set -euo pipefail

# Get absolute paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEBSITE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
DEV_SCRIPT="${WEBSITE_DIR}/website/scripts/dev.sh"

# Default values
DRY_RUN=0
SKIP_TESTS=0

# Function to show usage
usage() {
    cat << EOF
Usage: $(basename "$0") [options]

Deploy the website using GitHub Actions workflow structure.

Options:
    --dry-run       Test the deployment process without pushing
    --skip-tests    Skip running tests
    -h, --help      Show this help message
EOF
    exit 1
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=1
            shift
            ;;
        --skip-tests)
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

# Ensure we're in the website directory
cd "$WEBSITE_DIR"

# Function to run a step with proper formatting
run_step() {
    local step_name="$1"
    local cmd="$2"
    echo "📋 $step_name..."
    if ! eval "$cmd"; then
        echo "❌ $step_name failed"
        exit 1
    fi
}

# Build and test using dev.sh
cd "$WEBSITE_DIR/website"
if [[ $SKIP_TESTS -eq 1 ]]; then
    run_step "Building website" "$DEV_SCRIPT exec npm run build"
else
    # Use --skip-build for test since we'll build first
    run_step "Building website" "$DEV_SCRIPT exec npm run build"
    run_step "Running tests" "$DEV_SCRIPT test --skip-build"
fi

# Ensure .nojekyll exists in output directory
run_step "Creating .nojekyll" "mkdir -p out && touch out/.nojekyll"

# If this is a dry run, we're done
if [[ $DRY_RUN -eq 1 ]]; then
    echo "✨ Dry run completed successfully!"
    echo "🔍 Build output is available in: $WEBSITE_DIR/website/out"
    exit 0
fi

# Check if we have the required GitHub token
if [[ -z "${GITHUB_TOKEN:-}" ]]; then
    echo "❌ GITHUB_TOKEN environment variable is required for deployment"
    echo "💡 For local testing, use --dry-run"
    exit 1
fi

# Get repository information
if ! REPO_URL=$(git config --get remote.origin.url); then
    echo "❌ Failed to get repository URL"
    exit 1
fi

# Extract owner and repo name from the URL
REPO_OWNER=$(echo "$REPO_URL" | sed -n 's/.*github.com[:/]\([^/]*\).*/\1/p')
REPO_NAME=$(echo "$REPO_URL" | sed -n 's/.*github.com[:/][^/]*\/\([^.]*\).*/\1/p')

# Trigger GitHub Actions workflow using the API
echo "🚀 Triggering GitHub Actions workflow..."
RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/workflows/nextjs.yml/dispatches" \
    -d "{\"ref\":\"main\"}")

if [[ -n "$RESPONSE" ]]; then
    echo "❌ Failed to trigger workflow: $RESPONSE"
    exit 1
fi

echo "✨ Deployment triggered successfully!"
echo "🌐 Check the Actions tab in GitHub for deployment status"
echo "⏳ The site will be available in a few minutes"