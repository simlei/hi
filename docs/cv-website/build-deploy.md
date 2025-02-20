# Build and Deployment Tools

## Development and Testing Scripts

### Local Development Script

Location: `scripts/manage-website.sh`

A versatile script that manages the development environment:
- Dependency checking and installation
- Build verification
- Server management
- Automated testing
- URL extraction

```bash
# Start development server
./scripts/manage-website.sh

# Run automated tests
./scripts/manage-website.sh --test

# Get server URL
./scripts/manage-website.sh --print-url

# Clean up server
./scripts/manage-website.sh --cleanup
```

### Build Test Script

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

#### What's Tested
- Build completion
- Critical file presence
- Content validation (key elements)
- Directory structure
- Static generation

#### Output
- Build size metrics
- File count
- Validation results

## Deployment

### GitHub Pages Setup

1. Repository Requirements:
   - Name: `<username>.github.io`
   - SSH key configured
   - GitHub Pages enabled:
     - Source: Deploy from branch
     - Branch: gh-pages / root

2. First Time Setup:
   ```bash
   # Add remote
   git remote add origin git@github.com:<username>/<username>.github.io.git

   # Generate SSH key (if needed)
   ssh-keygen -t ed25519 -C "your_email@example.com"

   # Add key to GitHub: Settings > SSH and GPG keys
   ```

### Deployment Script

Location: `website/deploy.sh`

Features:
- Automated testing integration
- Clean workspace handling
- Error management
- Self-cleanup
- Clear feedback
- Branch management

```bash
# Deploy with tests
./deploy.sh

# Deploy without tests
./deploy.sh --skip-tests
```

### Deployment Process

1. Pre-deployment:
   - Dependencies installation
   - Automated testing (optional)
   - Build verification

2. Deployment:
   - Branch preparation (gh-pages)
   - Static file generation
   - Content organization
   - Git operations

3. Post-deployment:
   - Cleanup
   - Status verification
   - Branch restoration

### Notes

- The deployment script integrates with the new development workflow
- Automated testing ensures deployment readiness
- Clean workspace management prevents artifacts
- Progress indicators show deployment status
- Allow a few minutes for GitHub Pages to update after deployment