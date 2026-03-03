import { getLocalizationKey, getEnglishLocalization, getLocalizedValue, sortLocalization } from '../util/localization.util';

import type { Localization } from '../interface';

describe('localization.util', () => {
  describe('getLocalizationKey', () => {
    test('generates key with prefix, key name, and data key', () => {
      expect(getLocalizationKey('item', 'name', 'IRON_SWORD')).toBe('item_iron_sword_name');
    });

    test('generates key without data key', () => {
      expect(getLocalizationKey('creature', 'description')).toBe('creature_description');
    });

    test('lowercases the data key', () => {
      expect(getLocalizationKey('object', 'name', 'BIG_TREE')).toBe('object_big_tree_name');
    });
  });

  describe('getEnglishLocalization', () => {
    test('finds English localization', () => {
      const localizations: Localization[] = [
        { key: 'fr-FR', name: 'French', values: {} },
        { key: 'en-US', name: 'English', values: { hello: 'Hello' } },
        { key: 'de-DE', name: 'German', values: {} }
      ];

      const result = getEnglishLocalization(localizations);
      expect(result.englishLocalization).toEqual({ key: 'en-US', name: 'English', values: { hello: 'Hello' } });
      expect(result.englishIndex).toBe(1);
    });

    test('returns null and -1 when English not found', () => {
      const localizations: Localization[] = [
        { key: 'fr-FR', name: 'French', values: {} },
        { key: 'de-DE', name: 'German', values: {} }
      ];

      const result = getEnglishLocalization(localizations);
      expect(result.englishLocalization).toBeNull();
      expect(result.englishIndex).toBe(-1);
    });

    test('is case-insensitive for the key', () => {
      const localizations: Localization[] = [{ key: 'EN-US', name: 'English', values: {} }];

      const result = getEnglishLocalization(localizations);
      expect(result.englishIndex).toBe(0);
    });
  });

  describe('getLocalizedValue', () => {
    const localization: Localization = {
      key: 'en-US',
      name: 'English',
      values: {
        item_iron_sword_name: 'Iron Sword',
        item_iron_sword_description: 'A sharp blade'
      }
    };
    const keys = ['item_iron_sword_name', 'item_iron_sword_description'];

    test('returns localized value when key exists', () => {
      expect(getLocalizedValue(localization, keys, 'item_iron_sword_name')).toBe('Iron Sword');
    });

    test('returns empty string when key not in keys array', () => {
      expect(getLocalizedValue(localization, keys, 'nonexistent_key')).toBe('');
    });

    test('returns empty string when localization is null', () => {
      expect(getLocalizedValue(null, keys, 'item_iron_sword_name')).toBe('');
    });

    test('returns empty string when localization is undefined', () => {
      expect(getLocalizedValue(undefined, keys, 'item_iron_sword_name')).toBe('');
    });

    test('returns empty string when key exists in keys but not in values', () => {
      const sparseLocalization: Localization = {
        key: 'en-US',
        name: 'English',
        values: {}
      };
      expect(getLocalizedValue(sparseLocalization, keys, 'item_iron_sword_name')).toBe('');
    });
  });

  describe('sortLocalization', () => {
    test('sorts localization values by key alphabetically', () => {
      const localization: Localization = {
        key: 'en-US',
        name: 'English',
        values: {
          zebra: 'Zebra',
          apple: 'Apple',
          mango: 'Mango'
        }
      };

      const result = sortLocalization(localization);
      const sortedKeys = Object.keys(result.values);
      expect(sortedKeys).toEqual(['apple', 'mango', 'zebra']);
      expect(result.key).toBe('en-US');
      expect(result.name).toBe('English');
    });

    test('preserves values during sort', () => {
      const localization: Localization = {
        key: 'en-US',
        name: 'English',
        values: {
          b_key: 'B Value',
          a_key: 'A Value'
        }
      };

      const result = sortLocalization(localization);
      expect(result.values).toEqual({
        a_key: 'A Value',
        b_key: 'B Value'
      });
    });

    test('handles empty values', () => {
      const localization: Localization = { key: 'en-US', name: 'English', values: {} };
      const result = sortLocalization(localization);
      expect(result.values).toEqual({});
    });
  });
});
