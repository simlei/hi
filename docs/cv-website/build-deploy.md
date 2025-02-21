# Build and Deployment Tools

## Development Tools

### Local Development

The project uses a unified development script for all tasks:

```bash
# Start development server
./scripts/dev.sh server

# Run tests (includes build)
./scripts/dev.sh test

# Run specific command in dev environment
./scripts/dev.sh exec npm run build

# Skip build step
./scripts/dev.sh test --skip-build
```

### Development Script Features

Location: `website/scripts/dev.sh`

1. **Environment Management**
   - Isolated local environment in `.local/`
   - Proper PATH and library handling
   - Clean process management

2. **Build Process**
   - Next.js static site generation
   - TypeScript compilation
   - Asset optimization
   - `.nojekyll` file creation

3. **Testing**
   - Build validation
   - URL structure verification
   - Content checks
   - TypeScript type checking

## Deployment

### GitHub Pages Setup

The site is automatically deployed to GitHub Pages using GitHub Actions. To set this up:

1. Repository Requirements:
   - GitHub Pages enabled in repository settings
   - Source: GitHub Actions

2. First Time Setup:
   - Push the repository to GitHub
   - Go to Settings > Pages
   - Under "Build and deployment", select "GitHub Actions"

### GitHub Actions Workflow

Location: `.github/workflows/nextjs.yml`

Features:
- Automated builds on push to main branch
- Dependency caching for faster builds
- Comprehensive testing
- Automatic deployment to GitHub Pages
- Proper handling of base paths and assets

The workflow:
1. Triggers on push to main branch
2. Sets up Node.js environment
3. Caches dependencies and build outputs
4. Builds the Next.js application
5. Runs tests
6. Deploys to GitHub Pages

### Manual Deployment

While automatic deployment is preferred, you can trigger a manual deployment:

1. Go to the GitHub repository
2. Click "Actions"
3. Select "Deploy Next.js site to Pages"
4. Click "Run workflow"

### Testing Strategy

#### Local Testing
```bash
# Quick development testing
npm run dev

# Preview production build
npm run preview

# Run build tests
npm run test:build
```

#### GitHub Actions Testing
The GitHub Actions workflow automatically:
- Builds the application
- Runs tests
- Validates the build
- Deploys only if all tests pass

### Notes

- Deployments are automated via GitHub Actions
- No manual branch management needed
- Clean workspace handling is automated
- Progress visible in GitHub Actions UI
- Allow a few minutes for GitHub Pages to update after deployment
- Use local preview for quick testing
- GitHub Actions provides detailed logs and status