# CV Website Implementation

## Overview
Modern CV website implementation using Next.js and TailwindCSS, with PDF generation capabilities and GitHub Pages integration.

## Project Structure
```
website/
├── src/
│   ├── pages/
│   │   ├── index.tsx        # Landing page
│   │   ├── cv/             
│   │   │   ├── index.tsx    # Online CV
│   │   │   └── pdf.tsx      # PDF versions
│   ├── components/          # Reusable CV components
│   ├── data/               
│   │   └── cv.ts           # CV data in structured format
│   └── styles/             # TailwindCSS styles
├── public/
│   └── images/             # Project thumbnails
└── scripts/
    └── generate-thumbs.sh  # ImageMagick automation
```

## Technology Stack
- Next.js - React framework
- TailwindCSS - Styling
- React-PDF - PDF generation
- ImageMagick - Thumbnail generation
- GitHub Actions - CI/CD

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Development Workflow
1. Make changes
2. Run tests
3. Build and test locally
4. Commit and push
5. GitHub Actions will automatically deploy to Pages

## Documentation
- [Design Decisions](design-decisions.md) - Key architectural choices
- [GitHub Pages Setup](github-pages-setup.md) - Deployment configuration