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

2. Testing Infrastructure:
   - Comprehensive test suite: `dev.sh test`
   - Test phases:
     * Build validation (Next.js build)
     * Static export verification
     * Content validation
     * Unit tests (Jest)
     * Server verification
   - Test options:
     * `--skip-build`: Skip build phase for quick iterations
     * `--skip-runtime`: Skip server tests for content updates
     * `--no-server`: Skip server verification
     * `--ci`: Extended timeouts for CI environment
   - Automated checks:
     * File structure validation
     * HTML content verification
     * Asset presence and integrity
     * Server accessibility
     * Runtime error monitoring via `/workspace/.oh/current_error.txt`

3. Development Commands:
   - `server`: Development server with hot reload
   - `test`: Comprehensive test suite
   - `exec`: Run commands in local environment
   - Common options:
     * `--skip-build`: Skip build step
     * `--port PORT`: Custom server port (default: 3000)

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

2. Current Task: Graph Background Enhancement ✅
   - Achievements:
     * Implemented physics-based particle system
     * Added mass and inertia to vertices
     * Created force field interaction system
     * Developed wave-based pulse propagation
     * Optimized visual rendering
   - Physics System:
     * Velocity Verlet integration for stability
     * Mass-based dynamics (0.8-1.2 units)
     * Proper time-step handling (60 Hz target)
     * Air drag proportional to v²
   - Force Fields:
     * Hex grid structure (weight: 0.35)
     * Brownian motion (factor: 0.08)
     * Upward bias (0.2)
     * Proper force scaling (50.0 units/s²)
   - Visual Effects:
     * Wave-like pulse propagation
     * Dynamic edge connections
     * Smooth color transitions
     * GPU acceleration
   - Key Files:
     * `/website/components/forces/ForceField.ts` - Physics engine and force fields
     * `/website/components/forces/PositionController.ts` - Force management
     * `/website/components/GraphBackground.tsx` - Rendering and effects
   - Documentation:
     * Updated design decisions
     * Documented physics parameters
     * Added implementation details
     * Recorded visual effects configuration

3. Testing & Development:
   ```bash
   /workspace/scripts/deploy.sh --dry-run
   /workspace/website/scripts/dev.sh test
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

4. Testing Requirements
   - Visual consistency across browsers
   - Animation performance
   - Mobile responsiveness
   - Image loading states
   - Accessibility standards
   - Commands:
     ```bash
     # Development testing
     /workspace/website/scripts/dev.sh server
     
     # Build validation
     /workspace/website/scripts/dev.sh test
     
     # Full deployment test
     /workspace/scripts/deploy.sh --dry-run
     ```

5. Content Integration
   - Original CV content from cv/index.html
   - Project showcase with cards
   - Company logos and branding
   - Professional portrait
   - Interactive elements
