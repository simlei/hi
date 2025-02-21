# Next.js Developer Guide

This guide explains how the project works from a Next.js developer perspective and how to extend it.

## Project Structure

```
website/
├── components/     # React components
├── pages/         # Next.js pages and API routes
├── public/        # Static assets
├── styles/        # CSS and Tailwind styles
└── scripts/       # Development and build tools
    ├── dev.sh     # Main development script
    ├── server.sh  # Development server
    ├── test.sh    # Testing script
    └── lib/       # Bash helper libraries
```

## Key Technologies

- **Next.js 13.4** - React framework with static site generation
- **TailwindCSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **Headless UI** - Accessible React components
- **Heroicons** - SVG icon set

## How It Works

1. **Development**
   - `dev.sh` provides a unified interface for development tasks
   - `npm run dev` starts the development server
   - Changes are hot-reloaded
   - TypeScript errors are checked in real-time

2. **Building**
   - `next build` generates static HTML/CSS/JS
   - Output goes to `website/out/`
   - `.nojekyll` file is created to disable GitHub Pages processing

3. **Testing**
   - `dev.sh test` runs build and content validation
   - URLs and content structure are verified
   - TypeScript compilation is checked

4. **Deployment**
   - GitHub Actions workflow in `.github/workflows/nextjs.yml`
   - Triggered on push to main branch
   - Builds and deploys to GitHub Pages
   - No manual intervention needed

## Extending the Project

### Adding New Pages

1. Create a new file in `pages/`:
   ```tsx
   // pages/projects.tsx
   export default function Projects() {
     return <div>Projects Page</div>
   }
   ```

2. Add navigation in `components/Navigation.tsx`
3. Update tests in `scripts/test.sh` if needed

### Creating Components

1. Add component in `components/`:
   ```tsx
   // components/ProjectCard.tsx
   interface ProjectCardProps {
     title: string;
     description: string;
   }

   export function ProjectCard({ title, description }: ProjectCardProps) {
     return (
       <div className="p-4 border rounded">
         <h3>{title}</h3>
         <p>{description}</p>
       </div>
     );
   }
   ```

2. Use TypeScript for type safety
3. Follow existing component patterns

### Styling Guidelines

1. Use Tailwind classes for styling:
   ```tsx
   <div className="flex items-center justify-between">
   ```

2. Create custom classes in `styles/globals.css` if needed
3. Use CSS modules for component-specific styles

### Adding Features

1. **Interactive Elements**
   - Use Headless UI components
   - Add TypeScript interfaces
   - Include ARIA attributes

2. **Data Handling**
   - Use static props for build-time data
   - Add types for data structures
   - Update build process if needed

3. **New Dependencies**
   - Add to package.json
   - Update TypeScript config if needed
   - Document in this guide

### Testing Changes

1. Run development server:
   ```bash
   ./scripts/dev.sh server
   ```

2. Run tests:
   ```bash
   ./scripts/dev.sh test
   ```

3. Test build:
   ```bash
   ./scripts/deploy.sh --dry-run
   ```

## Best Practices

1. **TypeScript**
   - Define interfaces for props
   - Use strict type checking
   - Avoid `any` type

2. **Components**
   - Keep components focused
   - Use TypeScript props
   - Follow React best practices

3. **Performance**
   - Use static generation
   - Optimize images
   - Minimize JavaScript

4. **Accessibility**
   - Use semantic HTML
   - Include ARIA attributes
   - Test with screen readers

## Common Tasks

1. **Update Content**
   - Edit relevant pages in `pages/`
   - Update components if needed
   - Run tests to validate

2. **Style Changes**
   - Modify Tailwind classes
   - Update `tailwind.config.js`
   - Check responsive design

3. **Add Dependencies**
   - Install with npm
   - Update TypeScript config
   - Test thoroughly

4. **Debug Issues**
   - Check browser console
   - Use Next.js error overlay
   - Review build logs