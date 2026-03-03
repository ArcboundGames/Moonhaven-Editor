import { isEmpty, isNotEmpty, toTitleCaseFromKey, toTitleCaseFromVariableName } from '../util/string.util';

describe('string.util', () => {
  describe('isEmpty', () => {
    test('returns true for null', () => {
      expect(isEmpty(null)).toBe(true);
    });

    test('returns true for undefined', () => {
      expect(isEmpty(undefined)).toBe(true);
    });

    test('returns true for empty string', () => {
      expect(isEmpty('')).toBe(true);
    });

    test('returns false for non-empty string', () => {
      expect(isEmpty('hello')).toBe(false);
    });

    test('returns false for whitespace string', () => {
      expect(isEmpty(' ')).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    test('returns false for null', () => {
      expect(isNotEmpty(null)).toBe(false);
    });

    test('returns false for undefined', () => {
      expect(isNotEmpty(undefined)).toBe(false);
    });

    test('returns false for empty string', () => {
      expect(isNotEmpty('')).toBe(false);
    });

    test('returns true for non-empty string', () => {
      expect(isNotEmpty('hello')).toBe(true);
    });

    test('returns true for whitespace string', () => {
      expect(isNotEmpty(' ')).toBe(true);
    });
  });

  describe('toTitleCaseFromKey', () => {
    test('converts UPPER_SNAKE_CASE to Title Case', () => {
      expect(toTitleCaseFromKey('HELLO_WORLD')).toBe('Hello World');
    });

    test('converts single word key', () => {
      expect(toTitleCaseFromKey('HELLO')).toBe('Hello');
    });

    test('converts multi-word key', () => {
      expect(toTitleCaseFromKey('NEW_ITEM_TYPE')).toBe('New Item Type');
    });

    test('handles empty string', () => {
      expect(toTitleCaseFromKey('')).toBe('');
    });

    test('handles already lowercase with underscores', () => {
      expect(toTitleCaseFromKey('hello_world')).toBe('Hello World');
    });
  });

  describe('toTitleCaseFromVariableName', () => {
    test('converts camelCase to Title Case', () => {
      expect(toTitleCaseFromVariableName('helloWorld')).toBe('Hello World');
    });

    test('converts single word', () => {
      expect(toTitleCaseFromVariableName('hello')).toBe('Hello');
    });

    test('converts multi-word camelCase', () => {
      expect(toTitleCaseFromVariableName('newItemType')).toBe('New Item Type');
    });

    test('handles empty string', () => {
      expect(toTitleCaseFromVariableName('')).toBe('');
    });

    test('converts PascalCase', () => {
      expect(toTitleCaseFromVariableName('HelloWorld')).toBe('Hello World');
    });
  });
});
