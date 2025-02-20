# Local Website Preview

There are two ways to preview the website locally:

## 1. Development Server (with Hot Reload)

```bash
npm run dev
```
Then visit: http://localhost:3001

This method provides:
- Live updates as you edit code
- Development tools and debugging
- Fast refresh

## 2. Static Build Preview

```bash
npm run preview
```

This will:
1. Build the website
2. Copy the build to `.preview` directory (gitignored)
3. Provide instructions for viewing

To view the static build:
```bash
cd .preview
python3 -m http.server 8000
```
Then visit: http://localhost:8000

This method shows exactly how the site will look when deployed to GitHub Pages.

## Directory Structure

- `/workspace/cv-website/` - Main project directory
  - `out/` - Build output (temporary)
  - `.preview/` - Static build copy (gitignored)
  - `pages/` - Source pages
  - `scripts/` - Utility scripts
    - `preview.sh` - Preview setup script
    - `test-build.sh` - Build testing script