#!/usr/bin/env bash

# Test configuration
declare -A REQUIRED_FILES=(
    ["index.html"]="Homepage"
    ["cv/index.html"]="CV page"
    ["404.html"]="404 page"
    [".nojekyll"]="GitHub Pages config"
)

declare -A REQUIRED_DIRS=(
    ["_next"]="Next.js assets"
)

# Function to run build test
run_build_test() {
    log_step "Running build test..."
    
    # Save .nojekyll if it exists
    if [[ -f "out/.nojekyll" ]]; then
        mv out/.nojekyll out/.nojekyll.bak
    fi
    
    # Run build
    run_npm_cmd "build" "Build failed"
    
    # Restore .nojekyll if it was saved
    if [[ -f "out/.nojekyll.bak" ]]; then
        mv out/.nojekyll.bak out/.nojekyll
    fi
    
    log_success "Build test passed"
}

# Function to test static export
test_static_export() {
    log_step "Testing static export..."
    
    # Check if out directory exists
    if [[ ! -d "out" ]]; then
        log_error "Static export directory 'out' not found"
        return 1
    fi
    
    # Check required files
    for file in "${!REQUIRED_FILES[@]}"; do
        description="${REQUIRED_FILES[$file]}"
        log_step "Checking $description ($file)..."
        
        if [[ ! -f "out/$file" ]]; then
            log_error "Missing required file: $file ($description)"
            return 1
        fi
        
        # For HTML files, do basic content validation
        if [[ $file == *.html ]]; then
            if ! grep -q "<html" "out/$file"; then
                log_error "Invalid HTML file: $file (missing <html> tag)"
                return 1
            fi
            
            # Check if file is not empty
            if [[ ! -s "out/$file" ]]; then
                log_error "Empty HTML file: $file"
                return 1
            fi
        fi
    done
    
    # Check required directories
    for dir in "${!REQUIRED_DIRS[@]}"; do
        description="${REQUIRED_DIRS[$dir]}"
        log_step "Checking $description directory ($dir)..."
        
        if [[ ! -d "out/$dir" ]]; then
            log_error "Missing required directory: $dir ($description)"
            return 1
        fi
        
        # Check if directory is not empty
        if [[ ! "$(ls -A "out/$dir")" ]]; then
            log_error "Empty directory: $dir ($description)"
            return 1
        fi
    done
    
    # Check for critical Next.js static assets
    log_step "Checking Next.js static assets..."
    
    # Check for CSS files
    if ! find "out/_next" -name "*.css" -type f | grep -q .; then
        log_error "No CSS files found in static export"
        return 1
    fi
    
    # Check for JavaScript files
    if ! find "out/_next" -name "*.js" -type f | grep -q .; then
        log_error "No JavaScript files found in static export"
        return 1
    fi
    
    # Validate HTML content
    log_step "Validating HTML content..."
    
    # Check homepage content
    if ! grep -q "<title" "out/index.html"; then
        log_error "Homepage missing title tag"
        return 1
    fi
    
    # Check CV page content
    if ! grep -q "<title" "out/cv/index.html"; then
        log_error "CV page missing title tag"
        return 1
    fi
    
    log_success "All static export tests passed"
    return 0
}

# Function to run unit tests
run_unit_tests() {
    log_step "Running unit tests..."
    if ! npm test -- --watchAll=false --ci; then
        log_error "Unit tests failed"
        return 1
    fi
    log_success "Unit tests passed"
    return 0
}

# Function to verify server
verify_server() {
    log_step "Verifying development server..."
    
    if ! start_dev_server; then
        return 1
    fi
    
    log_success "Server verification passed (port $(cat "$PORT_FILE"))"
    stop_server
    return 0
}

# Main test function
run_tests() {
    local skip_build=0
    local skip_runtime=0
    local verify_server=1
    local ci_mode=0
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -s|--skip-build)
                skip_build=1
                shift
                ;;
            -r|--skip-runtime)
                skip_runtime=1
                shift
                ;;
            -n|--no-server)
                verify_server=0
                shift
                ;;
            -c|--ci)
                ci_mode=1
                shift
                ;;
            *)
                log_error "Unknown test option: $1"
                return 1
                ;;
        esac
    done
    
    # Run build test unless skipped
    if [[ $skip_build -eq 0 ]]; then
        if ! run_build_test; then
            return 1
        fi
    fi
    
    # Run static export tests
    if ! test_static_export; then
        return 1
    fi
    
    # Run unit tests
    if ! run_unit_tests; then
        return 1
    fi
    
    # Verify server if requested
    if [[ $verify_server -eq 1 && $skip_runtime -eq 0 ]]; then
        if ! verify_server; then
            return 1
        fi
    fi
    
    log_success "All tests passed successfully"
    return 0
}