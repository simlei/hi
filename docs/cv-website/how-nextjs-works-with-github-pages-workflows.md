# How Next.js Works with GitHub Pages Workflows

This document explains how Next.js integrates with GitHub Pages using GitHub Actions workflows, based on the [nextjs-github-pages](https://github.com/gregrickaby/nextjs-github-pages) example repository.

## Key Components

### 1. Static Export Configuration

Next.js needs specific configuration to work with GitHub Pages:

```typescript
// next.config.js
const nextConfig = {
  // Enable static exports - required for GitHub Pages
  output: "export",

  // Set base path to repository name
  basePath: "/hi",

  // Disable server-based image optimization
  images: {
    unoptimized: true,
  },
}
```

### 2. GitHub Actions Workflow

The workflow (`.github/workflows/nextjs.yml`) handles:

1. **Build Trigger**: Runs on push to main branch or manual trigger
2. **Permissions**: Sets up GitHub token permissions for Pages
3. **Concurrency**: Prevents multiple deployments running simultaneously
4. **Package Management**: Auto-detects and uses npm or yarn
5. **Caching**: Optimizes build times with dependency caching
6. **Deployment**: Uses GitHub Pages deployment action

### 3. Jekyll Bypass

GitHub Pages normally processes sites with Jekyll. To prevent this:

1. Place `.nojekyll` file in `/public` directory
2. File gets copied to output during build
3. Ensures static assets are served correctly

## Workflow Details

### Build Job

1. **Checkout**: Gets repository code
2. **Package Detection**: Determines whether to use npm or yarn
3. **Node Setup**: Configures Node.js with caching
4. **Pages Setup**: Configures GitHub Pages environment
5. **Dependencies**: Installs using detected package manager
6. **Build**: Creates static export
7. **Artifact**: Uploads build output for deployment

### Deploy Job

1. **Environment**: Sets up github-pages environment
2. **Deployment**: Uses actions/deploy-pages
3. **URL**: Provides deployment URL in output

## Directory Structure

```
.
├── .github/
│   └── workflows/
│       └── nextjs.yml    # GitHub Actions workflow
├── public/
│   └── .nojekyll        # Prevents Jekyll processing
├── src/
│   └── ...             # Next.js source files
└── next.config.js      # Next.js configuration
```

## Key Differences from gh-pages Branch

1. **No Branch Management**: No need for gh-pages branch
2. **Automated Process**: Fully automated via GitHub Actions
3. **Better Caching**: Built-in caching mechanisms
4. **Cleaner History**: Deployment doesn't pollute git history
5. **Better Security**: Uses GitHub-managed deployment tokens

## Development Workflow

1. **Local Development**:
   ```bash
   npm run dev     # Development server
   npm run build   # Test static build
   ```

2. **Testing**:
   - Use `dev.sh test` for comprehensive testing
   - Validates build and content
   - Checks static export

3. **Deployment**:
   - Push to main branch triggers deployment
   - Or manually trigger from Actions tab
   - Preview deployment before going live

## Common Issues and Solutions

1. **Base Path**: 
   - Must match repository name
   - Required for asset paths
   - Configured in next.config.js

2. **Image Optimization**:
   - Must be disabled for static export
   - Use unoptimized: true in config
   - Pre-optimize images if needed

3. **Build Failures**:
   - Check package manager detection
   - Verify dependencies are installed
   - Ensure static export compatibility

## Best Practices

1. **Configuration**:
   - Keep .nojekyll in public/
   - Set correct basePath
   - Use static exports

2. **Workflow**:
   - Use package manager detection
   - Implement proper caching
   - Set correct permissions

3. **Development**:
   - Test builds locally
   - Use provided scripts
   - Check deployment previews

## References

1. [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
2. [GitHub Pages Documentation](https://docs.github.com/en/pages)
3. [GitHub Actions for Pages](https://github.com/actions/deploy-pages)
4. [Example Repository](https://github.com/gregrickaby/nextjs-github-pages)