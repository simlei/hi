# Personal CV Website

A minimal, modern CV website built with Next.js and TailwindCSS.

## Features

- Clean, professional design
- Responsive layout
- GitHub Pages integration
- PDF generation (coming soon)
- Project thumbnails (coming soon)

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## GitHub Pages Setup

1. Go to your repository's Settings > Pages
2. Under "Source", select "GitHub Actions"
3. Push your changes to the main branch
4. GitHub Actions will automatically build and deploy your site

## Project Structure

```
website/
├── src/
│   ├── pages/
│   │   ├── index.tsx        # Landing page
│   │   ├── cv/             
│   │   │   └── index.tsx    # CV page
│   ├── components/          # Reusable components
│   ├── styles/             
│   │   └── globals.css      # Global styles
│   └── data/               # CV data (coming soon)
├── public/
│   └── images/             # Project thumbnails
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages deployment
```

## Technology Stack

- Next.js - React framework
- TailwindCSS - Styling
- GitHub Actions - CI/CD
- GitHub Pages - Hosting