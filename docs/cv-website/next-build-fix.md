# Next.js Build Error Resolution Plan

## Current Issue
The website build is failing during the static export process with the following errors:
1. Cannot find module for pages: /404, /cv
2. Cannot find module for /index.js
3. All errors seem related to the Next.js static export process

## Analysis
1. The errors suggest a mismatch between the Next.js page structure and the build process
2. The issue appears during prerendering, indicating a problem with static generation
3. The paths in error messages show a different base path (/home/sleischnig/...) than expected
4. All page components exist but aren't being found during build

## Proposed Solutions

### 1. Next.js Configuration Review
- Check next.config.js for proper export configuration
- Verify output directory settings
- Review basePath and assetPrefix settings

### 2. Page Structure Alignment
- Ensure pages are in correct directory structure (pages/ vs app/)
- Verify file extensions (.tsx vs .js)
- Check for any case-sensitivity issues in imports

### 3. Build Process Verification
- Review build scripts in package.json
- Verify build command sequence
- Check for environment-specific build issues

### 4. Development Environment Consistency
- Ensure node_modules is properly installed
- Verify Next.js version compatibility
- Check for any path-related environment issues

## Implementation Steps

1. **Investigation Phase**
   - Run build with verbose logging
   - Check actual file paths during build
   - Verify Next.js configuration

2. **Configuration Update**
   - Update next.config.js if needed
   - Adjust build scripts if required
   - Fix any path-related issues

3. **Testing**
   - Test build in clean environment
   - Verify static export process
   - Check all page routes

4. **Documentation**
   - Update build documentation
   - Document any configuration changes
   - Add troubleshooting notes

## Success Criteria
1. All pages build successfully
2. Static export completes without errors
3. All routes are accessible in the exported build
4. Build process works consistently across environments