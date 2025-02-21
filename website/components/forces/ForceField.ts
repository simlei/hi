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

  // Brownian motion with constant speed but changing direction
  brownianMotion: (
    baseSpeed: number,
    directionChangeRate: number = 0.5
  ): ForceField => {
    // Store individual vertex angles and their personal frequencies
    const vertexStates = new Map<Forceable, {
      angle: number;
      angleVelocity: number;
      personalFreq: number;
    }>();
    
    // Store base speed for use in motion calculations
    const speed = baseSpeed;
    
    return (pos, time, context) => {
      if (!context?.currentVertex) {
        return { magnitude: 0, direction: { x: 0, y: 0 } };
      }

      // Initialize or get current state for this vertex
      if (!vertexStates.has(context.currentVertex)) {
        vertexStates.set(context.currentVertex, {
          angle: Math.random() * Math.PI * 2,
          angleVelocity: (Math.random() - 0.5) * 0.2,
          personalFreq: 0.5 + Math.random() * 0.5 // Individual frequency
        });
      }
      const state = vertexStates.get(context.currentVertex)!;

      // Scale time with speed to maintain consistent motion patterns
      const speedFactor = Math.min(1, 1 / speed); // Normalize for high speeds
      const timeScale = time * directionChangeRate * state.personalFreq * speedFactor;
      
      // Multi-layered noise for more organic motion
      const noiseX = Math.sin(timeScale + context.currentVertex.x * 0.1);
      const noiseY = Math.cos(timeScale + context.currentVertex.y * 0.1);
      const noiseZ = Math.sin(timeScale * 1.3);
      const noiseW = Math.cos(timeScale * 0.7); // Fourth dimension for richer motion
      
      // Combine noise dimensions with varied weights
      const angularAccel = (
        noiseX * noiseY * 0.5 +  // Primary rotation
        noiseZ * 0.3 +           // Medium frequency variation
        noiseW * 0.2             // Slow variation
      ) * 0.3;                   // Overall scale
      
      // Update angle velocity with adaptive damping
      const dampingFactor = 0.95 + (1 - speedFactor) * 0.03; // More damping at higher speeds
      state.angleVelocity = state.angleVelocity * dampingFactor + angularAccel * (1 - dampingFactor);
      
      // Scale angle change with speed
      const angleChange = state.angleVelocity * (1 + speed * 0.1);
      state.angle += angleChange;

      // Normalize angle to [0, 2π]
      state.angle = state.angle % (Math.PI * 2);
      if (state.angle < 0) state.angle += Math.PI * 2;

      vertexStates.set(context.currentVertex, state);

      // Always maintain the base speed
      return {
        magnitude: speed,
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

// Physics constants
const PHYSICS = {
  INERTIA_SCALE: 1000,    // Scale factor for inertia calculations
  MIN_VELOCITY: 0.0001,   // Minimum velocity magnitude to consider
  BASE_TIMESTEP: 1/60,    // Base timestep for 60fps
  DRAG_COEFF: 0.02       // Air drag coefficient
};

// Apply forces to a vertex using proper physics
export const applyForce = (
  vertex: Forceable,
  force: Force,
  deltaTime: number,
  damping: number = 0.98
) => {
  // Normalize timestep relative to our base rate
  const dt = deltaTime / PHYSICS.BASE_TIMESTEP;
  
  // Calculate current velocity magnitude and direction
  const currentSpeed = Math.sqrt(vertex.vx * vertex.vx + vertex.vy * vertex.vy);
  const currentInertia = 0.5 * vertex.mass * currentSpeed * currentSpeed;
  
  // Apply force using F = ma
  const acceleration = {
    x: force.direction.x * force.magnitude / vertex.mass,
    y: force.direction.y * force.magnitude / vertex.mass
  };

  // Calculate drag force (proportional to velocity squared)
  const dragMagnitude = currentSpeed * currentSpeed * PHYSICS.DRAG_COEFF;
  const drag = currentSpeed > PHYSICS.MIN_VELOCITY ? {
    x: -vertex.vx / currentSpeed * dragMagnitude,
    y: -vertex.vy / currentSpeed * dragMagnitude
  } : { x: 0, y: 0 };

  // Update velocity using acceleration and drag (v = v0 + at)
  vertex.vx += (acceleration.x + drag.x / vertex.mass) * dt;
  vertex.vy += (acceleration.y + drag.y / vertex.mass) * dt;
  
  // Apply damping as a general energy loss factor
  vertex.vx *= Math.pow(damping, dt);
  vertex.vy *= Math.pow(damping, dt);
  
  // Update position (x = x0 + vt)
  vertex.x += vertex.vx * dt;
  vertex.y += vertex.vy * dt;
  
  // Update inertia
  const newSpeed = Math.sqrt(vertex.vx * vertex.vx + vertex.vy * vertex.vy);
  vertex.inertia = 0.5 * vertex.mass * newSpeed * newSpeed;
};