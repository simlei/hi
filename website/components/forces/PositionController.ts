import { forceFields, combineForceFields, applyForce, type ForceField, type ForceFieldConfig } from './ForceField';

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
    } = {}
  ): PositionController {
    const {
      gridSize = 100,
      upwardBias = 0.3,
      hexWeight = 0.4,
      cellAspect = 1,
      cellScale = 1,
      brownianFactor = 4.0
    } = config;
    // Base force scale for the system (adjust this to control overall motion)
    const BASE_FORCE = 50.0; // units/s²
    
    // Calculate relative force magnitudes
    const brownianForce = BASE_FORCE * brownianFactor;
    const hexForce = BASE_FORCE * hexWeight;
    const upwardForce = BASE_FORCE * upwardBias;

    return new PositionController([
      // Brownian motion force
      {
        field: forceFields.brownianMotion(brownianForce, 2.0),
        weight: 1.0,
        type: 'additive'
      },
      // Hex grid alignment force
      {
        field: forceFields.hexGrid(gridSize, {
          aspect: cellAspect,
          scale: cellScale
        }),
        weight: hexForce / BASE_FORCE,
        type: 'restrictive'
      },
      // Upward bias force
      {
        field: (pos) => ({
          magnitude: upwardForce,
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