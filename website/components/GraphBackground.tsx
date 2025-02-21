import { useEffect, useRef } from 'react';

interface Vertex {
  x: number;
  y: number;
  vx: number;
  vy: number;
  activity: number;
}

interface Edge {
  from: number;
  to: number;
  activity: number;
  branches: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
  }>;
}

export function GraphBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Make canvas fill the container
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Visualization parameters
    const PARAMS = {
      numVertices: 20,
      vertexBaseRadius: 2.4, // Smaller base node size
      vertexGlowMultiplier: 8, // Increased glow for interest
      vertexSpeed: 0.3,
      maxDistance: 300,
      edgeBaseWidth: 1.2, // Slightly thinner base edges
      edgeActivityMultiplier: 2.4,
      baseAlpha: 0.12, // Slightly more subtle inactive state
      activityDecay: 0.008,
      branchSpeed: 2.4,
      branchSpawnChance: 0.2,
      // Visual enhancement parameters
      innerGlowSize: 0.4, // Size of the inner bright core
      outerGlowIntensity: 0.6, // Intensity of the outer glow
      edgeGradientStops: 3, // Number of gradient stops for edges
      // Tree-like behavior parameters
      directionBias: Math.PI * 0.5,
      directionStrength: 0.7,
      traverseProb: (from: Vertex, to: Vertex) => {
        // Less aggressive filtering for more connections
        const dy = to.y - from.y;
        const upwardness = -dy / Math.sqrt(dy * dy + 0.1);
        return Math.pow(0.4 + 0.6 * upwardness, 2); // Gentler curve
      }
    };

    // Create vertices
    const vertices: Vertex[] = Array.from({ length: PARAMS.numVertices }, () => {
      // Distribute vertices more evenly vertically
      const section = Math.floor(Math.random() * 3); // 0, 1, or 2
      const yMin = (section * canvas.height) / 3;
      const yMax = ((section + 1) * canvas.height) / 3;
      return {
        x: Math.random() * canvas.width,
        y: yMin + Math.random() * (yMax - yMin),
        vx: (Math.random() - 0.5) * PARAMS.vertexSpeed,
        vy: (Math.random() - 0.5) * PARAMS.vertexSpeed * 0.5, // Reduced vertical movement
        activity: 0,
      };
    });

    // Create edges between nearby vertices
    const edges: Edge[] = [];

    function updateEdges() {
      edges.length = 0;
      for (let i = 0; i < vertices.length; i++) {
        for (let j = i + 1; j < vertices.length; j++) {
          const dx = vertices[i].x - vertices[j].x;
          const dy = vertices[i].y - vertices[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < PARAMS.maxDistance) {
            // Apply directional bias using traversal probability
            const prob = PARAMS.traverseProb(vertices[i], vertices[j]);
            if (Math.random() < prob) {
              edges.push({ 
                from: i, 
                to: j, 
                activity: 0,
                branches: []
              });
            }
          }
        }
      }
    }

    function animate() {
      if (!canvas || !ctx) return;

      // Clear canvas with blur effect (slower fade)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Randomly trigger vertex activity at bottom vertices (less frequent)
      if (Math.random() < 0.006) {
        // Prefer vertices in the lower third of the canvas
        const candidates = vertices.filter(v => v.y > canvas.height * 0.67);
        if (candidates.length > 0) {
          const randomVertex = candidates[Math.floor(Math.random() * candidates.length)];
          randomVertex.activity = 1.0;
        }
      }

      // Update vertex positions and activity
      vertices.forEach(vertex => {
        vertex.x += vertex.vx;
        vertex.y += vertex.vy;

        // Bounce off edges
        if (vertex.x < 0 || vertex.x > canvas.width) vertex.vx *= -1;
        if (vertex.y < 0 || vertex.y > canvas.height) vertex.vy *= -1;

        // Decay activity
        vertex.activity = Math.max(0, vertex.activity - PARAMS.activityDecay);
      });

      // Update edges and propagate activity
      updateEdges();
      edges.forEach(edge => {
        const from = vertices[edge.from];
        const to = vertices[edge.to];
        
        // Propagate activity along edges
        if (from.activity > 0.1 || to.activity > 0.1) {
          edge.activity = Math.max(from.activity, to.activity);
          
          // Create new branches
          if (Math.random() < PARAMS.branchSpawnChance && edge.activity > 0.5) {
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            // Bias angle towards upward direction
            const baseAngle = -Math.PI/2; // Upward
            const spread = Math.PI * (1 - PARAMS.directionStrength);
            const angle = baseAngle + (Math.random() - 0.5) * spread;
            edge.branches.push({
              x: midX,
              y: midY,
              vx: Math.cos(angle) * PARAMS.branchSpeed,
              vy: Math.sin(angle) * PARAMS.branchSpeed,
              life: 1.0
            });
          }
        }
        edge.activity = Math.max(0, edge.activity - PARAMS.activityDecay);

        // Update and draw branches
        edge.branches = edge.branches.filter(branch => {
          branch.x += branch.vx;
          branch.y += branch.vy;
          branch.life -= 0.05;

          if (branch.life > 0) {
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(217, 119, 6, ${branch.life * 0.4})`;
            ctx.lineWidth = branch.life * PARAMS.edgeBaseWidth;
            ctx.moveTo(midX, midY);
            ctx.lineTo(branch.x, branch.y);
            ctx.stroke();
            return true;
          }
          return false;
        });
      });

      // Draw edges with enhanced effect
      edges.forEach(edge => {
        const from = vertices[edge.from];
        const to = vertices[edge.to];
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Create multi-stop gradient for more interesting edge look
        const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        const stops = PARAMS.edgeGradientStops;
        
        for (let i = 0; i <= stops; i++) {
          const t = i / stops;
          const wave = Math.sin(t * Math.PI) * 0.3; // Adds subtle variation
          const alpha = PARAMS.baseAlpha + 
            (from.activity * (1 - t) + to.activity * t) * 0.4 +
            edge.activity * wave;
          gradient.addColorStop(t, `rgba(217, 119, 6, ${alpha})`);
        }
        
        // Draw edge with subtle glow
        const width = PARAMS.edgeBaseWidth + edge.activity * PARAMS.edgeActivityMultiplier;
        if (edge.activity > 0.1) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(217, 119, 6, ${edge.activity * 0.15})`;
          ctx.lineWidth = width * 2;
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        }
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = width;
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });

      // Draw vertices with enhanced effect
      vertices.forEach(vertex => {
        const glowRadius = PARAMS.vertexBaseRadius + vertex.activity * PARAMS.vertexGlowMultiplier;
        
        // Draw outer glow
        if (vertex.activity > 0) {
          const outerGlow = ctx.createRadialGradient(
            vertex.x, vertex.y, PARAMS.vertexBaseRadius * 0.5,
            vertex.x, vertex.y, glowRadius
          );
          outerGlow.addColorStop(0, `rgba(217, 119, 6, ${vertex.activity * PARAMS.outerGlowIntensity})`);
          outerGlow.addColorStop(1, 'rgba(217, 119, 6, 0)');
          
          ctx.beginPath();
          ctx.fillStyle = outerGlow;
          ctx.arc(vertex.x, vertex.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw vertex with inner glow
        const innerGlow = ctx.createRadialGradient(
          vertex.x, vertex.y, 0,
          vertex.x, vertex.y, PARAMS.vertexBaseRadius
        );
        const coreAlpha = 0.3 + vertex.activity * 0.7;
        innerGlow.addColorStop(0, `rgba(217, 119, 6, ${coreAlpha})`);
        innerGlow.addColorStop(PARAMS.innerGlowSize, `rgba(217, 119, 6, ${coreAlpha * 0.8})`);
        innerGlow.addColorStop(1, `rgba(217, 119, 6, ${coreAlpha * 0.2})`);
        
        ctx.beginPath();
        ctx.fillStyle = innerGlow;
        ctx.arc(vertex.x, vertex.y, PARAMS.vertexBaseRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    const animation = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animation);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none opacity-60 -z-10"
      style={{ filter: 'blur(1px) brightness(1.2)' }}
    />
  );
}