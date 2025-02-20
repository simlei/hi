# Design Decisions

## Framework Choice: Next.js
- **Why?** 
  - Excellent GitHub Pages support
  - Static site generation capabilities
  - React ecosystem for modern interactivity
  - Built-in routing and optimization

## Styling: TailwindCSS
- **Why?**
  - Utility-first approach for rapid development
  - Highly customizable
  - Built-in responsive design
  - Small bundle size when purged

## PDF Generation: React-PDF
- **Why?**
  - React components for PDF generation
  - Consistent styling between web and PDF
  - Programmatic control over layouts

## Project Structure
- Separation of concerns between data and presentation
- Component-based architecture for reusability
- Clear separation of web and PDF versions

## Content Management
- CV data stored in structured TypeScript files
- Easy to update and maintain
- Type safety for data structure

## Image Processing
- ImageMagick for automated thumbnail generation
- Consistent image sizes and quality
- Optimized for web delivery

## Testing Strategy
- Basic component tests
- Build and deployment tests
- PDF generation tests
- Responsive design tests