import {
  ALL_SEASONS,
  ATTACK_TYPE_ARC,
  ATTACK_TYPE_NONE,
  ATTACK_TYPE_TOUCH,
  AUTO_BOX_COLLIDER_TYPE,
  BOX_COLLIDER_TYPE,
  DAYS_IN_A_WEEK,
  EMPTY_GROUND_CONDITION,
  FALL,
  FARMLAND_CONDITION,
  FILLED_FROM_TYPE_NONE,
  FILLED_FROM_TYPE_SAND,
  FILLED_FROM_TYPE_WATER,
  FISHING_ITEM_TYPE_FISH,
  FISHING_ITEM_TYPE_LURE,
  FISHING_ITEM_TYPE_NONE,
  FISHING_ITEM_TYPE_POLE,
  GROUND_TYPE_FARMLAND,
  GROUND_TYPE_GRASS,
  GROUND_TYPE_INSIDE,
  GROUND_TYPE_SAND,
  INSIDE_CONDITION,
  INVENTORY_TYPE_LARGE,
  INVENTORY_TYPE_NONE,
  INVENTORY_TYPE_SMALL,
  LOOT_TYPE_DROP,
  LOOT_TYPE_NONE,
  LOOT_TYPE_STAGE_DROP,
  MOVEMENT_TYPE_JUMP,
  MOVEMENT_TYPE_WALK,
  PLACEMENT_LAYER_IN_AIR,
  PLACEMENT_LAYER_IN_GROUND,
  PLACEMENT_LAYER_ON_GROUND,
  PLACEMENT_POSITION_CENTER,
  PLACEMENT_POSITION_EDGE,
  POLYGON_COLLIDER_TYPE,
  QUEST_COMPLETION_TRIGGER_AUTO_COMPLETE,
  QUEST_COMPLETION_TRIGGER_TALK_TO_CREATURE,
  QUEST_OBJECTIVE_TYPE_CRAFT,
  QUEST_OBJECTIVE_TYPE_DESTINATION,
  QUEST_OBJECTIVE_TYPE_GATHER,
  QUEST_OBJECTIVE_TYPE_TALK_TO_CREATURE,
  QUEST_SOURCE_AUTO_START,
  QUEST_SOURCE_CREATURE,
  SPRING,
  SPRITE_RULE_DIRECTION_DOWN,
  SPRITE_RULE_DIRECTION_DOWN_LEFT,
  SPRITE_RULE_DIRECTION_DOWN_RIGHT,
  SPRITE_RULE_DIRECTION_LEFT,
  SPRITE_RULE_DIRECTION_RIGHT,
  SPRITE_RULE_DIRECTION_UP,
  SPRITE_RULE_DIRECTION_UP_LEFT,
  SPRITE_RULE_DIRECTION_UP_RIGHT,
  STAGES_TYPE_BREAKABLE,
  STAGES_TYPE_GROWABLE,
  STAGES_TYPE_GROWABLE_WITH_HEALTH,
  STAGES_TYPE_NONE,
  STAGE_JUMP_CONDITION_HARVEST,
  STAGE_JUMP_CONDITION_TIME,
  SUMMER,
  TIME_COMPARATOR_AFTER,
  TIME_COMPARATOR_BEFORE,
  TIME_COMPARATOR_BETWEEN,
  WEAPON_TYPE_ARC,
  WEAPON_TYPE_NONE,
  WEAPON_TYPE_POINT,
  WEAPON_TYPE_PROJECTILE,
  WEAPON_TYPE_PROJECTILE_LAUNCHER,
  WINTER
} from '../constants';
import {
  createCampSpawn,
  createCreatureShop,
  createCreatureSprites,
  createObjectSprite,
  createObjectSprites,
  createObjectTypeStage,
  createQuestObjective,
  createQuestTask,
  createVector2,
  fromNullish,
  fromNullishArray,
  fromNullishRecord,
  mapTypedKeyRecord,
  toAttackType,
  toCampSpawn,
  toCategorySprite,
  toColliderType,
  toColliders,
  toCraftingRecipe,
  toCraftingRecipeCategory,
  toCreatureCategory,
  toCreatureSettings,
  toCreatureShop,
  toCreatureSprites,
  toCreatureType,
  toDataObject,
  toDialogue,
  toDialogueConditions,
  toDialogueResponse,
  toDialogueTree,
  toEventLog,
  toFilledFromType,
  toFishingItemType,
  toFishingPoleAnchorPoints,
  toFishingZone,
  toGroundType,
  toInventoryType,
  toItemCategory,
  toItemSettings,
  toItemType,
  toLocalization,
  toLocalizationFile,
  toLootTable,
  toLootTableComponent,
  toLootTableComponentGroup,
  toLootType,
  toMovementType,
  toObjectCategory,
  toObjectCollider,
  toObjectSettings,
  toObjectSpriteRule,
  toObjectSpriteRulePosition,
  toObjectSpriteRules,
  toObjectSprites,
  toObjectSubCategory,
  toObjectType,
  toObjectTypeStage,
  toPlacementLayer,
  toPlacementPosition,
  toPlayerData,
  toProcessedRawCampSpawn,
  toProcessedRawCategorySprite,
  toProcessedRawColliders,
  toProcessedRawCraftingRecipe,
  toProcessedRawCraftingRecipeCategory,
  toProcessedRawCreatureCategory,
  toProcessedRawCreatureSettings,
  toProcessedRawCreatureShop,
  toProcessedRawCreatureSprites,
  toProcessedRawCreatureType,
  toProcessedRawDialogue,
  toProcessedRawDialogueConditions,
  toProcessedRawDialogueResponse,
  toProcessedRawDialogueTree,
  toProcessedRawEventLog,
  toProcessedRawFishingZone,
  toProcessedRawItemCategory,
  toProcessedRawItemSettings,
  toProcessedRawItemType,
  toProcessedRawLocalization,
  toProcessedRawLocalizationFile,
  toProcessedRawLootTable,
  toProcessedRawLootTableComponent,
  toProcessedRawLootTableComponentGroup,
  toProcessedRawObjectCategory,
  toProcessedRawObjectCollider,
  toProcessedRawObjectSettings,
  toProcessedRawObjectSprites,
  toProcessedRawObjectSpriteRule,
  toProcessedRawObjectSpriteRules,
  toProcessedRawObjectSubCategory,
  toProcessedRawObjectType,
  toProcessedRawObjectTypeStage,
  toProcessedRawPlayerData,
  toProcessedRawQuest,
  toProcessedRawQuestObjective,
  toProcessedRawQuestTask,
  toProcessedRawSkill,
  toProcessedRawSkillLevel,
  toProcessedRawSprite,
  toProcessedRawSprites,
  toProcessedRawSpriteColliders,
  toProcessedRawWeatherSettings,
  toProcessedRawWorldSettings,
  toProcessedRawWorldZone,
  toProcessedRawWorldZoneSpawn,
  toQuest,
  toQuestCompletionTrigger,
  toQuestObjective,
  toQuestObjectiveType,
  toQuestSource,
  toQuestTask,
  toSeason,
  toSkill,
  toSkillLevel,
  toSpawningCondition,
  toSprite,
  toSpriteColliders,
  toSprites,
  toStageJumpCondition,
  toStagesType,
  toTimeComparator,
  toTypedArray,
  toTypedKeyRecord,
  toVector2,
  toWeaponType,
  toWeatherSettings,
  toWorldSettings,
  toWorldZone,
  toWorldZoneSpawn
} from '../util/converters.util';

// ─── Generic Helpers ───────────────────────────────────────────────────────────

