import { useEffect, useRef, useState } from 'react';
import { useMouseContext } from '../contexts/MouseContext';

interface Vertex {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface Edge {
  from: number;
  to: number;
  strength: number;
}

export function GoldenGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mouseState } = useMouseContext();
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Make canvas fill the container
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Create vertices
    const numVertices = 30;
    const vertices: Vertex[] = Array.from({ length: numVertices }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
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
              strength: 1 - distance / maxDistance,
            });
          }
        }
      }
    }

    function animate() {
      if (!canvas || !ctx) return;

      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      // Update vertex positions and apply mouse influence
      vertices.forEach(vertex => {
        vertex.x += vertex.vx;
        vertex.y += vertex.vy;

        // Apply mouse influence
        if (mouseState.current.position) {
          const dx = mouseState.current.position.x * canvas.width / window.devicePixelRatio - vertex.x;
          const dy = mouseState.current.position.y * canvas.height / window.devicePixelRatio - vertex.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 100;
          
          if (distance < maxDistance) {
            const force = (1 - distance / maxDistance) * 0.5;
            vertex.vx += (dx / distance) * force;
            vertex.vy += (dy / distance) * force;
          }
        }

        // Bounce off edges
        if (vertex.x < 0 || vertex.x > canvas.width / window.devicePixelRatio) vertex.vx *= -1;
        if (vertex.y < 0 || vertex.y > canvas.height / window.devicePixelRatio) vertex.vy *= -1;

        // Apply damping
        vertex.vx *= 0.99;
        vertex.vy *= 0.99;
      });

      // Update edges
      updateEdges();

      // Draw edges
      edges.forEach(edge => {
        const from = vertices[edge.from];
        const to = vertices[edge.to];
        const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        
        // Golden gradient with transparency
        gradient.addColorStop(0, `rgba(255, 215, 0, ${edge.strength * 0.15})`);
        gradient.addColorStop(1, `rgba(218, 165, 32, ${edge.strength * 0.15})`);
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = edge.strength;
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });

      // Draw vertices
      vertices.forEach(vertex => {
        const gradient = ctx.createRadialGradient(
          vertex.x, vertex.y, 0,
          vertex.x, vertex.y, vertex.size * 2
        );
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(218, 165, 32, 0)');

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(vertex.x, vertex.y, vertex.size * 2, 0, Math.PI * 2);
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
      className="fixed inset-0 w-full h-full pointer-events-none opacity-30"
      style={{ filter: 'blur(1px)' }}
    />
  );
}