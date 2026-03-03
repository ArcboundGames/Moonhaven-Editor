import deepEqual from '../deepEqual';

describe('deepEqual', () => {
  it('returns true for two undefined values', () => {
    expect(deepEqual(undefined, undefined)).toBe(true);
  });

  it('returns false when first argument is undefined', () => {
    expect(deepEqual(undefined, 1)).toBe(false);
  });

  it('returns false when second argument is undefined', () => {
    expect(deepEqual(1, undefined)).toBe(false);
  });

  it('returns true for equal primitives', () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual('hello', 'hello')).toBe(true);
    expect(deepEqual(true, true)).toBe(true);
    expect(deepEqual(null, null)).toBe(true);
  });

  it('returns false for different primitives', () => {
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual('a', 'b')).toBe(false);
    expect(deepEqual(true, false)).toBe(false);
  });

  it('returns true for deeply equal objects', () => {
    const a = { x: 1, y: { z: [1, 2, 3] } };
    const b = { x: 1, y: { z: [1, 2, 3] } };
    expect(deepEqual(a, b)).toBe(true);
  });

  it('returns false for different objects', () => {
    const a = { x: 1 };
    const b = { x: 2 };
    expect(deepEqual(a, b)).toBe(false);
  });

  it('returns true for equal arrays', () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('returns false for different arrays', () => {
    expect(deepEqual([1, 2], [1, 3])).toBe(false);
  });

  it('returns false for null vs object', () => {
    expect(deepEqual(null, {})).toBe(false);
  });

  it('handles empty objects and arrays', () => {
    expect(deepEqual({}, {})).toBe(true);
    expect(deepEqual([], [])).toBe(true);
    expect(deepEqual({}, [])).toBe(false);
  });
});
