import { getPivot } from '../util/sprite.util';

describe('sprite.util', () => {
  describe('getPivot', () => {
    test('returns centered x pivot for symmetric sprite', () => {
      const result = getPivot(16, 16, { x: 0, y: 0 });
      // SPRITE_PIVOT_X = 0.5, so x = 0.5 * 16 + 0 = 8
      // SPRITE_PIVOT_Y = 0, OFFSET = 2, so y = 0 * 16 + 2 + 0 = 2
      expect(result.x).toBe(8);
      expect(result.y).toBe(2);
    });

    test('applies x offset', () => {
      const result = getPivot(16, 16, { x: 3, y: 0 });
      // x = 0.5 * 16 + 3 = 11
      expect(result.x).toBe(11);
    });

    test('applies y offset', () => {
      const result = getPivot(16, 32, { x: 0, y: 5 });
      // y = 0 * 32 + 2 + 5 = 7
      expect(result.y).toBe(7);
    });

    test('clamps x to minimum 0', () => {
      const result = getPivot(16, 16, { x: -20, y: 0 });
      // x = 0.5 * 16 + (-20) = -12, clamped to 0
      expect(result.x).toBe(0);
    });

    test('clamps x to maximum width', () => {
      const result = getPivot(16, 16, { x: 20, y: 0 });
      // x = 0.5 * 16 + 20 = 28, clamped to 16
      expect(result.x).toBe(16);
    });

    test('clamps y to minimum 0', () => {
      const result = getPivot(16, 16, { x: 0, y: -10 });
      // y = 0 * 16 + 2 + (-10) = -8, clamped to 0
      expect(result.y).toBe(0);
    });

    test('clamps y to maximum height', () => {
      const result = getPivot(16, 16, { x: 0, y: 20 });
      // y = 0 * 16 + 2 + 20 = 22, clamped to 16
      expect(result.y).toBe(16);
    });

    test('handles zero-dimension sprite', () => {
      const result = getPivot(0, 0, { x: 0, y: 0 });
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });

    test('handles undefined offset x as 0', () => {
      const offset = { y: 0 } as { x: number; y: number };
      const result = getPivot(16, 16, offset);
      // x = 0.5 * 16 + (undefined ?? 0) = 8
      expect(result.x).toBe(8);
    });

    test('handles undefined offset y as 0', () => {
      const offset = { x: 0 } as { x: number; y: number };
      const result = getPivot(16, 16, offset);
      // y = 0 * 16 + 2 + (undefined ?? 0) = 2
      expect(result.y).toBe(2);
    });
  });
});
