import toRecord from '../util/record.util';

describe('record.util', () => {
  describe('toRecord', () => {
    test('converts array to record using key function', () => {
      const items = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 }
      ];
      const result = toRecord(items, (item) => item.key);
      expect(result).toEqual({
        a: { key: 'a', value: 1 },
        b: { key: 'b', value: 2 },
        c: { key: 'c', value: 3 }
      });
    });

    test('returns empty record for empty array', () => {
      const result = toRecord([], (item: { key: string }) => item.key);
      expect(result).toEqual({});
    });

    test('skips entries where key function returns undefined', () => {
      const items = [
        { key: 'a', value: 1 },
        { key: undefined as string | undefined, value: 2 },
        { key: 'c', value: 3 }
      ];
      const result = toRecord(items, (item) => item.key);
      expect(result).toEqual({
        a: { key: 'a', value: 1 },
        c: { key: 'c', value: 3 }
      });
    });

    test('last entry wins for duplicate keys', () => {
      const items = [
        { key: 'a', value: 1 },
        { key: 'a', value: 2 }
      ];
      const result = toRecord(items, (item) => item.key);
      expect(result).toEqual({
        a: { key: 'a', value: 2 }
      });
    });
  });
});
