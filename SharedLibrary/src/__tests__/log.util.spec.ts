import { log, info, warn, error, dataToString } from '../util/log.util';

describe('log.util', () => {
  describe('dataToString', () => {
    test('converts single string to string with leading space', () => {
      expect(dataToString('hello')).toBe(' hello');
    });

    test('converts multiple arguments to space-separated string', () => {
      expect(dataToString('hello', 'world')).toBe(' hello world');
    });

    test('converts numbers', () => {
      expect(dataToString(42)).toBe(' 42');
    });

    test('converts mixed types', () => {
      expect(dataToString('count:', 5, true)).toBe(' count: 5 true');
    });

    test('returns empty string for no arguments', () => {
      expect(dataToString()).toBe('');
    });

    test('converts null and undefined', () => {
      expect(dataToString(null, undefined)).toBe(' null undefined');
    });

    test('converts objects', () => {
      const result = dataToString({ key: 'value' });
      expect(result).toBe(' [object Object]');
    });
  });

  describe('log', () => {
    test('falls back to console.info when unityLog is not defined', () => {
      const spy = jest.spyOn(console, 'info').mockImplementation();
      log('test message');
      expect(spy).toHaveBeenCalledWith('test message');
      spy.mockRestore();
    });

    test('uses unityLog when available', () => {
      const mockUnityLog = jest.fn();
      (globalThis as unknown as Record<string, unknown>).unityLog = mockUnityLog;

      log('test message');
      expect(mockUnityLog).toHaveBeenCalledWith(' test message');

      delete (globalThis as unknown as Record<string, unknown>).unityLog;
    });
  });

  describe('info', () => {
    test('falls back to console.info when unityLog is not defined', () => {
      const spy = jest.spyOn(console, 'info').mockImplementation();
      info('info message');
      expect(spy).toHaveBeenCalledWith('info message');
      spy.mockRestore();
    });
  });

  describe('warn', () => {
    test('falls back to console.warn when unityLogWarning is not defined', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();
      warn('warning message');
      expect(spy).toHaveBeenCalledWith('warning message');
      spy.mockRestore();
    });

    test('uses unityLogWarning when available', () => {
      const mockUnityLogWarning = jest.fn();
      (globalThis as unknown as Record<string, unknown>).unityLogWarning = mockUnityLogWarning;

      warn('warning message');
      expect(mockUnityLogWarning).toHaveBeenCalledWith(' warning message');

      delete (globalThis as unknown as Record<string, unknown>).unityLogWarning;
    });
  });

  describe('error', () => {
    test('falls back to console.error when unityLogError is not defined', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();
      error('error message');
      expect(spy).toHaveBeenCalledWith('error message');
      spy.mockRestore();
    });

    test('uses unityLogError when available', () => {
      const mockUnityLogError = jest.fn();
      (globalThis as unknown as Record<string, unknown>).unityLogError = mockUnityLogError;

      error('error message');
      expect(mockUnityLogError).toHaveBeenCalledWith(' error message');

      delete (globalThis as unknown as Record<string, unknown>).unityLogError;
    });
  });
});
