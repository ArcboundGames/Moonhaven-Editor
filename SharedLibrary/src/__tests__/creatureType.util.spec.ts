import { ATTACK_TYPE_TOUCH, MOVEMENT_TYPE_JUMP, MOVEMENT_TYPE_WALK } from '../constants';
import { getCreatureSetting } from '../util/creatureType.util';
import { mockCreatureCategory, mockCreatureType } from './mock.helpers';

import type { CreatureCategory } from '../interface';

describe('creatureType.util', () => {
  const baseCreatureType = mockCreatureType({
    key: 'SLIME',
    categoryKey: 'MONSTER',
    health: 50,
    lootTableKey: 'SLIME_LOOT',
    settings: {
      hasHealth: true,
      movementType: MOVEMENT_TYPE_WALK,
      attackType: ATTACK_TYPE_TOUCH
    }
  });

  const monsterCategory = mockCreatureCategory({
    key: 'MONSTER',
    settings: {
      hasHealth: true,
      neutral: false,
      movementType: MOVEMENT_TYPE_JUMP
    }
  });

  const creatureCategoriesByKey: Record<string, CreatureCategory> = {
    MONSTER: monsterCategory
  };

  describe('getCreatureSetting', () => {
    test('returns type-level setting when set on type', () => {
      const result = getCreatureSetting('movementType', baseCreatureType, creatureCategoriesByKey);
      expect(result.value).toBe(MOVEMENT_TYPE_WALK);
      expect(result.controlledBy).toBe(0);
    });

    test('falls back to category setting when not set on type', () => {
      const type = mockCreatureType({ categoryKey: 'MONSTER', settings: { hasHealth: true } });
      const result = getCreatureSetting('movementType', type, creatureCategoriesByKey);
      expect(result.value).toBe(MOVEMENT_TYPE_JUMP);
      expect(result.controlledBy).toBe(1);
    });

    test('returns undefined value and controlledBy 1 when type is undefined', () => {
      const result = getCreatureSetting('hasHealth', undefined, creatureCategoriesByKey);
      expect(result.value).toBeUndefined();
      expect(result.controlledBy).toBe(1);
    });

    test('returns undefined value and controlledBy 1 when type is null', () => {
      const result = getCreatureSetting('hasHealth', null as unknown as undefined, creatureCategoriesByKey);
      expect(result.value).toBeUndefined();
      expect(result.controlledBy).toBe(1);
    });

    test('handles type with no settings', () => {
      const type = mockCreatureType({ categoryKey: 'MONSTER', settings: undefined });
      const result = getCreatureSetting('movementType', type, creatureCategoriesByKey);
      expect(result.value).toBe(MOVEMENT_TYPE_JUMP);
      expect(result.controlledBy).toBe(1);
    });

    test('handles type with no category key', () => {
      const type = mockCreatureType({ categoryKey: undefined, settings: undefined });
      const result = getCreatureSetting('movementType', type, creatureCategoriesByKey);
      expect(result.value).toBeUndefined();
      expect(result.controlledBy).toBe(1);
    });

    test('returns boolean settings correctly', () => {
      const result = getCreatureSetting('hasHealth', baseCreatureType, creatureCategoriesByKey);
      expect(result.value).toBe(true);
      expect(result.controlledBy).toBe(0);
    });
  });
});
