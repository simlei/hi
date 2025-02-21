// Type for a 2D vector
export type Vector2D = {
  x: number;
  y: number;
};

// Type for a force that can be applied to a vertex
export type Force = {
  magnitude: number;  // Strength of the force
  direction: Vector2D;  // Normalized direction vector
};

// Interface for any object that can be influenced by forces
export interface Forceable {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;     // Mass of the vertex (around 1.0)
  inertia: number;  // Current inertial energy
}

// Type for force field functions
export type ForceField = (
  position: Vector2D,
  time: number,
  context?: ForceFieldContext
) => Force;

// Context that can be passed to force fields
export interface ForceFieldContext {
  canvasWidth: number;
  canvasHeight: number;
  vertices: Forceable[];
  currentVertex?: Forceable;
}

// Type for force field configuration
export interface ForceFieldConfig {
  field: ForceField;
  weight: number;
  type?: 'additive' | 'restrictive';
}

// Helper to combine multiple force fields with weights
export const combineForceFields = (
  fields: Array<ForceFieldConfig>
): ForceField => {
  return (pos, time, context) => {
    // Separate additive (like Brownian) and restrictive (like grid) forces
    const additive = fields
      .filter(f => f.type !== 'restrictive')
      .map(({ field, weight }) => {
        const force = field(pos, time, context);
        return {
          magnitude: force.magnitude * weight,
          direction: force.direction
        };
      });

    const restrictive = fields
      .filter(f => f.type === 'restrictive')
      .map(({ field, weight }) => {
        const force = field(pos, time, context);
        return {
          magnitude: force.magnitude * weight,
          direction: force.direction
        };
      });

    // Sum up additive forces first
    const additiveForce = additive.reduce((acc, force) => ({
      magnitude: acc.magnitude + force.magnitude,
      direction: {
        x: acc.direction.x + force.direction.x * force.magnitude,
        y: acc.direction.y + force.direction.y * force.magnitude
      }
    }), { magnitude: 0, direction: { x: 0, y: 0 } });

    // Normalize additive direction
    const additiveMag = Math.sqrt(
      additiveForce.direction.x * additiveForce.direction.x +
      additiveForce.direction.y * additiveForce.direction.y
    );
    if (additiveMag > 0) {
      additiveForce.direction.x /= additiveMag;
      additiveForce.direction.y /= additiveMag;
    }

    // Apply restrictive forces as direction modifiers only
    const finalForce = restrictive.reduce((acc, force) => {
      const restrictionFactor = 1 - Math.min(1, force.magnitude);
      return {
        magnitude: acc.magnitude,
        direction: {
          x: acc.direction.x * (1 - force.magnitude) + force.direction.x * force.magnitude,
          y: acc.direction.y * (1 - force.magnitude) + force.direction.y * force.magnitude
        }
      };
    }, additiveForce);

    // Normalize final direction
    const finalMag = Math.sqrt(
      finalForce.direction.x * finalForce.direction.x +
      finalForce.direction.y * finalForce.direction.y
    );
    if (finalMag > 0) {
      finalForce.direction.x /= finalMag;
      finalForce.direction.y /= finalMag;
    }

    return finalForce;
  };
};

