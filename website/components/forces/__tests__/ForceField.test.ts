import { forceFields, combineForceFields, applyForce } from '../ForceField';

describe('ForceField', () => {
  describe('hexGrid', () => {
    const hexField = forceFields.hexGrid(100);
    
    test('pulls towards nearest hex point', () => {
      const force = hexField({ x: 50, y: 50 }, 0);
      expect(force.magnitude).toBeLessThanOrEqual(1);
      expect(Math.sqrt(
        force.direction.x ** 2 + force.direction.y ** 2
      )).toBeCloseTo(1);
    });

    test('zero force at hex point', () => {
      // Point exactly on hex grid (origin)
      const force = hexField({ x: 0, y: 0 }, 0);
      expect(force.magnitude).toBeCloseTo(0, 1);
    });
  });

  describe('orbit', () => {
    const orbitField = forceFields.orbit({ x: 0, y: 0 }, 100);

    test('produces perpendicular force', () => {
      const pos = { x: 100, y: 0 };
      const force = orbitField(pos, 0);
      // Should point straight up for point on positive x-axis
      expect(force.direction.x).toBeCloseTo(0);
      expect(force.direction.y).toBeCloseTo(1);
    });

    test('maintains constant radius', () => {
      const pos = { x: 150, y: 0 }; // Outside orbit
      const force = orbitField(pos, 0);
      expect(force.magnitude).toBeGreaterThan(0);
    });
  });

  describe('flowField', () => {
    const flowField = forceFields.flowField(0.1, 0.5);

    test('produces time-varying force', () => {
      const pos = { x: 0, y: 0 };
      const force1 = flowField(pos, 0);
      const force2 = flowField(pos, 1);
      expect(force1).not.toEqual(force2);
    });

    test('maintains constant magnitude', () => {
      const force = flowField({ x: 100, y: 100 }, 0);
      expect(force.magnitude).toBeCloseTo(0.5);
    });
  });

  describe('combineForceFields', () => {
    test('combines multiple fields', () => {
      const combined = combineForceFields([
        {
          field: () => ({
            magnitude: 1,
            direction: { x: 1, y: 0 }
          }),
          weight: 0.5
        },
        {
          field: () => ({
            magnitude: 1,
            direction: { x: 0, y: 1 }
          }),
          weight: 0.5
        }
      ]);

      const force = combined({ x: 0, y: 0 }, 0);
      expect(force.direction.x).toBeCloseTo(0.5);
      expect(force.direction.y).toBeCloseTo(0.5);
    });
  });

  describe('applyForce', () => {
    test('updates vertex position and velocity', () => {
      const vertex = { x: 0, y: 0, vx: 0, vy: 0 };
      const force = {
        magnitude: 1,
        direction: { x: 1, y: 0 }
      };

      applyForce(vertex, force, 1);
      expect(vertex.vx).toBeGreaterThan(0);
      expect(vertex.x).toBeGreaterThan(0);
    });

    test('applies damping', () => {
      const vertex = { x: 0, y: 0, vx: 1, vy: 1 };
      const force = {
        magnitude: 0,
        direction: { x: 0, y: 0 }
      };

      applyForce(vertex, force, 1, 0.5);
      expect(vertex.vx).toBeLessThan(1);
      expect(vertex.vy).toBeLessThan(1);
    });
  });
});