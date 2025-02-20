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

1. Development Scripts (`website/scripts/`)
   - Modular bash script system
   - Shared utilities and functions
   - Clean process management
   - Automated testing

2. Main Scripts:
   - `dev.sh`: Development server control
   - `test.sh`: Automated testing
   - Shared modules in `lib/`

3. Features:
   - Dependency management
   - Server lifecycle control
   - Build verification
   - Health checking
   - Clean error handling

## Documentation Structure

Each task or component has its own directory under `/workspace/docs/` with:
- README.md - Overview and getting started
- Specific documentation files for different aspects
- Task-specific guides and references

## Current Progress

1. CV Website Implementation
   - Status: Basic implementation complete
   - Landing page: Minimal, professional design
   - CV page: Experience section with latest roles
   - Infrastructure: Next.js + TailwindCSS
   - Testing: Automated workflow with URL verification
   - Deployment: GitHub Pages ready

2. Next Steps
   - Add project thumbnails and descriptions
   - Implement PDF generation
   - Add more CV content sections
   - Enhance responsive design features
   - Add more interactive elements