// Example force fields
export const forceFields = {
  // Pull towards nearest point in a hexagonal grid
  hexGrid: (
    baseSize: number,
    options: {
      aspect?: number;  // Vertical stretch factor (1 = regular hexagons)
      scale?: number;   // Overall scale multiplier
    } = {}
  ): ForceField => {
    const { aspect = 1, scale = 1 } = options;
    const gridSize = baseSize * scale;
    
    return (pos, time, context) => {
      // Calculate hex grid dimensions with aspect ratio
      const hexWidth = gridSize * Math.sqrt(3);
      const hexHeight = gridSize * 2 * aspect;
      
      // Convert to hex coordinates (accounting for aspect ratio)
      const q = (2/3 * pos.x) / gridSize;
      const r = (-1/3 * pos.x + Math.sqrt(3)/3 * pos.y / aspect) / gridSize;
      const s = -(q + r);
      
      // Round to nearest hex
      let rq = Math.round(q);
      let rr = Math.round(r);
      let rs = Math.round(s);
      
      const qDiff = Math.abs(rq - q);
      const rDiff = Math.abs(rr - r);
      const sDiff = Math.abs(rs - s);
      
      if (qDiff > rDiff && qDiff > sDiff) {
        rq = -(rr + rs);
      } else if (rDiff > sDiff) {
        rr = -(rq + rs);
      }
      
      // Convert back to pixel coordinates (with aspect ratio)
      const targetX = gridSize * (3/2 * rq);
      const targetY = gridSize * aspect * (Math.sqrt(3) * (rr + rq/2));

      const dx = targetX - pos.x;
      const dy = targetY - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      return {
        magnitude: Math.min(1, dist / gridSize),
        direction: {
          x: dist > 0 ? dx / dist : 0,
          y: dist > 0 ? dy / dist : 0
        }
      };
    };
  },

  // Circular orbit around a point
  orbit: (center: Vector2D, radius: number): ForceField => {
    return (pos, time) => {
      const dx = pos.x - center.x;
      const dy = pos.y - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Tangent direction for orbit
      const direction = {
        x: -dy / dist,
        y: dx / dist
      };

      // Strength based on distance from ideal radius
      const radiusDiff = Math.abs(dist - radius);
      
      return {
        magnitude: Math.min(1, radiusDiff / radius),
        direction
      };
    };
  },

  // Flow field based on sine waves
  flowField: (frequency: number, amplitude: number): ForceField => {
    return (pos, time) => {
      const angle = Math.sin(pos.x * frequency + time) * 
                   Math.cos(pos.y * frequency + time) * 
                   Math.PI;

      return {
        magnitude: amplitude,
        direction: {
          x: Math.cos(angle),
          y: Math.sin(angle)
        }
      };
    };
  },

  // Brownian motion as a stochastic force field
  brownianMotion: (
    baseForce: number, // Base magnitude of the Brownian force
    coherenceTime: number = 2.0 // Time scale for direction changes
  ): ForceField => {
    // Store per-vertex Brownian state
    const vertexStates = new Map<Forceable, {
      // Direction evolution parameters
      angle: number;           // Current force direction
      targetAngle: number;     // Target direction for smooth transitions
      transitionTime: number;  // Time for current direction transition
      personalFreq: number;    // Individual frequency multiplier
      lastUpdateTime: number;  // Last state update timestamp
    }>();
    
    return (pos, time, context) => {
      if (!context?.currentVertex) {
        return { magnitude: 0, direction: { x: 0, y: 0 } };
      }

      // Initialize or get state for this vertex
      if (!vertexStates.has(context.currentVertex)) {
        vertexStates.set(context.currentVertex, {
          angle: Math.random() * Math.PI * 2,
          targetAngle: Math.random() * Math.PI * 2,
          transitionTime: time,
          personalFreq: 0.7 + Math.random() * 0.6, // 0.7-1.3 range
          lastUpdateTime: time
        });
      }
      const state = vertexStates.get(context.currentVertex)!;

      // Time since last update
      const dt = time - state.lastUpdateTime;
      state.lastUpdateTime = time;

      // Check if we need a new target angle
      const timeSinceTransition = time - state.transitionTime;
      if (timeSinceTransition > coherenceTime * state.personalFreq) {
        // Set new target with continuous rotation preference
        const currentRotation = (state.targetAngle - state.angle) / (Math.PI * 2);
        const rotationBias = Math.sign(currentRotation) * 0.3; // Prefer continuing current rotation
        state.targetAngle = state.angle + (Math.PI * (1 + rotationBias * (Math.random() - 0.5)));
        state.transitionTime = time;
      }

      // Smoothly interpolate towards target angle
      const transitionProgress = Math.min(1, timeSinceTransition / (coherenceTime * state.personalFreq));
      const angleChange = (state.targetAngle - state.angle) * (1 - Math.pow(1 - transitionProgress, 3)) * dt;
      state.angle += angleChange;

      // Normalize angle to [0, 2π]
      state.angle = ((state.angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

      // Store updated state
      vertexStates.set(context.currentVertex, state);

      // Return force with constant magnitude but smoothly changing direction
      return {
        magnitude: baseForce * state.personalFreq, // Scale force by personal frequency
        direction: {
          x: Math.cos(state.angle),
          y: Math.sin(state.angle)
        }
      };
    };
  },

  // Custom force field from lambda
  custom: (
    forceFn: (pos: Vector2D, time: number, context?: ForceFieldContext) => Force
  ): ForceField => forceFn
};

// Physics system configuration
const PHYSICS = {
  TARGET_TIMESTEP: 1/60,  // Target physics timestep (60 Hz)
  MAX_TIMESTEP: 1/30,     // Maximum allowed timestep to prevent instability
  DRAG_COEFF: 0.1,       // Fluid drag coefficient
  MIN_SPEED: 1e-5        // Minimum speed to consider for calculations
};

// Physics state for debugging/visualization
interface PhysicsState {
  acceleration: { x: number; y: number };
  kineticEnergy: number;
  momentum: { x: number; y: number };
}

// Apply forces and update position using Velocity Verlet integration
export const applyForce = (
  vertex: Forceable,
  force: Force,
  deltaTime: number,
  damping: number = 0.98
): PhysicsState => {
  // Clamp deltaTime to prevent instability
  const dt = Math.min(deltaTime, PHYSICS.MAX_TIMESTEP);
  
  // Current velocity magnitude
  const speed = Math.sqrt(vertex.vx * vertex.vx + vertex.vy * vertex.vy);
  
  // Calculate acceleration from force (F = ma)
  const acceleration = {
    x: force.direction.x * force.magnitude / vertex.mass,
    y: force.direction.y * force.magnitude / vertex.mass
  };
  
  // Add drag force (proportional to v² in opposite direction)
  if (speed > PHYSICS.MIN_SPEED) {
    const dragForce = PHYSICS.DRAG_COEFF * speed * speed;
    acceleration.x -= (vertex.vx / speed) * dragForce / vertex.mass;
    acceleration.y -= (vertex.vy / speed) * dragForce / vertex.mass;
  }

  // Velocity Verlet integration:
  // 1. Update position using current velocity and half-step acceleration
  vertex.x += vertex.vx * dt + 0.5 * acceleration.x * dt * dt;
  vertex.y += vertex.vy * dt + 0.5 * acceleration.y * dt * dt;
  
  // 2. Update velocity with full acceleration step
  vertex.vx += acceleration.x * dt;
  vertex.vy += acceleration.y * dt;
  
  // Apply velocity damping (energy loss)
  const dampingFactor = Math.pow(damping, dt / PHYSICS.TARGET_TIMESTEP);
  vertex.vx *= dampingFactor;
  vertex.vy *= dampingFactor;
  
  // Calculate physics state for debugging/visualization
  const newSpeed = Math.sqrt(vertex.vx * vertex.vx + vertex.vy * vertex.vy);
  return {
    acceleration,
    kineticEnergy: 0.5 * vertex.mass * newSpeed * newSpeed,
    momentum: {
      x: vertex.mass * vertex.vx,
      y: vertex.mass * vertex.vy
    }
  };
};