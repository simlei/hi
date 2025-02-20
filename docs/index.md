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
- [Design Decisions](/workspace/docs/cv-website/design-decisions.md) - Key architectural choices
- [Build & Deploy](/workspace/docs/cv-website/build-deploy.md) - Build and deployment tools
- [Content Guidelines](/workspace/docs/cv-website/content.md) - CV and landing page content guidelines

## Tools Overview

1. Build & Test Script (`scripts/test-build.sh`)
   - Non-interactive build verification
   - Static content generation test
   - Content validation checks

2. Deployment Script (`deploy.sh`)
   - GitHub Pages deployment automation
   - Setup instructions included
   - Self-cleaning and error handling

## Documentation Structure

Each task or component has its own directory under `/workspace/docs/` with:
- README.md - Overview and getting started
- Specific documentation files for different aspects
- Task-specific guides and references

## Current Active Tasks

1. CV Website Implementation
   - Status: Infrastructure ready
   - Primary docs: `/workspace/docs/cv-website/`
   - Current focus: Content implementation according to prompt

2. Next Steps
   - Review and implement CV content from prompt
   - Create minimal but professional landing page
   - Ensure non-interactive build process works
   - Document content structure and guidelines