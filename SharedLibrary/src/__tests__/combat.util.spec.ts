import { STAGES_TYPE_GROWABLE_WITH_HEALTH, WEAPON_TYPE_PROJECTILE } from '../constants';
import { damagableObjectFilter, getDamagableData, getProjectileData } from '../util/combat.util';
import {
  mockCreatureCategory,
  mockCreatureType,
  mockItemCategory,
  mockItemType,
  mockObjectCategory,
  mockObjectSubCategory,
  mockObjectType
} from './mock.helpers';

import type { CreatureCategory, ItemCategory, ObjectCategory, ObjectSubCategory } from '../interface';

describe('combat.util', () => {
  const treeCategory = mockObjectCategory({
    key: 'TREE',
    settings: { hasHealth: true }
  });

  const rockCategory = mockObjectCategory({
    key: 'ROCK',
    settings: { breakable: true }
  });

  const decorCategory = mockObjectCategory({
    key: 'DECORATION',
    settings: {}
  });

  const growableCategory = mockObjectCategory({
    key: 'CROP',
    settings: { stagesType: STAGES_TYPE_GROWABLE_WITH_HEALTH }
  });

  const objectCategoriesByKey: Record<string, ObjectCategory> = {
    TREE: treeCategory,
    ROCK: rockCategory,
    DECORATION: decorCategory,
    CROP: growableCategory
  };

  const oakSub = mockObjectSubCategory({
    key: 'OAK',
    categoryKey: 'TREE',
    settings: {}
  });

  const objectSubCategoriesByKey: Record<string, ObjectSubCategory> = {
    OAK: oakSub
  };

  const baseObjType = (overrides: Partial<ReturnType<typeof mockObjectType>>): ReturnType<typeof mockObjectType> =>
    mockObjectType({ health: 50, ...overrides });

  describe('damagableObjectFilter', () => {
    test('returns true for breakable objects', () => {
      const obj = baseObjType({ key: 'BOULDER', categoryKey: 'ROCK' });
      expect(damagableObjectFilter(obj, objectCategoriesByKey, objectSubCategoriesByKey)).toBe(true);
    });

    test('returns true for objects with hasHealth', () => {
      const obj = baseObjType({ key: 'OAK_TREE', categoryKey: 'TREE' });
      expect(damagableObjectFilter(obj, objectCategoriesByKey, objectSubCategoriesByKey)).toBe(true);
    });

    test('returns true for objects with stagesType GROWABLE_WITH_HEALTH', () => {
      const obj = baseObjType({ key: 'WHEAT', categoryKey: 'CROP' });
      expect(damagableObjectFilter(obj, objectCategoriesByKey, objectSubCategoriesByKey)).toBe(true);
    });

    test('returns false for decoration objects', () => {
      const obj = baseObjType({ key: 'FLOWER', categoryKey: 'DECORATION' });
      expect(damagableObjectFilter(obj, objectCategoriesByKey, objectSubCategoriesByKey)).toBe(false);
    });

    test('works with sub-categories', () => {
      expect(damagableObjectFilter(oakSub, objectCategoriesByKey, objectSubCategoriesByKey)).toBe(true);
    });
  });

  describe('getDamagableData', () => {
    const objectCategories = [treeCategory, rockCategory, decorCategory, growableCategory];
    const objectSubCategories = [oakSub];
    const objects = [
      baseObjType({ key: 'OAK_TREE', categoryKey: 'TREE' }),
      baseObjType({ key: 'FLOWER', categoryKey: 'DECORATION' }),
      baseObjType({ key: 'BOULDER', categoryKey: 'ROCK' })
    ];

    const monsterCategory = mockCreatureCategory({
      key: 'MONSTER',
      settings: { hasHealth: true }
    });

    const npcCategory = mockCreatureCategory({
      key: 'NPC',
      settings: {}
    });

    const creatureCategoriesByKey: Record<string, CreatureCategory> = {
      MONSTER: monsterCategory,
      NPC: npcCategory
    };

    const creatures = [
      mockCreatureType({ key: 'SLIME', categoryKey: 'MONSTER', health: 50, experience: 10, settings: { hasHealth: true } }),
      mockCreatureType({ key: 'MERCHANT', categoryKey: 'NPC', health: 0, experience: 0, settings: {} })
    ];

    test('filters damagable object categories', () => {
      const result = getDamagableData(
        objectCategories,
        objectCategoriesByKey,
        objectSubCategories,
        objectSubCategoriesByKey,
        objects,
        [monsterCategory, npcCategory],
        creatureCategoriesByKey,
        creatures
      );

      expect(result.damagableObjectCategoryKeys).toContain('TREE');
      expect(result.damagableObjectCategoryKeys).toContain('ROCK');
      expect(result.damagableObjectCategoryKeys).toContain('CROP');
      expect(result.damagableObjectCategoryKeys).not.toContain('DECORATION');
    });

    test('filters damagable objects', () => {
      const result = getDamagableData(
        objectCategories,
        objectCategoriesByKey,
        objectSubCategories,
        objectSubCategoriesByKey,
        objects,
        [monsterCategory, npcCategory],
        creatureCategoriesByKey,
        creatures
      );

      expect(result.damagableObjectKeys).toContain('OAK_TREE');
      expect(result.damagableObjectKeys).toContain('BOULDER');
      expect(result.damagableObjectKeys).not.toContain('FLOWER');
    });

    test('filters damagable creature categories', () => {
      const result = getDamagableData(
        objectCategories,
        objectCategoriesByKey,
        objectSubCategories,
        objectSubCategoriesByKey,
        objects,
        [monsterCategory, npcCategory],
        creatureCategoriesByKey,
        creatures
      );

      expect(result.damagableCreatureCategoryKeys).toContain('MONSTER');
      expect(result.damagableCreatureCategoryKeys).not.toContain('NPC');
    });

    test('filters damagable creatures', () => {
      const result = getDamagableData(
        objectCategories,
        objectCategoriesByKey,
        objectSubCategories,
        objectSubCategoriesByKey,
        objects,
        [monsterCategory, npcCategory],
        creatureCategoriesByKey,
        creatures
      );

      expect(result.damagableCreatureKeys).toContain('SLIME');
      expect(result.damagableCreatureKeys).not.toContain('MERCHANT');
    });

    test('filters damagable sub-categories', () => {
      const result = getDamagableData(
        objectCategories,
        objectCategoriesByKey,
        objectSubCategories,
        objectSubCategoriesByKey,
        objects,
        [],
        {},
        []
      );

      expect(result.damagableObjectSubCategoryKeys).toContain('OAK');
    });
  });

  describe('getProjectileData', () => {
    const projectileCategory = mockItemCategory({
      key: 'PROJECTILE',
      settings: { weaponType: WEAPON_TYPE_PROJECTILE }
    });

    const toolCategory = mockItemCategory({
      key: 'TOOL',
      settings: {}
    });

    const itemCategoriesByKey: Record<string, ItemCategory> = {
      PROJECTILE: projectileCategory,
      TOOL: toolCategory
    };

    const baseItem = (overrides: Partial<ReturnType<typeof mockItemType>>): ReturnType<typeof mockItemType> => mockItemType(overrides);

    test('filters projectile item categories', () => {
      const result = getProjectileData([projectileCategory, toolCategory], itemCategoriesByKey, []);

      expect(result.projectileItemCategoryKeys).toContain('PROJECTILE');
      expect(result.projectileItemCategoryKeys).not.toContain('TOOL');
    });

    test('filters projectile items by type setting', () => {
      const arrow = baseItem({
        key: 'ARROW',
        categoryKey: 'PROJECTILE',
        settings: { weaponType: WEAPON_TYPE_PROJECTILE }
      });
      const axe = baseItem({ key: 'AXE', categoryKey: 'TOOL' });

      const result = getProjectileData([projectileCategory, toolCategory], itemCategoriesByKey, [arrow, axe]);

      expect(result.projectileItemKeys).toContain('ARROW');
      expect(result.projectileItemKeys).not.toContain('AXE');
    });

    test('filters projectile items by category setting inheritance', () => {
      const arrow = baseItem({
        key: 'ARROW',
        categoryKey: 'PROJECTILE'
        // No type-level weaponType — inherits from category
      });

      const result = getProjectileData([projectileCategory, toolCategory], itemCategoriesByKey, [arrow]);

      expect(result.projectileItemKeys).toContain('ARROW');
    });
  });
});
