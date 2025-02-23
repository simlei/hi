import { forceFields, combineForceFields, applyForce, calculateForceBalance, type ForceField, type ForceFieldConfig } from './ForceField';

export interface Moveable {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  inertia: number;
}

export interface CanvasContext {
  width: number;
  height: number;
  time: number;
  deltaTime: number;
}

export class PositionController {
  private forceField: ForceField;
  private damping: number;

  constructor(
    forceFields: Array<ForceFieldConfig>,
    damping: number = 0.98 // Increased damping for more subtle motion
  ) {
    this.forceField = combineForceFields(forceFields);
    this.damping = damping;
  }

  static createHexGrid(
    config: {
      gridSize?: number;      // Size of hex cells
      upwardBias?: number;    // Strength of upward force
      hexWeight?: number;     // Weight of hex grid vs upward force
      cellAspect?: number;    // Vertical stretch factor (1 = regular hexagons)
      cellScale?: number;     // Overall scale multiplier
      brownianFactor?: number; // Brownian motion magnitude as factor of field strength
      baseForce?: number;     // Base force scale for the system
    } = {}
  ): PositionController {
    const {
      gridSize = 100,
      upwardBias = 0.2,
      cellAspect = 1,
      cellScale = 1,
      baseForce = 50.0
    } = config;

    // Calculate balanced forces
    const { brownianForce, fieldForce, coherenceTime } = calculateForceBalance(baseForce);
    // Base force scale for the system (adjust this to control overall motion)
    const BASE_FORCE = baseForce; // units/s²
    
    return new PositionController([
      // Brownian motion force - always slightly stronger than field force
      {
        field: forceFields.brownianMotion(brownianForce, coherenceTime),
        weight: 1.0,
        type: 'additive'
      },
      // Hex grid alignment force - gentle guiding force
      {
        field: forceFields.hexGrid(gridSize, {
          aspect: cellAspect,
          scale: cellScale
        }),
        weight: fieldForce / baseForce,
        type: 'additive'  // Changed from restrictive to allow more natural motion
      },
      // Upward bias force - very subtle vertical tendency
      {
        field: (pos) => ({
          magnitude: fieldForce * upwardBias,
          direction: { x: 0, y: -1 }
        }),
        weight: 1.0,
        type: 'additive'
      }
    ]);
  }

  updatePositions(
    objects: Moveable[],
    context: CanvasContext
  ): void {
    objects.forEach(obj => {
      const force = this.forceField(
        { x: obj.x, y: obj.y },
        context.time,
        {
          canvasWidth: context.width,
          canvasHeight: context.height,
          vertices: objects,
          currentVertex: obj
        }
      );
      applyForce(obj, force, context.deltaTime, this.damping);
    });
  }
}
