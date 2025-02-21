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
  pulsePhase: number;
  gradientPhase: number;
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
      maxDistance: 250, // Slightly increased from 230
      edgeBaseWidth: 0.93,
      edgeActivityMultiplier: 2.8,
      baseAlpha: 0.35,
      activityDecay: 0.005,
      branchSpeed: 0.8,
      branchSpawnChance: 0.18,
      // Edge animation parameters
      edgePulseSpeed: 0.018,
      edgePulseAmount: 0.375, // Reduced from 0.5 (scaled by 3/4)
      gradientSpeed: 0.04,
      gradientLength: 0.3,
      // Activity parameters
      activityBoost: 1.8, // New: increases activity effect
      activitySpreadProb: 0.65, // New: chance to spread activity
      // Visual enhancement parameters
      innerGlowSize: 0.4,
      outerGlowIntensity: 0.8,
      edgeGradientStops: 3,
      // Pulsation parameters
      pulseSpeed: 0.025, // Slightly faster base pulsation
      pulseAmount: 1.4, // More pronounced pulsation
      pulseFreqMin: 0.6, // Wider frequency range
      pulseFreqMax: 1.4,
      baseSizeMin: 0.7,
      baseSizeMax: 1.3,
      pulseActivityBoost: 2.0, // Stronger activity influence on pulse
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
                pulsePhase: Math.random() * Math.PI * 2,
                gradientPhase: Math.random() * Math.PI * 2,
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
        vertex.pulsePhase += PARAMS.pulseSpeed * vertex.pulseFreq * (1 + vertex.activity * PARAMS.pulseActivityBoost);
        if (vertex.pulsePhase > Math.PI * 2) vertex.pulsePhase -= Math.PI * 2;

        // Decay activity
        vertex.activity = Math.max(0, vertex.activity - PARAMS.activityDecay);
      });

      // Update edges and propagate activity
      updateEdges();
      edges.forEach(edge => {
        const from = vertices[edge.from];
        const to = vertices[edge.to];
        
        // Enhanced activity propagation
        if (from.activity > 0.1 || to.activity > 0.1) {
          // Calculate boosted activity
          const maxActivity = Math.max(from.activity, to.activity);
          edge.activity = Math.min(1, maxActivity * PARAMS.activityBoost);
          
          // Spread activity between vertices
          if (Math.random() < PARAMS.activitySpreadProb) {
            if (from.activity > to.activity) {
              to.activity = Math.max(to.activity, from.activity * 0.85);
            } else {
              from.activity = Math.max(from.activity, to.activity * 0.85);
            }
          }
          
          // Create new branches with boosted probability
          if (Math.random() < PARAMS.branchSpawnChance * (1 + edge.activity) && edge.activity > 0.4) {
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

      // Draw edges with enhanced effect and animation
      edges.forEach(edge => {
        const from = vertices[edge.from];
        const to = vertices[edge.to];
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Update edge animation phases
        edge.pulsePhase += PARAMS.edgePulseSpeed;
        if (edge.pulsePhase > Math.PI * 2) edge.pulsePhase -= Math.PI * 2;
        
        edge.gradientPhase += PARAMS.gradientSpeed;
        if (edge.gradientPhase > Math.PI * 2) edge.gradientPhase -= Math.PI * 2;
        
        // Calculate pulsing width
        const pulseFactor = 1 + Math.sin(edge.pulsePhase) * PARAMS.edgePulseAmount;
        const baseWidth = PARAMS.edgeBaseWidth * pulseFactor;
        const width = baseWidth + edge.activity * PARAMS.edgeActivityMultiplier;
        
        // Create animated gradient
        const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        const gradientOffset = (Math.sin(edge.gradientPhase) + 1) * 0.5; // 0 to 1
        const gradientLength = PARAMS.gradientLength;
        
        // Add base color stops
        gradient.addColorStop(0, `rgba(217, 119, 6, ${PARAMS.baseAlpha})`);
        gradient.addColorStop(1, `rgba(217, 119, 6, ${PARAMS.baseAlpha})`);
        
        // Add moving highlight
        const highlightPos = gradientOffset * (1 + gradientLength) - gradientLength;
        const startPos = Math.max(0, highlightPos);
        const peakPos = Math.min(1, Math.max(0, highlightPos + gradientLength * 0.5));
        const endPos = Math.min(1, highlightPos + gradientLength);
        
        if (startPos < 1) gradient.addColorStop(startPos, `rgba(217, 119, 6, ${PARAMS.baseAlpha})`);
        if (peakPos >= 0 && peakPos <= 1) {
          const peakAlpha = PARAMS.baseAlpha + edge.activity * 0.4 + 0.1;
          gradient.addColorStop(peakPos, `rgba(217, 119, 6, ${peakAlpha})`);
        }
        if (endPos > 0) gradient.addColorStop(endPos, `rgba(217, 119, 6, ${PARAMS.baseAlpha})`);
        
        // Draw edge with glow effect
        if (edge.activity > 0.1) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(217, 119, 6, ${edge.activity * 0.15})`;
          ctx.lineWidth = width * 2;
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        }
        
        // Draw main edge
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
