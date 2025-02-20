# Testing Strategy

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

## Running Tests

```bash
# Run build tests
npm run test:build
```

## Test Results

The build test verifies:
- Static generation is working (`out/` directory created)
- HTML files are generated correctly
- JavaScript chunks are present
- Content is properly rendered
- Directory structure follows Next.js static export format

Current build statistics:
- Total size: ~472KB
- Total files: 11