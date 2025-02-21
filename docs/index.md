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

2. Subcommands:
   - `server`: Development server with hot reload
   - `test`: Build validation and URL testing
   - `exec`: Run commands in local environment
   - Common options: `--skip-build`, `--help`

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

## Current Status & Task

1. Current Task: Visual Enhancement
   - Objective: Modernize UI while maintaining professionalism
   - Focus: Clean, sleek design with subtle animations
   - Key Elements:
     * Dynamic graph background with golden accents
     * Project cards with smooth transitions
     * Professional CV layout with modern touches
     * Intersection-based animations
   - Constraints:
     * Keep CV document feel
     * Maintain readability
     * Subtle, not flashy animations
     * Professional color scheme

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