import { clamp } from '../util/math.util';

describe('math.util', () => {
  describe('clamp', () => {
    test('returns value when within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    test('clamps to min when value is below range', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    test('clamps to max when value is above range', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    test('returns min when value equals min', () => {
      expect(clamp(0, 0, 10)).toBe(0);
    });

    test('returns max when value equals max', () => {
      expect(clamp(10, 0, 10)).toBe(10);
    });

    test('works with negative ranges', () => {
      expect(clamp(-5, -10, -1)).toBe(-5);
      expect(clamp(-15, -10, -1)).toBe(-10);
      expect(clamp(0, -10, -1)).toBe(-1);
    });

    test('works when min equals max', () => {
      expect(clamp(5, 3, 3)).toBe(3);
      expect(clamp(1, 3, 3)).toBe(3);
    });

    test('works with decimal values', () => {
      expect(clamp(0.5, 0, 1)).toBe(0.5);
      expect(clamp(1.5, 0, 1)).toBe(1);
      expect(clamp(-0.5, 0, 1)).toBe(0);
    });
  });
});
