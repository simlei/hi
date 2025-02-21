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
   - Command dispatcher with subcommands
   - Environment management
   - Local toolchain support
   - Dependency validation

2. Subcommands:
   - `server`: Development server (default)
   - `test`: Automated testing
   - `exec`: Run with local environment

3. Features:
   - Smart dependency management
   - Local installation support (`.local/`)
   - Environment variable handling
   - Clean process management
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

## Current Progress

1. CV Website Implementation
   - Status: Implementation complete, build issue pending
   - Landing page: Minimal, professional design
   - CV page: Content updated from legacy repository
   - Infrastructure: Next.js + TailwindCSS
   - Testing: Automated workflow with URL verification
   - Deployment: GitHub Pages configuration ready

2. Testing and Deployment
   - Primary test command: `dev.sh test` (fast, for content changes)
   - Full deployment test: `deploy.sh --dry-run` (comprehensive)
   - Status: All tests passing, ready for deployment

3. Future Steps
   - Add project thumbnails and descriptions
   - Implement PDF generation
   - Enhance responsive design features
   - Add more interactive elements