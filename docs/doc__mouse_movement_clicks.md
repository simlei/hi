WHAT WORKED:
1. The key to making mouse interaction work while keeping the graph visually behind content is a two-layer approach:
```jsx
<>
  {/* Visual layer - stays behind */}
  <div className="fixed inset-0 -z-10">
    <div className="absolute inset-0">
      {/* Background gradient */}
    </div>
    <canvas /* Graph rendering */ />
  </div>

  {/* Event layer - invisible but catches all interactions */}
  <div 
    className="fixed inset-0"
    style={{ 
      zIndex: 9999,
      pointerEvents: 'auto',
      background: 'transparent'
    }}
    onMouseMove={handleMouseMove}
    onClick={handleClick}
  />
</>
```

2. Coordinate calculation process:
```typescript
// 1. Get canvas bounds relative to viewport
const rect = canvasRef.current.getBoundingClientRect();

// 2. Calculate viewport dimensions for graph space
const viewport = calculateViewport(canvas.width, canvas.height);

// 3. Convert mouse coordinates to graph space
const graphPos = pixelToGraph({
  // Subtract canvas position to get relative coordinates
  x: e.clientX - rect.left,
  y: e.clientY - rect.top
}, viewport);
```

WHAT WAS SUPERFLUOUS:
1. CSS-based solutions that didn't work:
   - Using pointer-events: none on content
   - Creating a special interactive class
   - Trying to manage z-index on individual elements

2. DOM-based approaches that didn't work:
   - Attaching events directly to canvas
   - Using multiple overlapping layers
   - Trying to make the graph container capture events

3. Unnecessary complexity:
   - The graph-interaction.css file
   - Multiple z-index layers
   - Event bubbling management

KEY INSIGHTS:
1. Separation of concerns:
   - Visual rendering layer (z-10)
   - Event handling layer (z-9999)
   - This allows independent control of visuals and interactions

2. Coordinate handling:
   - Browser coordinates (clientX/Y) → Canvas-relative coordinates → Graph space coordinates
   - This transformation chain is crucial for accurate interaction

3. React's synthetic events work better than direct DOM events in this case

