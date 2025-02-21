# UI Architecture Overview

This document explains how the UI components and features work together in our Next.js application, with comparisons to other GUI frameworks.

## Core Architecture

### Static Site Generation (SSG)
Unlike traditional SPAs (e.g., vanilla React, Vue) or server-side frameworks (e.g., Rails, Django), Next.js uses a hybrid approach:

```plaintext
Build Time                   Runtime
┌──────────────┐            ┌──────────────┐
│ Pages        │            │ Client-side   │
│ Components   │  ──────►   │ Hydration    │
│ Static Assets│            │ Interactivity │
└──────────────┘            └──────────────┘
```

- All pages are pre-rendered at build time
- JavaScript is then "hydrated" for interactivity
- No server required after deployment

### Component Hierarchy

```plaintext
Layout (persistent shell)
├── GraphBackground (canvas animation)
├── Navigation
└── Page Content
    ├── Home Page
    │   ├── Hero Section
    │   ├── Project Cards
    │   └── Skills Grid
    └── CV Page
        ├── Portrait Section
        ├── Experience Timeline
        └── Skills Matrix
```

## Key UI Features

### 1. Canvas-based Background Animation

The `GraphBackground` component uses React's lifecycle hooks with canvas:

```typescript
// components/GraphBackground.tsx
useEffect(() => {
  // Setup phase
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  
  // Animation loop
  function animate() {
    // Update vertices
    // Draw connections
    requestAnimationFrame(animate);
  }
  
  // Cleanup phase
  return () => cancelAnimationFrame(animation);
}, []);
```

Unlike traditional animation frameworks:
- Uses native canvas instead of DOM/SVG
- Runs outside React's render cycle
- Optimized for continuous updates

### 2. Intersection-based Animations

Project cards and sections use the Intersection Observer API:

```typescript
// components/ProjectCard.tsx
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => setIsVisible(entry.isIntersecting)
  );
  
  observer.observe(cardRef.current);
  return () => observer.disconnect();
}, []);
```

Benefits over scroll-based animations:
- Better performance (no scroll event handlers)
- Native lazy loading support
- More precise timing control

### 3. Modal Dialog System

Using Headless UI for accessible dialogs:

```typescript
<Dialog onClose={() => setIsOpen(false)}>
  <Dialog.Overlay className="fixed inset-0 bg-black/30" />
  <Dialog.Panel>
    {/* Content */}
  </Dialog.Panel>
</Dialog>
```

Advantages over custom modals:
- Built-in accessibility
- Focus management
- Keyboard navigation
- Portal-based rendering

## State Management

Unlike larger applications, we use local React state:

1. **Component State**
   ```typescript
   const [isOpen, setIsOpen] = useState(false);
   ```

2. **Animation State**
   ```typescript
   const [isVisible, setIsVisible] = useState(false);
   ```

No global state management needed because:
- Pages are static
- Interactions are localized
- No shared state between routes

## Styling Architecture

Three-layer approach:

1. **Base Styles** (Tailwind)
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

2. **Component Classes**
   ```css
   @layer components {
     .project-card {
       @apply transform transition-all;
     }
   }
   ```

3. **Dynamic Styles** (CSS-in-JS via template literals)
   ```typescript
   className={`
     transform transition-all duration-500
     ${isVisible ? 'translate-y-0' : 'translate-y-10'}
   `}
   ```

## Performance Optimizations

1. **Image Optimization**
   ```typescript
   import Image from 'next/image';
   
   <Image
     src="/images/portrait.png"
     width={300}
     height={400}
     loading="lazy"
   />
   ```

2. **Component Code-splitting**
   ```typescript
   const ProjectCard = dynamic(() => import('../components/ProjectCard'), {
     loading: () => <div className="skeleton" />
   });
   ```

3. **Route-based Splitting**
   - Automatic code-splitting by page
   - Prefetching on link hover

## Responsive Design Strategy

Mobile-first approach using Tailwind breakpoints:

```typescript
<div className="
  grid
  grid-cols-1          // Mobile: 1 column
  md:grid-cols-2       // Tablet: 2 columns
  lg:grid-cols-3       // Desktop: 3 columns
  gap-8
">
```

## Key Differences from Traditional GUI

1. **Rendering Model**
   - Traditional: Runtime rendering
   - Next.js: Build-time + Hydration

2. **State Management**
   - Traditional: Often centralized (Redux, MobX)
   - Our App: Local state + Static content

3. **Styling**
   - Traditional: Scoped CSS, CSS Modules
   - Our App: Utility-first + JIT compilation

4. **Routing**
   - Traditional: Client-side router
   - Next.js: File-system routing + Pre-rendering

## Development Workflow

1. **Component Development**
   ```bash
   # Start development server
   ./scripts/dev.sh server
   ```

2. **Testing Changes**
   ```bash
   # Run build and tests
   ./scripts/dev.sh test
   ```

3. **Production Build**
   ```bash
   # Create optimized build
   ./scripts/deploy.sh --dry-run
   ```

## Future Considerations

1. **State Management**
   - Consider Zustand/Jotai if complexity grows
   - Keep using local state where possible

2. **Performance**
   - Monitor Core Web Vitals
   - Implement analytics tracking
   - Consider service worker for offline support

3. **Animations**
   - Evaluate Framer Motion for complex animations
   - Keep canvas for background effects
   - Use CSS transitions for simple interactions