import { forceFields, combineForceFields, applyForce, type ForceField, type ForceFieldConfig } from './ForceField';

export interface Moveable {
  x: number;
  y: number;
  vx: number;
  vy: number;
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
    // Calculate base field strength from hex grid and upward bias
    const baseFieldStrength = Math.max(hexWeight, upwardBias);
    
    // Brownian speed is a factor of the base field strength
    const brownianSpeed = baseFieldStrength * brownianFactor;
    
    // Adjust weights to maintain proper balance
    const brownianWeight = 0.4; // Fixed weight for consistent influence
    const remainingWeight = 1 - brownianWeight;
    const adjustedHexWeight = hexWeight * remainingWeight;
    const adjustedUpwardWeight = (1 - hexWeight) * remainingWeight;

    return new PositionController([
      // Only Brownian motion for testing
      {
        field: forceFields.brownianMotion(0.5), // Increased speed to account for new force application
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