describe('generic helpers', () => {
  describe('createVector2', () => {
    test('returns zeroed vector', () => {
      expect(createVector2()).toEqual({ x: 0, y: 0 });
    });
  });

  describe('toVector2', () => {
    test('returns undefined when input is null and no default', () => {
      expect(toVector2(null)).toBeUndefined();
    });

    test('returns undefined when input is undefined and no default', () => {
      expect(toVector2(undefined)).toBeUndefined();
    });

    test('returns default when input is null', () => {
      expect(toVector2(null, { x: 5, y: 10 })).toEqual({ x: 5, y: 10 });
    });

    test('normalizes vector with nullish fields using default', () => {
      expect(toVector2({ x: 3 }, { x: 0, y: 7 })).toEqual({ x: 3, y: 7 });
    });

    test('normalizes vector with nullish fields and no default', () => {
      expect(toVector2({ x: 3 })).toEqual({ x: 3, y: 0 });
    });

    test('passes through complete vector', () => {
      expect(toVector2({ x: 1, y: 2 })).toEqual({ x: 1, y: 2 });
    });
  });

  describe('toFishingPoleAnchorPoints', () => {
    test('returns undefined for null', () => {
      expect(toFishingPoleAnchorPoints(null)).toBeUndefined();
    });

    test('normalizes sub-vectors', () => {
      const result = toFishingPoleAnchorPoints({ idle: { x: 1 }, casting: null, pulling: { x: 3, y: 4 } });
      expect(result).toEqual({
        idle: { x: 1, y: 0 },
        casting: { x: 0, y: 0 },
        pulling: { x: 3, y: 4 }
      });
    });
  });

  describe('fromNullish', () => {
    test('converts null to undefined', () => {
      expect(fromNullish(null)).toBeUndefined();
    });

    test('converts undefined to undefined', () => {
      expect(fromNullish(undefined)).toBeUndefined();
    });

    test('passes through truthy values', () => {
      expect(fromNullish('hello')).toBe('hello');
      expect(fromNullish(42)).toBe(42);
    });

    test('passes through falsy non-null values', () => {
      expect(fromNullish(0)).toBe(0);
      expect(fromNullish('')).toBe('');
      expect(fromNullish(false)).toBe(false);
    });
  });

  describe('fromNullishArray', () => {
    test('returns undefined for null input', () => {
      expect(fromNullishArray(null, (v) => v)).toBeUndefined();
    });

    test('returns undefined for undefined input', () => {
      expect(fromNullishArray(undefined, (v) => v)).toBeUndefined();
    });

    test('maps array through converter', () => {
      const result = fromNullishArray([1, null, 3], (v) => v ?? 0);
      expect(result).toEqual([1, 0, 3]);
    });
  });

  describe('fromNullishRecord', () => {
    test('returns undefined for null input', () => {
      expect(fromNullishRecord(null, (v) => v)).toBeUndefined();
    });

    test('returns undefined for undefined input', () => {
      expect(fromNullishRecord(undefined, (v) => v)).toBeUndefined();
    });

    test('maps record values through converter', () => {
      const result = fromNullishRecord({ a: 1, b: null, c: 3 }, (v) => v ?? 0);
      expect(result).toEqual({ a: 1, b: 0, c: 3 });
    });
  });

  describe('toTypedArray', () => {
    test('returns undefined for undefined input', () => {
      expect(toTypedArray(undefined, toSeason)).toBeUndefined();
    });

    test('filters out invalid values', () => {
      const result = toTypedArray([SPRING, 'INVALID', SUMMER], toSeason);
      expect(result).toEqual([SPRING, SUMMER]);
    });
  });

  describe('toTypedKeyRecord', () => {
    test('returns undefined for undefined input', () => {
      expect(toTypedKeyRecord(undefined, toSeason)).toBeUndefined();
    });

    test('re-keys record and drops invalid keys', () => {
      const input = { [SPRING]: 10, INVALID: 20, [SUMMER]: 30 };
      const result = toTypedKeyRecord(input, toSeason);
      expect(result).toEqual({ [SPRING]: 10, [SUMMER]: 30 });
    });
  });

  describe('mapTypedKeyRecord', () => {
    test('maps values through converter', () => {
      const input: Record<string, number> = { a: 1, b: 2 };
      const result = mapTypedKeyRecord(input, (v) => v * 2);
      expect(result).toEqual({ a: 2, b: 4 });
    });
  });
});

// ─── Enum Converters ───────────────────────────────────────────────────────────

describe('enum converters', () => {
  describe('toLootType', () => {
    test.each([LOOT_TYPE_NONE, LOOT_TYPE_DROP, LOOT_TYPE_STAGE_DROP])('returns %s', (val) => {
      expect(toLootType(val)).toBe(val);
    });
    test('returns undefined for invalid', () => {
      expect(toLootType('INVALID')).toBeUndefined();
    });
    test('returns undefined for undefined', () => {
      expect(toLootType(undefined)).toBeUndefined();
    });
  });

  describe('toStagesType', () => {
    test.each([STAGES_TYPE_NONE, STAGES_TYPE_GROWABLE, STAGES_TYPE_GROWABLE_WITH_HEALTH, STAGES_TYPE_BREAKABLE])('returns %s', (val) => {
      expect(toStagesType(val)).toBe(val);
    });
    test('returns undefined for invalid', () => {
      expect(toStagesType('INVALID')).toBeUndefined();
    });
  });

  describe('toPlacementPosition', () => {
    test.each([PLACEMENT_POSITION_CENTER, PLACEMENT_POSITION_EDGE])('returns %s', (val) => {
      expect(toPlacementPosition(val)).toBe(val);
    });
    test('returns undefined for invalid', () => {
      expect(toPlacementPosition('INVALID')).toBeUndefined();
    });
  });

  describe('toPlacementLayer', () => {
    test.each([PLACEMENT_LAYER_IN_GROUND, PLACEMENT_LAYER_ON_GROUND, PLACEMENT_LAYER_IN_AIR])('returns %s', (val) => {
      expect(toPlacementLayer(val)).toBe(val);
    });
    test('returns undefined for invalid', () => {
      expect(toPlacementLayer('INVALID')).toBeUndefined();
    });
    test('returns undefined for null', () => {
      expect(toPlacementLayer(null)).toBeUndefined();
    });
  });

  describe('toColliderType', () => {
    test.each([POLYGON_COLLIDER_TYPE, AUTO_BOX_COLLIDER_TYPE, BOX_COLLIDER_TYPE])('returns %s', (val) => {
      expect(toColliderType(val)).toBe(val);
    });
    test('returns undefined for invalid', () => {
      expect(toColliderType('INVALID')).toBeUndefined();
    });
  });

  describe('toObjectSpriteRulePosition', () => {
    const allDirections = [
      SPRITE_RULE_DIRECTION_UP,
      SPRITE_RULE_DIRECTION_UP_RIGHT,
      SPRITE_RULE_DIRECTION_RIGHT,
      SPRITE_RULE_DIRECTION_DOWN_RIGHT,
      SPRITE_RULE_DIRECTION_DOWN,
      SPRITE_RULE_DIRECTION_DOWN_LEFT,
      SPRITE_RULE_DIRECTION_LEFT,
      SPRITE_RULE_DIRECTION_UP_LEFT
    ];
    test.each(allDirections)('returns %s', (val) => {
      expect(toObjectSpriteRulePosition(val)).toBe(val);
    });
    test('returns undefined for invalid', () => {
      expect(toObjectSpriteRulePosition('INVALID')).toBeUndefined();
    });
  });

  describe('toStageJumpCondition', () => {
    test.each([STAGE_JUMP_CONDITION_TIME, STAGE_JUMP_CONDITION_HARVEST])('returns %s', (val) => {
      expect(toStageJumpCondition(val)).toBe(val);
    });
    test('returns undefined for invalid', () => {
      expect(toStageJumpCondition('INVALID')).toBeUndefined();
    });
  });

  describe('toSpawningCondition', () => {
    test.each([FARMLAND_CONDITION, EMPTY_GROUND_CONDITION, INSIDE_CONDITION])('returns %s', (val) => {
      expect(toSpawningCondition(val)).toBe(val);
    });
    test('returns undefined for invalid', () => {
      expect(toSpawningCondition('INVALID')).toBeUndefined();
    });
  });

  describe('toInventoryType', () => {
    test.each([INVENTORY_TYPE_NONE, INVENTORY_TYPE_SMALL, INVENTORY_TYPE_LARGE])('returns %s', (val) => {
      expect(toInventoryType(val)).toBe(val);
    });
    test('returns undefined for invalid', () => {
      expect(toInventoryType('INVALID')).toBeUndefined();
    });
  });

  describe('toFilledFromType', () => {
    test.each([FILLED_FROM_TYPE_NONE, FILLED_FROM_TYPE_WATER, FILLED_FROM_TYPE_SAND])('returns %s', (val) => {
      expect(toFilledFromType(val)).toBe(val);
    });
    test('returns undefined for invalid', () => {
      expect(toFilledFromType('INVALID')).toBeUndefined();
    });
  });

  describe('toTimeComparator', () => {
    test.each([TIME_COMPARATOR_BEFORE, TIME_COMPARATOR_AFTER, TIME_COMPARATOR_BETWEEN])('returns %s', (val) => {
      expect(toTimeComparator(val)).toBe(val);
    });
    test('returns undefined for invalid', () => {
      expect(toTimeComparator('INVALID')).toBeUndefined();
    });
  });

  describe('toWeaponType', () => {
    test.each([WEAPON_TYPE_NONE, WEAPON_TYPE_POINT, WEAPON_TYPE_ARC, WEAPON_TYPE_PROJECTILE_LAUNCHER, WEAPON_TYPE_PROJECTILE])(
      'returns %s',
      (val) => {
        expect(toWeaponType(val)).toBe(val);
      }
    );
    test('returns undefined for invalid', () => {
      expect(toWeaponType('INVALID')).toBeUndefined();
    });
  });

  describe('toFishingItemType', () => {
    test.each([FISHING_ITEM_TYPE_NONE, FISHING_ITEM_TYPE_POLE, FISHING_ITEM_TYPE_LURE, FISHING_ITEM_TYPE_FISH])('returns %s', (val) => {
      expect(toFishingItemType(val)).toBe(val);
    });
    test('returns undefined for invalid', () => {
      expect(toFishingItemType('INVALID')).toBeUndefined();
    });
  });

  describe('toSeason', () => {
    test.each([SPRING, SUMMER, FALL, WINTER, ALL_SEASONS])('returns %s', (val) => {
      expect(toSeason(val)).toBe(val);
    });
    test('returns undefined for invalid', () => {
      expect(toSeason('INVALID')).toBeUndefined();
    });
  });

  describe('toQuestObjectiveType', () => {
    test.each([
      QUEST_OBJECTIVE_TYPE_GATHER,
      QUEST_OBJECTIVE_TYPE_CRAFT,
      QUEST_OBJECTIVE_TYPE_DESTINATION,
      QUEST_OBJECTIVE_TYPE_TALK_TO_CREATURE
    ])('returns %s', (val) => {
      expect(toQuestObjectiveType(val)).toBe(val);
    });
    test('returns undefined for invalid', () => {
      expect(toQuestObjectiveType('INVALID')).toBeUndefined();
    });
  });

  describe('toQuestCompletionTrigger', () => {
    test.each([QUEST_COMPLETION_TRIGGER_AUTO_COMPLETE, QUEST_COMPLETION_TRIGGER_TALK_TO_CREATURE])('returns %s', (val) => {
      expect(toQuestCompletionTrigger(val)).toBe(val);
    });
    test('returns undefined for invalid', () => {
      expect(toQuestCompletionTrigger('INVALID')).toBeUndefined();
    });
  });

  describe('toQuestSource', () => {
    test.each([QUEST_SOURCE_CREATURE, QUEST_SOURCE_AUTO_START])('returns %s', (val) => {
      expect(toQuestSource(val)).toBe(val);
    });
    test('returns undefined for invalid', () => {
      expect(toQuestSource('INVALID')).toBeUndefined();
    });
  });

  describe('toGroundType', () => {
    test.each([GROUND_TYPE_GRASS, GROUND_TYPE_SAND, GROUND_TYPE_FARMLAND, GROUND_TYPE_INSIDE])('returns %s', (val) => {
      expect(toGroundType(val)).toBe(val);
    });
    test('returns undefined for invalid', () => {
      expect(toGroundType('INVALID')).toBeUndefined();
    });
  });

  describe('toMovementType', () => {
    test.each([MOVEMENT_TYPE_JUMP, MOVEMENT_TYPE_WALK])('returns %s', (val) => {
      expect(toMovementType(val)).toBe(val);
    });
    test('returns undefined for invalid', () => {
      expect(toMovementType('INVALID')).toBeUndefined();
    });
  });

  describe('toAttackType', () => {
    test.each([ATTACK_TYPE_NONE, ATTACK_TYPE_TOUCH, ATTACK_TYPE_ARC])('returns %s', (val) => {
      expect(toAttackType(val)).toBe(val);
    });
    test('returns undefined for invalid', () => {
      expect(toAttackType('INVALID')).toBeUndefined();
    });
  });
});

