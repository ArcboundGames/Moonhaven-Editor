import { WEAPON_TYPE_ARC, WEAPON_TYPE_POINT } from '../constants';
import { getItemSetting, canItemDamageObject } from '../util/itemType.util';
import { mockItemCategory, mockItemType, mockObjectType } from './mock.helpers';

import type { ItemCategory } from '../interface';

describe('itemType.util', () => {
  const baseItemType = mockItemType({
    key: 'IRON_SWORD',
    categoryKey: 'WEAPON',
    creatureDamage: 10,
    objectDamage: 5,
    durability: 100,
    sellPrice: 50,
    settings: {
      weaponType: WEAPON_TYPE_ARC,
      hasDurability: true,
      damagesObjectCategoryKeys: ['TREE'],
      damagesObjectSubCategoryKeys: ['OAK_TREE'],
      damagesObjectKeys: ['SPECIFIC_TREE']
    }
  });

  const weaponCategory = mockItemCategory({
    key: 'WEAPON',
    settings: {
      weaponType: WEAPON_TYPE_POINT,
      hasDurability: true,
      isEdible: false,
      damagesCreatureCategoryKeys: ['MONSTER']
    }
  });

  const itemCategoriesByKey: Record<string, ItemCategory> = {
    WEAPON: weaponCategory
  };

  describe('getItemSetting', () => {
    test('returns type-level setting when set on type', () => {
      const result = getItemSetting('weaponType', baseItemType, itemCategoriesByKey);
      expect(result.value).toBe(WEAPON_TYPE_ARC);
      expect(result.controlledBy).toBe(0);
    });

    test('falls back to category setting when not set on type', () => {
      const typeWithoutWeapon = mockItemType({
        categoryKey: 'WEAPON',
        settings: { hasDurability: true }
      });

      const result = getItemSetting('weaponType', typeWithoutWeapon, itemCategoriesByKey);
      expect(result.value).toBe(WEAPON_TYPE_POINT);
      expect(result.controlledBy).toBe(1);
    });

    test('returns undefined when setting not on type or category', () => {
      const result = getItemSetting('isEdible', baseItemType, itemCategoriesByKey);
      expect(result.controlledBy).toBe(1);
    });

    test('returns undefined value and controlledBy 1 when type is undefined', () => {
      const result = getItemSetting('weaponType', undefined, itemCategoriesByKey);
      expect(result.value).toBeUndefined();
      expect(result.controlledBy).toBe(1);
    });

    test('returns undefined value and controlledBy 1 when type is null', () => {
      const result = getItemSetting('weaponType', null as unknown as undefined, itemCategoriesByKey);
      expect(result.value).toBeUndefined();
      expect(result.controlledBy).toBe(1);
    });

    test('handles type with no settings', () => {
      const typeNoSettings = mockItemType({ categoryKey: 'WEAPON', settings: undefined });
      const result = getItemSetting('weaponType', typeNoSettings, itemCategoriesByKey);
      // Falls back to category
      expect(result.value).toBe(WEAPON_TYPE_POINT);
      expect(result.controlledBy).toBe(1);
    });

    test('handles type with no category key', () => {
      const typeNoCategory = mockItemType({ categoryKey: undefined, settings: undefined });
      const result = getItemSetting('weaponType', typeNoCategory, itemCategoriesByKey);
      expect(result.value).toBeUndefined();
      expect(result.controlledBy).toBe(1);
    });
  });

  describe('canItemDamageObject', () => {
    const treeObject = mockObjectType({
      key: 'SPECIFIC_TREE',
      categoryKey: 'TREE',
      subCategoryKey: 'OAK_TREE',
      health: 100
    });

    test('returns true when object key is in damagesObjectKeys', () => {
      expect(canItemDamageObject(baseItemType, treeObject, itemCategoriesByKey)).toBe(true);
    });

    test('returns true when object subCategoryKey is in damagesObjectSubCategoryKeys', () => {
      const rockObject = mockObjectType({
        key: 'OTHER_TREE',
        subCategoryKey: 'OAK_TREE',
        categoryKey: 'OTHER'
      });
      expect(canItemDamageObject(baseItemType, rockObject, itemCategoriesByKey)).toBe(true);
    });

    test('returns true when object categoryKey is in damagesObjectCategoryKeys', () => {
      const genericTree = mockObjectType({
        key: 'RANDOM_TREE',
        subCategoryKey: 'PINE_TREE',
        categoryKey: 'TREE'
      });
      expect(canItemDamageObject(baseItemType, genericTree, itemCategoriesByKey)).toBe(true);
    });

    test('returns false when object does not match any damage keys', () => {
      const stoneObject = mockObjectType({
        key: 'STONE',
        subCategoryKey: 'SMALL_STONE',
        categoryKey: 'ROCK'
      });
      expect(canItemDamageObject(baseItemType, stoneObject, itemCategoriesByKey)).toBe(false);
    });

    test('returns false when itemType is undefined', () => {
      expect(canItemDamageObject(undefined, treeObject, itemCategoriesByKey)).toBe(false);
    });

    test('returns false when objectType is undefined', () => {
      expect(canItemDamageObject(baseItemType, undefined, itemCategoriesByKey)).toBe(false);
    });

    test('returns false when both are undefined', () => {
      expect(canItemDamageObject(undefined, undefined, itemCategoriesByKey)).toBe(false);
    });
  });
});
