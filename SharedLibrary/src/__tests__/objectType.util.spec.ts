import { PLACEMENT_POSITION_CENTER, STAGES_TYPE_GROWABLE, STAGES_TYPE_GROWABLE_WITH_HEALTH } from '../constants';
import { getObjectSetting } from '../util/objectType.util';
import { mockObjectCategory, mockObjectSubCategory, mockObjectType } from './mock.helpers';

import type { ObjectCategory, ObjectSubCategory } from '../interface';

describe('objectType.util', () => {
  const treeCategory = mockObjectCategory({
    key: 'TREE',
    settings: {
      hasHealth: true,
      breakable: false,
      stagesType: STAGES_TYPE_GROWABLE,
      placementPosition: PLACEMENT_POSITION_CENTER
    }
  });

  const oakSubCategory = mockObjectSubCategory({
    key: 'OAK_TREE',
    categoryKey: 'TREE',
    settings: {
      breakable: true
    }
  });

  const oakTree = mockObjectType({
    key: 'OAK_TREE_LARGE',
    categoryKey: 'TREE',
    subCategoryKey: 'OAK_TREE',
    health: 100,
    sprite: { defaultSprite: 0, width: 32, height: 48 },
    worldSize: { x: 1, y: 2 },
    experience: 20,
    settings: {
      stagesType: STAGES_TYPE_GROWABLE_WITH_HEALTH
    }
  });

  const categoriesByKey: Record<string, ObjectCategory> = {
    TREE: treeCategory
  };

  const subCategoriesByKey: Record<string, ObjectSubCategory> = {
    OAK_TREE: oakSubCategory
  };

  describe('getObjectSetting', () => {
    test('returns type-level setting (controlledBy 0) when set on type', () => {
      const result = getObjectSetting('stagesType', oakTree, categoriesByKey, subCategoriesByKey);
      expect(result.value).toBe(STAGES_TYPE_GROWABLE_WITH_HEALTH);
      expect(result.controlledBy).toBe(0);
    });

    test('falls back to sub-category setting (controlledBy 1)', () => {
      const result = getObjectSetting('breakable', oakTree, categoriesByKey, subCategoriesByKey);
      expect(result.value).toBe(true);
      expect(result.controlledBy).toBe(1);
    });

    test('falls back to category setting (controlledBy 2)', () => {
      const result = getObjectSetting('hasHealth', oakTree, categoriesByKey, subCategoriesByKey);
      expect(result.value).toBe(true);
      expect(result.controlledBy).toBe(2);
    });

    test('returns undefined value and controlledBy 2 when type is undefined', () => {
      const result = getObjectSetting('hasHealth', undefined, categoriesByKey, subCategoriesByKey);
      expect(result.value).toBeUndefined();
      expect(result.controlledBy).toBe(2);
    });

    test('returns undefined value and controlledBy 2 when type is null', () => {
      const result = getObjectSetting('hasHealth', null as unknown as undefined, categoriesByKey, subCategoriesByKey);
      expect(result.value).toBeUndefined();
      expect(result.controlledBy).toBe(2);
    });

    test('handles object type with no settings', () => {
      const typeNoSettings = mockObjectType({ ...oakTree, settings: undefined });
      const result = getObjectSetting('breakable', typeNoSettings, categoriesByKey, subCategoriesByKey);
      // Falls back to sub-category
      expect(result.value).toBe(true);
      expect(result.controlledBy).toBe(1);
    });

    test('handles object type with no sub-category key', () => {
      const typeNoSubCat = mockObjectType({ ...oakTree, subCategoryKey: undefined, settings: undefined });
      const result = getObjectSetting('hasHealth', typeNoSubCat, categoriesByKey, subCategoriesByKey);
      // Falls back to category
      expect(result.value).toBe(true);
      expect(result.controlledBy).toBe(2);
    });

    test('handles object type with no category key', () => {
      const typeNoCategory = mockObjectType({
        ...oakTree,
        categoryKey: undefined,
        subCategoryKey: undefined,
        settings: undefined
      });
      const result = getObjectSetting('hasHealth', typeNoCategory, categoriesByKey, subCategoriesByKey);
      expect(result.value).toBeUndefined();
      expect(result.controlledBy).toBe(2);
    });

    test('works for sub-category as input (no subCategoryKey on sub-categories)', () => {
      const result = getObjectSetting('hasHealth', oakSubCategory, categoriesByKey, subCategoriesByKey);
      // Sub-category doesn't have hasHealth, falls to category
      expect(result.value).toBe(true);
      expect(result.controlledBy).toBe(2);
    });

    test('works for sub-category with own setting', () => {
      const result = getObjectSetting('breakable', oakSubCategory, categoriesByKey, subCategoriesByKey);
      // Sub-category has breakable=true in its own settings (controlledBy 0)
      expect(result.value).toBe(true);
      expect(result.controlledBy).toBe(0);
    });

    test('handles missing sub-categories lookup', () => {
      const result = getObjectSetting('stagesType', oakTree, categoriesByKey, undefined);
      // Type has stagesType set
      expect(result.value).toBe(STAGES_TYPE_GROWABLE_WITH_HEALTH);
      expect(result.controlledBy).toBe(0);
    });
  });
});
