# Build and Deployment Tools

## Build & Test Script

Location: `scripts/test-build.sh`

A non-interactive script that verifies:
1. Clean build process
2. Static content generation
3. Basic content validation
4. Directory structure

```bash
# Run build test
npm run test:build
```

### What's Tested
- Build completion
- Critical file presence
- Content validation (key elements)
- Directory structure
- Static generation

### Output
- Build size metrics
- File count
- Validation results

## Deployment Script

Location: `deploy.sh`

Automates GitHub Pages deployment with:
- Clean workspace handling
- Error management
- Self-cleanup
- Clear feedback

### Setup Requirements
1. GitHub repository: `<username>.github.io`
2. SSH key configuration
3. GitHub Pages settings:
   - Source: Deploy from branch
   - Branch: gh-pages / root

### Usage
```bash
# First time setup
git remote add origin git@github.com:<username>/<username>.github.io.git

# Deploy
./deploy.sh
```

### Process
1. Dependencies installation
2. Build verification
3. Static content generation
4. Branch management
5. Deployment
6. Cleanup

### Notes
- SSH authentication required
- May need manual GitHub Pages setup
- Allow time for deployment to complete