// ─── Factory Functions ─────────────────────────────────────────────────────────

describe('factory functions', () => {
  test('createCampSpawn', () => {
    expect(createCampSpawn()).toEqual({ position: { x: 0, y: 0 }, maxPopulation: 0 });
  });

  test('createCreatureShop', () => {
    const shop = createCreatureShop();
    expect(shop.prices).toEqual({});
    expect(shop.openTimes).toHaveLength(DAYS_IN_A_WEEK);
    expect(shop.closeTimes).toHaveLength(DAYS_IN_A_WEEK);
  });

  test('createCreatureSprites', () => {
    expect(createCreatureSprites()).toEqual({ width: 0, height: 0 });
  });

  test('createObjectSprites', () => {
    expect(createObjectSprites()).toEqual({ defaultSprite: 0, width: 0, height: 0 });
  });

  test('createObjectSprite', () => {
    expect(createObjectSprite()).toEqual({});
  });

  test('createObjectTypeStage', () => {
    expect(createObjectTypeStage()).toEqual({
      growthDays: 0,
      health: 0,
      threshold: 0,
      harvestable: false,
      autoWiggleCollidable: true,
      pause: false
    });
  });

  test('createQuestTask', () => {
    expect(createQuestTask()).toEqual({ id: 0, key: 'NEW_TASK', objectives: [{}] });
  });

  test('createQuestObjective', () => {
    expect(createQuestObjective()).toEqual({});
  });
});

// ─── Collider Converters ───────────────────────────────────────────────────────

describe('collider converters', () => {
  describe('toProcessedRawObjectCollider', () => {
    test('defaults all fields for null input', () => {
      const result = toProcessedRawObjectCollider(null);
      expect(result.isTrigger).toBe(false);
      expect(result.usedByComposite).toBe(false);
      expect(result.type).toBeUndefined();
      expect(result.size).toBeUndefined();
      expect(result.offset).toBeUndefined();
      expect(result.padding).toBe(0);
    });

    test('preserves valid values', () => {
      const result = toProcessedRawObjectCollider({
        isTrigger: true,
        usedByComposite: true,
        type: BOX_COLLIDER_TYPE,
        size: { x: 10, y: 20 },
        offset: { x: 1, y: 2 },
        padding: 5
      });
      expect(result.isTrigger).toBe(true);
      expect(result.type).toBe(BOX_COLLIDER_TYPE);
      expect(result.size).toEqual({ x: 10, y: 20 });
      expect(result.padding).toBe(5);
    });
  });

  describe('toObjectCollider', () => {
    test('converts type string to typed ColliderType', () => {
      const result = toObjectCollider({
        isTrigger: false,
        usedByComposite: false,
        type: BOX_COLLIDER_TYPE,
        padding: 0
      });
      expect(result.type).toBe(BOX_COLLIDER_TYPE);
    });

    test('leaves invalid type as undefined', () => {
      const result = toObjectCollider({
        isTrigger: false,
        usedByComposite: false,
        type: 'INVALID',
        padding: 0
      });
      expect(result.type).toBeUndefined();
    });
  });

  describe('toProcessedRawColliders', () => {
    test('maps array of raw colliders', () => {
      const result = toProcessedRawColliders([null, { isTrigger: true }]);
      expect(result).toHaveLength(2);
      expect(result[0].isTrigger).toBe(false);
      expect(result[1].isTrigger).toBe(true);
    });
  });

  describe('toColliders', () => {
    test('maps processed raw colliders to final colliders', () => {
      const result = toColliders([{ isTrigger: false, usedByComposite: false, type: POLYGON_COLLIDER_TYPE, padding: 0 }]);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(POLYGON_COLLIDER_TYPE);
    });
  });
});

// ─── Sprite Converters ─────────────────────────────────────────────────────────

