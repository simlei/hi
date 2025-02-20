# Testing Strategy

## Development Workflow Testing

The project includes a standalone script (`scripts/manage-website.sh`) that automates the development workflow testing process. This script ensures proper setup, building, and server functionality.

### Script Features

- Dependency checking (node, npm, curl)
- Automatic installation of npm packages
- Build verification
- Server startup and accessibility testing
- Automatic cleanup on exit
- URL extraction and browser opening
- Non-interactive test mode

### Usage

```bash
# Start server and open in browser
./scripts/manage-website.sh

# Run in test mode (start, verify, stop)
./scripts/manage-website.sh --test

# Only print the server URL
./scripts/manage-website.sh --print-url

# Clean up any running server
./scripts/manage-website.sh --cleanup
```

### Test Mode

The test mode (`--test`) performs these steps:
1. Checks all dependencies
2. Installs npm packages if needed
3. Builds the website
4. Starts the development server
5. Verifies server accessibility
6. Cleans up automatically

This ensures a complete end-to-end test of the development workflow.

## Build Testing

The website uses a comprehensive build test script (`scripts/test-build.sh`) that verifies:

1. Static Generation
   - Confirms the website is built as static HTML files
   - Validates the output directory structure
   - Checks for critical files

2. Content Validation
   - Verifies key content is present in the generated HTML
   - Ensures all required assets are generated

3. Directory Structure
   - Validates the Next.js static export structure
   - Confirms all necessary directories are present

### Running Build Tests

```bash
# Run build tests
npm run test:build
```

### Build Test Results

The build test verifies:
- Static generation is working (`out/` directory created)
- HTML files are generated correctly
- JavaScript chunks are present
- Content is properly rendered
- Directory structure follows Next.js static export format

Current build statistics:
- Total size: ~472KB
- Total files: 11

## Continuous Integration

The GitHub Actions workflow (`.github/workflows/deploy.yml`) performs additional tests during the build process:
1. Code linting
2. Type checking
3. Build verification
4. Static export validation

These tests run automatically on every push to the main branch.