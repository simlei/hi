// Type for a 2D vector
type Vector2D = {
  x: number;
  y: number;
};

// Type for a force that can be applied to a vertex
type Force = {
  magnitude: number;  // Strength of the force
  direction: Vector2D;  // Normalized direction vector
};

// Interface for any object that can be influenced by forces
interface Forceable {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

// Type for force field functions
type ForceField = (
  position: Vector2D,
  time: number,
  context?: ForceFieldContext
) => Force;

// Context that can be passed to force fields
interface ForceFieldContext {
  canvasWidth: number;
  canvasHeight: number;
  vertices: Forceable[];
  currentVertex?: Forceable;
}

// Helper to combine multiple force fields with weights
export const combineForceFields = (
  fields: Array<{ field: ForceField; weight: number }>
): ForceField => {
  return (pos, time, context) => {
    const forces = fields.map(({ field, weight }) => {
      const force = field(pos, time, context);
      return {
        magnitude: force.magnitude * weight,
        direction: force.direction
      };
    });

    // Sum up all force vectors
    return forces.reduce((acc, force) => ({
      magnitude: acc.magnitude + force.magnitude,
      direction: {
        x: acc.direction.x + force.direction.x * force.magnitude,
        y: acc.direction.y + force.direction.y * force.magnitude
      }
    }), { magnitude: 0, direction: { x: 0, y: 0 } });
  };
};

// Example force fields
export const forceFields = {
  // Pull towards nearest point in a hexagonal grid
  hexGrid: (gridSize: number): ForceField => {
    return (pos, time, context) => {
      // Calculate nearest hex grid point
      const hexWidth = gridSize * Math.sqrt(3);
      const hexHeight = gridSize * 2;
      
      const col = Math.round(pos.x / hexWidth);
      const row = Math.round(pos.y / hexHeight);
      
      // Offset every other row
      const targetX = col * hexWidth + (row % 2) * (hexWidth / 2);
      const targetY = row * (hexHeight * 0.75);

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

  // Custom force field from lambda
  custom: (
    forceFn: (pos: Vector2D, time: number, context?: ForceFieldContext) => Force
  ): ForceField => forceFn
};

// Apply forces to a vertex
export const applyForce = (
  vertex: Forceable,
  force: Force,
  deltaTime: number,
  damping: number = 0.98
) => {
  vertex.vx += force.direction.x * force.magnitude * deltaTime;
  vertex.vy += force.direction.y * force.magnitude * deltaTime;
  
  // Apply damping
  vertex.vx *= damping;
  vertex.vy *= damping;
  
  // Update position
  vertex.x += vertex.vx * deltaTime;
  vertex.y += vertex.vy * deltaTime;
};