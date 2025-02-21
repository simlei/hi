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

## Current Status

1. CV Website Implementation
   - Status: ✅ Stable, automated deployment
   - Landing page: Clean, professional design
   - CV page: Content synchronized with main branch
   - Infrastructure: Next.js 13.4 + TailwindCSS
   - Testing: Automated validation of build and URLs
   - Deployment: GitHub Actions workflow

2. Testing and Deployment
   - Primary test command: `dev.sh test` (validates build and content)
   - Local preview: `dev.sh server` (development server)
   - Deployment: Automatic via GitHub Actions on push to main
   - Dry run: `scripts/deploy.sh --dry-run` (local validation)
   - Status: ✅ Fully automated CI/CD pipeline

3. Architecture Highlights
   - Next.js static site generation
   - GitHub Pages hosting
   - GitHub Actions for CI/CD
   - Bash tooling for development
   - TypeScript for type safety
   - Tailwind for styling

4. Future Enhancements
   - Project portfolio expansion
   - PDF generation feature
   - Enhanced responsive design
   - Interactive elements
   - SEO optimization