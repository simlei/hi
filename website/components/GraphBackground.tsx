import { useEffect, useRef } from 'react';
import { calculateViewport, pixelToGraph } from './forces/GraphSpace';
import { GraphNode, MouseState, calculateForces, updateNode } from './forces/GraphForces';
import { renderGraph } from './forces/GraphRenderer';

// Configuration
const CONFIG = {
  NUM_NODES: 30,
  MIN_MASS: 0.8,
  MAX_MASS: 1.2,
  ACTIVITY_INTERVAL: 30,  // Seconds between random activity
  ACTIVITY_CHANCE: 0.2,  // Chance of activity per interval
};

export function GraphBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const mouseRef = useRef<MouseState>({
    position: null,
    lastMoved: 0
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
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize nodes in graph space
    if (nodesRef.current.length === 0) {
      for (let i = 0; i < CONFIG.NUM_NODES; i++) {
        // Use golden ratio for even distribution
        const phi = (1 + Math.sqrt(5)) / 2;
        const theta = 2 * Math.PI * i * phi;
        const r = Math.sqrt(i / CONFIG.NUM_NODES);

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

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const viewport = calculateViewport(canvas.width, canvas.height);
      mouseRef.current.position = pixelToGraph({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }, viewport);
      mouseRef.current.lastMoved = performance.now();
    };
    canvas.addEventListener('mousemove', handleMouseMove);

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
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-20" style={{ background: 'linear-gradient(to bottom right, rgb(255, 251, 235), rgba(236, 253, 245, 0.8))' }}>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none opacity-100 -z-10 graph-background-effect"
        style={{ 
          willChange: 'transform',
          transform: 'translateZ(0)',
          filter: 'blur(0px)',
          opacity: 0.9
        }}
      />
    </div>
  );
}
