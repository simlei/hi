import { useEffect, useRef } from 'react';
import { LightningController } from './forces/LightningController';

interface Vertex {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  activity: number;
  index: number;  // Store the vertex index for familiarity tracking
}

interface Edge {
  from: number;
  to: number;
  activity: number;
  pulsePhase: number;
  gradientPhase: number;
  lastValidTime: number;     // Last time this edge was considered valid
  lastInvalidTime: number;   // Last time this edge was considered invalid
  branches: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
  }>;
}

// Track potential edges that are being considered for creation
interface PotentialEdge {
  from: number;
  to: number;
  firstValidTime: number;  // When this potential edge first became valid
  lastValidTime: number;   // Last time this edge was considered valid
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

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    // Ensure canvas is transparent
    canvas.style.backgroundColor = 'transparent';

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
      gridSize: 450,     // Base size of hex cells (increased by 1.2x)
      upwardBias: 0.13, // Slightly reduced upward force
      hexWeight: 0.25,  // Increased grid influence for more stability
      cellAspect: 1.0,  // Slightly compressed vertically
      cellScale: 1.0,   // Overall scale multiplier
      brownianFactor: 6.0, // Reduced random motion
      baseForce: 10.0,   // Reduced force for calmer movement
    });

    // Create lightning controller
    const lightningController = new LightningController({
      medianInterval: 5.0,  // Much longer interval between lightnings
      burstModeProb: 0.3,   // Lower chance to enter burst mode
      burstDuration: 2.0,   // Longer burst mode duration
      quietDuration: 8.0,  // Much longer quiet periods
      forkingProb: 0.6,    // 60% chance to fork at each node
      maxForks: 40,        // Maximum number of forks per lightning
      decayFactor: 0.8,   // Path selection decay factor
      propagationDuration: 0.65,  // Initial propagation takes 0.6 seconds
      fadeDuration: 0.35,        // Fade to orange takes all in all ~1sec
      colorVariations: [
        {
          start: 'rgb(255, 180, 180)', // Bright red
          peak: 'rgb(230, 240, 255)',  // Cool white
          end: 'rgb(210, 180, 140)',    // Warm gold
        },
      ]
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

    // Familiarity tracking system
    interface FamiliarityRecord {
      lastSeen: number;      // Last time these nodes were in proximity
      encounterCount: number; // Number of times nodes have been in proximity
    }

    // Map to store familiarity between nodes: "nodeA,nodeB" -> FamiliarityRecord
    const familiarityMap = new Map<string, FamiliarityRecord>();

    const PARAMS = {
      numVertices: 30, // More nodes for wider coverage
      vertexBaseRadius: 5.0, // Increased for 1.2x zoom
      vertexGlowMultiplier: 5.8,
      vertexSpeed: 0.01, // Reduced for calmer movement # defunct?
      maxDistance: 370, // Adjusted for 1.2x zoom
      edgeBaseWidth: 3.3, // Adjusted for 1.2x zoom
      edgeActivityMultiplier: 0.8, // Increased activity for smoother transitions
      // Familiarity system parameters
      familiarityDecayTime: 2.0,  // Time in seconds before familiarity starts decaying
      familiarityMaxAge: 8.0,    // Time in seconds after which familiarity is forgotten
      edgePreferenceWeight: 0.4,   // Weight of familiarity in connection probability (0-1)
      // Edge debouncing parameters
      edgeRemovalDelay: 1.0,      // Time in seconds an edge must be invalid before removal
      edgeCreationDelay: 0.5,     // Time in seconds a potential edge must be valid before creation
      baseAlpha: 0.40, // Increased base opacity for more consistent visibility
      activityDecay: 2.0, // Faster decay for less persistent activity
      branchSpeed: 0.005, // Slower branches
      branchSpawnChance: 0.001, // Fewer branches
      // Edge animation parameters
      edgePulseSpeed: 0.004, // Slower pulse
      edgePulseAmount: 0.12, // Reduced pulse intensity
      gradientSpeed: 0.02, // Slower gradient movement
      gradientLength: 0.7,
      // Activity parameters
      activityBoost: 0.5, // Reduced activity boost
      activitySpreadProb: 0.57, // Lower spread chance
      // Visual enhancement parameters
      innerGlowSize: 0.9,
      outerGlowIntensity: 1.4, // Slightly reduced intensity
      edgeGradientStops: 15,
      // Pulsation parameters
      // Pulse wave parameters
      pulseSpawnInterval: 5.0,    // Much longer interval between pulses
      pulseSpawnChance: 0.001,     // Much lower chance for new pulses
      pulseSpeed: 0.1,           // Even slower pulse travel
      pulseWavelength: 500,      // Longer wavelength for smoother effect
      pulseDecay: 0.35,          // Faster decay for more localized effect
      pulseStrengthMin: 0.7,     // Lower minimum strength
      pulseStrengthMax: 0.9,     // Lower maximum strength
      // Size parameters
      baseSizeMin: 0.8,
      baseSizeMax: 1.5,
      directionBias: Math.PI * 0.5,
      directionStrength: 0.4,
      // Connection probability based on distance and direction
      traverseProb: (from: Vertex, to: Vertex) => {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Distance factor: stronger preference for closer nodes
        const distanceFactor = Math.max(0, 1 - Math.pow(distance / PARAMS.maxDistance, 1.5));
        
        // Direction bias: slight preference for upward connections
        const upwardness = -dy / (distance + 0.1);
        const directionFactor = 0.7 + 0.3 * upwardness;

        // Familiarity factor: nodes that have been frequently close get a bonus
        const familiarityScore = getFamiliarityScore(from.index, to.index, timeRef.current);
        const familiarityFactor = 1 + PARAMS.edgePreferenceWeight * familiarityScore;
        
        // Combined probability with distance still being the dominant factor
        // but familiarity providing a significant boost when nodes are already close
        const baseProb = Math.pow(distanceFactor, 1.8) * directionFactor;
        return baseProb * familiarityFactor;
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
        index: i, // Store vertex index for familiarity tracking
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
    
    // Track potential edges that are being considered for creation
    const potentialEdges: Map<string, PotentialEdge> = new Map();
    
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

    // Helper functions for familiarity system
    function getFamiliarityKey(i: number, j: number): string {
      return i < j ? `${i},${j}` : `${j},${i}`;
    }

    function updateFamiliarity(i: number, j: number, currentTime: number) {
      const key = getFamiliarityKey(i, j);
      const record = familiarityMap.get(key) || { lastSeen: currentTime, encounterCount: 0 };
      record.lastSeen = currentTime;
      record.encounterCount++;
      familiarityMap.set(key, record);
    }

    function getFamiliarityScore(i: number, j: number, currentTime: number): number {
      const key = getFamiliarityKey(i, j);
      const record = familiarityMap.get(key);
      if (!record) return 0;

      const timeSinceLastSeen = currentTime - record.lastSeen;
      
      // Return 0 if beyond max age
      if (timeSinceLastSeen > PARAMS.familiarityMaxAge) {
        familiarityMap.delete(key);
        return 0;
      }

      // Calculate decay factor
      const decayStart = Math.max(0, timeSinceLastSeen - PARAMS.familiarityDecayTime);
      const decayDuration = PARAMS.familiarityMaxAge - PARAMS.familiarityDecayTime;
      const decayFactor = decayStart > 0 ? 
        Math.max(0, 1 - (decayStart / decayDuration)) : 1;

      // Normalize encounter count (cap at 10 for reasonable bounds)
      const normalizedCount = Math.min(record.encounterCount, 10) / 10;

      return normalizedCount * decayFactor;
    }

    function updateEdges() {
      const currentTime = timeRef.current;
      
      // Clear adjacency list but keep edges (we'll clean them up selectively)
      adjacencyList.forEach(list => list.length = 0);

      // Helper to check if an edge should exist
      function shouldHaveEdge(i: number, j: number, distance: number): boolean {
        if (distance >= PARAMS.maxDistance) return false;
        const prob = PARAMS.traverseProb(vertices[i], vertices[j]);
        return Math.random() < prob;
      }

      // Check all possible vertex pairs
      for (let i = 0; i < vertices.length; i++) {
        for (let j = i + 1; j < vertices.length; j++) {
          const dx = vertices[i].x - vertices[j].x;
          const dy = vertices[i].y - vertices[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const edgeKey = i < j ? `${i},${j}` : `${j},${i}`;
          
          // Update familiarity when nodes are in proximity
          if (distance < PARAMS.maxDistance) {
            updateFamiliarity(i, j, currentTime);
          }

          // Check if this pair should have an edge
          const shouldExist = shouldHaveEdge(i, j, distance);
          
          // Find existing edge if any
          const existingEdge = edges.find(e => 
            (e.from === i && e.to === j) || (e.from === j && e.to === i));
          
          if (existingEdge) {
            // Update edge validity timing
            if (shouldExist) {
              existingEdge.lastValidTime = currentTime;
            } else {
              existingEdge.lastInvalidTime = currentTime;
            }
            
            // Remove edge if it's been invalid for too long
            if (!shouldExist && 
                (currentTime - existingEdge.lastValidTime) > PARAMS.edgeRemovalDelay) {
              const idx = edges.indexOf(existingEdge);
              edges.splice(idx, 1);
            } else {
              // Keep edge in adjacency list if it still exists
              adjacencyList[i].push(j);
              adjacencyList[j].push(i);
            }
          } else if (shouldExist) {
            // Check potential edge
            const potentialEdge = potentialEdges.get(edgeKey);
            
            if (potentialEdge) {
              potentialEdge.lastValidTime = currentTime;
              
              // Create edge if it's been valid long enough
              if ((currentTime - potentialEdge.firstValidTime) > PARAMS.edgeCreationDelay) {
                edges.push({ 
                  from: i, 
                  to: j, 
                  activity: 0,
                  pulsePhase: 0,
                  gradientPhase: Math.random() * Math.PI * 2,
                  lastValidTime: currentTime,
                  lastInvalidTime: 0,
                  branches: []
                });
                potentialEdges.delete(edgeKey);
                
                // Update adjacency list for new edge
                adjacencyList[i].push(j);
                adjacencyList[j].push(i);
              }
            } else {
              // Start tracking new potential edge
              potentialEdges.set(edgeKey, {
                from: i,
                to: j,
                firstValidTime: currentTime,
                lastValidTime: currentTime
              });
            }
          } else {
            // Remove from potential edges if it exists there
            potentialEdges.delete(edgeKey);
          }
        }
      }
    }

    function animate() {
      if (!canvas || !ctx) return;

      // Update time first
      const currentTime = performance.now() / 1000;
      const deltaTime = lastFrameTimeRef.current ? currentTime - lastFrameTimeRef.current : 0.016;
      lastFrameTimeRef.current = currentTime;
      timeRef.current += deltaTime;

      // Clear canvas with transparent fade
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Randomly trigger vertex activity at bottom vertices (much less frequent)
      // With 0.001 probability per frame at 60fps, this means about once every ~17 seconds
      if (Math.random() < 0.001) {
        // Prefer vertices in the lower third of the canvas
        const candidates = vertices.filter(v => v.y > canvas.height * 0.67);
        if (candidates.length > 0) {
          const randomVertex = candidates[Math.floor(Math.random() * candidates.length)];
          randomVertex.activity = 1.0;
        }
      }

      // Reset all positions every 5 minutes
      const resetInterval = 5 * 60; // 5 minutes in seconds
      const currentCycle = Math.floor(timeRef.current / resetInterval);
      const previousCycle = Math.floor((timeRef.current - deltaTime) / resetInterval);
      if (currentCycle > previousCycle) {
        // Distribute vertices in a new pattern
        vertices.forEach((vertex, i) => {
          const phi = (1 + Math.sqrt(5)) / 2;
          const idx = (i + currentCycle * 13) / vertices.length; // Add cycle offset for variation
          const angle = 2 * Math.PI * idx * phi;
          const radius = Math.sqrt(idx) * Math.min(canvas.width, canvas.height) * 0.45;
          
          const baseX = canvas.width * 0.5 + Math.cos(angle) * radius;
          const baseY = canvas.height * 0.5 + Math.sin(angle) * radius;
          
          const offset = Math.min(canvas.width, canvas.height) * 0.1;
          const xOffset = (Math.random() - 0.5) * offset;
          const yOffset = (Math.random() - 0.5) * offset;
          
          vertex.x = Math.max(0, Math.min(canvas.width, baseX + xOffset));
          vertex.y = Math.max(0, Math.min(canvas.height, baseY + yOffset));
          vertex.vx = 0;
          vertex.vy = 0;
          vertex.activity = 0;
        });
      }

      // Update pulse propagation
      updatePulses(timeRef.current);

      // Update lightning effects
      const activeLightnings = lightningController.update(
        timeRef.current,
        deltaTime,
        adjacencyList,
        vertices.length
      );

      // Draw lightning paths and highlight affected vertices
      activeLightnings.forEach(lightning => {
        const nodes = lightning.nodes;
        
        // Calculate temperature based on energy level
        const temp = Math.min(1, Math.max(0, lightning.energy * 2));
        
        // First draw all vertex highlights with sketchy style
        for (let i = 0; i < nodes.length - 1; i++) {
          const vertex = vertices[nodes[i]];
          
          // Base parameters
          const baseRadius = PARAMS.vertexBaseRadius * vertex.baseSize;
          
          // Draw multiple concentric sketchy circles
          const numCircles = 2 + Math.floor(temp * 3);
          for (let c = 0; c < numCircles; c++) {
            const radius = baseRadius * (1.5 + c * 0.5 + lightning.energy);
            const segments = 8 + Math.floor(temp * 8);
            const jitterAmount = (0.5 + temp * 1.5) * lightning.energy;
            
            ctx.beginPath();
            
            // Create jittered circle
            for (let j = 0; j <= segments; j++) {
              const angle = (j / segments) * Math.PI * 2;
              const nextAngle = ((j + 1) / segments) * Math.PI * 2;
              
              // Add time-based oscillation and random jitter
              const jitter = (
                Math.sin(timeRef.current * 6 + angle * 3) * 0.6 +
                (Math.random() - 0.5) * 0.4
              ) * jitterAmount;
              
              const r = radius * (1 + jitter * 0.2);
              const x = vertex.x + Math.cos(angle) * r;
              const y = vertex.y + Math.sin(angle) * r;
              
              if (j === 0) {
                ctx.moveTo(x, y);
              } else {
                // Add a slight curve between points
                const controlX = vertex.x + Math.cos((angle + nextAngle) / 2) * r * 1.1;
                const controlY = vertex.y + Math.sin((angle + nextAngle) / 2) * r * 1.1;
                ctx.quadraticCurveTo(controlX, controlY, x, y);
              }
            }
            
            // Draw with varying opacity
            const circleAlpha = lightning.alpha * (0.2 + temp * 0.3) * (1 - c/numCircles * 0.7);
            ctx.strokeStyle = lightning.color.replace('rgb', 'rgba').replace(')', `,${circleAlpha})`);
            ctx.lineWidth = PARAMS.edgeBaseWidth * 0.5 * (1 - c/numCircles * 0.5);
            ctx.stroke();
          }
          
          // Add "energy dots" when hot
          if (temp > 0.5) {
            const dotCount = Math.floor(temp * 8 * lightning.energy);
            for (let d = 0; d < dotCount; d++) {
              const angle = Math.random() * Math.PI * 2;
              const r = baseRadius * (1 + Math.random() * 2);
              const x = vertex.x + Math.cos(angle) * r;
              const y = vertex.y + Math.sin(angle) * r;
              
              ctx.beginPath();
              ctx.arc(x, y, PARAMS.edgeBaseWidth * 0.3, 0, Math.PI * 2);
              const dotAlpha = lightning.alpha * (0.3 + Math.random() * 0.4);
              ctx.fillStyle = lightning.color.replace('rgb', 'rgba').replace(')', `,${dotAlpha})`);
              ctx.fill();
            }
          }
        }
        
        // Then draw the lightning paths with temperature-based jitter
        for (let i = 0; i < nodes.length - 1; i++) {
          const from = vertices[nodes[i]];
          const to = vertices[nodes[i + 1]];
          
          // Calculate base parameters
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          
          // Use the same temperature as before
          const temp = Math.min(1, Math.max(0, lightning.energy * 2));
          
          // Jitter parameters based on temperature and energy
          const jitterCount = Math.floor(4 + temp * 4); // More segments when hotter
          const jitterAmplitude = (2 + temp * 4) * lightning.energy; // Larger jitter when hotter
          const jitterFreq = (0.2 + temp * 0.4) * Math.PI; // Faster oscillation when hotter
          
          // Draw multiple sketch lines with varying opacity
          const numStrokes = 2 + Math.floor(temp * 2); // More strokes when hotter
          for (let stroke = 0; stroke < numStrokes; stroke++) {
            const strokeOffset = (stroke - (numStrokes - 1) / 2) * 0.5;
            
            // Calculate perpendicular vector once
            const perpX = Math.cos(angle + Math.PI/2);
            const perpY = Math.sin(angle + Math.PI/2);

            // Create jittered path
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            
            // Generate points along the path with controlled randomness
            for (let j = 1; j <= jitterCount; j++) {
              const t = j / jitterCount;
              const x = from.x + dx * t;
              const y = from.y + dy * t;
              
              // Add temperature-based jitter
              const jitterPhase = timeRef.current * 8 + t * jitterFreq * Math.PI;
              
              // Combine smooth oscillation with random jitter
              const jitter = (
                Math.sin(jitterPhase) * 0.7 + // Smooth oscillation
                (Math.random() - 0.5) * 0.3    // Random noise
              ) * jitterAmplitude;
              
              // Apply jitter perpendicular to the line
              const jitteredX = x + perpX * jitter + perpX * strokeOffset;
              const jitteredY = y + perpY * jitter + perpY * strokeOffset;
              
              ctx.lineTo(jitteredX, jitteredY);
            }
            ctx.lineTo(to.x + perpX * strokeOffset, to.y + perpY * strokeOffset);
            
            // Draw with varying opacity and width
            const baseAlpha = lightning.alpha * (0.4 + temp * 0.6);
            const strokeAlpha = baseAlpha * (0.5 + Math.random() * 0.5) / numStrokes;
            ctx.strokeStyle = lightning.color.replace('rgb', 'rgba').replace(')', `,${strokeAlpha})`);
            ctx.lineWidth = PARAMS.edgeBaseWidth * (0.5 + lightning.energy * 0.5) * (1 - stroke/numStrokes * 0.3);
            ctx.stroke();
          }
          
          // Add small "sparks" when temperature is high
          if (temp > 0.6) {
            const sparkCount = Math.floor(temp * 6 * lightning.energy);
            for (let s = 0; s < sparkCount; s++) {
              const t = Math.random();
              const baseX = from.x + dx * t;
              const baseY = from.y + dy * t;
              const sparkLength = (2 + Math.random() * 4) * lightning.energy;
              const sparkAngle = angle + (Math.random() - 0.5) * Math.PI * 0.8;
              
              ctx.beginPath();
              ctx.moveTo(baseX, baseY);
              ctx.lineTo(
                baseX + Math.cos(sparkAngle) * sparkLength,
                baseY + Math.sin(sparkAngle) * sparkLength
              );
              
              const sparkAlpha = lightning.alpha * (0.3 + Math.random() * 0.3);
              ctx.strokeStyle = lightning.color.replace('rgb', 'rgba').replace(')', `,${sparkAlpha})`);
              ctx.lineWidth = PARAMS.edgeBaseWidth * 0.5;
              ctx.stroke();
            }
          }
        }
      });

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

    // Animate turbulence effect
    let phase = 0;
    const animateTurbulence = () => {
      const turbulence = document.querySelector('#turbulence feTurbulence');
      if (!turbulence) return;
      
      phase += 0.002;
      turbulence.setAttribute('seed', (Math.sin(phase) + 1).toString());
      requestAnimationFrame(animateTurbulence);
    };
    const animationFrame = requestAnimationFrame(animateTurbulence);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []); // Empty dependency array ensures effect runs only once

  return (
    <div className="fixed inset-0 -z-20" style={{ background: 'linear-gradient(to bottom right, rgb(255, 251, 235), rgba(236, 253, 245, 0.8))' }}>
      <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none opacity-100 -z-10 graph-background-effect"
      style={{ 
        willChange: 'transform', // Optimize for animations
        transform: 'translateZ(0)', // Force GPU acceleration
        filter: 'blur(0px)', // Slightly blur the background
        opacity: 0.9 // Reduced opacity for better readability
      }}
    />
    </div>
  );
}
