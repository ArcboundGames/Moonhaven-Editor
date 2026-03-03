import { cleanObject } from '../util/object.util';

describe('object.util', () => {
  describe('cleanObject', () => {
    test('returns same object when no empty sub-objects', () => {
      const data = { a: 1, b: 'hello' };
      const result = cleanObject(data);
      expect(result).toEqual({ a: 1, b: 'hello' });
    });

    test('removes empty nested objects', () => {
      const data = { a: 1, b: {} };
      const result = cleanObject(data);
      expect(result).toEqual({ a: 1 });
    });

    test('removes deeply nested empty objects', () => {
      const data = { a: 1, b: { c: {} } };
      const result = cleanObject(data);
      expect(result).toEqual({ a: 1 });
    });

    test('keeps nested objects with values', () => {
      const data = { a: 1, b: { c: 2 } };
      const result = cleanObject(data);
      expect(result).toEqual({ a: 1, b: { c: 2 } });
    });

    test('preserves arrays', () => {
      const data = { a: [1, 2, 3] };
      const result = cleanObject(data);
      expect(result).toEqual({ a: [1, 2, 3] });
    });

    test('preserves empty arrays', () => {
      const data = { a: [] };
      const result = cleanObject(data);
      expect(result).toEqual({ a: [] });
    });

    test('removes objects where all sub-properties are undefined', () => {
      const data = { a: { b: undefined, c: undefined } };
      const result = cleanObject(data);
      expect(result).toEqual({});
    });

    test('handles falsy but non-nullish values', () => {
      const data = { a: 0, b: false, c: '' };
      const result = cleanObject(data);
      expect(result).toEqual({ a: 0, b: false, c: '' });
    });

    test('returns falsy input as-is', () => {
      const nullInput = null as unknown as Record<string, unknown>;
      const undefinedInput = undefined as unknown as Record<string, unknown>;
      expect(cleanObject(nullInput)).toBe(null);
      expect(cleanObject(undefinedInput)).toBe(undefined);
    });
  });
});
