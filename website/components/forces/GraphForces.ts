import { GraphPoint, graphDistance } from './GraphSpace';

export interface Force {
  x: number;  // Force in x direction
  y: number;  // Force in y direction
}

export interface GraphNode extends GraphPoint {
  vx: number;     // Velocity in x direction
  vy: number;     // Velocity in y direction
  mass: number;   // Node mass
  activity: number; // Node activity level [0,1]
}

interface Wave {
  center: GraphPoint;
  startTime: number;
  amplitude: number;
}

export interface MouseState {
  position: GraphPoint | null;  // Current mouse position in graph space
  lastMoved: number;           // Last time mouse was moved (ms)
  waves: Wave[];              // Active waves from clicks
}

// Physics parameters
const PHYSICS = {
  DAMPING: 0.85,           // Velocity damping per second
  MAX_FORCE: 30.0,          // Maximum force magnitude
  MIN_DISTANCE: 0.01,      // Minimum distance for force calculation
  MOUSE_FORCE: 0.25,        // Mouse repulsion force magnitude
  MOUSE_RADIUS: 0.8,       // Mouse influence radius in graph space
  MOUSE_TIMEOUT: 2000,     // Mouse position reset timeout (ms)
  EDGE_LENGTH: 0.3,        // Preferred edge length in graph space
  EDGE_STRENGTH: 0.8,      // Edge spring force strength
  REPULSION_STRENGTH: 0.08, // Node repulsion strength
  CENTER_STRENGTH: 3.0,    // Force pulling nodes to center
  WAVE_FORCE: 0.9,        // Wave force magnitude
  WAVE_SPEED: 0.9,         // Wave propagation speed
  WAVE_DECAY: 0.7,         // Wave amplitude decay rate
};

// Calculate forces on a node from other nodes and constraints
export function calculateForces(
  node: GraphNode,
  nodes: GraphNode[],
  mouse: MouseState,
  time: number
): Force {
  const forces: Force[] = [];

  // Node repulsion (inverse square law)
  nodes.forEach(other => {
    if (other === node) return;
    const dist = graphDistance(node, other);
    if (dist < PHYSICS.MIN_DISTANCE) return;

    const force = PHYSICS.REPULSION_STRENGTH / (dist * dist);
    const dx = node.x - other.x;
    const dy = node.y - other.y;
    forces.push({
      x: (dx / dist) * force,
      y: (dy / dist) * force
    });
  });

  // Edge spring forces (only to close nodes)
  nodes.forEach(other => {
    if (other === node) return;
    const dist = graphDistance(node, other);
    if (dist > PHYSICS.EDGE_LENGTH * 2) return;

    const force = (dist - PHYSICS.EDGE_LENGTH) * PHYSICS.EDGE_STRENGTH;
    const dx = other.x - node.x;
    const dy = other.y - node.y;
    forces.push({
      x: (dx / dist) * force,
      y: (dy / dist) * force
    });
  });

  // Center gravity force
  const centerDist = Math.sqrt(node.x * node.x + node.y * node.y);
  if (centerDist > PHYSICS.MIN_DISTANCE) {
    const force = centerDist * PHYSICS.CENTER_STRENGTH;
    forces.push({
      x: -node.x * force / centerDist,
      y: -node.y * force / centerDist
    });
  }

  // Mouse repulsion force
  if (mouse.position && (time - mouse.lastMoved) < PHYSICS.MOUSE_TIMEOUT) {
    const dist = graphDistance(node, mouse.position);
    if (dist < PHYSICS.MOUSE_RADIUS && dist > PHYSICS.MIN_DISTANCE) {
      const force = (PHYSICS.MOUSE_FORCE * (1 - dist / PHYSICS.MOUSE_RADIUS));
      const dx = node.x - mouse.position.x;
      const dy = node.y - mouse.position.y;
      forces.push({
        x: (dx / dist) * force,
        y: (dy / dist) * force
      });
    }
  }

  // Wave forces
  if (mouse.waves && mouse.waves.length > 0) {
    mouse.waves.forEach((wave, index) => {
      const timeSinceStart = (time - wave.startTime) / 1000; // Convert to seconds
      const waveRadius = PHYSICS.WAVE_SPEED * timeSinceStart;
      const dist = graphDistance(node, wave.center);
      
      // Only affect nodes near the wave front
      const waveFrontWidth = 0.5;
      const distFromFront = Math.abs(dist - waveRadius);
      
      if (distFromFront < waveFrontWidth) {
        // Calculate wave amplitude with decay
        const amplitude = wave.amplitude * Math.exp(-PHYSICS.WAVE_DECAY * timeSinceStart);
        const force = amplitude * PHYSICS.WAVE_FORCE * (1 - distFromFront / waveFrontWidth);
        
        // Direction from wave center
        const dx = node.x - wave.center.x;
        const dy = node.y - wave.center.y;
        const normalizedDist = Math.max(dist, PHYSICS.MIN_DISTANCE);
        
        forces.push({
          x: (dx / normalizedDist) * force,
          y: (dy / normalizedDist) * force
        });
      }
    });

    // Remove old waves
    mouse.waves = mouse.waves.filter(wave => 
      (time - wave.startTime) / 1000 < 2.0 // Remove waves after 2 seconds
    );
  }

  // Sum all forces
  const totalForce = forces.reduce(
    (sum, force) => ({ x: sum.x + force.x, y: sum.y + force.y }),
    { x: 0, y: 0 }
  );

  // Limit maximum force
  const magnitude = Math.sqrt(totalForce.x * totalForce.x + totalForce.y * totalForce.y);
  if (magnitude > PHYSICS.MAX_FORCE) {
    const scale = PHYSICS.MAX_FORCE / magnitude;
    totalForce.x *= scale;
    totalForce.y *= scale;
  }

  return totalForce;
}

// Update node positions based on forces
export function updateNode(
  node: GraphNode,
  force: Force,
  deltaTime: number
): void {
  // Apply force to velocity
  node.vx += force.x * deltaTime;
  node.vy += force.y * deltaTime;

  // Apply damping
  const damping = Math.pow(PHYSICS.DAMPING, deltaTime);
  node.vx *= damping;
  node.vy *= damping;

  // Update position
  node.x += node.vx * deltaTime;
  node.y += node.vy * deltaTime;

  // Keep node in graph space
  node.x = Math.max(-1, Math.min(1, node.x));
  node.y = Math.max(-1, Math.min(1, node.y));

  // Decay activity
  node.activity = Math.max(0, node.activity - deltaTime);
}
