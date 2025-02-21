# OpenHands Knowledge Base

⚠️ **IMPORTANT FOR ALL SESSIONS** ⚠️
All agents MUST:
1. Check this knowledge base first
2. Update the status file with their progress
3. Document any decisions or important findings
4. Review prompt at `/workspace/.oh/curriculum-vitae-prompt.txt`

## Quick Navigation

- [Current Status](/workspace/docs/STATUS.md) - Always check this first
- [CV Website Implementation](/workspace/docs/cv-website/README.md) - Documentation for CV website implementation
- [Development Scripts](/workspace/docs/cv-website/scripts.md) - Development and testing tools
- [Design Decisions](/workspace/docs/cv-website/design-decisions.md) - Key architectural choices
- [Build & Deploy](/workspace/docs/cv-website/build-deploy.md) - Build and deployment tools
- [Content Guidelines](/workspace/docs/cv-website/content.md) - CV and landing page content guidelines

## Tools Overview

1. Development Command (`website/scripts/dev.sh`)
   - Command dispatcher for development tasks
   - Environment and dependency management
   - Local toolchain with isolated environment
   - Automated dependency validation
   - Clean process handling

2. Testing Strategy:
   - Quick content updates: `dev.sh test --skip-runtime`
   - Component changes: `dev.sh test`
   - CI/deployment: `dev.sh test --ci`
   - Runtime error monitoring via `/workspace/.oh/current_error.txt`

3. Subcommands:
   - `server`: Development server with hot reload
   - `test`: Multi-level validation (build, static, runtime)
   - `exec`: Run commands in local environment
   - Common options: `--skip-build`, `--skip-runtime`, `--ci`

3. Deployment Tools
   - GitHub Actions workflow (`.github/workflows/nextjs.yml`)
   - Automated build and deployment to GitHub Pages
   - Content validation and artifact handling
   - Clean URLs without .html extension
   - No manual deployment needed

4. Development Features
   - Isolated local environment in `.local/`
   - Smart dependency management
   - TypeScript type checking
   - Hot module replacement
   - Comprehensive testing

## Documentation Structure

Each task or component has its own directory under `/workspace/docs/` with:
- README.md - Overview and getting started
- Specific documentation files for different aspects
- Task-specific guides and references

### Key Guidelines

1. [Bash Style Guide](/workspace/docs/bash_style.md)
   - Location-independent script execution
   - DRY principles and code reuse
   - Robust error handling
   - Common library structure

## Current Status & Next Task

1. Recent Achievements:
   - ✅ Project cards layout fixed and responsive
   - ✅ Image handling improved and simplified
   - ✅ Deployment and testing scripts working reliably
   - ✅ Documentation structure established
   - ✅ Bash tooling library enhanced

2. Current Task: Graph Background Integration & Enhancement
   - Objective: Get graph background working with proper Brownian motion and hex grid structure
   - Current State:
     * GraphBackground component is visible and integrated
     * Implementing proper physics-based motion system
     * Added mass and inertia to vertices
     * Currently testing with disabled hex grid for debugging
   - Physics Implementation:
     * Each vertex has random mass (0.8 to 1.2)
     * Force application uses F = ma
     * Proper time-step based integration
     * Added air drag proportional to v²
     * Inertia tracking for each vertex
   - Debug Status:
     * Temporary solution: Disabled hex grid to isolate motion
     * Added mass/inertia visualization
     * Using proper deltaTime integration
     * Testing new physics-based motion
   - Current Debug Configuration:
     * Only Brownian motion active (speed: 0.5)
     * Hex grid and upward forces temporarily disabled
     * Force application normalized to 60fps
     * Added velocity vector visualization
   - Next Steps:
     * Confirm if force application fix resolves the motion issue
     * Re-enable hex grid and upward forces once confirmed
     * Fine-tune force balance between grid and motion
     * Remove debug visualization
   - Key Files Modified:
     * `/website/components/forces/ForceField.ts` - Force application fix
     * `/website/components/forces/PositionController.ts` - Force field configuration
     * `/website/components/GraphBackground.tsx` - Debug visualization
   - Pending Tasks:
     * Verify physics-based motion behavior
     * Re-enable hex grid with proper force scaling
     * Adjust field strength relative to vertex mass
     * Fine-tune drag and damping coefficients
     * Remove debug visualization
     * Test performance with physics system
     * Document physics parameters for future reference

3. Testing & Development:
   ```bash
   # Start development server
   ./scripts/dev.sh server

   # Run tests (includes build validation)
   ./scripts/dev.sh test

   # Test deployment
   ./scripts/deploy.sh --dry-run
   ```

2. Design Guidelines
   - Color Palette:
     * Base: Professional grays and whites
     * Accent: Golden tones (#FFD700 with variations)
     * Background: Subtle gradients
   - Typography:
     * Clear hierarchy
     * Professional font stack
     * Optimal line lengths
   - Animations:
     * Graph background with particle connections
     * Smooth intersection reveals
     * Subtle hover effects
     * Performance-optimized

3. Implementation Status
   - ✅ Next.js 13.4 + TailwindCSS setup
   - ✅ Automated deployment via GitHub Actions
   - ✅ Image optimization with next/image
   - ✅ Basic responsive design
   - 🔄 Enhancing visual elements
   - 🔄 Adding dynamic background
   - 🔄 Implementing smooth transitions

4. Testing Requirements
   - Visual consistency across browsers
   - Animation performance
   - Mobile responsiveness
   - Image loading states
   - Accessibility standards
   - Commands:
     ```bash
     # Development testing
     ./scripts/dev.sh server
     
     # Build validation
     ./scripts/dev.sh test
     
     # Full deployment test
     ./scripts/deploy.sh --dry-run
     ```

5. Content Integration
   - Original CV content from cv/index.html
   - Project showcase with cards
   - Company logos and branding
   - Professional portrait
   - Interactive elements