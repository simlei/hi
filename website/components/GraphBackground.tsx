import { useEffect, useRef } from 'react';
import { calculateViewport, pixelToGraph } from './forces/GraphSpace';
import { GraphNode, MouseState, calculateForces, updateNode } from './forces/GraphForces';
import { renderGraph } from './forces/GraphRenderer';

// Configuration
const CONFIG = {
  NUM_NODES: 25,
  MIN_MASS: 50.8,
  MAX_MASS: 130.2,
  ACTIVITY_INTERVAL: 10,  // Seconds between random activity
  ACTIVITY_CHANCE: 0.3,  // Chance of activity per interval
};

export function GraphBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const mouseRef = useRef<MouseState>({
    position: null,
    lastMoved: 0,
    waves: []
  });
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Make canvas fill container
    const resize = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize nodes in graph space
    if (nodesRef.current.length === 0) {
      for (let i = 0; i < CONFIG.NUM_NODES; i++) {
        // Use golden ratio for even distribution

        const random_variation = Math.random() * 0.08;
        const phi = (1 + Math.sqrt(5)) / 2 + random_variation;
        const theta = 2 * Math.PI * i * phi + Math.random() * 0.1;
        const r = Math.sqrt(i / CONFIG.NUM_NODES) + Math.random() * 0.1;

        nodesRef.current.push({
          x: r * Math.cos(theta),
          y: r * Math.sin(theta),
          vx: 0,
          vy: 0,
          mass: CONFIG.MIN_MASS + Math.random() * (CONFIG.MAX_MASS - CONFIG.MIN_MASS),
          activity: 0
        });
      }
    }

    // Event handlers will be attached via React props

    // Animation loop
    let animationFrameId: number;
    function animate() {
      // Update time
      const currentTime = performance.now() / 1000;
      const deltaTime = Math.min(0.1, currentTime - (lastFrameTimeRef.current || currentTime));
      lastFrameTimeRef.current = currentTime;
      timeRef.current += deltaTime;

      // Calculate viewport
      const viewport = calculateViewport(canvas!.width, canvas!.height);

      // Random node activation
      if (Math.floor(timeRef.current / CONFIG.ACTIVITY_INTERVAL) >
          Math.floor((timeRef.current - deltaTime) / CONFIG.ACTIVITY_INTERVAL)) {
        nodesRef.current.forEach(node => {
          if (Math.random() < CONFIG.ACTIVITY_CHANCE) {
            node.activity = Math.max(node.activity, Math.random());
          }
        });
      }

      // Update node positions
      nodesRef.current.forEach(node => {
        const force = calculateForces(node, nodesRef.current, mouseRef.current, currentTime * 1000);
        updateNode(node, force, deltaTime);
      });

      // Render frame
      renderGraph(ctx!, nodesRef.current, viewport, timeRef.current);

      animationFrameId = requestAnimationFrame(animate);
    }

    // Start animation
    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const viewport = calculateViewport(canvasRef.current.width, canvasRef.current.height);
    mouseRef.current.position = pixelToGraph({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }, viewport);
    mouseRef.current.lastMoved = performance.now();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const viewport = calculateViewport(canvasRef.current.width, canvasRef.current.height);
    const clickPos = pixelToGraph({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }, viewport);
    
    if (!mouseRef.current.waves) {
      mouseRef.current.waves = [];
    }
    
    mouseRef.current.waves.push({
      center: clickPos,
      startTime: performance.now(),
      amplitude: 1.0
    });
  };

  return (
    <>
      {/* Background and canvas - visually behind */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0" style={{ 
          background: 'linear-gradient(to bottom right, rgb(255, 251, 235), rgba(236, 253, 245, 0.8))'
        }} />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ 
            willChange: 'transform',
            transform: 'translateZ(0)',
            filter: 'blur(0px)',
            opacity: 0.9
          }}
        />
      </div>

      {/* Invisible overlay for events - in front */}
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
  );
}