describe('sprite converters', () => {
  describe('toProcessedRawSprite', () => {
    test('defaults fields for null input', () => {
      const result = toProcessedRawSprite(null);
      expect(result.pivotOffset).toBeUndefined();
      expect(result.spriteOffset).toEqual({ x: 0, y: 0 });
      expect(result.placementLayer).toBeUndefined();
      expect(result.colliders).toBeUndefined();
    });

    test('preserves and normalizes values', () => {
      const result = toProcessedRawSprite({
        pivotOffset: { x: 1, y: 2 },
        placementLayer: PLACEMENT_LAYER_ON_GROUND
      });
      expect(result.pivotOffset).toEqual({ x: 1, y: 2 });
      expect(result.placementLayer).toBe(PLACEMENT_LAYER_ON_GROUND);
    });
  });

  describe('toSprite', () => {
    test('converts placementLayer and colliders', () => {
      const result = toSprite({
        spriteOffset: { x: 0, y: 0 },
        placementLayer: PLACEMENT_LAYER_IN_AIR,
        colliders: [{ isTrigger: false, usedByComposite: false, type: BOX_COLLIDER_TYPE, padding: 0 }]
      });
      expect(result.placementLayer).toBe(PLACEMENT_LAYER_IN_AIR);
      expect(result.colliders).toHaveLength(1);
    });
  });

  describe('toProcessedRawSprites', () => {
    test('returns undefined for null', () => {
      expect(toProcessedRawSprites(null)).toBeUndefined();
    });

    test('maps record of sprites', () => {
      const result = toProcessedRawSprites({ front: { pivotOffset: { x: 1, y: 2 } }, back: null });
      expect(result).toBeDefined();
      expect(result!['front'].pivotOffset).toEqual({ x: 1, y: 2 });
      expect(result!['back'].spriteOffset).toEqual({ x: 0, y: 0 });
    });
  });

  describe('toSprites', () => {
    test('returns undefined for undefined', () => {
      expect(toSprites(undefined)).toBeUndefined();
    });

    test('converts sprite map', () => {
      const result = toSprites({
        main: { spriteOffset: { x: 0, y: 0 }, placementLayer: PLACEMENT_LAYER_ON_GROUND }
      });
      expect(result).toBeDefined();
      expect(result!['main'].placementLayer).toBe(PLACEMENT_LAYER_ON_GROUND);
    });
  });

  describe('toProcessedRawCategorySprite', () => {
    test('returns empty sprites for null', () => {
      const result = toProcessedRawCategorySprite(null);
      expect(result.sprites).toBeUndefined();
    });
  });

  describe('toCategorySprite', () => {
    test('returns undefined for undefined input', () => {
      expect(toCategorySprite(undefined)).toBeUndefined();
    });

    test('converts category sprite', () => {
      const result = toCategorySprite({ sprites: { main: { spriteOffset: { x: 0, y: 0 } } } });
      expect(result).toBeDefined();
      expect(result!.sprites).toBeDefined();
    });
  });

  describe('toProcessedRawSpriteColliders', () => {
    test('returns empty object for null', () => {
      expect(toProcessedRawSpriteColliders(null)).toEqual({});
    });

    test('normalizes sprite collider map', () => {
      const result = toProcessedRawSpriteColliders({
        sprite1: [{ isTrigger: true }]
      });
      expect(result['sprite1']).toHaveLength(1);
      expect(result['sprite1'][0].isTrigger).toBe(true);
    });
  });

  describe('toSpriteColliders', () => {
    test('returns empty object for null', () => {
      expect(toSpriteColliders(null)).toEqual({});
    });

    test('converts sprite collider map', () => {
      const result = toSpriteColliders({
        sprite1: [{ isTrigger: false, usedByComposite: false, type: BOX_COLLIDER_TYPE, padding: 0 }]
      });
      expect(result['sprite1']).toHaveLength(1);
      expect(result['sprite1'][0].type).toBe(BOX_COLLIDER_TYPE);
    });
  });
});

// ─── Sprite Rule Converters ────────────────────────────────────────────────────

describe('sprite rule converters', () => {
  describe('toProcessedRawObjectSpriteRules', () => {
    test('defaults for null input', () => {
      const result = toProcessedRawObjectSpriteRules(null);
      expect(result.rules).toBeUndefined();
      expect(result.defaultSprite).toBe(0);
    });
  });

  describe('toObjectSpriteRules', () => {
    test('converts rules', () => {
      const result = toObjectSpriteRules({
        defaultSprite: 2,
        rules: [{ sprites: [1, 2], conditions: { [SPRITE_RULE_DIRECTION_UP]: true } }]
      });
      expect(result.defaultSprite).toBe(2);
      expect(result.rules).toHaveLength(1);
    });
  });

  describe('toProcessedRawObjectSpriteRule', () => {
    test('defaults for null', () => {
      const result = toProcessedRawObjectSpriteRule(null);
      expect(result.sprites).toBeUndefined();
      expect(result.conditions).toBeUndefined();
    });
  });

  describe('toObjectSpriteRule', () => {
    test('converts condition keys to typed positions', () => {
      const result = toObjectSpriteRule({
        sprites: [0],
        conditions: { [SPRITE_RULE_DIRECTION_UP]: true, INVALID: false }
      });
      expect(result.conditions).toBeDefined();
      expect(result.conditions![SPRITE_RULE_DIRECTION_UP]).toBe(true);
      // Invalid key should be dropped
      expect(Object.keys(result.conditions!)).not.toContain('INVALID');
    });
  });
});

// ─── Creature Converters ───────────────────────────────────────────────────────

describe('creature converters', () => {
  describe('toProcessedRawCreatureSettings', () => {
    test('returns empty object for null', () => {
      expect(toProcessedRawCreatureSettings(null)).toEqual({});
    });

    test('normalizes settings', () => {
      const result = toProcessedRawCreatureSettings({
        hasHealth: true,
        movementType: MOVEMENT_TYPE_WALK,
        attackType: ATTACK_TYPE_TOUCH
      });
      expect(result.hasHealth).toBe(true);
      expect(result.movementType).toBe(MOVEMENT_TYPE_WALK);
    });
  });

  describe('toCreatureSettings', () => {
    test('returns undefined for falsy input', () => {
      expect(toCreatureSettings(undefined)).toBeUndefined();
    });

    test('converts movement and attack types', () => {
      const result = toCreatureSettings({
        hasHealth: true,
        movementType: MOVEMENT_TYPE_JUMP,
        attackType: ATTACK_TYPE_ARC
      });
      expect(result!.movementType).toBe(MOVEMENT_TYPE_JUMP);
      expect(result!.attackType).toBe(ATTACK_TYPE_ARC);
    });
  });

  describe('toProcessedRawCreatureShop', () => {
    test('returns undefined for null', () => {
      expect(toProcessedRawCreatureShop(null)).toBeUndefined();
    });

    test('normalizes shop data', () => {
      const result = toProcessedRawCreatureShop({
        prices: { SPRING: { ITEM_A: 10 } },
        openTimes: [8, 8, 8, 8, 8, 8, 8],
        closeTimes: [20, 20, 20, 20, 20, 20, 20]
      });
      expect(result).toBeDefined();
      expect(result!.prices).toEqual({ SPRING: { ITEM_A: 10 } });
      expect(result!.openTimes).toHaveLength(7);
    });
  });

  describe('toCreatureShop', () => {
    test('returns undefined for undefined', () => {
      expect(toCreatureShop(undefined)).toBeUndefined();
    });

    test('passes through processed shop', () => {
      const shop = {
        prices: {},
        openTimes: [8, 8, 8, 8, 8, 8, 8],
        closeTimes: [20, 20, 20, 20, 20, 20, 20]
      };
      expect(toCreatureShop(shop)).toEqual(shop);
    });
  });

  describe('toProcessedRawCampSpawn', () => {
    test('defaults for null', () => {
      const result = toProcessedRawCampSpawn(null);
      expect(result.position).toEqual({ x: 0, y: 0 });
      expect(result.maxPopulation).toBe(0);
    });

    test('preserves values', () => {
      const result = toProcessedRawCampSpawn({ position: { x: 5, y: 10 }, maxPopulation: 3 });
      expect(result.position).toEqual({ x: 5, y: 10 });
      expect(result.maxPopulation).toBe(3);
    });
  });

  describe('toCampSpawn', () => {
    test('spreads processed raw', () => {
      const input = { position: { x: 1, y: 2 }, maxPopulation: 5 };
      expect(toCampSpawn(input)).toEqual(input);
    });
  });

  describe('toProcessedRawCreatureSprites', () => {
    test('defaults for null', () => {
      const result = toProcessedRawCreatureSprites(null);
      expect(result.width).toBe(0);
      expect(result.height).toBe(0);
      expect(result.pivotOffset).toBeUndefined();
    });

    test('normalizes pivot offset', () => {
      const result = toProcessedRawCreatureSprites({ width: 32, height: 32, pivotOffset: { x: 1 } });
      expect(result.pivotOffset).toEqual({ x: 1, y: 0 });
    });
  });

  describe('toCreatureSprites', () => {
    test('converts sprite maps', () => {
      const result = toCreatureSprites({
        width: 16,
        height: 16,
        sprites: { walk: { spriteOffset: { x: 0, y: 0 } } }
      });
      expect(result.width).toBe(16);
      expect(result.sprites).toBeDefined();
    });
  });

  describe('toProcessedRawCreatureCategory', () => {
    test('normalizes null fields', () => {
      const result = toProcessedRawCreatureCategory(null);
      expect(result.key).toBeUndefined();
      expect(result.settings).toEqual({});
    });

    test('preserves valid key', () => {
      const result = toProcessedRawCreatureCategory({ key: 'ANIMAL' });
      expect(result.key).toBe('ANIMAL');
    });
  });

  describe('toCreatureCategory', () => {
    test('generates default key when missing', () => {
      const result = toCreatureCategory({ settings: {} });
      expect(result.key).toBe('UNKNOWN_CREATURE_CATEGORY');
    });

    test('uses index for key generation', () => {
      const result = toCreatureCategory({ settings: {} }, 5);
      expect(result.key).toBe('CREATURE_CATEGORY_5');
    });

    test('preserves existing key', () => {
      const result = toCreatureCategory({ key: 'ANIMAL', settings: {} });
      expect(result.key).toBe('ANIMAL');
    });
  });

  describe('toProcessedRawCreatureType', () => {
    test('defaults all fields for null', () => {
      const result = toProcessedRawCreatureType(null);
      expect(result.id).toBe(0);
      expect(result.key).toBeUndefined();
      expect(result.health).toBe(0);
      expect(result.walkSpeed).toBe(0);
      expect(result.runSpeed).toBe(0);
      expect(result.wanderBehaviorEnabled).toBe(false);
      expect(result.dangerBehaviorEnabled).toBe(false);
      expect(result.attackBehaviorEnabled).toBe(false);
      expect(result.randomSpawnsEnabled).toBe(false);
      expect(result.campSpawns).toEqual([]);
    });

    test('preserves provided values', () => {
      const result = toProcessedRawCreatureType({
        id: 1,
        key: 'WOLF',
        health: 50,
        walkSpeed: 2
      });
      expect(result.id).toBe(1);
      expect(result.key).toBe('WOLF');
      expect(result.health).toBe(50);
      expect(result.walkSpeed).toBe(2);
    });
  });

  describe('toCreatureType', () => {
    test('generates default key when missing', () => {
      const processed = toProcessedRawCreatureType({ id: 1 });
      const result = toCreatureType(processed);
      expect(result.key).toBe('UNKNOWN_CREATURE');
    });

    test('uses index for key generation', () => {
      const processed = toProcessedRawCreatureType({ id: 1 });
      const result = toCreatureType(processed, 3);
      expect(result.key).toBe('CREATURE_3');
    });

    test('preserves existing key', () => {
      const processed = toProcessedRawCreatureType({ id: 1, key: 'WOLF' });
      const result = toCreatureType(processed);
      expect(result.key).toBe('WOLF');
    });
  });
});

