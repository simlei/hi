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

    // Create vertices
    const numVertices = 20;
    const vertices: Vertex[] = Array.from({ length: numVertices }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      activity: 0,
    }));

    // Create edges between nearby vertices
    const edges: Edge[] = [];
    const maxDistance = 150;

    function updateEdges() {
      edges.length = 0;
      for (let i = 0; i < vertices.length; i++) {
        for (let j = i + 1; j < vertices.length; j++) {
          const dx = vertices[i].x - vertices[j].x;
          const dy = vertices[i].y - vertices[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < maxDistance) {
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

    function animate() {
      if (!canvas || !ctx) return;

      // Clear canvas with blur effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Randomly trigger vertex activity
      if (Math.random() < 0.02) {
        const randomVertex = vertices[Math.floor(Math.random() * vertices.length)];
        randomVertex.activity = 1.0;
      }

      // Update vertex positions and activity
      vertices.forEach(vertex => {
        vertex.x += vertex.vx;
        vertex.y += vertex.vy;

        // Bounce off edges
        if (vertex.x < 0 || vertex.x > canvas.width) vertex.vx *= -1;
        if (vertex.y < 0 || vertex.y > canvas.height) vertex.vy *= -1;

        // Decay activity
        vertex.activity = Math.max(0, vertex.activity - 0.02);
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
          if (Math.random() < 0.3 && edge.activity > 0.5) {
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const angle = Math.random() * Math.PI * 2;
            edge.branches.push({
              x: midX,
              y: midY,
              vx: Math.cos(angle) * 2,
              vy: Math.sin(angle) * 2,
              life: 1.0
            });
          }
        }
        edge.activity = Math.max(0, edge.activity - 0.02);

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
            ctx.lineWidth = branch.life;
            ctx.moveTo(midX, midY);
            ctx.lineTo(branch.x, branch.y);
            ctx.stroke();
            return true;
          }
          return false;
        });
      });

      // Draw edges with activity effect
      edges.forEach(edge => {
        const from = vertices[edge.from];
        const to = vertices[edge.to];
        const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        
        const baseAlpha = 0.15;
        const activityAlpha = edge.activity * 0.5;
        
        // Using primary-600 color from theme
        gradient.addColorStop(0, `rgba(217, 119, 6, ${baseAlpha + from.activity * 0.4})`);
        gradient.addColorStop(1, `rgba(217, 119, 6, ${baseAlpha + to.activity * 0.4})`);
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1 + edge.activity * 2;
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });

      // Draw vertices with activity effect
      vertices.forEach(vertex => {
        const baseRadius = 3;
        const glowRadius = baseRadius + vertex.activity * 5;
        
        // Draw glow
        if (vertex.activity > 0) {
          const gradient = ctx.createRadialGradient(
            vertex.x, vertex.y, 0,
            vertex.x, vertex.y, glowRadius
          );
          gradient.addColorStop(0, `rgba(217, 119, 6, ${vertex.activity * 0.5})`);
          gradient.addColorStop(1, 'rgba(217, 119, 6, 0)');
          
          ctx.beginPath();
          ctx.fillStyle = gradient;
          ctx.arc(vertex.x, vertex.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw vertex
        ctx.beginPath();
        ctx.fillStyle = `rgba(217, 119, 6, ${0.25 + vertex.activity * 0.5})`;
        ctx.arc(vertex.x, vertex.y, baseRadius, 0, Math.PI * 2);
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
      className="fixed inset-0 w-full h-full pointer-events-none opacity-40 -z-10"
      style={{ filter: 'blur(2px) brightness(1.2)' }}
    />
  );
}