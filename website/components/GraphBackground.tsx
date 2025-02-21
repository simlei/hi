import { useEffect, useRef } from 'react';

interface Vertex {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
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

import { PositionController } from './forces/PositionController';

export function GraphBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  useEffect(() => {
    console.log('GraphBackground mounting...');
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Store animation frame ID for cleanup
    let animationFrameId: number;

    // Make canvas fill the container
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create position controller with hex grid
    const positionController = PositionController.createHexGrid({
      gridSize: 320,    // Base size of hex cells
      upwardBias: 0.3,  // Strength of upward force
      hexWeight: 0.6,  // Weight of hex grid vs upward force
      cellAspect: 1.0,  // Slightly compressed vertically
      cellScale: 1.0,   // Overall scale multiplier
      brownianFactor: 4.0, // Brownian motion relative to field strength
      baseForce: 8.0,  // Base force scale for the system, controls amount of movement
    });

    // Visualization parameters
    interface VertexState extends Vertex {
      baseSize: number;
      pulseValue: number;      // Current pulse intensity (0-1)
      distanceFromSource: number;  // Graph distance from current pulse source
      lastPulseTime: number;   // When this vertex was last affected by a pulse
      inertia: number;        // Current inertial energy
    }

    interface PulseWave {
      sourceIndex: number;     // Index of the source vertex
      startTime: number;       // When the pulse started
      strength: number;        // Initial pulse strength
      speed: number;          // How fast the pulse propagates
      wavelength: number;     // Distance between pulse peaks
      decay: number;          // How quickly pulse decays with distance
    }

    const PARAMS = {
      numVertices: 80, // More nodes for wider coverage
      vertexBaseRadius: 0.43, // Smaller nodes since we have more
      vertexGlowMultiplier: 2.8,
      vertexSpeed: 0.2,
      maxDistance: 500, // Longer-range connections
      edgeBaseWidth: 1.00, // Scaled down by 1.5
      edgeActivityMultiplier: 1.57, // Scaled down by 1.5
      baseAlpha: 0.35,
      activityDecay: 0.01,
      branchSpeed: 0.6,
      branchSpawnChance: 0.05,
      // Edge animation parameters
      edgePulseSpeed: 0.004,
      edgePulseAmount: 0.2, // Reduced from 0.5 (scaled by 3/4)
      gradientSpeed: 0.003,
      gradientLength: 0.5,
      // Activity parameters
      activityBoost: 1.5, // New: increases activity effect
      activitySpreadProb: 0.50, // New: chance to spread activity
      // Visual enhancement parameters
      innerGlowSize: 0.9,
      outerGlowIntensity: 1.9,
      edgeGradientStops: 20,
      // Pulsation parameters
      // Pulse wave parameters
      pulseSpawnInterval: 13.0,    // Average seconds between new pulses
      pulseSpawnChance: 0.015,     // Chance per frame to spawn new pulse
      pulseSpeed: 30,            // Units per second pulse travels
      pulseWavelength: 100,       // Distance between pulse peaks
      pulseDecay: 0.12,           // Decay per unit distance
      pulseStrengthMin: 0.5,     // Minimum initial pulse strength
      pulseStrengthMax: 1.0,     // Maximum initial pulse strength
      // Size parameters
      baseSizeMin: 0.5,
      baseSizeMax: 1.5,
      directionBias: Math.PI * 0.5,
      directionStrength: 0.8,
      // Connection probability based on distance and direction
      traverseProb: (from: Vertex, to: Vertex) => {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Distance factor: more likely to connect to closer nodes
        const distanceFactor = Math.max(0, 1 - distance / PARAMS.maxDistance);
        
        // Direction bias: slight preference for upward connections
        const upwardness = -dy / (distance + 0.1);
        const directionFactor = 0.7 + 0.3 * upwardness;
        
        // Combined probability with distance having more weight
        return Math.pow(distanceFactor, 1.2) * directionFactor;
      }
    };

    // Create vertices
    const vertices: VertexState[] = Array.from({ length: PARAMS.numVertices }, (_, i) => {
      // Distribute vertices more evenly across the canvas
      // Use golden ratio for better distribution
      const phi = (1 + Math.sqrt(5)) / 2;
      const idx = i / PARAMS.numVertices;
      
      // Spiral-based distribution for more even coverage
      const angle = 2 * Math.PI * idx * phi;
      const radius = Math.sqrt(idx) * Math.min(canvas.width, canvas.height) * 0.45;
      
      // Convert to cartesian coordinates with some randomness
      const baseX = canvas.width * 0.5 + Math.cos(angle) * radius;
      const baseY = canvas.height * 0.5 + Math.sin(angle) * radius;
      
      // Add random offset for natural look
      const offset = Math.min(canvas.width, canvas.height) * 0.1;
      const xOffset = (Math.random() - 0.5) * offset;
      const yOffset = (Math.random() - 0.5) * offset;
      
      // Generate random mass around 1.0 (0.8 to 1.2)
      const mass = 0.8 + Math.random() * 0.4;
      
      return {
        x: Math.max(0, Math.min(canvas.width, baseX + xOffset)),
        y: Math.max(0, Math.min(canvas.height, baseY + yOffset)),
        vx: 0, // Let force field determine velocities
        vy: 0,
        mass,
        inertia: 0, // Initial inertia is 0 (at rest)
        activity: 0,
        // Pulse propagation state
        pulseValue: 0,
        distanceFromSource: Infinity,
        lastPulseTime: 0,
        // Base size proportional to mass for visual feedback
        baseSize: PARAMS.baseSizeMin + (mass - 0.8) / 0.4 * (PARAMS.baseSizeMax - PARAMS.baseSizeMin),
      };
    });

    // Track active pulse waves
    const pulseWaves: PulseWave[] = [];

    // Create edges between nearby vertices
    const edges: Edge[] = [];
    
    // Create adjacency list for graph traversal
    const adjacencyList: number[][] = Array(PARAMS.numVertices).fill(0).map(() => []);

    // Calculate shortest paths from a source vertex using BFS
    function calculateDistances(sourceIndex: number): number[] {
      const distances = new Array(vertices.length).fill(Infinity);
      distances[sourceIndex] = 0;
      
      const queue: number[] = [sourceIndex];
      while (queue.length > 0) {
        const current = queue.shift()!;
        for (const neighbor of adjacencyList[current]) {
          if (distances[neighbor] === Infinity) {
            distances[neighbor] = distances[current] + 1;
            queue.push(neighbor);
          }
        }
      }
      return distances;
    }

    // Create a new pulse wave from a source vertex
    function createPulseWave(sourceIndex: number) {
      const wave: PulseWave = {
        sourceIndex,
        startTime: timeRef.current,
        strength: PARAMS.pulseStrengthMin + Math.random() * (PARAMS.pulseStrengthMax - PARAMS.pulseStrengthMin),
        speed: PARAMS.pulseSpeed,
        wavelength: PARAMS.pulseWavelength,
        decay: PARAMS.pulseDecay
      };
      pulseWaves.push(wave);
      
      // Calculate and store distances for this pulse
      const distances = calculateDistances(sourceIndex);
      vertices.forEach((vertex, i) => {
        vertex.distanceFromSource = distances[i];
        vertex.lastPulseTime = timeRef.current;
      });
    }

    // Update pulse values for all vertices
    function updatePulses(currentTime: number) {
      // Possibly create new pulse
      if (Math.random() < PARAMS.pulseSpawnChance) {
        const sourceIndex = Math.floor(Math.random() * vertices.length);
        createPulseWave(sourceIndex);
      }
      
      // Update existing pulses
      vertices.forEach(vertex => {
        vertex.pulseValue = 0; // Reset pulse value
      });
      
      // Calculate pulse contribution from each wave
      pulseWaves.forEach((wave, i) => {
        const timeSinceStart = currentTime - wave.startTime;
        const distanceTraveled = timeSinceStart * wave.speed;
        
        vertices.forEach(vertex => {
          if (vertex.distanceFromSource === Infinity) return;
          
          // Calculate pulse based on distance from wave front
          const distanceFromWave = Math.abs(distanceTraveled - vertex.distanceFromSource * PARAMS.maxDistance);
          const wavelengthPhase = (distanceFromWave / wave.wavelength) * Math.PI * 2;
          const pulseIntensity = Math.cos(wavelengthPhase) * 0.5 + 0.5;
          
          // Apply distance decay
          const decayFactor = Math.exp(-vertex.distanceFromSource * wave.decay);
          vertex.pulseValue = Math.max(vertex.pulseValue, pulseIntensity * wave.strength * decayFactor);
        });
      });
      
      // Remove old waves
      pulseWaves.forEach((wave, i) => {
        const timeSinceStart = currentTime - wave.startTime;
        if (timeSinceStart * wave.speed > PARAMS.maxDistance * 2) {
          pulseWaves.splice(i, 1);
        }
      });
    }

    function updateEdges() {
      // Clear existing edges and adjacency list
      edges.length = 0;
      adjacencyList.forEach(list => list.length = 0);
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
                pulsePhase: 0,
                gradientPhase: Math.random() * Math.PI * 2,
                branches: []
              });
              // Update adjacency list for both vertices
              adjacencyList[i].push(j);
              adjacencyList[j].push(i);
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

      // Update time and pulses
      const currentTime = performance.now() / 1000;
      const deltaTime = lastFrameTimeRef.current ? currentTime - lastFrameTimeRef.current : 0.016;
      lastFrameTimeRef.current = currentTime;
      timeRef.current += deltaTime;

      // Update pulse propagation
      updatePulses(timeRef.current);

      // Update positions using force field
      positionController.updatePositions(vertices, {
        width: canvas.width,
        height: canvas.height,
        time: timeRef.current,
        deltaTime
      });

      vertices.forEach(vertex => {
        // Bounce off edges (as safety measure)
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
        
        // Calculate edge width based on vertex pulse values
        const fromPulse = vertices[edge.from].pulseValue;
        const toPulse = vertices[edge.to].pulseValue;
        const edgePulse = Math.max(fromPulse, toPulse);
        const baseWidth = PARAMS.edgeBaseWidth * (1 + edgePulse * 2);
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
        // Calculate vertex size based on pulse value
        const pulseScale = 1 + vertex.pulseValue * 1.5;
        const baseRadius = Math.max(0.1, PARAMS.vertexBaseRadius * vertex.baseSize * pulseScale);
        const glowRadius = baseRadius + (vertex.activity + vertex.pulseValue * 0.5) * PARAMS.vertexGlowMultiplier;
        
        // Draw outer glow
        if (vertex.activity > 0.05 || vertex.pulseValue > 0.1) { // Show glow for active or pulsing vertices
          const outerGlow = ctx.createRadialGradient(
            vertex.x, vertex.y, baseRadius * 0.5,
            vertex.x, vertex.y, glowRadius
          );
          const glowIntensity = ((vertex.activity + vertex.pulseValue) * PARAMS.outerGlowIntensity) * 0.8;
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
        const coreAlpha = (0.5 + vertex.activity * 0.5) * (0.9 + vertex.pulseValue * 0.1);
        innerGlow.addColorStop(0, `rgba(217, 119, 6, ${coreAlpha})`);
        innerGlow.addColorStop(PARAMS.innerGlowSize, `rgba(217, 119, 6, ${coreAlpha * 0.9})`);
        innerGlow.addColorStop(1, `rgba(217, 119, 6, ${coreAlpha * 0.4})`);
        
        ctx.beginPath();
        ctx.fillStyle = innerGlow;
        ctx.arc(vertex.x, vertex.y, baseRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    // Start the animation
    animationFrameId = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      console.log('GraphBackground cleanup...');
      window.removeEventListener('resize', resize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []); // Empty dependency array ensures effect runs only once

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none opacity-60 -z-10"
      style={{ 
        filter: 'blur(1px) brightness(1.2)',
        willChange: 'transform', // Optimize for animations
        transform: 'translateZ(0)' // Force GPU acceleration
      }}
    />
  );
}