// ─── Item Converters ───────────────────────────────────────────────────────────

describe('item converters', () => {
  describe('toProcessedRawItemSettings', () => {
    test('normalizes null settings', () => {
      const result = toProcessedRawItemSettings(null);
      expect(result.placeable).toBeUndefined();
      expect(result.weaponType).toBeUndefined();
    });

    test('preserves settings', () => {
      const result = toProcessedRawItemSettings({ weaponType: WEAPON_TYPE_ARC, placeable: true });
      expect(result.weaponType).toBe(WEAPON_TYPE_ARC);
      expect(result.placeable).toBe(true);
    });
  });

  describe('toItemSettings', () => {
    test('returns undefined for undefined', () => {
      expect(toItemSettings(undefined)).toBeUndefined();
    });

    test('converts enum fields', () => {
      const result = toItemSettings({
        weaponType: WEAPON_TYPE_POINT,
        filledFromType: FILLED_FROM_TYPE_WATER,
        fishingItemType: FISHING_ITEM_TYPE_POLE
      });
      expect(result!.weaponType).toBe(WEAPON_TYPE_POINT);
      expect(result!.filledFromType).toBe(FILLED_FROM_TYPE_WATER);
      expect(result!.fishingItemType).toBe(FISHING_ITEM_TYPE_POLE);
    });
  });

  describe('toProcessedRawItemCategory', () => {
    test('normalizes null', () => {
      const result = toProcessedRawItemCategory(null);
      expect(result.key).toBeUndefined();
    });
  });

  describe('toItemCategory', () => {
    test('generates default key', () => {
      const result = toItemCategory({ settings: {} });
      expect(result.key).toBe('UNKNOWN_ITEM_CATEGORY');
    });

    test('uses index', () => {
      const result = toItemCategory({ settings: {} }, 2);
      expect(result.key).toBe('ITEM_CATEGORY_2');
    });
  });

  describe('toProcessedRawItemType', () => {
    test('defaults all fields for null', () => {
      const result = toProcessedRawItemType(null);
      expect(result.id).toBe(0);
      expect(result.key).toBeUndefined();
      expect(result.maxStackSize).toBe(0);
      expect(result.creatureDamage).toBe(0);
      expect(result.objectDamage).toBe(0);
      expect(result.sellPrice).toBe(0);
      expect(result.fishExperience).toBe(0);
    });
  });

  describe('toItemType', () => {
    test('generates default key', () => {
      const processed = toProcessedRawItemType({});
      const result = toItemType(processed);
      expect(result.key).toBe('UNKNOWN_ITEM');
    });

    test('uses index', () => {
      const processed = toProcessedRawItemType({});
      const result = toItemType(processed, 7);
      expect(result.key).toBe('ITEM_7');
    });
  });
});

// ─── Object Converters ─────────────────────────────────────────────────────────

describe('object converters', () => {
  describe('toProcessedRawObjectSettings', () => {
    test('returns empty object for null', () => {
      expect(toProcessedRawObjectSettings(null)).toEqual({});
    });

    test('normalizes settings fields', () => {
      const result = toProcessedRawObjectSettings({
        hasHealth: true,
        stagesType: STAGES_TYPE_GROWABLE,
        placementPosition: PLACEMENT_POSITION_CENTER
      });
      expect(result.hasHealth).toBe(true);
      expect(result.stagesType).toBe(STAGES_TYPE_GROWABLE);
    });
  });

  describe('toObjectSettings', () => {
    test('returns undefined for falsy input', () => {
      expect(toObjectSettings(undefined)).toBeUndefined();
    });

    test('converts enum fields', () => {
      const result = toObjectSettings({
        lootType: LOOT_TYPE_DROP,
        stagesType: STAGES_TYPE_BREAKABLE,
        placementPosition: PLACEMENT_POSITION_EDGE,
        placementLayer: PLACEMENT_LAYER_ON_GROUND,
        spawningConditions: [FARMLAND_CONDITION, 'INVALID'],
        inventoryType: INVENTORY_TYPE_SMALL
      });
      expect(result!.lootType).toBe(LOOT_TYPE_DROP);
      expect(result!.stagesType).toBe(STAGES_TYPE_BREAKABLE);
      expect(result!.placementPosition).toBe(PLACEMENT_POSITION_EDGE);
      expect(result!.placementLayer).toBe(PLACEMENT_LAYER_ON_GROUND);
      expect(result!.spawningConditions).toEqual([FARMLAND_CONDITION]);
      expect(result!.inventoryType).toBe(INVENTORY_TYPE_SMALL);
    });
  });

  describe('toProcessedRawObjectSprites', () => {
    test('defaults for null', () => {
      const result = toProcessedRawObjectSprites(null);
      expect(result.defaultSprite).toBe(0);
      expect(result.width).toBe(0);
      expect(result.height).toBe(0);
    });
  });

  describe('toObjectSprites', () => {
    test('converts sprite map', () => {
      const result = toObjectSprites({
        defaultSprite: 1,
        width: 16,
        height: 16,
        sprites: { main: { spriteOffset: { x: 0, y: 0 } } }
      });
      expect(result.defaultSprite).toBe(1);
      expect(result.sprites).toBeDefined();
    });
  });

  describe('toProcessedRawObjectCategory', () => {
    test('normalizes null', () => {
      const result = toProcessedRawObjectCategory(null);
      expect(result.key).toBeUndefined();
    });
  });

  describe('toObjectCategory', () => {
    test('generates default key', () => {
      const processed = toProcessedRawObjectCategory({});
      const result = toObjectCategory(processed);
      expect(result.key).toBe('UNKNOWN_OBJECT_CATEGORY');
    });

    test('uses index', () => {
      const processed = toProcessedRawObjectCategory({});
      const result = toObjectCategory(processed, 4);
      expect(result.key).toBe('OBJECT_CATEGORY_4');
    });
  });

  describe('toProcessedRawObjectSubCategory', () => {
    test('normalizes null', () => {
      const result = toProcessedRawObjectSubCategory(null);
      expect(result.key).toBeUndefined();
    });
  });

  describe('toObjectSubCategory', () => {
    test('generates default key', () => {
      const processed = toProcessedRawObjectSubCategory({});
      const result = toObjectSubCategory(processed);
      expect(result.key).toBe('UNKNOWN_OBJECT_SUB_CATEGORY');
    });
  });

  describe('toProcessedRawObjectType', () => {
    test('defaults all fields for null', () => {
      const result = toProcessedRawObjectType(null);
      expect(result.id).toBe(0);
      expect(result.key).toBeUndefined();
      expect(result.health).toBe(0);
      expect(result.worldSize).toEqual({ x: 1, y: 1 });
      expect(result.experience).toBe(0);
    });
  });

  describe('toObjectType', () => {
    test('generates default key', () => {
      const processed = toProcessedRawObjectType({});
      const result = toObjectType(processed);
      expect(result.key).toBe('UNKNOWN_OBJECT');
    });

    test('converts season string', () => {
      const processed = toProcessedRawObjectType({ season: SPRING });
      const result = toObjectType(processed);
      expect(result.season).toBe(SPRING);
    });
  });

  describe('toProcessedRawObjectTypeStage', () => {
    test('defaults for null', () => {
      const result = toProcessedRawObjectTypeStage(null);
      expect(result.growthDays).toBe(0);
      expect(result.health).toBe(0);
      expect(result.threshold).toBe(0);
      expect(result.harvestable).toBe(false);
      expect(result.autoWiggleCollidable).toBe(true);
      expect(result.pause).toBe(false);
    });
  });

  describe('toObjectTypeStage', () => {
    test('converts jumpCondition', () => {
      const processed = toProcessedRawObjectTypeStage({ jumpCondition: STAGE_JUMP_CONDITION_TIME });
      const result = toObjectTypeStage(processed);
      expect(result.jumpCondition).toBe(STAGE_JUMP_CONDITION_TIME);
    });
  });
});

