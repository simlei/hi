#!/usr/bin/env bash

set -euo pipefail

# Import common library
source "$(dirname "${BASH_SOURCE[0]}")/lib/common.sh"

# Parse arguments
SKIP_BUILD=0
SKIP_RUNTIME=0
CI_MODE=0
RUNTIME_TIMEOUT=5

usage() {
    show_usage "$(basename "$0")" \
        "Run all tests" \
        "    -s, --skip-build    Skip build test
    -r, --skip-runtime  Skip runtime tests (for content updates)
    -c, --ci           Run in CI mode with extended timeout
    -h, --help         Show this help message"
}

while [[ $# -gt 0 ]]; do
    case $1 in
        -s|--skip-build)
            SKIP_BUILD=1
            shift
            ;;
        -r|--skip-runtime)
            SKIP_RUNTIME=1
            shift
            ;;
        -c|--ci)
            CI_MODE=1
            RUNTIME_TIMEOUT=30
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

# Main script
ensure_website_dir

# Check system dependencies with version requirements
if ! check_project_deps; then
    exit 1
fi

# Ensure project dependencies
if ! ensure_project_deps "$WEBSITE_DIR"; then
    exit 1
fi

# Run build test
if [[ $SKIP_BUILD -eq 0 ]]; then
    log_step "Running build test..."
    # Save .nojekyll if it exists
    if [[ -f "out/.nojekyll" ]]; then
        mv out/.nojekyll out/.nojekyll.bak
    fi
    run_npm_cmd "build" "Build failed"
    # Restore .nojekyll if it was saved
    if [[ -f "out/.nojekyll.bak" ]]; then
        mv out/.nojekyll.bak out/.nojekyll
    fi
    log_success "Build test passed"
fi

# Test static export
log_step "Testing static export..."

# Check if out directory exists
if [[ ! -d "out" ]]; then
    log_error "Static export directory 'out' not found"
    exit 1
fi

# Required files to check - adjust based on your needs
declare -A required_files=(
    ["index.html"]="Homepage"
    ["cv/index.html"]="CV page"
    ["404.html"]="404 page"
    [".nojekyll"]="GitHub Pages config"
)

# Required assets/directories to check
declare -A required_dirs=(
    ["_next"]="Next.js assets"
)

# Check required files
for file in "${!required_files[@]}"; do
    description="${required_files[$file]}"
    log_step "Checking $description ($file)..."
    
    if [[ ! -f "out/$file" ]]; then
        log_error "Missing required file: $file ($description)"
        exit 1
    fi
    
    # For HTML files, do basic content validation
    if [[ $file == *.html ]]; then
        if ! grep -q "<html" "out/$file"; then
            log_error "Invalid HTML file: $file (missing <html> tag)"
            exit 1
        fi
        
        # Check if file is not empty
        if [[ ! -s "out/$file" ]]; then
            log_error "Empty HTML file: $file"
            exit 1
        fi
    fi
done

# Check required directories
for dir in "${!required_dirs[@]}"; do
    description="${required_dirs[$dir]}"
    log_step "Checking $description directory ($dir)..."
    
    if [[ ! -d "out/$dir" ]]; then
        log_error "Missing required directory: $dir ($description)"
        exit 1
    fi
    
    # Check if directory is not empty
    if [[ ! "$(ls -A "out/$dir")" ]]; then
        log_error "Empty directory: $dir ($description)"
        exit 1
    fi
done

# Check for critical Next.js static assets
log_step "Checking Next.js static assets..."

# Check for CSS files
if ! find "out/_next" -name "*.css" -type f | grep -q .; then
    log_error "No CSS files found in static export"
    exit 1
fi

# Check for JavaScript files
if ! find "out/_next" -name "*.js" -type f | grep -q .; then
    log_error "No JavaScript files found in static export"
    exit 1
fi

# Optional: Validate HTML content more thoroughly
log_step "Validating HTML content..."

# Check homepage content
if ! grep -q "<title" "out/index.html"; then
    log_error "Homepage missing title tag"
    exit 1
fi

# Check CV page content
if ! grep -q "<title" "out/cv/index.html"; then
    log_error "CV page missing title tag"
    exit 1
fi

log_success "All static export tests passed"

# Run Jest unit tests
log_step "Running unit tests..."
if ! npm test -- --watchAll=false --ci; then
    log_error "Unit tests failed"
    exit 1
fi
log_success "Unit tests passed"

# Run runtime tests unless skipped
if [[ $SKIP_RUNTIME -eq 0 ]]; then
    RUNTIME_TIMEOUT=$RUNTIME_TIMEOUT CI_MODE=$CI_MODE "$(dirname "${BASH_SOURCE[0]}")/runtime-test.sh"
fi