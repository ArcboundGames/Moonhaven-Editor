import { isNotNullish, isNullish } from '../util/null.util';

describe('null.util', () => {
  describe('isNotNullish', () => {
    test('returns true for non-null, non-undefined values', () => {
      expect(isNotNullish(0)).toBe(true);
      expect(isNotNullish('')).toBe(true);
      expect(isNotNullish(false)).toBe(true);
      expect(isNotNullish([])).toBe(true);
      expect(isNotNullish({})).toBe(true);
      expect(isNotNullish('hello')).toBe(true);
      expect(isNotNullish(42)).toBe(true);
    });

    test('returns false for null', () => {
      expect(isNotNullish(null)).toBe(false);
    });

    test('returns false for undefined', () => {
      expect(isNotNullish(undefined)).toBe(false);
    });
  });

  describe('isNullish', () => {
    test('returns true for null', () => {
      expect(isNullish(null)).toBe(true);
    });

    test('returns true for undefined', () => {
      expect(isNullish(undefined)).toBe(true);
    });

    test('returns false for non-null, non-undefined values', () => {
      expect(isNullish(0)).toBe(false);
      expect(isNullish('')).toBe(false);
      expect(isNullish(false)).toBe(false);
      expect(isNullish([])).toBe(false);
      expect(isNullish({})).toBe(false);
    });
  });
});