// ─── Loot Table Converters ─────────────────────────────────────────────────────

describe('loot table converters', () => {
  describe('toProcessedRawLootTable', () => {
    test('defaults for null', () => {
      const result = toProcessedRawLootTable(null);
      expect(result.defaultGroup.probability).toBe(0);
      expect(result.defaultGroup.components).toEqual([]);
      expect(result.groups).toEqual([]);
    });

    test('normalizes groups', () => {
      const result = toProcessedRawLootTable({
        key: 'TEST_TABLE',
        defaultGroup: { probability: 100, components: [{ typeKey: 'ITEM_A', min: 1, max: 3, probability: 50 }] },
        groups: [{ probability: 50, components: [] }]
      });
      expect(result.key).toBe('TEST_TABLE');
      expect(result.defaultGroup.probability).toBe(100);
      expect(result.defaultGroup.components).toHaveLength(1);
      expect(result.groups).toHaveLength(1);
    });
  });

  describe('toLootTable', () => {
    test('generates default key', () => {
      const processed = toProcessedRawLootTable(null);
      const result = toLootTable(processed);
      expect(result.key).toBe('UNKNOWN_LOOT_TABLE');
    });

    test('uses index for key', () => {
      const processed = toProcessedRawLootTable(null);
      const result = toLootTable(processed, 5);
      expect(result.key).toBe('LOOT_TABLE_5');
    });
  });

  describe('toProcessedRawLootTableComponentGroup', () => {
    test('defaults for null', () => {
      const result = toProcessedRawLootTableComponentGroup(null);
      expect(result.probability).toBe(0);
      expect(result.components).toEqual([]);
    });
  });

  describe('toLootTableComponentGroup', () => {
    test('converts components', () => {
      const result = toLootTableComponentGroup({
        probability: 100,
        components: [{ min: 1, max: 2, probability: 50 }]
      });
      expect(result.components).toHaveLength(1);
    });
  });

  describe('toProcessedRawLootTableComponent', () => {
    test('defaults for null', () => {
      const result = toProcessedRawLootTableComponent(null);
      expect(result.min).toBe(0);
      expect(result.max).toBe(0);
      expect(result.probability).toBe(0);
    });

    test('preserves values', () => {
      const result = toProcessedRawLootTableComponent({ typeKey: 'ITEM_A', min: 1, max: 5, probability: 75 });
      expect(result.typeKey).toBe('ITEM_A');
      expect(result.min).toBe(1);
      expect(result.max).toBe(5);
    });
  });

  describe('toLootTableComponent', () => {
    test('spreads processed raw', () => {
      const input = { min: 1, max: 2, probability: 50, typeKey: 'X' };
      expect(toLootTableComponent(input)).toEqual(input);
    });
  });
});

// ─── Crafting Recipe Converters ────────────────────────────────────────────────

describe('crafting recipe converters', () => {
  describe('toProcessedRawCraftingRecipeCategory', () => {
    test('normalizes null', () => {
      const result = toProcessedRawCraftingRecipeCategory(null);
      expect(result.key).toBeUndefined();
    });
  });

  describe('toCraftingRecipeCategory', () => {
    test('generates default key', () => {
      const result = toCraftingRecipeCategory({});
      expect(result.key).toBe('UNKNOWN_CRAFTING_RECIPE_CATEGORY');
    });

    test('uses index', () => {
      const result = toCraftingRecipeCategory({}, 3);
      expect(result.key).toBe('CRAFTING_RECIPE_CATEGORY_3');
    });
  });

  describe('toProcessedRawCraftingRecipe', () => {
    test('defaults fields', () => {
      const result = toProcessedRawCraftingRecipe(null);
      expect(result.key).toBeUndefined();
      expect(result.amount).toBe(0);
      expect(result.craftingTime).toBe(0);
    });

    test('normalizes ingredients and search categories', () => {
      const result = toProcessedRawCraftingRecipe({
        key: 'RECIPE_1',
        ingredients: { ITEM_A: 2, ITEM_B: 3 },
        searchCategories: ['FOOD', 'TOOLS']
      });
      expect(result.ingredients).toEqual({ ITEM_A: 2, ITEM_B: 3 });
      expect(result.searchCategories).toEqual(['FOOD', 'TOOLS']);
    });
  });

  describe('toCraftingRecipe', () => {
    test('generates default key', () => {
      const processed = toProcessedRawCraftingRecipe(null);
      const result = toCraftingRecipe(processed);
      expect(result.key).toBe('UNKNOWN_CRAFTING_RECIPE');
    });
  });
});

// ─── Dialogue Converters ───────────────────────────────────────────────────────

describe('dialogue converters', () => {
  describe('toProcessedRawDialogueTree', () => {
    test('defaults for null', () => {
      const result = toProcessedRawDialogueTree(null);
      expect(result.id).toBe(0);
      expect(result.key).toBeUndefined();
      expect(result.dialogues).toEqual([]);
      expect(result.priority).toBe(0);
      expect(result.runOnlyOnce).toBe(false);
    });
  });

  describe('toDialogueTree', () => {
    test('generates key from id when missing', () => {
      const processed = toProcessedRawDialogueTree({ id: 5 });
      const result = toDialogueTree(processed);
      expect(result.key).toBe('DIALOG_TREE_5');
    });

    test('uses fallback key when no id', () => {
      const processed = toProcessedRawDialogueTree(null);
      const result = toDialogueTree(processed);
      expect(result.key).toBe('UNKNOWN_DIALOG_TREE');
    });
  });

  describe('toProcessedRawDialogueConditions', () => {
    test('returns undefined for null', () => {
      expect(toProcessedRawDialogueConditions(null)).toBeUndefined();
    });

    test('normalizes conditions', () => {
      const result = toProcessedRawDialogueConditions({
        days: [1, 2],
        times: [600, 1200],
        timesComparator: TIME_COMPARATOR_BETWEEN
      });
      expect(result!.days).toEqual([1, 2]);
      expect(result!.timesComparator).toBe(TIME_COMPARATOR_BETWEEN);
    });
  });

  describe('toDialogueConditions', () => {
    test('returns undefined for undefined', () => {
      expect(toDialogueConditions(undefined)).toBeUndefined();
    });

    test('converts timesComparator', () => {
      const result = toDialogueConditions({ timesComparator: TIME_COMPARATOR_AFTER });
      expect(result!.timesComparator).toBe(TIME_COMPARATOR_AFTER);
    });
  });

  describe('toProcessedRawDialogue', () => {
    test('defaults for null', () => {
      const result = toProcessedRawDialogue(null);
      expect(result.id).toBe(0);
      expect(result.key).toBeUndefined();
      expect(result.responses).toEqual([]);
    });
  });

  describe('toDialogue', () => {
    test('generates key from id', () => {
      const processed = toProcessedRawDialogue({ id: 3 });
      const result = toDialogue(processed);
      expect(result.key).toBe('DIALOG_3');
    });
  });

  describe('toProcessedRawDialogueResponse', () => {
    test('defaults for null', () => {
      const result = toProcessedRawDialogueResponse(null);
      expect(result.id).toBe(0);
      expect(result.key).toBeUndefined();
    });
  });

  describe('toDialogueResponse', () => {
    test('generates key from id', () => {
      const result = toDialogueResponse({ id: 7, key: undefined, nextDialogId: undefined });
      expect(result.key).toBe('DIALOG_RESPONSE_7');
    });
  });
});

