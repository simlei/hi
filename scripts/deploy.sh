#!/bin/bash
set -eo pipefail

# Get absolute paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEBSITE_DIR="$(cd "${SCRIPT_DIR}/../website" && pwd)"
DEV_SCRIPT_DIR="$WEBSITE_DIR/scripts"

# Import dev.sh framework
source "$DEV_SCRIPT_DIR/lib/common.sh"
source "$DEV_SCRIPT_DIR/lib/test.sh"

# Default values
DRY_RUN=0
SKIP_TESTS=0

# Function to show usage
usage() {
    show_usage "$(basename "$0")" \
        "Deploy the website using GitHub Actions workflow structure" \
        "    --dry-run       Test the deployment process without pushing
    --skip-tests    Skip running tests
    -h, --help      Show this help message"
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

log_step "Starting deployment process..."

# Ensure we're in the website directory
cd "$WEBSITE_DIR"

# Build first
log_step "Building website..."
if ! run_npm_cmd "build" "Build failed"; then
    exit 1
fi

# Create .nojekyll file right after build
log_step "Creating .nojekyll..."
mkdir -p out && touch out/.nojekyll

# Run tests if not skipped
if [[ $SKIP_TESTS -eq 0 ]]; then
    if ! run_tests --skip-build; then
        exit 1
    fi
fi

# If this is a dry run, we're done
if [[ $DRY_RUN -eq 1 ]]; then
    log_success "Dry run completed successfully!"
    log_step "Build output is available in: $WEBSITE_DIR/out"
    exit 0
fi

# Get repository information
if ! REPO_URL=$(git config --get remote.origin.url); then
    log_error "Failed to get repository URL"
    exit 1
fi

# Extract owner and repo name from the URL
REPO_OWNER=$(echo "$REPO_URL" | sed -n 's/.*github.com[:/]\([^/]*\).*/\1/p')
REPO_NAME=$(echo "$REPO_URL" | sed -n 's/.*github.com[:/][^/]*\/\([^.]*\).*/\1/p')

# Commit and push changes
git add -A . || :
git commit -m "Deploy website" || :
git push origin HEAD:master || {
    log_error "Failed to push changes"
    exit 1
}

log_success "Deployment triggered successfully!"
log_step "Check the Actions tab in GitHub for deployment status: https://github.com/$REPO_OWNER/$REPO_NAME/actions"
log_step "The site will be available in a few minutes"