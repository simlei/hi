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
    interface VertexState extends Vertex {
      pulsePhase: number;
      pulseFreq: number;
      baseSize: number;
    }

    const PARAMS = {
      numVertices: 40,
      vertexBaseRadius: 0.8,
      vertexGlowMultiplier: 2.7,
      vertexSpeed: 0.3,
      maxDistance: 230, // Reduced from 400 (factor ~1.75)
      edgeBaseWidth: 0.93,
      edgeActivityMultiplier: 1.2,
      baseAlpha: 0.35,
      activityDecay: 0.006,
      branchSpeed: 0.8,
      branchSpawnChance: 0.15, // Reduced from 0.25
      // Visual enhancement parameters
      innerGlowSize: 0.4,
      outerGlowIntensity: 0.8,
      edgeGradientStops: 3,
      // Pulsation parameters
      pulseSpeed: 0.02, // Base speed of pulsation
      pulseAmount: 1.2, // Increased by 4x (was 0.3)
      pulseFreqMin: 0.7, // Slightly wider frequency range
      pulseFreqMax: 1.3,
      baseSizeMin: 0.7, // More size variation
      baseSizeMax: 1.3,
      activityBoost: 1.6, // Increased activity influence
      directionBias: Math.PI * 0.5,
      directionStrength: 0.7,
      traverseProb: (from: Vertex, to: Vertex) => {
        // More selective connection probability
        const dy = to.y - from.y;
        const upwardness = -dy / Math.sqrt(dy * dy + 0.1);
        // Reduced base probability and steeper curve
        return Math.pow(0.35 + 0.65 * upwardness, 1.8);
      }
    };

    // Create vertices
    const vertices: VertexState[] = Array.from({ length: PARAMS.numVertices }, () => {
      // Distribute vertices with slight clustering
      const section = Math.floor(Math.random() * 4); // 4 vertical sections
      let yBase = (section * canvas.height) / 4;
      // Add some randomness to section boundaries
      const yVariance = canvas.height / 8;
      const yMin = Math.max(0, yBase - yVariance);
      const yMax = Math.min(canvas.height, yBase + canvas.height/4 + yVariance);
      
      // Add slight horizontal clustering
      const xCluster = Math.random() < 0.5 ? 
        Math.random() * canvas.width * 0.5 : 
        canvas.width * 0.5 + Math.random() * canvas.width * 0.5;
      
      return {
        x: xCluster + (Math.random() - 0.5) * canvas.width * 0.3,
        y: yMin + Math.random() * (yMax - yMin),
        vx: (Math.random() - 0.5) * PARAMS.vertexSpeed,
        vy: (Math.random() - 0.5) * PARAMS.vertexSpeed * 0.4,
        activity: 0,
        // Individual pulsation state
        pulsePhase: Math.random() * Math.PI * 2,
        pulseFreq: PARAMS.pulseFreqMin + Math.random() * (PARAMS.pulseFreqMax - PARAMS.pulseFreqMin),
        baseSize: PARAMS.baseSizeMin + Math.random() * (PARAMS.baseSizeMax - PARAMS.baseSizeMin),
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

      // Update vertex positions, activity, and pulsation
      vertices.forEach(vertex => {
        vertex.x += vertex.vx;
        vertex.y += vertex.vy;

        // Bounce off edges
        if (vertex.x < 0 || vertex.x > canvas.width) vertex.vx *= -1;
        if (vertex.y < 0 || vertex.y > canvas.height) vertex.vy *= -1;

        // Update pulsation
        vertex.pulsePhase += PARAMS.pulseSpeed * vertex.pulseFreq * (1 + vertex.activity * PARAMS.activityBoost);
        if (vertex.pulsePhase > Math.PI * 2) vertex.pulsePhase -= Math.PI * 2;

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

      // Draw vertices with enhanced effect and pulsation
      vertices.forEach(vertex => {
        // Calculate pulsation effect with safety bounds
        const pulseFactor = Math.max(0.1, 1 + Math.sin(vertex.pulsePhase) * PARAMS.pulseAmount);
        const baseRadius = Math.max(0.1, PARAMS.vertexBaseRadius * vertex.baseSize * pulseFactor);
        const glowRadius = baseRadius + vertex.activity * PARAMS.vertexGlowMultiplier;
        
        // Draw outer glow
        if (vertex.activity > 0.05) { // Increased threshold for more visible active state
          const outerGlow = ctx.createRadialGradient(
            vertex.x, vertex.y, baseRadius * 0.5,
            vertex.x, vertex.y, glowRadius
          );
          const glowIntensity = (vertex.activity * PARAMS.outerGlowIntensity) * (0.8 + pulseFactor * 0.2);
          outerGlow.addColorStop(0, `rgba(217, 119, 6, ${glowIntensity})`);
          outerGlow.addColorStop(1, 'rgba(217, 119, 6, 0)');
          
          ctx.beginPath();
          ctx.fillStyle = outerGlow;
          ctx.arc(vertex.x, vertex.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw vertex with inner glow
        const innerGlow = ctx.createRadialGradient(
          vertex.x, vertex.y, 0,
          vertex.x, vertex.y, baseRadius
        );
        const coreAlpha = (0.5 + vertex.activity * 0.5) * (0.9 + pulseFactor * 0.1);
        innerGlow.addColorStop(0, `rgba(217, 119, 6, ${coreAlpha})`);
        innerGlow.addColorStop(PARAMS.innerGlowSize, `rgba(217, 119, 6, ${coreAlpha * 0.9})`);
        innerGlow.addColorStop(1, `rgba(217, 119, 6, ${coreAlpha * 0.4})`);
        
        ctx.beginPath();
        ctx.fillStyle = innerGlow;
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
      className="fixed inset-0 w-full h-full pointer-events-none opacity-60 -z-10"
      style={{ filter: 'blur(1px) brightness(1.2)' }}
    />
  );
}