// ─── Player Data Converters ────────────────────────────────────────────────────

describe('player data converters', () => {
  describe('toProcessedRawPlayerData', () => {
    test('defaults all stats to 0', () => {
      const result = toProcessedRawPlayerData(null);
      expect(result.health).toBe(0);
      expect(result.healthMax).toBe(0);
      expect(result.hunger).toBe(0);
      expect(result.hungerMax).toBe(0);
      expect(result.thirst).toBe(0);
      expect(result.thirstMax).toBe(0);
      expect(result.energy).toBe(0);
      expect(result.energyMax).toBe(0);
      expect(result.money).toBe(0);
      expect(result.startingItems).toEqual({});
      expect(result.nextLevelExp).toEqual([]);
      expect(result.damageImmunityTime).toBe(0);
    });

    test('preserves provided values', () => {
      const result = toProcessedRawPlayerData({
        health: 100,
        healthMax: 100,
        money: 500,
        startingItems: { SWORD: 1 },
        nextLevelExp: [100, 200, 400]
      });
      expect(result.health).toBe(100);
      expect(result.money).toBe(500);
      expect(result.startingItems).toEqual({ SWORD: 1 });
      expect(result.nextLevelExp).toEqual([100, 200, 400]);
    });
  });

  describe('toPlayerData', () => {
    test('spreads processed raw', () => {
      const input = toProcessedRawPlayerData({ health: 50 });
      const result = toPlayerData(input);
      expect(result.health).toBe(50);
    });
  });
});

// ─── Event Log Converters ──────────────────────────────────────────────────────

describe('event log converters', () => {
  describe('toProcessedRawEventLog', () => {
    test('defaults for null', () => {
      const result = toProcessedRawEventLog(null);
      expect(result.id).toBe(0);
      expect(result.key).toBe('UNKNOWN_EVENT_LOG');
    });

    test('preserves values', () => {
      const result = toProcessedRawEventLog({ id: 3, key: 'QUEST_COMPLETE' });
      expect(result.id).toBe(3);
      expect(result.key).toBe('QUEST_COMPLETE');
    });
  });

  describe('toEventLog', () => {
    test('spreads processed raw', () => {
      const input = toProcessedRawEventLog({ id: 1, key: 'EVT' });
      expect(toEventLog(input)).toEqual(input);
    });
  });
});

// ─── World Settings Converters ─────────────────────────────────────────────────

describe('world settings converters', () => {
  describe('toProcessedRawWeatherSettings', () => {
    test('defaults for null', () => {
      const result = toProcessedRawWeatherSettings(null);
      expect(result.rainChance).toBe(0);
      expect(result.snowChance).toBe(0);
    });
  });

  describe('toWeatherSettings', () => {
    test('spreads processed raw', () => {
      const input = { rainChance: 30, snowChance: 10 };
      expect(toWeatherSettings(input)).toEqual(input);
    });
  });

  describe('toProcessedRawWorldSettings', () => {
    test('normalizes weather', () => {
      const result = toProcessedRawWorldSettings(null);
      expect(result.weather.rainChance).toBe(0);
      expect(result.weather.snowChance).toBe(0);
    });
  });

  describe('toWorldSettings', () => {
    test('converts weather sub-object', () => {
      const processed = toProcessedRawWorldSettings({ weather: { rainChance: 50, snowChance: 20 } });
      const result = toWorldSettings(processed);
      expect(result.weather.rainChance).toBe(50);
    });
  });
});

// ─── World Zone Converters ─────────────────────────────────────────────────────

describe('world zone converters', () => {
  describe('toProcessedRawWorldZoneSpawn', () => {
    test('defaults for null', () => {
      const result = toProcessedRawWorldZoneSpawn(null);
      expect(result.creatureKey).toBeUndefined();
      expect(result.probability).toBe(0);
      expect(result.limit).toBe(0);
    });
  });

  describe('toWorldZoneSpawn', () => {
    test('spreads processed raw', () => {
      const input = { creatureKey: 'WOLF', probability: 50, limit: 3 };
      const result = toWorldZoneSpawn(input);
      expect(result).toEqual(input);
    });
  });

  describe('toProcessedRawWorldZone', () => {
    test('defaults for null', () => {
      const result = toProcessedRawWorldZone(null);
      expect(result.id).toBe(0);
      expect(result.key).toBe('UNKNOWN_WORLD_ZONE');
      expect(result.spawns).toEqual([]);
    });
  });

  describe('toWorldZone', () => {
    test('converts spawns', () => {
      const processed = toProcessedRawWorldZone({
        id: 1,
        key: 'FOREST',
        spawns: [{ creatureKey: 'WOLF', probability: 50, limit: 5 }]
      });
      const result = toWorldZone(processed);
      expect(result.spawns).toHaveLength(1);
      expect(result.spawns[0].creatureKey).toBe('WOLF');
    });
  });
});

// ─── Fishing Zone Converters ───────────────────────────────────────────────────

describe('fishing zone converters', () => {
  describe('toProcessedRawFishingZone', () => {
    test('defaults for null', () => {
      const result = toProcessedRawFishingZone(null);
      expect(result.id).toBe(0);
      expect(result.key).toBe('UNKNOWN_FISHING_ZONE');
      expect(result.lootTableKey).toBe('');
    });
  });

  describe('toFishingZone', () => {
    test('spreads processed raw', () => {
      const input = toProcessedRawFishingZone({ id: 1, key: 'POND', lootTableKey: 'FISH_TABLE' });
      expect(toFishingZone(input).key).toBe('POND');
    });
  });
});

// ─── Skill Converters ──────────────────────────────────────────────────────────

describe('skill converters', () => {
  describe('toProcessedRawSkillLevel', () => {
    test('defaults all buff fields to 0', () => {
      const result = toProcessedRawSkillLevel(null);
      expect(result.key).toBeUndefined();
      expect(result.damageIncrease).toBe(0);
      expect(result.healthRegenIncrease).toBe(0);
      expect(result.energyRegenIncrease).toBe(0);
      expect(result.energyUseDescrease).toBe(0);
      expect(result.craftingSpeedIncrease).toBe(0);
      expect(result.monsterLootIncrease).toBe(0);
      expect(result.damageReduction).toBe(0);
      expect(result.doubleCropChance).toBe(0);
      expect(result.fishSizeChanceIncrease).toBe(0);
      expect(result.fishBiteSpeedIncrease).toBe(0);
      expect(result.sellPriceIncrease).toBe(0);
      expect(result.buyDiscount).toBe(0);
    });
  });

  describe('toSkillLevel', () => {
    test('generates default key', () => {
      const processed = toProcessedRawSkillLevel(null);
      const result = toSkillLevel(processed);
      expect(result.key).toBe('UNKNOWN_SKILL_LEVEL');
    });
  });

  describe('toProcessedRawSkill', () => {
    test('defaults for null', () => {
      const result = toProcessedRawSkill(null);
      expect(result.id).toBeUndefined();
      expect(result.key).toBeUndefined();
      expect(result.levels).toEqual([]);
    });
  });

  describe('toSkill', () => {
    test('defaults id and key', () => {
      const processed = toProcessedRawSkill(null);
      const result = toSkill(processed);
      expect(result.id).toBe(0);
      expect(result.key).toBe('UNKNOWN_SKILL');
    });

    test('converts levels', () => {
      const processed = toProcessedRawSkill({
        id: 1,
        key: 'FARMING',
        levels: [{ key: 'LEVEL_1', damageIncrease: 5 }]
      });
      const result = toSkill(processed);
      expect(result.levels).toHaveLength(1);
      expect(result.levels[0].key).toBe('LEVEL_1');
    });
  });
});

