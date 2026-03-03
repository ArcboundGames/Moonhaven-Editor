import { createAssert } from '../util/assert.util';

describe('assert.util', () => {
  describe('createAssert', () => {
    test('returns assert functions and empty errors array', () => {
      const result = createAssert();
      expect(result.errors).toEqual([]);
      expect(typeof result.assert).toBe('function');
      expect(typeof result.assertNotNullish).toBe('function');
      expect(typeof result.assertNotEmpty).toBe('function');
    });
  });

  describe('assert', () => {
    test('returns true and does not add error when condition is true', () => {
      const { errors, assert } = createAssert();
      const result = assert(true, 'This should not appear');
      expect(result).toBe(true);
      expect(errors).toEqual([]);
    });

    test('returns false and adds error when condition is false', () => {
      const { errors, assert } = createAssert();
      const result = assert(false, 'Something went wrong');
      expect(result).toBe(false);
      expect(errors).toEqual(['Something went wrong']);
    });

    test('accumulates multiple errors', () => {
      const { errors, assert } = createAssert();
      assert(false, 'Error 1');
      assert(true, 'Not an error');
      assert(false, 'Error 2');
      expect(errors).toEqual(['Error 1', 'Error 2']);
    });
  });

  describe('assertNotNullish', () => {
    test('returns true for non-null, non-undefined values', () => {
      const { errors, assertNotNullish } = createAssert();
      expect(assertNotNullish(0, 'error')).toBe(true);
      expect(assertNotNullish('', 'error')).toBe(true);
      expect(assertNotNullish(false, 'error')).toBe(true);
      expect(assertNotNullish([], 'error')).toBe(true);
      expect(errors).toEqual([]);
    });

    test('returns false and adds error for null', () => {
      const { errors, assertNotNullish } = createAssert();
      expect(assertNotNullish(null, 'Value is null')).toBe(false);
      expect(errors).toEqual(['Value is null']);
    });

    test('returns false and adds error for undefined', () => {
      const { errors, assertNotNullish } = createAssert();
      expect(assertNotNullish(undefined, 'Value is undefined')).toBe(false);
      expect(errors).toEqual(['Value is undefined']);
    });
  });

  describe('assertNotEmpty', () => {
    test('returns true for non-empty string', () => {
      const { errors, assertNotEmpty } = createAssert();
      expect(assertNotEmpty('hello', 'error')).toBe(true);
      expect(assertNotEmpty(' ', 'error')).toBe(true);
      expect(errors).toEqual([]);
    });

    test('returns false and adds error for empty string', () => {
      const { errors, assertNotEmpty } = createAssert();
      expect(assertNotEmpty('', 'String is empty')).toBe(false);
      expect(errors).toEqual(['String is empty']);
    });

    test('returns false and adds error for null', () => {
      const { errors, assertNotEmpty } = createAssert();
      expect(assertNotEmpty(null, 'String is null')).toBe(false);
      expect(errors).toEqual(['String is null']);
    });

    test('returns false and adds error for undefined', () => {
      const { errors, assertNotEmpty } = createAssert();
      expect(assertNotEmpty(undefined, 'String is undefined')).toBe(false);
      expect(errors).toEqual(['String is undefined']);
    });
  });
});
