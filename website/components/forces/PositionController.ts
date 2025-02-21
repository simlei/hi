import { forceFields, combineForceFields, applyForce, type ForceField } from './ForceField';

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
    forceFields: Array<{ field: ForceField; weight: number }>,
    damping: number = 0.98
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
      brownianSpeed?: number; // Speed of Brownian motion
      brownianWeight?: number; // Weight of Brownian motion vs other forces
    } = {}
  ): PositionController {
    const {
      gridSize = 100,
      upwardBias = 0.3,
      hexWeight = 0.4,
      cellAspect = 1,
      cellScale = 1,
      brownianSpeed = 0.15,
      brownianWeight = 0.25
    } = config;
    const totalWeight = hexWeight + brownianWeight + (1 - hexWeight - brownianWeight);
    return new PositionController([
      // Hex grid alignment
      {
        field: forceFields.hexGrid(gridSize, {
          aspect: cellAspect,
          scale: cellScale
        }),
        weight: hexWeight
      },
      // Brownian motion
      {
        field: forceFields.brownianMotion(brownianSpeed),
        weight: brownianWeight
      },
      // Gentle upward flow
      {
        field: (pos) => ({
          magnitude: upwardBias,
          direction: { x: 0, y: -1 }
        }),
        weight: 1 - hexWeight - brownianWeight
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