// ─── Localization Converters ───────────────────────────────────────────────────

describe('localization converters', () => {
  describe('toProcessedRawLocalization', () => {
    test('defaults for null', () => {
      const result = toProcessedRawLocalization(null);
      expect(result.key).toBe('');
      expect(result.name).toBe('');
      expect(result.values).toEqual({});
    });
  });

  describe('toLocalization', () => {
    test('spreads processed raw', () => {
      const input = { key: 'en', name: 'English', values: { HELLO: 'Hello' } };
      expect(toLocalization(input)).toEqual(input);
    });
  });

  describe('toProcessedRawLocalizationFile', () => {
    test('normalizes keys and localizations', () => {
      const result = toProcessedRawLocalizationFile({
        keys: ['KEY_A', 'KEY_B'],
        localizations: [{ key: 'en', name: 'English', values: { KEY_A: 'A' } }]
      });
      expect(result.keys).toEqual(['KEY_A', 'KEY_B']);
      expect(result.localizations).toHaveLength(1);
    });
  });

  describe('toLocalizationFile', () => {
    test('converts localizations array', () => {
      const processed = toProcessedRawLocalizationFile({
        keys: [],
        localizations: [{ key: 'en', name: 'English', values: {} }]
      });
      const result = toLocalizationFile(processed);
      expect(result.localizations).toHaveLength(1);
    });
  });
});

// ─── Quest Converters ──────────────────────────────────────────────────────────

describe('quest converters', () => {
  describe('toProcessedRawQuestObjective', () => {
    test('defaults for null', () => {
      const result = toProcessedRawQuestObjective(null);
      expect(result.objectiveType).toBeUndefined();
      expect(result.itemTypeKey).toBeUndefined();
      expect(result.itemAmount).toBeUndefined();
    });
  });

  describe('toQuestObjective', () => {
    test('converts objectiveType', () => {
      const processed = toProcessedRawQuestObjective({ objectiveType: QUEST_OBJECTIVE_TYPE_GATHER });
      const result = toQuestObjective(processed);
      expect(result.objectiveType).toBe(QUEST_OBJECTIVE_TYPE_GATHER);
    });
  });

  describe('toProcessedRawQuestTask', () => {
    test('defaults for null', () => {
      const result = toProcessedRawQuestTask(null);
      expect(result.id).toBeUndefined();
      expect(result.key).toBeUndefined();
      expect(result.objectives).toEqual([]);
    });
  });

  describe('toQuestTask', () => {
    test('defaults id and key', () => {
      const processed = toProcessedRawQuestTask(null);
      const result = toQuestTask(processed);
      expect(result.id).toBe(0);
      expect(result.key).toBe('');
    });
  });

  describe('toProcessedRawQuest', () => {
    test('defaults for null', () => {
      const result = toProcessedRawQuest(null);
      expect(result.id).toBeUndefined();
      expect(result.key).toBeUndefined();
      expect(result.tasks).toEqual([]);
      expect(result.prerequisiteEventKeys).toEqual([]);
      expect(result.experienceReward).toBe(0);
      expect(result.itemRewards).toEqual({});
    });
  });

  describe('toQuest', () => {
    test('defaults id and key', () => {
      const processed = toProcessedRawQuest(null);
      const result = toQuest(processed);
      expect(result.id).toBe(0);
      expect(result.key).toBe('');
    });

    test('converts source and completionTrigger', () => {
      const processed = toProcessedRawQuest({
        tasks: [],
        source: QUEST_SOURCE_CREATURE,
        completionTrigger: QUEST_COMPLETION_TRIGGER_TALK_TO_CREATURE
      });
      const result = toQuest(processed);
      expect(result.source).toBe(QUEST_SOURCE_CREATURE);
      expect(result.completionTrigger).toBe(QUEST_COMPLETION_TRIGGER_TALK_TO_CREATURE);
    });
  });
});

// ─── Master Dispatcher ─────────────────────────────────────────────────────────

describe('toDataObject', () => {
  test('dispatches creature', () => {
    const processed = toProcessedRawCreatureType({ id: 1, key: 'TEST' });
    const result = toDataObject('creature', undefined, processed);
    expect(result).toBeDefined();
  });

  test('dispatches creature-category', () => {
    const processed = toProcessedRawCreatureCategory({ key: 'CAT' });
    const result = toDataObject('creature-category', undefined, processed);
    expect(result).toBeDefined();
  });

  test('dispatches item', () => {
    const processed = toProcessedRawItemType({ id: 1 });
    const result = toDataObject('item', undefined, processed);
    expect(result).toBeDefined();
  });

  test('dispatches item-category', () => {
    const processed = toProcessedRawItemCategory({ key: 'WEAPON' });
    const result = toDataObject('item-category', undefined, processed);
    expect(result).toBeDefined();
  });

  test('dispatches object-category', () => {
    const processed = toProcessedRawObjectCategory({});
    const result = toDataObject('object-category', undefined, processed);
    expect(result).toBeDefined();
  });

  test('dispatches object-sub-category', () => {
    const processed = toProcessedRawObjectSubCategory({});
    const result = toDataObject('object-sub-category', undefined, processed);
    expect(result).toBeDefined();
  });

  test('dispatches loot-table', () => {
    const processed = toProcessedRawLootTable(null);
    const result = toDataObject('loot-table', undefined, processed);
    expect(result).toBeDefined();
  });

  test('dispatches crafting-recipe', () => {
    const processed = toProcessedRawCraftingRecipe(null);
    const result = toDataObject('crafting-recipe', undefined, processed);
    expect(result).toBeDefined();
  });

  test('dispatches crafting-recipe-category', () => {
    const processed = toProcessedRawCraftingRecipeCategory(null);
    const result = toDataObject('crafting-recipe-category', undefined, processed);
    expect(result).toBeDefined();
  });

  test('dispatches dialogue-tree', () => {
    const processed = toProcessedRawDialogueTree(null);
    const result = toDataObject('dialogue-tree', undefined, processed);
    expect(result).toBeDefined();
  });

  test('dispatches player-data', () => {
    const processed = toProcessedRawPlayerData(null);
    const result = toDataObject('player-data', undefined, processed);
    expect(result).toBeDefined();
  });

  test('dispatches event-log', () => {
    const processed = toProcessedRawEventLog(null);
    const result = toDataObject('event-log', undefined, processed);
    expect(result).toBeDefined();
  });

  test('dispatches world-settings', () => {
    const processed = toProcessedRawWorldSettings(null);
    const result = toDataObject('world-settings', undefined, processed);
    expect(result).toBeDefined();
  });

  test('dispatches fishing-zone', () => {
    const processed = toProcessedRawFishingZone(null);
    const result = toDataObject('fishing-zone', undefined, processed);
    expect(result).toBeDefined();
  });

  test('dispatches skill', () => {
    const processed = toProcessedRawSkill(null);
    const result = toDataObject('skill', undefined, processed);
    expect(result).toBeDefined();
  });

  test('dispatches localization-key passthrough', () => {
    const result = toDataObject('localization-key', undefined, 'MY_KEY');
    expect(result).toBe('MY_KEY');
  });

  test('dispatches localization', () => {
    const processed = toProcessedRawLocalization(null);
    const result = toDataObject('localization', undefined, processed);
    expect(result).toBeDefined();
  });

  test('dispatches quest', () => {
    const processed = toProcessedRawQuest(null);
    const result = toDataObject('quest', undefined, processed);
    expect(result).toBeDefined();
  });

  test('dispatches world-zone', () => {
    const processed = toProcessedRawWorldZone(null);
    const result = toDataObject('world-zone', undefined, processed);
    expect(result).toBeDefined();
  });

  test('defaults to object type for unknown section', () => {
    const processed = toProcessedRawObjectType({});
    const result = toDataObject('object' as const, undefined, processed);
    expect(result).toBeDefined();
  });
});
