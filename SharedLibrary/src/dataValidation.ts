import {
  ALL_SEASONS,
  AUTO_BOX_COLLIDER_TYPE,
  BOX_COLLIDER_TYPE,
  COLLIDER_TYPES,
  CONDITIONS,
  CRAFTING_RECIPES_DATA_FILE,
  CREATURES_DATA_FILE,
  DAYS_IN_A_WEEK,
  DAYS_OF_THE_WEEK,
  DAY_LENGTH,
  DIALOGUE_DATA_FILE,
  ERROR_SECTION_CRAFTING_RECIPES,
  ERROR_SECTION_CRAFTING_RECIPE_CATEGORIES,
  ERROR_SECTION_CREATURES,
  ERROR_SECTION_CREATURE_CATEGORIES,
  ERROR_SECTION_DIALOGUE_TREES,
  ERROR_SECTION_FISHING_ZONES,
  ERROR_SECTION_ITEMS,
  ERROR_SECTION_ITEM_CATEGORIES,
  ERROR_SECTION_LOCALIZATIONS,
  ERROR_SECTION_LOCALIZATION_KEYS,
  ERROR_SECTION_OBJECTS,
  ERROR_SECTION_OBJECT_CATEGORIES,
  ERROR_SECTION_OBJECT_SUB_CATEGORIES,
  ERROR_SECTION_PLAYER_LEVELS,
  ERROR_SECTION_PLAYER_STARTING_ITEMS,
  ERROR_SECTION_PLAYER_STATS,
  ERROR_SECTION_PLAYER_WORLD_WEATHER,
  ERROR_SECTION_QUESTS,
  ERROR_SECTION_SKILLS,
  EVENTS_DATA_FILE,
  FILLED_FROM_TYPES,
  FILLED_FROM_TYPE_SAND,
  FILLED_FROM_TYPE_WATER,
  FISHING_DATA_FILE,
  FISHING_ITEM_TYPES,
  FISHING_ITEM_TYPE_FISH,
  FISHING_ITEM_TYPE_POLE,
  GROUND_TYPES,
  ICON_HEIGHT,
  ICON_WIDTH,
  INVENTORY_TYPES,
  INVENTORY_TYPE_SMALL,
  ITEMS_DATA_FILE,
  LOCALIZATION_DATA_FILE,
  LOOT_TABLES_DATA_FILE,
  LOOT_TYPES,
  LOOT_TYPE_DROP,
  LOOT_TYPE_NONE,
  LOOT_TYPE_STAGE_DROP,
  MOVEMENT_TYPE_JUMP,
  MOVEMENT_TYPE_WALK,
  OBJECTS_DATA_FILE,
  PLACEMENT_LAYERS,
  PLACEMENT_LAYER_IN_AIR,
  PLACEMENT_LAYER_IN_GROUND,
  PLACEMENT_LAYER_ON_GROUND,
  PLACEMENT_POSITIONS,
  PLACEMENT_POSITION_CENTER,
  PLACEMENT_POSITION_EDGE,
  PLAYER_DATA_FILE,
  PLAYER_SPRITE_HEIGHT,
  PLAYER_SPRITE_WIDTH,
  POLYGON_COLLIDER_TYPE,
  PORTRAIT_HEIGHT,
  PORTRAIT_WIDTH,
  QUESTS_DATA_FILE,
  QUEST_COMPLETION_TRIGGERS,
  QUEST_OBJECTIVE_TYPES,
  QUEST_OBJECTIVE_TYPE_CRAFT,
  QUEST_OBJECTIVE_TYPE_DESTINATION,
  QUEST_OBJECTIVE_TYPE_GATHER,
  QUEST_OBJECTIVE_TYPE_TALK_TO_CREATURE,
  QUEST_SOURCES,
  QUEST_SOURCE_CREATURE,
  SEASONS,
  SKILLS_DATA_FILE,
  SPRITE_RULE_DIRECTIONS,
  STAGES_TYPES,
  STAGES_TYPE_BREAKABLE,
  STAGES_TYPE_GROWABLE,
  STAGES_TYPE_GROWABLE_WITH_HEALTH,
  STAGES_TYPE_NONE,
  STAGE_JUMP_CONDITIONS,
  STAGE_JUMP_CONDITION_HARVEST,
  STAGE_JUMP_CONDITION_TIME,
  TIME_COMPARATORS,
  TIME_COMPARATOR_AFTER,
  TIME_COMPARATOR_BEFORE,
  TIME_COMPARATOR_BETWEEN,
  WEAPON_TYPES,
  WEAPON_TYPE_ARC,
  WEAPON_TYPE_NONE,
  WEAPON_TYPE_POINT,
  WEAPON_TYPE_PROJECTILE,
  WORLD_DATA_FILE
} from './constants';
import * as dataValidation from './dataValidation';
import { createAssert } from './util/assert.util';
import { getDamagableData, getProjectileData } from './util/combat.util';
import {
  toCraftingRecipe,
  toCraftingRecipeCategory,
  toCreatureCategory,
  toCreatureType,
  toDialogueTree,
  toEventLog,
  toFishingZone,
  toItemCategory,
  toItemType,
  toLocalization,
  toLootTable,
  toObjectCategory,
  toObjectSubCategory,
  toObjectType,
  toPlayerData,
  toProcessedRawPlayerData,
  toProcessedRawWorldSettings,
  toQuest,
  toSkill,
  toWorldSettings
} from './util/converters.util';
import { getCreatureSetting } from './util/creatureType.util';
import { getItemSetting } from './util/itemType.util';
import { getEnglishLocalization, getLocalizationKey, getLocalizedValue } from './util/localization.util';
import { isNotNullish, isNullish } from './util/null.util';
import { getObjectSetting } from './util/objectType.util';
import { isNotEmpty } from './util/string.util';

import type {
  AllErrors,
  ColliderType,
  CraftingRecipe,
  CraftingRecipeCategory,
  CreatureCategory,
  CreatureType,
  DialogueTree,
  EventLog,
  FilledFromType,
  FishingItemType,
  FishingPoleAnchorPoints,
  FishingZone,
  InventoryType,
  ItemCategory,
  ItemType,
  Localization,
  LootTable,
  LootTableComponent,
  LootType,
  ObjectCategory,
  ObjectSettings,
  ObjectSpriteRulePosition,
  ObjectSubCategory,
  ObjectType,
  PlacementLayer,
  PlacementPosition,
  PlayerData,
  ProcessedRawCampSpawn,
  ProcessedRawCollider,
  ProcessedRawCraftingRecipe,
  ProcessedRawCraftingRecipeCategory,
  ProcessedRawCreatureCategory,
  ProcessedRawCreatureShop,
  ProcessedRawCreatureSprites,
  ProcessedRawCreatureType,
  ProcessedRawDialogue,
  ProcessedRawDialogueResponse,
  ProcessedRawDialogueTree,
  ProcessedRawEventLog,
  ProcessedRawFishingZone,
  ProcessedRawItemCategory,
  ProcessedRawItemType,
  ProcessedRawLocalization,
  ProcessedRawLootTable,
  ProcessedRawLootTableComponentGroup,
  ProcessedRawObjectCategory,
  ProcessedRawObjectSpriteRuleset,
  ProcessedRawObjectSprites,
  ProcessedRawObjectSubCategory,
  ProcessedRawObjectType,
  ProcessedRawObjectTypeStage,
  ProcessedRawPlayerData,
  ProcessedRawQuest,
  ProcessedRawQuestObjective,
  ProcessedRawQuestTask,
  ProcessedRawSkill,
  ProcessedRawSkillLevel,
  ProcessedRawSprite,
  ProcessedRawWorldSettings,
  Quest,
  QuestCompletionTrigger,
  QuestObjectiveType,
  Season,
  Skill,
  SpawningCondition,
  StageJumpCondition,
  StagesType,
  TimeComparator,
  WeaponType,
  WorldSettings
} from './interface';
import type { Assert, AssertNotEmpty, AssertNotNullish } from './util/assert.util';

export function validateData(
  rawCreatureCategories: ProcessedRawCreatureCategory[] | null | undefined,
  rawCreatures: ProcessedRawCreatureType[] | null | undefined,
  creatureAnimations: Record<string, number>,
  creaturePortraits: Record<
    string,
    {
      width: number | undefined;
      height: number | undefined;
    }
  >,
  rawItemCategories: ProcessedRawItemCategory[] | null | undefined,
  rawItems: ProcessedRawItemType[] | null | undefined,
  itemIconSizes: Record<
    string,
    {
      width: number | undefined;
      height: number | undefined;
    }
  >,
  itemAnimations: Record<string, number>,
  rawLootTables: ProcessedRawLootTable[] | null | undefined,
  rawCraftingRecipesCategories: ProcessedRawCraftingRecipeCategory[] | null | undefined,
  rawCraftingRecipes: ProcessedRawCraftingRecipe[] | null | undefined,
  rawObjectCategories: ProcessedRawObjectCategory[] | null | undefined,
  rawObjectSubCategories: ProcessedRawObjectSubCategory[] | null | undefined,
  rawObjects: ProcessedRawObjectType[] | null | undefined,
  objectSpriteCounts: Record<string, number>,
  objectAccentSpriteCounts: Record<string, Record<string, number>>,
  rawPlayerData: ProcessedRawPlayerData | null | undefined,
  rawDialogueTrees: ProcessedRawDialogueTree[] | null | undefined,
  rawEventLogs: ProcessedRawEventLog[] | null | undefined,
  rawWorldSettings: ProcessedRawWorldSettings | null | undefined,
  rawFishingZones: ProcessedRawFishingZone[] | null | undefined,
  rawSkills: ProcessedRawSkill[] | null | undefined,
  rawLocalizationKeys: string[] | null | undefined,
  rawLocalizations: ProcessedRawLocalization[] | null | undefined,
  rawQuests: ProcessedRawQuest[] | null | undefined
): AllErrors | null {
  const allErrors: AllErrors = {};

  const { localizationKeys } = validateLocalizationKeys(allErrors, rawLocalizationKeys);
  const { localizations } = validateLocalizations(allErrors, rawLocalizations, localizationKeys);
  const { englishLocalization } = getEnglishLocalization(localizations);

  const { skillsByKey } = validateSkills(allErrors, rawSkills, englishLocalization, localizationKeys);

  const { itemCategories, itemCategoriesByKey } = validateItemCategories(allErrors, rawItemCategories, skillsByKey);
  const { items, itemsByKey } = validateItems(
    allErrors,
    rawItems,
    itemCategoriesByKey,
    skillsByKey,
    itemIconSizes,
    itemAnimations,
    englishLocalization,
    localizationKeys
  );

  const { lootTablesByKey } = validateLootTables(allErrors, rawLootTables, itemsByKey);

  const { eventLogsByKey } = validateEventLogs(allErrors, rawEventLogs, englishLocalization, localizationKeys);

  const { creatureCategories, creatureCategoriesByKey } = validateCreatureCategories(allErrors, rawCreatureCategories);
  const { creatures, creaturesByKey } = validateCreatures(
    allErrors,
    rawCreatures,
    creatureCategoriesByKey,
    itemsByKey,
    lootTablesByKey,
    eventLogsByKey,
    englishLocalization,
    localizationKeys,
    creatureAnimations,
    creaturePortraits
  );
  checkCreaturesConnections(allErrors, creatures, creaturesByKey, creatureCategoriesByKey);

  const { objectCategories, objectCategoriesByKey } = validateObjectCategories(allErrors, rawObjectCategories);
  const { objectSubCategories, objectSubCategoriesByKey } = validateObjectSubCategories(
    allErrors,
    rawObjectSubCategories,
    objectCategoriesByKey
  );

  const { objects, objectsByKey } = validateObjects(
    allErrors,
    rawObjects,
    objectCategoriesByKey,
    objectSubCategories,
    objectSubCategoriesByKey,
    lootTablesByKey,
    objectSpriteCounts,
    objectAccentSpriteCounts,
    englishLocalization,
    localizationKeys
  );

  const { craftingRecipeCategoriesByKey } = validateCraftingRecipeCategories(allErrors, rawCraftingRecipesCategories);

  const workstationKeys = objects
    .filter((type) => {
      const { value: isWorkstation } = getObjectSetting('isWorkstation', type, objectCategoriesByKey, objectSubCategoriesByKey);
      return isWorkstation;
    })
    .map((workstation) => workstation.key);

  const { craftingRecipesByKey } = validateCraftingRecipes(
    allErrors,
    rawCraftingRecipes,
    craftingRecipeCategoriesByKey,
    skillsByKey,
    itemsByKey,
    workstationKeys
  );

  const { dialogueTreesByKey } = validateDialogueTrees(
    allErrors,
    rawDialogueTrees,
    creaturesByKey,
    eventLogsByKey,
    englishLocalization,
    localizationKeys
  );

  validatePlayerData(allErrors, rawPlayerData, itemsByKey);

  validateWorldSettings(allErrors, rawWorldSettings);

  const { projectileItemCategoryKeys: projectileItemCategoryKeyOptions, projectileItemKeys: projectileItemKeyOptions } = getProjectileData(
    itemCategories,
    itemCategoriesByKey,
    items
  );

  const {
    damagableObjectCategoryKeys,
    damagableObjectSubCategoryKeys,
    damagableObjectKeys,
    damagableCreatureCategoryKeys,
    damagableCreatureKeys
  } = getDamagableData(
    objectCategories,
    objectCategoriesByKey,
    objectSubCategories,
    objectSubCategoriesByKey,
    objects,
    creatureCategories,
    creatureCategoriesByKey,
    creatures
  );

  checkObjectCategoriesRequiredSettings(allErrors, objectCategories, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey);
  checkObjectSubCategoriesRequiredSettings(allErrors, objectSubCategories, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey);
  checkObjectsRequiredSettings(allErrors, objects, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey);

  checkItemCategoryConnections(
    allErrors,
    itemCategories,
    damagableObjectKeys,
    damagableObjectCategoryKeys,
    damagableObjectSubCategoryKeys,
    damagableCreatureKeys,
    damagableCreatureCategoryKeys,
    projectileItemKeyOptions,
    projectileItemCategoryKeyOptions
  );
  checkItemsConnections(
    allErrors,
    items,
    itemsByKey,
    itemCategoriesByKey,
    objectsByKey,
    damagableObjectKeys,
    damagableObjectCategoryKeys,
    damagableObjectSubCategoryKeys,
    damagableCreatureKeys,
    damagableCreatureCategoryKeys,
    projectileItemKeyOptions,
    projectileItemCategoryKeyOptions
  );

  validateFishingZones(allErrors, rawFishingZones, lootTablesByKey);

  validateQuests(
    allErrors,
    rawQuests,
    itemsByKey,
    craftingRecipesByKey,
    creaturesByKey,
    dialogueTreesByKey,
    eventLogsByKey,
    englishLocalization,
    localizationKeys
  );

  if (Object.keys(allErrors).length > 0) {
    return allErrors;
  }

  return null;
}

/**
 * Creatures
 */
export function validateCreatureCategories(
  allErrors: AllErrors,
  rawCreatureCategories: ProcessedRawCreatureCategory[] | null | undefined
): {
  creatureCategories: CreatureCategory[];
  creatureCategoriesByKey: Record<string, CreatureCategory>;
} {
  const creatureCategories: CreatureCategory[] = [];
  const creatureCategoriesByKey: Record<string, CreatureCategory> = {};

  if (!isNotNullish(rawCreatureCategories)) {
    return { creatureCategories, creatureCategoriesByKey };
  }

  const creatureErrors: Record<string, string[]> = {};

  let i = 1;
  for (const rawCategory of rawCreatureCategories) {
    let key: string;
    if (isNotNullish(rawCategory.key)) {
      key = rawCategory.key;
    } else {
      key = `Creature Category #${i}`;
    }

    const errors = validateCreatureCategory(rawCategory);

    if (isNotNullish(rawCategory.key)) {
      const category = toCreatureCategory(rawCategory, i);
      creatureCategories.push(category);
      creatureCategoriesByKey[category.key] = category;
    }

    if (errors.length > 0) {
      creatureErrors[key] = errors;
    }

    i++;
  }

  if (Object.keys(creatureErrors).length > 0) {
    allErrors[CREATURES_DATA_FILE] = {
      ...(allErrors[CREATURES_DATA_FILE] ?? {}),
      [ERROR_SECTION_CREATURE_CATEGORIES]: creatureErrors
    };
  }

  return { creatureCategories, creatureCategoriesByKey };
}

export function validateCreatureCategory(rawCategory: ProcessedRawCreatureCategory) {
  const { errors, assertNotNullish } = createAssert();

  assertNotNullish(rawCategory.key, 'No key');

  return errors;
}

export function validateCreatures(
  allErrors: AllErrors,
  rawCreatures: ProcessedRawCreatureType[] | null | undefined,
  categoriesByKey: Record<string, CreatureCategory>,
  itemsByKey: Record<string, ItemType>,
  lootTablesByKey: Record<string, LootTable>,
  eventLogsByKey: Record<string, EventLog>,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  creatureAnimations: Record<string, number>,
  creaturePortraits: Record<
    string,
    {
      width: number | undefined;
      height: number | undefined;
    }
  >
): {
  creatures: CreatureType[];
  creaturesByKey: Record<string, CreatureType>;
} {
  const creatures: CreatureType[] = [];
  const creaturesByKey: Record<string, CreatureType> = {};

  if (!isNotNullish(rawCreatures)) {
    return { creatures, creaturesByKey };
  }

  const creatureErrors: Record<string, string[]> = {};
  const idsSeen: number[] = [];

  let i = 1;
  for (const rawType of rawCreatures) {
    let key: string;
    if (isNotNullish(rawType.key)) {
      key = rawType.key;
    } else {
      key = `Creature #${i}`;
    }

    const errors = validateCreature(
      rawType,
      categoriesByKey,
      itemsByKey,
      lootTablesByKey,
      eventLogsByKey,
      localization,
      localizationKeys,
      rawType.key ? creatureAnimations[rawType.key] : 0,
      rawType.key
        ? creaturePortraits[rawType.key]
        : {
            width: undefined,
            height: undefined
          },
      idsSeen
    );

    i++;
    if (isNotNullish(rawType.key)) {
      const type = toCreatureType(rawType, i);
      creatures.push(type);
      creaturesByKey[type.key] = type;
      idsSeen.push(type.id);
    }

    if (errors.length > 0) {
      creatureErrors[key] = errors;
    }
  }

  if (Object.keys(creatureErrors).length > 0) {
    allErrors[CREATURES_DATA_FILE] = {
      ...(allErrors[CREATURES_DATA_FILE] ?? {}),
      [ERROR_SECTION_CREATURES]: creatureErrors
    };
  }

  return { creatures, creaturesByKey };
}

export function validateCreature(
  rawType: ProcessedRawCreatureType,
  categoriesByKeys: Record<string, CreatureCategory>,
  itemsByKey: Record<string, ItemType>,
  lootTablesByKey: Record<string, LootTable>,
  eventLogsByKey: Record<string, EventLog>,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  animationSpriteCount: number,
  portraitSize: {
    width: number | undefined;
    height: number | undefined;
  },
  idsSeen: number[]
): string[] {
  return [
    ...validateCreatureGeneralTab(rawType, categoriesByKeys, lootTablesByKey, localization, localizationKeys, portraitSize, idsSeen),
    ...validateCreatureSpriteStageTab(rawType, animationSpriteCount),
    ...validatePhysicsTab(rawType),
    ...validateCreatureShopTab(rawType, categoriesByKeys, itemsByKey, eventLogsByKey, localization, localizationKeys),
    ...validateCreatureBehaviorTab(rawType, categoriesByKeys),
    ...validateCreatureSpawningTab(rawType)
  ];
}

export function validateCreatureGeneralTab(
  rawType: ProcessedRawCreatureType,
  categoriesByKeys: Record<string, CreatureCategory>,
  lootTablesByKey: Record<string, LootTable>,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  portraitSize: {
    width: number | undefined;
    height: number | undefined;
  },
  idsSeen: number[]
) {
  const { errors, assert, assertNotNullish, assertNotEmpty } = createAssert();
  if (assertNotNullish(rawType.id, 'No id') && assert(rawType.id != 0, 'Id cannot be 0')) {
    assert(!idsSeen.includes(rawType.id), `Duplicate id: ${rawType.id}`);
  }

  if (assertNotNullish(rawType.key, 'No key') && localization) {
    assertNotEmpty(getLocalizedValue(localization, localizationKeys, getLocalizationKey('creature', 'name', rawType.key)), 'No name');
  }

  if (assertNotNullish(rawType.categoryKey, 'No category')) {
    const hasValidCategory = rawType.categoryKey in categoriesByKeys;
    assert(hasValidCategory, `Invalid category: ${rawType.categoryKey}`);
  }

  const hasDialogue = getCreatureSetting('hasDialogue', rawType, categoriesByKeys).value;
  if (hasDialogue) {
    if (
      assertNotNullish(portraitSize.width, 'Creatures with dialogue must have portrait width') &&
      assertNotNullish(portraitSize.height, 'Creatures with dialogue must have portrait height')
    ) {
      assert(portraitSize.width === PORTRAIT_WIDTH, `Portrait width must be ${PORTRAIT_WIDTH} pixels, currently is ${portraitSize.width}`);
      assert(
        portraitSize.height === PORTRAIT_HEIGHT,
        `Portrait height must be ${PORTRAIT_HEIGHT} pixels, currently is ${portraitSize.height}`
      );
    }
  }

  const hasHealth = getCreatureSetting('hasHealth', rawType, categoriesByKeys).value;
  if (hasHealth) {
    if (assertNotNullish(rawType.health, 'No health')) {
      assert(rawType.health > 0, 'Health must be greater than 0');
      assert(rawType.health % 1 === 0, 'Health must be a whole number');
    }
  }

  if (isNotNullish(rawType.lootTableKey)) {
    assert(rawType.lootTableKey in lootTablesByKey, `No loot table with key ${rawType.lootTableKey} exists`);
  }

  if (hasHealth && isNotNullish(rawType.lootTableKey)) {
    assert(rawType.experience > 0, 'Experience must be greater than 0');
    assert(rawType.experience % 1 === 0, 'Experience must be a whole number');
  }

  return errors;
}

export function validateCreatureSpriteStageTab(rawType: ProcessedRawCreatureType, spriteCount: number) {
  const { errors, assert, assertNotNullish } = createAssert();

  if (assertNotNullish(rawType.sprite, 'No sprite data')) {
    assertCreatureSprite(assert, rawType.sprite, spriteCount);
  }

  return errors;
}

export function validateCreatureShopTab(
  rawType: ProcessedRawCreatureType,
  categoriesByKeys: Record<string, CreatureCategory>,
  itemsByKey: Record<string, ItemType>,
  eventLogsByKey: Record<string, EventLog>,
  localization: Localization | null | undefined,
  localizationKeys: string[]
) {
  const { errors, assert, assertNotNullish } = createAssert();

  const isShopkeeper = getCreatureSetting('isShopkeeper', rawType, categoriesByKeys).value;
  if (isShopkeeper) {
    if (assertNotNullish(rawType.shop, 'No shop data')) {
      assertCreatureShop(assert, assertNotNullish, rawType.shop, itemsByKey, eventLogsByKey, localization, localizationKeys);
    }
  }

  return errors;
}

export function validateCreatureBehaviorTab(rawType: ProcessedRawCreatureType, categoriesByKeys: Record<string, CreatureCategory>) {
  const { errors, assert, assertNotNullish } = createAssert();

  const movementType = getCreatureSetting('movementType', rawType, categoriesByKeys).value;
  if (movementType === MOVEMENT_TYPE_WALK) {
    assert(rawType.walkSpeed >= 1, 'Walk speed must be greater than or equal to 1');
    assert(rawType.walkSpeed <= 10, 'Walk speed must be less than or equal to 10');
  } else if (movementType === MOVEMENT_TYPE_JUMP) {
    assert(rawType.jumpFrequencySpeed >= 1, 'Jump frequency speed must be greater than or equal to 1');
    assert(rawType.jumpFrequencySpeed <= 10, 'Jump frequency speed must be less than or equal to 10');
    assert(rawType.jumpMinDistance >= 1, 'Jump min distance must be greater than or equal to 1');
    assert(rawType.jumpMinDistance <= 10, 'Jump min distance must be less than or equal to 10');
    assert(rawType.jumpMaxDistance >= 1, 'Jump max distance must be greater than or equal to 1');
    assert(rawType.jumpMaxDistance <= 10, 'Jump max distance must be less than or equal to 10');
  }

  if (rawType.dangerBehaviorEnabled) {
    if (movementType === MOVEMENT_TYPE_WALK) {
      assert(rawType.runSpeed >= 0, 'Run speed must be greater than or equal to 0');
      assert(rawType.runSpeed <= 10, 'Run speed must be less than or equal to 10');
      assert(rawType.walkSpeed < rawType.runSpeed, 'Run speed must be greater than walk speed');
    }
    assert(rawType.dangerRadius >= 1, 'Danger radius must be greater than or equal to 1');
    assert(rawType.dangerRadius <= 20, 'Danger radius must be less than or equal to 20');
    assert(rawType.dangerTolerance > 0, 'Danger tolerance must be between 0 and 1 (inclusive)');
  }

  if (rawType.wanderBehaviorEnabled) {
    assert(rawType.wanderTime > 0, 'Wander time must be greater than 0');
    assert(rawType.wanderTime <= 20, 'Wander time must be less than or equal to 20');
    assert(rawType.wanderRadius >= 1, 'Wander radius must be greater than or equal to 1');
    assert(rawType.wanderRadius <= 20, 'Wander radius must be less than or equal to 20');

    if (rawType.campSpawns.length > 0) {
      assert(rawType.wanderUseSpawnAnchor === true, 'Spawn anchor must be used with camp spawns');
    }

    assert(!rawType.wanderUseSpawnAnchor || !rawType.wanderUseCustomAnchor, 'Spawn and custom anchors cannot be used together');
    if (rawType.wanderUseSpawnAnchor || rawType.wanderUseCustomAnchor) {
      if (rawType.wanderUseHardLeash) {
        assert(rawType.wanderHardLeashRange >= 1, 'Wander hard leash range must be greater than or equal to 1');
        assert(rawType.wanderHardLeashRange <= 25, 'Wander hard leash range must be less than or equal to 25');
      }
    } else {
      assert(!rawType.wanderUseHardLeash, 'Hard lease cannot be used with a spawn or custom anchor');
    }

    if (rawType.wanderUseCustomAnchor) {
      assertNotNullish(rawType.wanderAnchor, 'No wander custom anchor');
    }

    if (rawType.attackUseStrafing) {
      assert(rawType.attackStrafingTimeMin >= 1, 'Strafing min time must be greater than or equal to 1');
      assert(rawType.attackStrafingTimeMin <= 25, 'Strafing min time must be less than or equal to 10');
      assert(rawType.attackStrafingTimeMax >= 1, 'Strafing max time must be greater than or equal to 1');
      assert(rawType.attackStrafingTimeMax <= 25, 'Strafing max time must be less than or equal to 10');
      assert(rawType.attackStrafingTimeMin < rawType.attackStrafingTimeMax, 'Strafing min time must be less than strafing max time');
    }
  }

  if (rawType.attackBehaviorEnabled) {
    assert(rawType.attackRadius >= 1, 'Attack radius must be greater than or equal to 1');
    assert(rawType.attackRadius <= 20, 'Attack radius must be less than or equal to 20');
    assert(rawType.attackDesiredRangeMin >= 1, 'Attack desired min range must be greater than or equal to 1');
    assert(rawType.attackDesiredRangeMin <= 20, 'Attack desired min range must be less than or equal to 20');
    assert(rawType.attackDesiredRangeMax >= 1, 'Attack desired max range must be greater than or equal to 1');
    assert(rawType.attackDesiredRangeMax <= 20, 'Attack desired max range must be less than or equal to 20');
    assert(
      rawType.attackDesiredRangeMin < rawType.attackDesiredRangeMax,
      'Attack desired min range must be less than attack desired max range'
    );
  }

  return errors;
}

export function validateCreatureSpawningTab(rawType: ProcessedRawCreatureType) {
  const { errors, assert, assertNotNullish } = createAssert();

  assert(rawType.spawnDistanceFromPlayers >= 0, 'Spawn distance from players must be greater than or equal to 0');
  assert(rawType.spawnDistanceFromPlayers <= 100, 'Spawn distance from players must be less than or equal to 100');

  if (rawType.randomSpawnsEnabled) {
    assert(rawType.maxPopulation >= 1, 'Max population must be greater than or equal to 1');
    assert(rawType.maxPopulation <= 250, 'Max population must be less than or equal to 250');
    assert(rawType.maxPopulation % 1 === 0, 'Max population must be a whole number');
  }

  rawType.campSpawns.forEach((campSpawn, index) => assertCampSpawn(assert, assertNotNullish, campSpawn, `Camp spawn ${index}`));

  return errors;
}

export function checkCreaturesConnections(
  allErrors: AllErrors,
  creatures: CreatureType[],
  creaturesByKey: Record<string, CreatureType>,
  creatureCategoriesByKey: Record<string, CreatureCategory>
) {
  const creatureErrors: Record<string, string[]> = allErrors[CREATURES_DATA_FILE]?.[ERROR_SECTION_CREATURES] ?? {};

  for (const creature of creatures) {
    const key = creature.key;
    const errors = checkCreatureConnections(creature, creaturesByKey, creatureCategoriesByKey);

    if (errors.length > 0) {
      if (key in creatureErrors) {
        creatureErrors[key].push(...errors);
      } else {
        creatureErrors[key] = errors;
      }
    }
  }

  if (Object.keys(creatureErrors).length > 0) {
    allErrors[CREATURES_DATA_FILE] = {
      ...(allErrors[CREATURES_DATA_FILE] ?? {}),
      [ERROR_SECTION_CREATURES]: creatureErrors
    };
  }
}

export function checkCreatureConnections(
  creature: CreatureType,
  creaturesByKey: Record<string, CreatureType>,
  creatureCategoriesByKey: Record<string, CreatureCategory>
) {
  const { errors, assert } = createAssert();

  if (creature.dangerBehaviorEnabled) {
    for (const key of creature.dangerCreatureCategoryKeys) {
      assert(key in creatureCategoriesByKey, `Danager Behavior: No creature category exists with key '${key}'`);
    }

    for (const key of creature.dangerCreatureKeys) {
      assert(key in creaturesByKey, `Danager Behavior: No creature exists with key '${key}'`);
    }
  }

  if (creature.attackBehaviorEnabled) {
    for (const key of creature.attackTargetCreatureCategoryKeys) {
      assert(key in creatureCategoriesByKey, `Attack Behavior: No creature category exists with key '${key}'`);
    }

    for (const key of creature.attackTargetCreatureKeys) {
      assert(key in creaturesByKey, `Attack Behavior: No creature exists with key '${key}'`);
    }
  }

  return errors;
}

export function assertCampSpawn(assert: Assert, assertNotNullish: AssertNotNullish, campSpawn: ProcessedRawCampSpawn, header: string) {
  assertNotNullish(campSpawn.position, `${header}: No position`);
  assert(campSpawn.maxPopulation > 0, `${header}: Max population must be greater than 0`);
  assert(campSpawn.maxPopulation <= 250, `${header}: Max population must be less than or equal to 250`);
}

export function assertCreatureShop(
  assert: Assert,
  assertNotNullish: AssertNotNullish,
  shop: ProcessedRawCreatureShop,
  itemsByKey: Record<string, ItemType>,
  eventLogsByKey: Record<string, EventLog>,
  localization: Localization | null | undefined,
  localizationKeys: string[]
) {
  for (const seasonKey of Object.keys(shop.prices)) {
    if (assert(seasonKey === ALL_SEASONS || SEASONS.includes(seasonKey as Season), `Invalid season: ${seasonKey}`)) {
      for (const itemKey of Object.keys(shop.prices[seasonKey])) {
        assert(itemKey in itemsByKey, `Shop Price: No item exists with key '${itemKey}'`);
        if (itemKey in itemsByKey) {
          const item = itemsByKey[itemKey];
          const itemName = getLocalizedValue(localization, localizationKeys, getLocalizationKey('item', 'name', item.key));
          const amount = shop.prices[seasonKey][itemKey];
          assert(amount > 0, `Shop Price [${itemName}]: Amount must be greater than 0`);
          assert(amount % 1 === 0, `Shop Price [${itemName}]: Amount must be a whole number`);
        }
      }
    }
  }

  assert(shop.openTimes.length === DAYS_IN_A_WEEK, `There must be ${DAYS_IN_A_WEEK} open times`);
  assert(shop.closeTimes.length === DAYS_IN_A_WEEK, `There must be ${DAYS_IN_A_WEEK} close times`);
  if (shop.openTimes.length === DAYS_IN_A_WEEK && shop.closeTimes.length === DAYS_IN_A_WEEK) {
    for (let i = 0; i < shop.openTimes.length; i++) {
      const openTime = shop.openTimes[i];
      const closeTime = shop.closeTimes[i];

      if (
        !assertNotNullish(openTime, `${DAYS_OF_THE_WEEK[i].name} has no open time (set to -1 for closed)`) ||
        !assertNotNullish(closeTime, `${DAYS_OF_THE_WEEK[i].name} has no close time (set to -1 for closed)`)
      ) {
        continue;
      }

      assert(
        openTime >= -1 && openTime <= DAY_LENGTH,
        `${DAYS_OF_THE_WEEK[i].name} open time must be between (inclusive) -1 and ${DAY_LENGTH}`
      );
      assert(
        closeTime >= -1 && closeTime <= DAY_LENGTH,
        `${DAYS_OF_THE_WEEK[i].name} close time must be between (inclusive) -1 and ${DAY_LENGTH}`
      );

      assert(
        (openTime === -1 && closeTime === -1) || (openTime >= 0 && closeTime >= 0),
        `${DAYS_OF_THE_WEEK[i].name} must have both open and close times or neither`
      );

      if (openTime >= 0 && closeTime >= 0) {
        assert(openTime < closeTime, `${DAYS_OF_THE_WEEK[i].name} open time must be before close time`);
      }
    }
  }

  if (isNotNullish(shop.openingEvent)) {
    assert(shop.openingEvent in eventLogsByKey, `Invalid shop opening event: ${shop.openingEvent}`);
  }
}

export function assertCreatureSprite(assert: Assert, creatureSprite: ProcessedRawCreatureSprites, spriteCount: number) {
  assert(spriteCount > 0, 'No sprites');
  assert(creatureSprite.width >= 16, 'Sprite width must be at least 16');
  assert(creatureSprite.width % 1 == 0, 'Sprite width must be a whole number');
  assert(creatureSprite.height >= 16, 'Sprite height must be at least 16');
  assert(creatureSprite.height % 1 == 0, 'Sprite height must be a whole number');

  if (isNotNullish(creatureSprite.pivotOffset)) {
    assert(creatureSprite.pivotOffset.x % 1 == 0, 'Sprite pivot offset x must be a whole number');
    assert(creatureSprite.pivotOffset.y % 1 == 0, 'Sprite pivot offset y must be a whole number');
  }

  if (isNotNullish(creatureSprite.sprites)) {
    assertCreatureSprites(assert, creatureSprite.sprites);
  }

  if (isNotNullish(creatureSprite.idleSprites)) {
    assertCreatureSprites(assert, creatureSprite.idleSprites);
  }

  if (isNotNullish(creatureSprite.deathSprites)) {
    assertCreatureSprites(assert, creatureSprite.deathSprites);
  }
}

export function assertCreatureSprites(assert: Assert, sprites: Record<string, ProcessedRawSprite>) {
  for (const key of Object.keys(sprites)) {
    const keyAsNumber = Number(key);
    assert(!Number.isNaN(keyAsNumber), `Sprite key '${key}' must be a number`);
    if (!Number.isNaN(keyAsNumber)) {
      const individualObjectSprite = sprites[key];
      if (isNotNullish(individualObjectSprite)) {
        if (isNotNullish(individualObjectSprite.pivotOffset)) {
          assert(individualObjectSprite.pivotOffset?.x % 1 == 0, `Sprite ${keyAsNumber + 1} pivot offset x must be a whole number`);
          assert(individualObjectSprite.pivotOffset?.y % 1 == 0, `Sprite ${keyAsNumber + 1} pivot offset y must be a whole number`);
        }

        if (isNotNullish(individualObjectSprite.spriteOffset)) {
          assert(individualObjectSprite.spriteOffset?.x % 1 == 0, `Sprite ${keyAsNumber + 1} sprite offset x must be a whole number`);
          assert(individualObjectSprite.spriteOffset?.y % 1 == 0, `Sprite ${keyAsNumber + 1} sprite offset y must be a whole number`);
        }

        if (isNotNullish(individualObjectSprite.placementLayer)) {
          assert(
            PLACEMENT_LAYERS.includes(individualObjectSprite.placementLayer as PlacementLayer),
            `Sprite ${keyAsNumber + 1} Invalid placement layer: ${individualObjectSprite.placementLayer}`
          );
        }
      }
    }
  }
}

/**
 * Items
 */
export function validateItemCategories(
  allErrors: AllErrors,
  rawItemCategories: ProcessedRawItemCategory[] | null | undefined,
  skillsByKey: Record<string, Skill>
): {
  itemCategories: ItemCategory[];
  itemCategoriesByKey: Record<string, ItemCategory>;
} {
  const itemCategories: ItemCategory[] = [];
  const itemCategoriesByKey: Record<string, ItemCategory> = {};

  if (!isNotNullish(rawItemCategories)) {
    return { itemCategories, itemCategoriesByKey };
  }

  const itemErrors: Record<string, string[]> = {};

  let i = 1;
  for (const rawCategory of rawItemCategories) {
    let key: string;
    if (isNotNullish(rawCategory.key)) {
      key = rawCategory.key;
    } else {
      key = `Item Category #${i}`;
    }

    const errors = validateItemCategory(rawCategory, skillsByKey);

    if (isNotNullish(rawCategory.key)) {
      const category = toItemCategory(rawCategory, i);
      itemCategories.push(category);
      itemCategoriesByKey[category.key] = category;
    }

    if (errors.length > 0) {
      itemErrors[key] = errors;
    }

    i++;
  }

  if (Object.keys(itemErrors).length > 0) {
    allErrors[ITEMS_DATA_FILE] = {
      ...(allErrors[ITEMS_DATA_FILE] ?? {}),
      [ERROR_SECTION_ITEM_CATEGORIES]: itemErrors
    };
  }

  return { itemCategories, itemCategoriesByKey };
}

export function validateItemCategory(rawCategory: ProcessedRawItemCategory, skillsByKey: Record<string, Skill>) {
  return [...validateItemCategoryGeneralTab(rawCategory), ...validateItemCategoryCombatTab(rawCategory, skillsByKey)];
}

export function validateItemCategoryGeneralTab(rawCategory: ProcessedRawItemCategory) {
  const { errors, assert, assertNotNullish, assertNotEmpty } = createAssert();

  assertNotNullish(rawCategory.key, 'No key');

  if (isNotNullish(rawCategory.settings) && assertNotEmpty(rawCategory.settings.filledFromType, 'No filled from type')) {
    assert(
      FILLED_FROM_TYPES.includes(rawCategory.settings.filledFromType as FilledFromType),
      `Invalid filled from type: ${rawCategory.settings.filledFromType}`
    );
  }

  if (isNotNullish(rawCategory.settings) && assertNotEmpty(rawCategory.settings.fishingItemType, 'No fishing item type')) {
    assert(
      FISHING_ITEM_TYPES.includes(rawCategory.settings.fishingItemType as FishingItemType),
      `Invalid fishing item type: ${rawCategory.settings.fishingItemType}`
    );
  }

  return errors;
}

export function validateItemCategoryCombatTab(rawCategory: ProcessedRawItemCategory, skillsByKey: Record<string, Skill>) {
  const { errors, assert, assertNotEmpty } = createAssert();

  if (isNotNullish(rawCategory.settings) && assertNotEmpty(rawCategory.settings.weaponType, 'No weapon type')) {
    assert(
      WEAPON_TYPES.includes(rawCategory.settings.weaponType as WeaponType),
      `Invalid weapon type '${rawCategory.settings?.weaponType}'`
    );
    if (WEAPON_TYPES.includes(rawCategory.settings.weaponType as WeaponType) && rawCategory.settings.weaponType !== WEAPON_TYPE_NONE) {
      if (isNotNullish(rawCategory.settings.damagedIncreasedBySkillKey)) {
        assert(
          rawCategory.settings.damagedIncreasedBySkillKey in skillsByKey,
          `Invalid skill: ${rawCategory.settings.damagedIncreasedBySkillKey}`
        );
      }
    }
  }

  return errors;
}

export function validateItems(
  allErrors: AllErrors,
  rawItems: ProcessedRawItemType[] | null | undefined,
  categories: Record<string, ItemCategory>,
  skillsByKey: Record<string, Skill>,
  itemIconSizes: Record<
    string,
    {
      width: number | undefined;
      height: number | undefined;
    }
  >,
  itemAnimations: Record<string, number>,
  localization: Localization | null | undefined,
  localizationKeys: string[]
): {
  items: ItemType[];
  itemsById: Record<number, ItemType>;
  itemsByKey: Record<string, ItemType>;
} {
  const items: ItemType[] = [];
  const itemsById: Record<number, ItemType> = {};
  const itemsByKey: Record<string, ItemType> = {};

  if (!isNotNullish(rawItems)) {
    return { items, itemsById, itemsByKey };
  }

  const itemErrors: Record<string, string[]> = {};
  const idsSeen: number[] = [];

  let i = 1;
  for (const rawType of rawItems) {
    let key: string;
    if (isNotNullish(rawType.key)) {
      key = rawType.key;
    } else {
      key = `Item #${i}`;
    }

    const errors = validateItem(
      rawType,
      categories,
      skillsByKey,
      rawType.key
        ? itemIconSizes[rawType.key]
        : {
            width: undefined,
            height: undefined
          },
      rawType.key ? itemAnimations[rawType.key] : 0,
      idsSeen,
      localization,
      localizationKeys
    );

    i++;
    if (isNotNullish(rawType.key) && isNotNullish(rawType.id) && rawType.id > 0) {
      const type = toItemType(rawType, i);
      items.push(type);
      itemsById[type.id] = type;
      idsSeen.push(type.id);
      itemsByKey[type.key] = type;
    }

    if (errors.length > 0) {
      itemErrors[key] = errors;
    }
  }

  if (Object.keys(itemErrors).length > 0) {
    allErrors[ITEMS_DATA_FILE] = {
      ...(allErrors[ITEMS_DATA_FILE] ?? {}),
      [ERROR_SECTION_ITEMS]: itemErrors
    };
  }

  return { items, itemsById, itemsByKey };
}

export function validateItem(
  rawType: ProcessedRawItemType,
  categoriesByKeys: Record<string, ItemCategory>,
  skillsByKey: Record<string, Skill>,
  iconSize: {
    width: number | undefined;
    height: number | undefined;
  },
  animationSpriteCount: number,
  idsSeen: number[],
  localization: Localization | null | undefined,
  localizationKeys: string[]
): string[] {
  return [
    ...validateItemGeneralTab(rawType, categoriesByKeys, iconSize, animationSpriteCount, idsSeen, localization, localizationKeys),
    ...validateItemCombatTab(rawType, categoriesByKeys, skillsByKey),
    ...validateItemFishingTab(rawType, categoriesByKeys)
  ];
}

export function validateItemGeneralTab(
  rawType: ProcessedRawItemType,
  categoriesByKeys: Record<string, ItemCategory>,
  iconSize: {
    width: number | undefined;
    height: number | undefined;
  },
  animationSpriteCount: number,
  idsSeen: number[],
  localization: Localization | null | undefined,
  localizationKeys: string[]
): string[] {
  const { errors, assert, assertNotNullish, assertNotEmpty } = createAssert();
  if (assertNotNullish(rawType.id, 'No id') && assert(rawType.id != 0, 'Id cannot be 0')) {
    assert(!idsSeen.includes(rawType.id), `Duplicate id: ${rawType.id}`);
  }

  assertNotNullish(rawType.key, 'No key');

  assert(rawType.maxStackSize >= 0, 'Max stack size cannot be negative');
  assert(rawType.maxStackSize % 1 === 0, 'Max stack size must be a whole number');
  if (assertNotNullish(iconSize.width, 'No icon width') && assertNotNullish(iconSize.height, 'No icon height')) {
    assert(iconSize.width === ICON_WIDTH, `Icon width must be ${ICON_WIDTH} pixels, currently is ${iconSize.width}`);
    assert(iconSize.height === ICON_HEIGHT, `Icon height must be ${ICON_HEIGHT} pixels, currently is ${iconSize.height}`);
  }

  if (isNotNullish(rawType.key) && localization) {
    assertNotEmpty(getLocalizedValue(localization, localizationKeys, getLocalizationKey('item', 'name', rawType.key)), 'No name');
  }

  if (assertNotNullish(rawType.sellPrice, 'No sell price')) {
    assert(rawType.sellPrice > 0, 'Sell price must be greater than 0');
    assert(rawType.sellPrice % 1 === 0, 'Sell price must be a whole number');
  }

  if (assertNotNullish(rawType.categoryKey, 'No category')) {
    const hasValidCategory = rawType.categoryKey in categoriesByKeys;
    assert(hasValidCategory, `Invalid category: ${rawType.categoryKey}`);
  }

  const placeable = getItemSetting('placeable', rawType, categoriesByKeys).value;
  if (placeable) {
    assertNotNullish(rawType.objectTypeKey, 'No object type key');
  }

  const hasDurability = getItemSetting('hasDurability', rawType, categoriesByKeys).value;
  if (hasDurability) {
    assert(rawType.durability > 0, 'Durability must be greater than 0');
    assert(rawType.durability % 1 === 0, 'Durability must be a whole number');
    assert(rawType.maxStackSize === 1, 'Items with durability must have a max stack size of 1');
  }

  const isEdible = getItemSetting('isEdible', rawType, categoriesByKeys).value;
  if (isEdible) {
    assert(rawType.hungerIncrease > 0 || rawType.thirstIncrease > 0, 'Edible items must increase either hunger, thirst or both');
    assert(rawType.hungerIncrease >= 0, 'Hunger increase cannot be negative');
    assert(rawType.thirstIncrease >= 0, 'Thirst increase cannot be negative');
    assert(rawType.energyIncrease >= 0, 'Energy increase cannot be negative');
  }

  const filledFromType = getItemSetting('filledFromType', rawType, categoriesByKeys).value;
  if (isNotNullish(filledFromType)) {
    if (assert(FILLED_FROM_TYPES.includes(filledFromType), `Invalid filled from type: ${filledFromType}`)) {
      switch (filledFromType) {
        case FILLED_FROM_TYPE_WATER:
          assert(
            rawType.filledLevel > 0 || isNotNullish(rawType.filledItemTypeKey),
            'Items that can be filled with water must either have a water amount greater than 0 or a filled item type'
          );
          break;
        case FILLED_FROM_TYPE_SAND:
          assertNotNullish(rawType.filledItemTypeKey, 'Items that can be filled with sand must have a filled item type');
          break;
      }
    }
  }

  const watersGround = getItemSetting('watersGround', rawType, categoriesByKeys).value;
  const createsFarmland = getItemSetting('createsFarmland', rawType, categoriesByKeys).value;
  const weaponType = getItemSetting('weaponType', rawType, categoriesByKeys).value;
  if (weaponType == WEAPON_TYPE_POINT || weaponType == WEAPON_TYPE_ARC || watersGround || createsFarmland) {
    assert(
      animationSpriteCount > 0,
      'Tools (waters ground, creates or destroys farmland) and weapons (anything that does damage other than projectiles) require animations'
    );
    assert(animationSpriteCount % 4 == 0, 'Item animations must have an equal number of animation frames for all 4 directions');
  }

  const hasLight = getObjectSetting('hasLight', rawType, categoriesByKeys).value;
  if (hasLight && assertNotNullish(rawType.lightLevel, 'No light level')) {
    assert(rawType.lightLevel >= 1 && rawType.lightLevel < 20, 'Light level must be between 1 and 20');
    if (rawType.lightLevel >= 1) {
      if (assertNotNullish(rawType.lightPosition, 'No light position')) {
        assert(
          rawType.lightPosition.x >= 0 && rawType.lightPosition.x < ICON_WIDTH,
          `Light position x value must be between 0 and ${ICON_WIDTH - 1} (inclusive)`
        );
        assert(
          rawType.lightPosition.y >= 0 && rawType.lightPosition.y < ICON_HEIGHT,
          `Light position y value must be between 0 and ${ICON_HEIGHT - 1} (inclusive)`
        );
      }
    }
  }

  return errors;
}

export function validateItemCombatTab(
  rawType: ProcessedRawItemType,
  categoriesByKeys: Record<string, ItemCategory>,
  skillsByKey: Record<string, Skill>
): string[] {
  const { errors, assert } = createAssert();
  const { value: weaponType, controlledBy: weaponTypeControlledBy } = getItemSetting('weaponType', rawType, categoriesByKeys);
  if (isNotNullish(weaponType) && weaponType != WEAPON_TYPE_NONE) {
    assert(rawType.damage > 0, 'Damage must be greater than 0');
    assert(rawType.damage % 1 === 0, 'Damage must be a whole number');
    if (weaponTypeControlledBy == 0) {
      assert(WEAPON_TYPES.includes(weaponType), `Invalid weapon type '${weaponType}'`);
    }

    if (weaponType === WEAPON_TYPE_ARC) {
      assert(rawType.damageArcRadius > 0, 'Damage arc radius must be greater than 0');
      assert(rawType.damageArcRadius <= 10, 'Damage arc radius must be less than or equal to 10');
    } else if (weaponType === WEAPON_TYPE_PROJECTILE) {
      assert(rawType.projectileSpeed > 0, 'Projectile speed must be greater than 0');
      assert(rawType.projectileSpeed <= 20, 'Projectile speed must be less than or equal to 20');
      assert(rawType.projectileDistance >= 1, 'Projectile distance must be greater than or equal to 1');
      assert(rawType.projectileDistance <= 50, 'Projectile distance must be less than or equal to 50');
    }

    const { value: damagedIncreasedBySkillKey, controlledBy: damagedIncreasedBySkillKeyControlledBy } = getItemSetting(
      'damagedIncreasedBySkillKey',
      rawType,
      categoriesByKeys
    );
    if (isNotNullish(damagedIncreasedBySkillKey) && damagedIncreasedBySkillKeyControlledBy === 0) {
      assert(damagedIncreasedBySkillKey in skillsByKey, `Invalid skill: ${damagedIncreasedBySkillKey}`);
    }
  }

  return errors;
}

export function validateItemFishingTab(rawType: ProcessedRawItemType, categoriesByKeys: Record<string, ItemCategory>): string[] {
  const { errors, assert, assertNotNullish } = createAssert();
  const fishingItemType = getItemSetting('fishingItemType', rawType, categoriesByKeys).value;
  if (isNotNullish(fishingItemType)) {
    if (fishingItemType === FISHING_ITEM_TYPE_POLE) {
      if (assertNotNullish(rawType.fishingPoleAnchorPointsNorth, 'No fishing pole north facing anchor points')) {
        assertFishingPoleAnchorPoints(assert, assertNotNullish, rawType.fishingPoleAnchorPointsNorth, 'north');
      }

      if (assertNotNullish(rawType.fishingPoleAnchorPointsEast, 'No fishing pole east facing anchor points')) {
        assertFishingPoleAnchorPoints(assert, assertNotNullish, rawType.fishingPoleAnchorPointsEast, 'east');
      }

      if (assertNotNullish(rawType.fishingPoleAnchorPointsSouth, 'No fishing pole south facing anchor points')) {
        assertFishingPoleAnchorPoints(assert, assertNotNullish, rawType.fishingPoleAnchorPointsSouth, 'south');
      }

      if (assertNotNullish(rawType.fishingPoleAnchorPointsWest, 'No fishing pole west facing anchor points')) {
        assertFishingPoleAnchorPoints(assert, assertNotNullish, rawType.fishingPoleAnchorPointsWest, 'west');
      }
    } else if (fishingItemType === FISHING_ITEM_TYPE_FISH) {
      assert(rawType.fishExperience >= 1, 'Fishing experience must be greater than 0');
      assert(rawType.fishExperience % 1 === 0, 'Fishing experience must be a whole number');
    }
  }

  return errors;
}

export function assertFishingPoleAnchorPoints(
  assert: Assert,
  assertNotNullish: AssertNotNullish,
  points: FishingPoleAnchorPoints,
  direction: 'north' | 'east' | 'south' | 'west'
) {
  if (assertNotNullish(points.idle, `No fishing pole ${direction} facing idle anchor point`)) {
    assert(
      points.idle.x >= 0 && points.idle.x < PLAYER_SPRITE_WIDTH,
      `Fishing pole ${direction} facing idle anchor point x value must be between 0 and ${PLAYER_SPRITE_WIDTH - 1} (inclusive)`
    );
    assert(
      points.idle.y >= 0 && points.idle.y < PLAYER_SPRITE_HEIGHT,
      `Fishing pole ${direction} facing idle anchor point y value must be between 0 and ${PLAYER_SPRITE_HEIGHT - 1} (inclusive)`
    );
  }

  if (assertNotNullish(points.casting, `No fishing pole ${direction} facing casting anchor point`)) {
    assert(
      points.casting.x >= 0 && points.casting.x < PLAYER_SPRITE_WIDTH,
      `Fishing pole ${direction} facing casting anchor point x value must be between 0 and ${PLAYER_SPRITE_WIDTH - 1} (inclusive)`
    );
    assert(
      points.casting.y >= 0 && points.casting.y < PLAYER_SPRITE_HEIGHT,
      `Fishing pole ${direction} facing casting anchor point y value must be between 0 and ${PLAYER_SPRITE_HEIGHT - 1} (inclusive)`
    );
  }

  if (assertNotNullish(points.pulling, `No fishing pole ${direction} facing pulling anchor point`)) {
    assert(
      points.pulling.x >= 0 && points.pulling.x < PLAYER_SPRITE_WIDTH,
      `Fishing pole ${direction} facing pulling anchor point x value must be between 0 and ${PLAYER_SPRITE_WIDTH - 1} (inclusive)`
    );
    assert(
      points.pulling.y >= 0 && points.pulling.y < PLAYER_SPRITE_HEIGHT,
      `Fishing pole ${direction} facing pulling anchor point y value must be between 0 and ${PLAYER_SPRITE_HEIGHT - 1} (inclusive)`
    );
  }
}

export function checkItemCategoryConnections(
  allErrors: AllErrors,
  categories: ItemCategory[],
  damagableObjectKeys: string[],
  damagableObjectCategoryKeys: string[],
  damagableObjectSubCategoryKeys: string[],
  damagableCreatureKeys: string[],
  damagableCreatureCategoryKeys: string[],
  projectileItemOptions: string[],
  projectileItemCategoryOptions: string[]
) {
  const itemErrors: Record<string, string[]> = allErrors[ITEMS_DATA_FILE]?.[ERROR_SECTION_ITEM_CATEGORIES] ?? {};

  for (const category of categories) {
    const key = category.key;
    const errors = checkItemCategoryConnection(
      category,
      damagableObjectKeys,
      damagableObjectCategoryKeys,
      damagableObjectSubCategoryKeys,
      damagableCreatureKeys,
      damagableCreatureCategoryKeys,
      projectileItemOptions,
      projectileItemCategoryOptions
    );

    if (errors.length > 0) {
      if (key in itemErrors) {
        itemErrors[key].push(...errors);
      } else {
        itemErrors[key] = errors;
      }
    }
  }

  if (Object.keys(itemErrors).length > 0) {
    allErrors[ITEMS_DATA_FILE] = {
      ...(allErrors[ITEMS_DATA_FILE] ?? {}),
      [ERROR_SECTION_ITEM_CATEGORIES]: itemErrors
    };
  }
}

export function checkItemCategoryConnection(
  category: ItemCategory,
  damagableObjectKeys: string[],
  damagableObjectCategoryKeys: string[],
  damagableObjectSubCategoryKeys: string[],
  damagableCreatureKeys: string[],
  damagableCreatureCategoryKeys: string[],
  projectileItemKeys: string[],
  projectileItemCategoryKeys: string[]
) {
  const { errors, assert } = createAssert();

  for (const objectCategoryKey of category.settings?.damagesObjectCategoryKeys ?? []) {
    assert(
      damagableObjectCategoryKeys.includes(objectCategoryKey),
      `Damages object category: No damagable object category with key '${objectCategoryKey}' exists`
    );
  }

  for (const objectSubCategoryKey of category.settings?.damagesObjectSubCategoryKeys ?? []) {
    assert(
      damagableObjectSubCategoryKeys.includes(objectSubCategoryKey),
      `Damages object sub category: No damagable object sub category with key '${objectSubCategoryKey}' exists`
    );
  }

  for (const objectKey of category.settings?.damagesObjectKeys ?? []) {
    assert(damagableObjectKeys.includes(objectKey), `Damages object: No damagable object with key '${objectKey}' exists`);
  }

  for (const creatureCategoryKey of category.settings?.damagesCreatureCategoryKeys ?? []) {
    assert(
      damagableCreatureCategoryKeys.includes(creatureCategoryKey),
      `Damages creature category: No damagable creature category with key '${creatureCategoryKey}' exists, options: ${damagableCreatureCategoryKeys}`
    );
  }

  for (const creatureKey of category.settings?.damagesCreatureKeys ?? []) {
    assert(damagableCreatureKeys.includes(creatureKey), `Damages creature: No damagable creature with key '${creatureKey}' exists`);
  }

  for (const projectileItemCategoryKey of category.settings?.projectileItemCategoryKeys ?? []) {
    assert(
      projectileItemCategoryKeys.includes(projectileItemCategoryKey),
      `Projectile item category: No projectile item category with key '${projectileItemCategoryKey}' exists`
    );
  }

  for (const projectileItemKey of category.settings?.projectileItemKeys ?? []) {
    assert(projectileItemKeys.includes(projectileItemKey), `Projectile item: No projectile item with key ${projectileItemKey} exists`);
  }

  return errors;
}

export function checkItemsConnections(
  allErrors: AllErrors,
  items: ItemType[],
  itemsByKey: Record<string, ItemType>,
  itemCategoriesByKey: Record<string, ItemCategory>,
  objectsByKey: Record<string, ObjectType>,
  damagableObjectKeys: string[],
  damagableObjectCategoryKeys: string[],
  damagableObjectSubCategoryKeys: string[],
  damagableCreatureKeys: string[],
  damagableCreatureCategoryKeys: string[],
  projectileItemOptions: string[],
  projectileItemCategoryOptions: string[]
) {
  const itemErrors: Record<string, string[]> = allErrors[ITEMS_DATA_FILE]?.[ERROR_SECTION_ITEMS] ?? {};

  for (const type of items) {
    const key = type.key;
    const errors = [
      ...checkItemGeneralConnections(type, itemsByKey, itemCategoriesByKey, objectsByKey),
      ...checkItemCombatConnections(
        type,
        itemCategoriesByKey,
        damagableObjectKeys,
        damagableObjectCategoryKeys,
        damagableObjectSubCategoryKeys,
        damagableCreatureKeys,
        damagableCreatureCategoryKeys,
        projectileItemOptions,
        projectileItemCategoryOptions
      )
    ];

    if (errors.length > 0) {
      if (key in itemErrors) {
        itemErrors[key].push(...errors);
      } else {
        itemErrors[key] = errors;
      }
    }
  }

  if (Object.keys(itemErrors).length > 0) {
    allErrors[ITEMS_DATA_FILE] = {
      ...(allErrors[ITEMS_DATA_FILE] ?? {}),
      [ERROR_SECTION_ITEMS]: itemErrors
    };
  }
}

export function checkItemGeneralConnections(
  type: ItemType,
  itemsByKey: Record<string, ItemType>,
  itemCategoriesByKey: Record<string, ItemCategory>,
  objectsByKey: Record<string, ObjectType>
) {
  const { errors, assert, assertNotNullish } = createAssert();

  const placeable = getItemSetting('placeable', type, itemCategoriesByKey).value;
  const requiredObjectCategoryKey = getItemSetting('requiredObjectCategoryKey', type, itemCategoriesByKey).value;
  if (placeable && isNotNullish(type.objectTypeKey)) {
    const objectType = objectsByKey[type.objectTypeKey];
    if (assertNotNullish(objectType, `Object to place: No object with key ${type.objectTypeKey} exists`) && requiredObjectCategoryKey) {
      assert(objectType.categoryKey == requiredObjectCategoryKey, `Must have an object in the ${requiredObjectCategoryKey} category`);
    }
  }

  const isEdible = getItemSetting('isEdible', type, itemCategoriesByKey).value;
  if (isEdible) {
    assert(
      isNullish(type.edibleLeftoverItemTypeKey) || type.edibleLeftoverItemTypeKey in itemsByKey,
      `Edible leftover item: No item with key ${type.edibleLeftoverItemTypeKey} exists`
    );
  }

  return errors;
}

export function checkItemCombatConnections(
  type: ItemType,
  itemCategoriesByKey: Record<string, ItemCategory>,
  damagableObjectKeys: string[],
  damagableObjectCategoryKeys: string[],
  damagableObjectSubCategoryKeys: string[],
  damagableCreatureKeys: string[],
  damagableCreatureCategoryKeys: string[],
  projectileItemOptions: string[],
  projectileItemCategoryOptions: string[]
) {
  const { errors, assert } = createAssert();

  const { value: damagesObjectCategoryKeys, controlledBy: damagesObjectCategoryKeysControlledBy } = getItemSetting(
    'damagesObjectCategoryKeys',
    type,
    itemCategoriesByKey
  );
  if (damagesObjectCategoryKeysControlledBy == 0) {
    for (const objectCategoryKey of damagesObjectCategoryKeys ?? []) {
      assert(
        damagableObjectCategoryKeys.includes(objectCategoryKey),
        `Damages object category: No damagable object category with key ${objectCategoryKey} exists`
      );
    }
  }

  const { value: damagesObjectSubCategoryKeys, controlledBy: damagesObjectSubCategoryKeysControlledBy } = getItemSetting(
    'damagesObjectSubCategoryKeys',
    type,
    itemCategoriesByKey
  );
  if (damagesObjectSubCategoryKeysControlledBy == 0) {
    for (const objectSubCategoryKey of damagesObjectSubCategoryKeys ?? []) {
      assert(
        damagableObjectSubCategoryKeys.includes(objectSubCategoryKey),
        `Damages object sub category: No damagable object sub category with key ${objectSubCategoryKey} exists`
      );
    }
  }

  const { value: damagesObjectKeys, controlledBy: damagesObjectKeysControlledBy } = getItemSetting(
    'damagesObjectKeys',
    type,
    itemCategoriesByKey
  );
  if (damagesObjectKeysControlledBy == 0) {
    for (const objectKey of damagesObjectKeys ?? []) {
      assert(damagableObjectKeys.includes(objectKey), `Damages object: No object with key ${objectKey} exists`);
    }
  }

  const { value: damagesCreatureCategoryKeys, controlledBy: damagesCreatureCategoryKeysControlledBy } = getItemSetting(
    'damagesCreatureCategoryKeys',
    type,
    itemCategoriesByKey
  );
  if (damagesCreatureCategoryKeysControlledBy == 0) {
    for (const creatureCategoryKey of damagesCreatureCategoryKeys ?? []) {
      assert(
        damagableCreatureCategoryKeys.includes(creatureCategoryKey),
        `Damages creature category: No damagable creature category with key ${creatureCategoryKey} exists`
      );
    }
  }

  const { value: damagesCreatureKeys, controlledBy: damagesCreatureKeysControlledBy } = getItemSetting(
    'damagesCreatureKeys',
    type,
    itemCategoriesByKey
  );
  if (damagesCreatureKeysControlledBy == 0) {
    for (const creatureKey of damagesCreatureKeys ?? []) {
      assert(damagableCreatureKeys.includes(creatureKey), `Damages creature: No creature with key ${creatureKey} exists`);
    }
  }

  const { value: projectileItemCategoryKeys, controlledBy: projectileItemCategoryKeysControlledBy } = getItemSetting(
    'projectileItemCategoryKeys',
    type,
    itemCategoriesByKey
  );
  if (projectileItemCategoryKeysControlledBy == 0) {
    for (const projectileItemCategoryKey of projectileItemCategoryKeys ?? []) {
      assert(
        projectileItemCategoryOptions.includes(projectileItemCategoryKey),
        `Projectile item category: No projectile item category with key '${projectileItemCategoryKey}' exists`
      );
    }
  }

  const { value: projectileItemKeys, controlledBy: projectileItemKeysControlledBy } = getItemSetting(
    'projectileItemKeys',
    type,
    itemCategoriesByKey
  );
  if (projectileItemKeysControlledBy == 0) {
    for (const projectileItemKey of projectileItemKeys ?? []) {
      assert(projectileItemOptions.includes(projectileItemKey), `Projectile item: No projectile item with key ${projectileItemKey} exists`);
    }
  }

  return errors;
}

/**
 * Loot Tables
 */
export function validateLootTables(
  allErrors: AllErrors,
  rawLootTables: ProcessedRawLootTable[] | null | undefined,
  itemsByKey: Record<string, ItemType>
): {
  lootTables: LootTable[];
  lootTablesByKey: Record<string, LootTable>;
} {
  const lootTables: LootTable[] = [];
  const lootTablesByKey: Record<string, LootTable> = {};

  if (!isNotNullish(rawLootTables)) {
    return { lootTables, lootTablesByKey };
  }

  const lootTableErrors: Record<string, string[]> = {};

  let i = 1;
  for (const rawLootTable of rawLootTables) {
    let key: string;
    if (isNotNullish(rawLootTable.key)) {
      key = rawLootTable.key;
    } else {
      key = `Loot Table #${i}`;
    }

    const errors = validateLootTable(rawLootTable, itemsByKey);

    if (isNotNullish(rawLootTable.key)) {
      const category = toLootTable(rawLootTable, i);
      lootTables.push(category);
      lootTablesByKey[category.key] = category;
    }

    if (errors.length > 0) {
      lootTableErrors[key] = errors;
    }

    i++;
  }

  if (Object.keys(lootTableErrors).length > 0) {
    allErrors[LOOT_TABLES_DATA_FILE] = lootTableErrors;
  }

  return { lootTables, lootTablesByKey };
}

export function validateLootTable(rawLootTable: ProcessedRawLootTable, itemTypesByKey: Record<string, ItemType>) {
  const { errors, assert, assertNotNullish } = createAssert();
  assertNotNullish(rawLootTable.key, 'No key');

  if (assertNotNullish(rawLootTable.defaultGroup, 'No default group')) {
    assertLootTableComponentGroup(assert, assertNotNullish, rawLootTable.defaultGroup, -1, itemTypesByKey);
  }

  if (assertNotNullish(rawLootTable.groups, 'No groups')) {
    for (let index = 0; index < rawLootTable.groups.length; index++) {
      assertLootTableComponentGroup(assert, assertNotNullish, rawLootTable.groups[index], index + 1, itemTypesByKey);
    }
  }

  return errors;
}

export function assertLootTableComponentGroup(
  assert: Assert,
  assertNotNullish: AssertNotNullish,
  group: ProcessedRawLootTableComponentGroup,
  groupIndex: number,
  itemTypesByKey: Record<string, ItemType>
) {
  const header = groupIndex === -1 ? 'Default Group' : `Group ${groupIndex}`;
  assert(group.probability <= 100 && group.probability >= 0, `${header}: Probability must be between 0 and 100 inclusive`);
  assert(group.probability % 1 === 0, `${header}: Probability must be a whole number`);

  if (
    assertNotNullish(group.components, `${header}: No components`) &&
    assert(group.components.length != 0, `${header}: There must be at least one component`)
  ) {
    for (let index = 0; index < group.components.length; index++) {
      assertLootTableComponent(assert, assertNotNullish, group.components[index], index + 1, itemTypesByKey, `${header},`);
    }
  }
}

export function assertLootTableComponent(
  assert: Assert,
  assertNotNullish: AssertNotNullish,
  component: LootTableComponent,
  index: number,
  itemTypes: Record<string, ItemType>,
  header: string
) {
  if (assertNotNullish(component.typeKey, `${header} Component ${index}: No item type key`)) {
    assert(component.typeKey in itemTypes, `${header} Component ${index}: No item with key ${component.typeKey} exists`);
  }
  assert(component.min >= 0, `${header} Component ${index}: Min cannot be negative`);
  assert(component.min % 1 === 0, `${header} Component ${index}: Min must be a whole number`);
  assert(component.max >= 1, `${header} Component ${index}: Max must be greater than or equal to 1`);
  assert(component.max % 1 === 0, `${header} Component ${index}: Max must be a whole number`);
  assert(component.max >= component.min, `${header} Component ${index}: Max must be greater than or equal to min`);
  assert(
    component.probability <= 100 && component.probability >= 0,
    `${header} Component ${index}: Probability must be between 0 and 100 inclusive`
  );
  assert(component.probability % 1 === 0, `${header} Component ${index}: Probability must be a whole number`);
}

/**
 * Crafting Recipes
 */
export function validateCraftingRecipeCategories(
  allErrors: AllErrors,
  rawCraftingRecipeCategories: ProcessedRawCraftingRecipeCategory[] | null | undefined
): {
  craftingRecipeCategories: CraftingRecipeCategory[];
  craftingRecipeCategoriesByKey: Record<string, CraftingRecipeCategory>;
} {
  const craftingRecipeCategories: CraftingRecipeCategory[] = [];
  const craftingRecipeCategoriesByKey: Record<string, CraftingRecipeCategory> = {};

  if (!isNotNullish(rawCraftingRecipeCategories)) {
    return { craftingRecipeCategories, craftingRecipeCategoriesByKey };
  }

  const craftingRecipeErrors: Record<string, string[]> = {};

  let i = 1;
  for (const rawCategory of rawCraftingRecipeCategories) {
    let key: string;
    if (isNotNullish(rawCategory.key)) {
      key = rawCategory.key;
    } else {
      key = `Crafting Recipe Category #${i}`;
    }

    const errors = validateCraftingRecipeCategory(rawCategory);

    if (isNotNullish(rawCategory.key)) {
      const category = toCraftingRecipeCategory(rawCategory, i);
      craftingRecipeCategories.push(category);
      craftingRecipeCategoriesByKey[category.key] = category;
    }

    if (errors.length > 0) {
      craftingRecipeErrors[key] = errors;
    }

    i++;
  }

  if (Object.keys(craftingRecipeErrors).length > 0) {
    allErrors[CRAFTING_RECIPES_DATA_FILE] = {
      ...(allErrors[CRAFTING_RECIPES_DATA_FILE] ?? {}),
      [ERROR_SECTION_CRAFTING_RECIPE_CATEGORIES]: craftingRecipeErrors
    };
  }

  return { craftingRecipeCategories, craftingRecipeCategoriesByKey };
}

export function validateCraftingRecipeCategory(rawCategory: ProcessedRawCraftingRecipeCategory) {
  const { errors, assertNotNullish } = createAssert();

  assertNotNullish(rawCategory.key, 'No key');

  return errors;
}

export function validateCraftingRecipes(
  allErrors: AllErrors,
  rawCraftingRecipes: ProcessedRawCraftingRecipe[] | null | undefined,
  craftingRecipeCategoriesByKey: Record<string, CraftingRecipeCategory>,
  skillsByKey: Record<string, Skill>,
  itemTypesByKey: Record<string, ItemType>,
  workstationKeys: string[]
): {
  craftingRecipes: CraftingRecipe[];
  craftingRecipesByKey: Record<string, CraftingRecipe>;
  craftingRecipesByCategory: Record<string, CraftingRecipe[]>;
} {
  const craftingRecipes: CraftingRecipe[] = [];
  const craftingRecipesByKey: Record<string, CraftingRecipe> = {};
  const craftingRecipesByCategory: Record<string, CraftingRecipe[]> = {};

  if (!isNotNullish(rawCraftingRecipes)) {
    return { craftingRecipes, craftingRecipesByKey, craftingRecipesByCategory };
  }

  const craftingRecipeErrors: Record<string, string[]> = {};

  let i = 1;
  for (const rawRecipe of rawCraftingRecipes) {
    let key: string;
    if (isNotNullish(rawRecipe.key)) {
      key = rawRecipe.key;
    } else {
      key = `Recipe #${i}`;
    }

    const errors = validateCraftingRecipe(rawRecipe, craftingRecipeCategoriesByKey, skillsByKey, itemTypesByKey, workstationKeys);

    if (isNotNullish(rawRecipe.key)) {
      const recipe = toCraftingRecipe(rawRecipe, i);
      craftingRecipes.push(recipe);
      craftingRecipesByKey[recipe.key] = recipe;
      if (isNotNullish(recipe.categoryKey)) {
        addToCategory(craftingRecipesByCategory, recipe.categoryKey, recipe);
      }
      if (isNotNullish(recipe.searchCategories)) {
        for (const searchCategory of recipe.searchCategories) {
          addToCategory(craftingRecipesByCategory, searchCategory, recipe);
        }
      }
    }

    if (errors.length > 0) {
      craftingRecipeErrors[key] = errors;
    }

    i++;
  }

  if (Object.keys(craftingRecipeErrors).length > 0) {
    allErrors[CRAFTING_RECIPES_DATA_FILE] = {
      ...(allErrors[CRAFTING_RECIPES_DATA_FILE] ?? {}),
      [ERROR_SECTION_CRAFTING_RECIPES]: craftingRecipeErrors
    };
  }

  return { craftingRecipes, craftingRecipesByKey, craftingRecipesByCategory };
}

export function validateCraftingRecipe(
  rawRecipe: ProcessedRawCraftingRecipe,
  craftingRecipeCategoriesByKey: Record<string, CraftingRecipeCategory>,
  skillsByKey: Record<string, Skill>,
  itemTypesByKey: Record<string, ItemType>,
  workstationKeys: string[]
) {
  const { errors, assert, assertNotNullish } = createAssert();
  assertNotNullish(rawRecipe.key, 'No key');

  assert(rawRecipe.craftingTime > 0, 'Crafting time must be greater than 0');
  assert(rawRecipe.craftingTime % 1 === 0, 'Crafting time must be a whole number');

  assert(rawRecipe.amount > 0, 'Amount must be greater than 0');
  assert(rawRecipe.amount % 1 === 0, 'Amount must be a whole number');

  if (isNotNullish(rawRecipe.requiredSkillKey)) {
    if (assert(rawRecipe.requiredSkillKey in skillsByKey, `No skill with key '${rawRecipe.requiredSkillKey}' exists`)) {
      if (assertNotNullish(rawRecipe.requiredSkillLevelKey, 'No skill level')) {
        const skill = skillsByKey[rawRecipe.requiredSkillKey];
        assert(
          isNotNullish(skill.levels.find((skillLevel) => skillLevel.key === rawRecipe.requiredSkillLevelKey)),
          `No skill level with key '${rawRecipe.requiredSkillLevelKey}' exists on skill '${rawRecipe.requiredSkillKey}'`
        );
      }
    }
  }

  if (assertNotNullish(rawRecipe.itemTypeKey, 'No item type')) {
    assert(rawRecipe.itemTypeKey in itemTypesByKey, `No item with key '${rawRecipe.itemTypeKey}' exists`);
  }

  if (isNotNullish(rawRecipe.hiddenResultsTypeKeys) && rawRecipe.hiddenResultsTypeKeys.length > 0) {
    for (let i = 0; i < rawRecipe.hiddenResultsTypeKeys.length; i++) {
      const key = rawRecipe.hiddenResultsTypeKeys[i];
      assert(key in itemTypesByKey, `Hidden result ${i + 1}: No item with key '${key}'' exists`);
    }
  }

  if (assertNotNullish(rawRecipe.categoryKey, 'No category')) {
    assert(rawRecipe.categoryKey in craftingRecipeCategoriesByKey, `Invalid category: ${rawRecipe.categoryKey}`);
  }

  if (isNotNullish(rawRecipe.workstation)) {
    assert(workstationKeys.includes(rawRecipe.workstation), `Invalid workstation (object): ${rawRecipe.workstation}`);
  }

  if (
    assertNotNullish(rawRecipe.ingredients, 'No ingredients') &&
    assert(Object.keys(rawRecipe.ingredients).length > 0, 'There must be at least 1 ingredient')
  ) {
    for (const ingredientKey of Object.keys(rawRecipe.ingredients)) {
      assertIngredient(assert, ingredientKey, rawRecipe.ingredients[ingredientKey], itemTypesByKey);
    }
  }

  return errors;
}

export function addToCategory(craftingRecipesByCategory: Record<string, CraftingRecipe[]>, category: string, recipe: CraftingRecipe) {
  if (!(category in craftingRecipesByCategory)) {
    craftingRecipesByCategory[category] = [];
  }
  craftingRecipesByCategory[category].push(recipe);
}

export function assertIngredient(assert: Assert, ingredientKey: string, amount: number, itemTypes: Record<string, ItemType>) {
  assert(ingredientKey in itemTypes, `Ingredient ${ingredientKey}: No item with key ${ingredientKey} exists`);
  assert(amount > 0, `Ingredient ${ingredientKey}: Amount must be greater than 0`);
  assert(amount % 1 === 0, `Ingredient ${ingredientKey}: Amount must be a whole number`);
}

/**
 * Objects
 */
export function validateObjectCategories(
  allErrors: AllErrors,
  rawObjectCategories: ProcessedRawObjectCategory[] | null | undefined
): {
  objectCategories: ObjectCategory[];
  objectCategoriesByKey: Record<string, ObjectCategory>;
} {
  const objectCategories: ObjectCategory[] = [];
  const objectCategoriesByKey: Record<string, ObjectCategory> = {};

  if (!isNotNullish(rawObjectCategories)) {
    return { objectCategories, objectCategoriesByKey };
  }

  const objectCategoryErrors: Record<string, string[]> = {};

  let i = 1;
  for (const rawCategory of rawObjectCategories) {
    let key: string;
    if (isNotNullish(rawCategory.key)) {
      key = rawCategory.key;
    } else {
      key = `Object Category #${i}`;
    }

    const errors = validateObjectCategory(rawCategory);

    if (isNotNullish(rawCategory.key)) {
      const category = toObjectCategory(rawCategory, i);
      objectCategories.push(category);
      objectCategoriesByKey[category.key] = category;
    }

    if (errors.length > 0) {
      objectCategoryErrors[key] = errors;
    }

    i++;
  }

  if (Object.keys(objectCategoryErrors).length > 0) {
    allErrors[OBJECTS_DATA_FILE] = {
      ...(allErrors[OBJECTS_DATA_FILE] ?? {}),
      [ERROR_SECTION_OBJECT_CATEGORIES]: objectCategoryErrors
    };
  }

  return { objectCategories, objectCategoriesByKey };
}

/**
 * Objects
 */
export function validateObjectCategory(rawCategory: ProcessedRawObjectCategory) {
  return [
    ...validateObjectCategoryGeneralTab(rawCategory),
    ...validateObjectCategoryPlacementSpawningTab(rawCategory),
    ...validatePhysicsTab(rawCategory)
  ];
}

export function validateObjectCategoryGeneralTab(rawCategory: ProcessedRawObjectCategory) {
  const { errors, assert, assertNotNullish } = createAssert();
  assertNotNullish(rawCategory.key, 'No key');

  const lootType = rawCategory.settings?.lootType;
  if (assertNotNullish(lootType, 'No loot type')) {
    assert(LOOT_TYPES.includes(lootType as LootType), `Invalid loot type: ${lootType}`);
  }

  const stagesType = rawCategory.settings?.stagesType;
  if (assertNotNullish(stagesType, 'No stages type')) {
    assert(STAGES_TYPES.includes(stagesType as StagesType), `Invalid stages type: ${stagesType}`);
  }

  const inventoryType = rawCategory.settings?.inventoryType;
  const isWorkstation = rawCategory.settings?.isWorkstation;
  if (assertNotNullish(inventoryType, 'No inventory type')) {
    assert(INVENTORY_TYPES.includes(inventoryType as InventoryType), `Invalid inventory type: ${inventoryType}`);
    assert(!isWorkstation || inventoryType === INVENTORY_TYPE_SMALL, 'Workstations must have small inventories');
  }

  assert(
    (isNotNullish(stagesType) && stagesType !== STAGES_TYPE_NONE) || lootType !== LOOT_TYPE_STAGE_DROP,
    `Loot type ${LOOT_TYPE_STAGE_DROP} requires stages`
  );

  return errors;
}

export function validateObjectCategoryPlacementSpawningTab(rawCategory: ProcessedRawObjectCategory) {
  const { errors, assert, assertNotNullish } = createAssert();

  const placementPosition = rawCategory.settings?.placementPosition;
  if (assertNotNullish(placementPosition, 'No placement position')) {
    assert(PLACEMENT_POSITIONS.includes(placementPosition as PlacementPosition), `Invalid placement position: ${placementPosition}`);
  }

  const placementLayer = rawCategory.settings?.placementLayer;
  if (assertNotNullish(placementLayer, 'No placement layer')) {
    assert(PLACEMENT_LAYERS.includes(placementLayer as PlacementLayer), `Invalid placement layer: ${placementLayer}`);
  }

  const spawningConditions = rawCategory.settings?.spawningConditions;
  if (isNotNullish(spawningConditions)) {
    assertSpawningConditions(assert, spawningConditions);
  }

  return errors;
}

export function checkObjectCategoriesRequiredSettings(
  allErrors: AllErrors,
  categories: ObjectCategory[],
  objectCategoriesByKey: Record<string, ObjectCategory>,
  objectSubCategoriesByKey: Record<string, ObjectSubCategory>,
  objectsByKey: Record<string, ObjectType>
) {
  const objectErrors: Record<string, string[]> = allErrors[OBJECTS_DATA_FILE]?.[ERROR_SECTION_OBJECT_CATEGORIES] ?? {};

  for (const category of categories) {
    const key = category.key;

    const placementLayer = category.settings?.placementLayer;
    if (isNotNullish(placementLayer) && isNotNullish(category.settings)) {
      const errors = [
        ...checkObjectRequiredBelowSettings(
          placementLayer,
          category.settings,
          objectCategoriesByKey,
          objectSubCategoriesByKey,
          objectsByKey
        ),
        ...checkObjectRequiredAdjacentSettings(
          placementLayer,
          category.settings,
          objectCategoriesByKey,
          objectSubCategoriesByKey,
          objectsByKey
        )
      ];

      if (errors.length > 0) {
        if (key in objectErrors) {
          objectErrors[key].push(...errors);
        } else {
          objectErrors[key] = errors;
        }
      }
    }
  }

  if (Object.keys(objectErrors).length > 0) {
    allErrors[OBJECTS_DATA_FILE] = {
      ...(allErrors[OBJECTS_DATA_FILE] ?? {}),
      [ERROR_SECTION_OBJECT_CATEGORIES]: objectErrors
    };
  }
}

export function validateObjectSubCategories(
  allErrors: AllErrors,
  rawObjectSubCategories: ProcessedRawObjectSubCategory[] | null | undefined,
  categoriesByKey: Record<string, ObjectCategory>
): {
  objectSubCategories: ObjectSubCategory[];
  objectSubCategoriesByKey: Record<string, ObjectSubCategory>;
} {
  const objectSubCategories: ObjectSubCategory[] = [];
  const objectSubCategoriesByKey: Record<string, ObjectSubCategory> = {};

  if (!isNotNullish(rawObjectSubCategories)) {
    return { objectSubCategories, objectSubCategoriesByKey };
  }

  const objectSubCategoryErrors: Record<string, string[]> = {};

  let i = 1;
  for (const rawSubCategory of rawObjectSubCategories) {
    let key: string;
    if (isNotNullish(rawSubCategory.key)) {
      key = rawSubCategory.key;
    } else {
      key = `Object Sub Category #${i}`;
    }

    const errors = validateObjectSubCategory(rawSubCategory, categoriesByKey);

    if (isNotNullish(rawSubCategory.key)) {
      const subCategory = toObjectSubCategory(rawSubCategory, i);
      objectSubCategories.push(subCategory);
      objectSubCategoriesByKey[subCategory.key] = subCategory;
    }

    if (errors.length > 0) {
      objectSubCategoryErrors[key] = errors;
    }

    i++;
  }

  if (Object.keys(objectSubCategoryErrors).length > 0) {
    allErrors[OBJECTS_DATA_FILE] = {
      ...(allErrors[OBJECTS_DATA_FILE] ?? {}),
      [ERROR_SECTION_OBJECT_SUB_CATEGORIES]: objectSubCategoryErrors
    };
  }

  return { objectSubCategories, objectSubCategoriesByKey };
}

export function validateObjectSubCategory(rawSubCategory: ProcessedRawObjectSubCategory, categoriesByKey: Record<string, ObjectCategory>) {
  return [
    ...validateObjectSubCategoryGeneralTab(rawSubCategory, categoriesByKey),
    ...validateObjectSubCategoryPlacementSpawningTab(rawSubCategory, categoriesByKey),
    ...validateObjectSubCategorySpriteRulesTab(rawSubCategory, categoriesByKey),
    ...validatePhysicsTab(rawSubCategory)
  ];
}

export function validateObjectSubCategoryGeneralTab(
  rawSubCategory: ProcessedRawObjectSubCategory,
  categoriesByKey: Record<string, ObjectCategory>
) {
  const { errors, assert, assertNotNullish, assertNotEmpty } = createAssert();
  assertNotNullish(rawSubCategory.key, 'No key');
  if (assertNotEmpty(rawSubCategory.categoryKey, 'No category')) {
    assert(rawSubCategory.categoryKey in categoriesByKey, `Invalid category: ${rawSubCategory.categoryKey}`);
  }

  const { value: lootType, controlledBy: lootTypeControlledBy } = getObjectSetting('lootType', rawSubCategory, categoriesByKey, {});
  if (isNotNullish(lootType) && lootTypeControlledBy === 0) {
    assert(LOOT_TYPES.includes(lootType), `Invalid loot type: ${lootType}`);
  }

  const { value: stagesType, controlledBy: stagesTypeControlledBy } = getObjectSetting('stagesType', rawSubCategory, categoriesByKey, {});
  if (isNotNullish(stagesType) && stagesTypeControlledBy === 0) {
    assert(STAGES_TYPES.includes(stagesType), `Invalid stages type: ${stagesType}`);
  }

  if (lootTypeControlledBy === 0 || stagesTypeControlledBy === 0) {
    assert(
      (isNotNullish(stagesType) && stagesType !== STAGES_TYPE_NONE) || lootType !== LOOT_TYPE_STAGE_DROP,
      `Loot type ${LOOT_TYPE_STAGE_DROP} requires stages`
    );
  }

  const { value: inventoryType, controlledBy: inventoryTypeControlledBy } = getObjectSetting(
    'inventoryType',
    rawSubCategory,
    categoriesByKey,
    {}
  );
  const { value: isWorkstation, controlledBy: isWorkstationControlledBy } = getObjectSetting(
    'isWorkstation',
    rawSubCategory,
    categoriesByKey,
    {}
  );
  if (inventoryTypeControlledBy === 0) {
    if (assertNotNullish(inventoryType, 'No inventory type')) {
      assert(INVENTORY_TYPES.includes(inventoryType), `Invalid inventory type: ${inventoryType}`);
    }
  }

  if (inventoryTypeControlledBy === 0 || isWorkstationControlledBy === 0) {
    assert(!isWorkstation || inventoryType === INVENTORY_TYPE_SMALL, 'Workstations must have small inventories');
  }

  return errors;
}

export function validateObjectSubCategoryPlacementSpawningTab(
  rawSubCategory: ProcessedRawObjectSubCategory,
  categoriesByKey: Record<string, ObjectCategory>
) {
  const { errors, assert } = createAssert();

  const { value: placementPosition, controlledBy: placementPositionControlledBy } = getObjectSetting(
    'placementPosition',
    rawSubCategory,
    categoriesByKey,
    {}
  );
  if (isNotNullish(placementPosition) && placementPositionControlledBy === 1) {
    assert(PLACEMENT_POSITIONS.includes(placementPosition), `Invalid placement position: ${placementPosition}`);
  }

  const { value: placementLayer, controlledBy: placementLayerControlledBy } = getObjectSetting(
    'placementLayer',
    rawSubCategory,
    categoriesByKey,
    {}
  );
  if (isNotNullish(placementLayer) && placementLayerControlledBy === 1) {
    assert(PLACEMENT_LAYERS.includes(placementLayer), `Invalid placement layer: ${placementLayer}`);
  }

  const { value: spawningConditions, controlledBy: spawningConditionsControlledBy } = getObjectSetting(
    'spawningConditions',
    rawSubCategory,
    categoriesByKey,
    {}
  );
  if (isNotNullish(spawningConditions) && spawningConditionsControlledBy === 1) {
    assertSpawningConditions(assert, spawningConditions);
  }

  return errors;
}

export function validateObjectSubCategorySpriteRulesTab(
  rawSubCategory: ProcessedRawObjectSubCategory,
  categoriesByKey: Record<string, ObjectCategory>
) {
  const { errors, assert, assertNotNullish } = createAssert();

  const { value: lootType } = getObjectSetting('lootType', rawSubCategory, categoriesByKey, {});
  const { value: stagesType } = getObjectSetting('stagesType', rawSubCategory, categoriesByKey, {});

  const { value: canOpen = false } = getObjectSetting('canOpen', rawSubCategory, categoriesByKey, {});
  if (isNotNullish(rawSubCategory.rulesets) && rawSubCategory.rulesets.length > 0) {
    assert(!canOpen, 'Object sub categories that can open cannot have rulesets');
  }

  if (lootType === LOOT_TYPE_STAGE_DROP || (isNotNullish(stagesType) && stagesType !== STAGES_TYPE_NONE)) {
    assert(isNullish(rawSubCategory.rulesets), 'Object sub categories with stages cannot have rulesets');
  } else if (isNotNullish(rawSubCategory.rulesets)) {
    const { value: placementPosition } = getObjectSetting('placementPosition', rawSubCategory, categoriesByKey, {});
    const rulesetsProcessed = false;
    if (isNotNullish(placementPosition)) {
      if (placementPosition === PLACEMENT_POSITION_CENTER) {
        assert(
          isNotNullish(rawSubCategory.rulesets) &&
            rawSubCategory.rulesets.length > 0 &&
            isNotNullish(rawSubCategory.rulesets[0].rules) &&
            rawSubCategory.rulesets[0].rules.length > 0,
          `One sprite ruleset are required for ${rawSubCategory.key}`
        );
        if (isNotNullish(rawSubCategory.rulesets) && rawSubCategory.rulesets.length > 0) {
          assertSubCategorySpriteRules(assert, assertNotNullish, 'Sprite rule', rawSubCategory.rulesets[0]);
        }
      } else if (placementPosition === PLACEMENT_POSITION_EDGE) {
        assert(
          isNotNullish(rawSubCategory.rulesets) &&
            rawSubCategory.rulesets.length >= 2 &&
            isNotNullish(rawSubCategory.rulesets[0].rules) &&
            rawSubCategory.rulesets[0].rules.length > 0 &&
            isNotNullish(rawSubCategory.rulesets[1].rules) &&
            rawSubCategory.rulesets[1].rules.length > 0,
          `Two sprite rulesets (front [0] and side [1]) are required for ${rawSubCategory.key}`
        );
        if (isNotNullish(rawSubCategory.rulesets)) {
          if (rawSubCategory.rulesets.length >= 1) {
            assertSubCategorySpriteRules(assert, assertNotNullish, 'Front sprite rule', rawSubCategory.rulesets[0]);
          }
          if (rawSubCategory.rulesets.length >= 2) {
            assertSubCategorySpriteRules(assert, assertNotNullish, 'Side sprite rule', rawSubCategory.rulesets[1]);
          }
        }
      }
    }

    if (!rulesetsProcessed) {
      if (isNotNullish(rawSubCategory.rulesets) && rawSubCategory.rulesets.length > 0) {
        assertSubCategorySpriteRules(assert, assertNotNullish, 'Sprite rule', rawSubCategory.rulesets[0]);
      }
    }
  }

  return errors;
}

export function checkObjectSubCategoriesRequiredSettings(
  allErrors: AllErrors,
  subCategories: ObjectSubCategory[],
  objectCategoriesByKey: Record<string, ObjectCategory>,
  objectSubCategoriesByKey: Record<string, ObjectSubCategory>,
  objectsByKey: Record<string, ObjectType>
) {
  const objectErrors: Record<string, string[]> = allErrors[OBJECTS_DATA_FILE]?.[ERROR_SECTION_OBJECT_SUB_CATEGORIES] ?? {};

  for (const subCategory of subCategories) {
    const key = subCategory.key;

    const placementLayer = getObjectSetting('placementLayer', subCategory, objectCategoriesByKey).value;
    if (isNotNullish(placementLayer) && isNotNullish(subCategory.settings)) {
      const errors = [
        ...checkObjectRequiredBelowSettings(
          placementLayer,
          subCategory.settings,
          objectCategoriesByKey,
          objectSubCategoriesByKey,
          objectsByKey
        ),
        ...checkObjectRequiredAdjacentSettings(
          placementLayer,
          subCategory.settings,
          objectCategoriesByKey,
          objectSubCategoriesByKey,
          objectsByKey
        )
      ];

      if (errors.length > 0) {
        if (key in objectErrors) {
          objectErrors[key].push(...errors);
        } else {
          objectErrors[key] = errors;
        }
      }
    }
  }

  if (Object.keys(objectErrors).length > 0) {
    allErrors[OBJECTS_DATA_FILE] = {
      ...(allErrors[OBJECTS_DATA_FILE] ?? {}),
      [ERROR_SECTION_OBJECT_SUB_CATEGORIES]: objectErrors
    };
  }
}

export function validateObjects(
  allErrors: AllErrors,
  rawObjects: ProcessedRawObjectType[] | null | undefined,
  categoriesByKey: Record<string, ObjectCategory>,
  subCategories: ObjectSubCategory[],
  subCategoriesByKey: Record<string, ObjectSubCategory>,
  lootTablesByKey: Record<string, LootTable>,
  spriteCounts: Record<string, number>,
  accentSpriteCounts: Record<string, Record<string, number>>,
  localization: Localization | null | undefined,
  localizationKeys: string[]
): {
  objects: ObjectType[];
  objectsByKey: Record<string, ObjectType>;
} {
  const objects: ObjectType[] = [];
  const objectsByKey: Record<string, ObjectType> = {};

  if (!isNotNullish(rawObjects)) {
    return { objects, objectsByKey };
  }

  const objectErrors: Record<string, string[]> = {};
  const idsSeen: number[] = [];

  let i = 1;
  for (const rawType of rawObjects) {
    let key: string;
    if (isNotNullish(rawType.key)) {
      key = rawType.key;
    } else {
      key = `Object #${i}`;
    }

    const errors = validateObject(
      rawType,
      categoriesByKey,
      subCategories,
      subCategoriesByKey,
      lootTablesByKey,
      spriteCounts,
      accentSpriteCounts,
      localization,
      localizationKeys,
      idsSeen
    );

    if (isNotNullish(rawType.key)) {
      const type = toObjectType(rawType, i);
      objects.push(type);
      objectsByKey[type.key] = type;
      idsSeen.push(type.id);
    }

    if (errors.length > 0) {
      objectErrors[key] = errors;
    }

    i++;
  }

  if (Object.keys(objectErrors).length > 0) {
    allErrors[OBJECTS_DATA_FILE] = {
      ...(allErrors[OBJECTS_DATA_FILE] ?? {}),
      [ERROR_SECTION_OBJECTS]: objectErrors
    };
  }

  return { objects, objectsByKey };
}

export function validateObject(
  rawType: ProcessedRawObjectType,
  categoriesByKey: Record<string, ObjectCategory>,
  subCategories: ObjectSubCategory[],
  subCategoriesByKey: Record<string, ObjectSubCategory>,
  lootTablesByKey: Record<string, LootTable>,
  spriteCounts: Record<string, number>,
  accentSpriteCounts: Record<string, Record<string, number>>,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  idsSeen: number[]
) {
  return [
    ...validateObjectGeneralTab(
      rawType,
      categoriesByKey,
      subCategories,
      subCategoriesByKey,
      lootTablesByKey,
      localization,
      localizationKeys,
      idsSeen
    ),
    ...validateObjectPlacementSpawningTab(rawType, categoriesByKey, subCategoriesByKey),
    ...validateObjectSpriteStageTab(rawType, categoriesByKey, subCategoriesByKey, lootTablesByKey, spriteCounts, accentSpriteCounts),
    ...validatePhysicsTab(rawType)
  ];
}

export function validateObjectGeneralTab(
  rawType: ProcessedRawObjectType,
  categoriesByKey: Record<string, ObjectCategory>,
  subCategories: ObjectSubCategory[],
  subCategoriesByKey: Record<string, ObjectSubCategory>,
  lootTablesByKey: Record<string, LootTable>,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  idsSeen: number[]
) {
  const { errors, assert, assertNotNullish, assertNotEmpty } = createAssert();
  if (assertNotNullish(rawType.id, 'No id') && rawType.id != 0) {
    assert(!idsSeen.includes(rawType.id), `Duplicate id: ${rawType.id}`);
  }

  if (assertNotNullish(rawType.key, 'No key') && localization) {
    assertNotEmpty(getLocalizedValue(localization, localizationKeys, getLocalizationKey('object', 'name', rawType.key)), 'No name');
  }

  if (assertNotNullish(rawType.categoryKey, 'No category')) {
    assert(rawType.categoryKey in categoriesByKey, `Invalid category: ${rawType.categoryKey}`);
    const availableSubCategories = subCategories.filter((subCategory) => subCategory.categoryKey === rawType.categoryKey);
    if (availableSubCategories.length > 0) {
      if (assertNotNullish(rawType.subCategoryKey, 'No sub category')) {
        assert(
          isNotNullish(availableSubCategories.find((subCategory) => subCategory.key === rawType.subCategoryKey)),
          `Invalid sub category: ${rawType.subCategoryKey}`
        );
      }
    }
  }

  const { value: lootType, controlledBy: lootTypeControlledBy } = getObjectSetting(
    'lootType',
    rawType,
    categoriesByKey,
    subCategoriesByKey
  );
  if (isNotNullish(lootType)) {
    if (lootTypeControlledBy === 0) {
      assert(LOOT_TYPES.includes(lootType), `Invalid loot type: ${lootType}`);
    }
    if (lootType === LOOT_TYPE_DROP) {
      if (assertNotNullish(rawType.lootTableKey, 'No loot table key')) {
        assert(rawType.lootTableKey in lootTablesByKey, `No loot table with key ${rawType.lootTableKey} exists`);
      }
    }
  }

  const { value: hasHealth } = getObjectSetting('hasHealth', rawType, categoriesByKey, subCategoriesByKey);
  if (hasHealth) {
    assert(rawType.health > 0, 'Health must be greater than 0');
    assert(rawType.health % 1 === 0, 'Health must be a whole number');
  }

  const { value: requiresWater } = getObjectSetting('requiresWater', rawType, categoriesByKey, subCategoriesByKey);
  if (requiresWater) {
    assert(rawType.expireChance >= 0 && rawType.expireChance <= 100, 'Expire change must be between 0 and 100 inclusive');
    assert(rawType.expireChance % 1 === 0, 'Expire change must be a whole number');
  }

  const { value: inventoryType, controlledBy: inventoryTypeControlledBy } = getObjectSetting(
    'inventoryType',
    rawType,
    categoriesByKey,
    subCategoriesByKey
  );
  const { value: isWorkstation, controlledBy: isWorkstationControlledBy } = getObjectSetting(
    'isWorkstation',
    rawType,
    categoriesByKey,
    subCategoriesByKey
  );
  if (inventoryTypeControlledBy === 0) {
    if (assertNotNullish(inventoryType, 'No inventory type')) {
      assert(INVENTORY_TYPES.includes(inventoryType), `Invalid inventory type: ${inventoryType}`);
    }
  }

  if (inventoryTypeControlledBy === 0 || isWorkstationControlledBy === 0) {
    assert(!isWorkstation || inventoryType === INVENTORY_TYPE_SMALL, 'Workstations must have small inventories');
  }

  const stagesType = getObjectSetting('stagesType', rawType, categoriesByKey, subCategoriesByKey).value;
  if (stagesType && stagesType !== STAGES_TYPE_NONE && lootType && lootType !== LOOT_TYPE_NONE) {
    assert(rawType.experience > 0, 'Experience must be greater than 0');
    assert(rawType.experience % 1 === 0, 'Experience must be a whole number');
  }

  const hasLight = getObjectSetting('hasLight', rawType, categoriesByKey, subCategoriesByKey).value;
  if (hasLight && assertNotNullish(rawType.lightLevel, 'No light level')) {
    assert(rawType.lightLevel >= 1 && rawType.lightLevel < 20, 'Light level must be between 1 and 20');
    if (rawType.lightLevel >= 1) {
      if (assertNotNullish(rawType.lightPosition, 'No light position')) {
        assert(
          rawType.lightPosition.x >= 0 && rawType.lightPosition.x < rawType.sprite.width,
          `Light position x value must be between 0 and ${rawType.sprite.width - 1} (inclusive)`
        );
        assert(
          rawType.lightPosition.y >= 0 && rawType.lightPosition.y < rawType.sprite.height,
          `Light position y value must be between 0 and ${rawType.sprite.height - 1} (inclusive)`
        );
      }
    }
  }

  return errors;
}

export function validateObjectPlacementSpawningTab(
  rawType: ProcessedRawObjectType,
  categoriesByKey: Record<string, ObjectCategory>,
  subCategoriesByKey: Record<string, ObjectSubCategory>
) {
  const { errors, assert, assertNotNullish } = createAssert();

  const { value: placementPosition, controlledBy: placementPositionControlledBy } = getObjectSetting(
    'placementPosition',
    rawType,
    categoriesByKey,
    subCategoriesByKey
  );
  if (isNotNullish(placementPosition) && placementPositionControlledBy === 0) {
    assert(PLACEMENT_POSITIONS.includes(placementPosition), `Invalid placement position: ${placementPosition}`);
  }

  const { value: placementLayer, controlledBy: placementLayerControlledBy } = getObjectSetting(
    'placementLayer',
    rawType,
    categoriesByKey,
    subCategoriesByKey
  );
  if (isNotNullish(placementLayer) && placementLayerControlledBy === 0) {
    assert(PLACEMENT_LAYERS.includes(placementLayer), `Invalid placement layer: ${placementLayer}`);
  }

  const { value: spawningConditions, controlledBy: spawningConditionsControlledBy } = getObjectSetting(
    'spawningConditions',
    rawType,
    categoriesByKey,
    subCategoriesByKey
  );
  if (isNotNullish(spawningConditions) && spawningConditionsControlledBy === 0) {
    assertSpawningConditions(assert, spawningConditions);
  }

  const { value: stagesType } = getObjectSetting('stagesType', rawType, categoriesByKey, subCategoriesByKey);
  if (isNotNullish(stagesType) && (stagesType === STAGES_TYPE_GROWABLE || stagesType === STAGES_TYPE_GROWABLE_WITH_HEALTH)) {
    if (assertNotNullish(rawType.season, 'No season')) {
      assert(rawType.season === ALL_SEASONS || SEASONS.includes(rawType.season as Season), `Invalid season: ${rawType.season}`);
    }
  }

  return errors;
}

export function validateObjectSpriteStageTab(
  rawType: ProcessedRawObjectType,
  categoriesByKey: Record<string, ObjectCategory>,
  subCategoriesByKey: Record<string, ObjectSubCategory>,
  lootTablesByKey: Record<string, LootTable>,
  spriteCounts: Record<string, number>,
  accentSpriteCounts: Record<string, Record<string, number>>
) {
  const { errors, assert, assertNotNullish } = createAssert();

  assertNotNullish(rawType.sprite, 'No sprite data');

  const { value: canOpen = false } = getObjectSetting('canOpen', rawType, categoriesByKey, subCategoriesByKey);
  const { value: canActivate = false } = getObjectSetting('canActivate', rawType, categoriesByKey, subCategoriesByKey);
  const { value: placementPosition = PLACEMENT_POSITION_CENTER } = getObjectSetting(
    'placementPosition',
    rawType,
    categoriesByKey,
    subCategoriesByKey
  );
  const { value: stagesType, controlledBy: stagesTypeControlledBy } = getObjectSetting(
    'stagesType',
    rawType,
    categoriesByKey,
    subCategoriesByKey
  );
  const { value: changesSpritesWithSeason = undefined } = getObjectSetting(
    'changesSpritesWithSeason',
    rawType,
    categoriesByKey,
    subCategoriesByKey
  );

  if (changesSpritesWithSeason) {
    for (const season of SEASONS) {
      const spriteKey = `${rawType.key}-${season}`;

      assertSpriteCounts(
        assert,
        rawType,
        categoriesByKey,
        subCategoriesByKey,
        placementPosition,
        canOpen,
        canActivate,
        rawType.key ? spriteCounts[spriteKey] : 0,
        rawType.key ? accentSpriteCounts[spriteKey] : {},
        stagesType,
        `${season}: `
      );
    }
  } else {
    assertSpriteCounts(
      assert,
      rawType,
      categoriesByKey,
      subCategoriesByKey,
      placementPosition,
      canOpen,
      canActivate,
      rawType.key ? spriteCounts[rawType.key] : 0,
      rawType.key ? accentSpriteCounts[rawType.key] : {},
      stagesType,
      ''
    );
  }

  if (assertNotNullish(rawType.worldSize, 'No world size')) {
    assert(rawType.worldSize.x >= 1, 'World size width must be at least 1');
    assert(rawType.worldSize.x % 1 == 0, 'World size width must be a whole number');
    assert(rawType.worldSize.y >= 1, 'World size height must be at least 1');
    assert(rawType.worldSize.y % 1 == 0, 'World size height must be a whole number');
  }

  if (canOpen) {
    assert(!canActivate, 'Objects that can open cannot be activated');
    assert(!changesSpritesWithSeason, 'Objects that can open cannot change sprites with seasons');
  }

  if (canActivate) {
    assert(!changesSpritesWithSeason, 'Objects that can be activated cannot change sprites with seasons');
    if (assertNotNullish(rawType.animationSampleRate, 'Objects that can be activated must have an animation sample rate')) {
      assert(rawType.animationSampleRate >= 1, 'Animation sample rate must be at least 1');
      assert(rawType.animationSampleRate % 1 == 0, 'Animation sample rate must be a whole number');
    }
  }

  if (isNotNullish(stagesType) && stagesType !== STAGES_TYPE_NONE) {
    assert(!canOpen, 'Objects that can open cannot have stages');
    assert(!canActivate, 'Objects that can be activated cannot have stages');

    if (assert(STAGES_TYPES.includes(stagesType), `Invalid stages type: ${stagesType}`) && isNotNullish(rawType.stages)) {
      const { value: lootType } = getObjectSetting('lootType', rawType, categoriesByKey, subCategoriesByKey);
      for (let i = 0; i < rawType.stages.length; i++) {
        const stage = rawType.stages[i];

        if (isNotNullish(lootType)) {
          if (lootType === LOOT_TYPE_STAGE_DROP) {
            if (assertNotNullish(stage.lootTableKey, `Stage ${i} has no loot table key`)) {
              assert(stage.lootTableKey in lootTablesByKey, `Stage ${i} no loot table with key ${stage.lootTableKey} exists`);
            }
          }
        }

        switch (stagesType) {
          case STAGES_TYPE_GROWABLE_WITH_HEALTH:
            assertGrowableStage(assert, assertNotNullish, stage, i + 1, rawType.stages.length);
            assertHealthStage(assert, stage, i + 1);
            break;
          case STAGES_TYPE_GROWABLE:
            assertGrowableStage(assert, assertNotNullish, stage, i + 1, rawType.stages.length);
            break;
          case STAGES_TYPE_BREAKABLE:
            assertBreakableStage(assert, rawType, stage, i);
            break;
        }
      }
    }
  }

  const { value: lootType, controlledBy: lootTypeControlledBy } = getObjectSetting(
    'lootType',
    rawType,
    categoriesByKey,
    subCategoriesByKey
  );
  if (lootTypeControlledBy === 0 || stagesTypeControlledBy === 0) {
    assert(
      (isNotNullish(stagesType) && stagesType !== STAGES_TYPE_NONE) || lootType !== LOOT_TYPE_STAGE_DROP,
      `Loot type ${LOOT_TYPE_STAGE_DROP} requires stages`
    );
  }

  return errors;
}

export function assertSpriteCounts(
  assert: Assert,
  rawType: ProcessedRawObjectType,
  categoriesByKey: Record<string, ObjectCategory>,
  subCategoriesByKey: Record<string, ObjectSubCategory>,
  placementPosition: PlacementPosition,
  canOpen: boolean,
  canActivate: boolean,
  spriteCount: number,
  accentSpriteCounts: Record<string, number>,
  stagesType: StagesType | undefined,
  prefix: string
) {
  if (isNotNullish(rawType.sprite)) {
    assertObjectSprite(assert, rawType.sprite, placementPosition, canOpen, canActivate, spriteCount, accentSpriteCounts, prefix);
  }

  if (isNotNullish(stagesType) && stagesType !== STAGES_TYPE_NONE) {
    assert(
      isNotNullish(rawType.sprite) && isNotNullish(rawType.stages) && spriteCount == rawType.stages.length,
      `${prefix} Sprite count (${spriteCount ?? 0}) does not match stage count (${rawType.stages?.length ?? 0})`
    );
  }

  if (
    isNotNullish(rawType.categoryKey) &&
    rawType.categoryKey in categoriesByKey &&
    isNotNullish(rawType.subCategoryKey) &&
    rawType.subCategoryKey in subCategoriesByKey
  ) {
    const subCategory = subCategoriesByKey[rawType.subCategoryKey];
    if (subCategory && isNotNullish(subCategory.rulesets) && subCategory.rulesets.length > 0) {
      let expectedSpriteCount = 0;
      for (const ruleset of subCategory.rulesets) {
        if (isNotNullish(ruleset.rules)) {
          for (const rule of ruleset.rules) {
            if (isNotNullish(rule) && isNotNullish(rule.sprites) && rule.sprites.length > 0) {
              for (const sprite of rule.sprites) {
                if (sprite > expectedSpriteCount) {
                  expectedSpriteCount = sprite;
                }
              }
            }
          }
        }
      }
      expectedSpriteCount += 1;
      assert(
        isNotNullish(rawType.sprite) && isNotNullish(spriteCount) && spriteCount >= expectedSpriteCount,
        `${prefix} There must be at least ${spriteCount} sprites based on rules`
      );
    }
  }
}

export function validatePhysicsTab(
  rawType: ProcessedRawObjectType | ProcessedRawObjectCategory | ProcessedRawObjectSubCategory | ProcessedRawCreatureType
) {
  const { errors, assert, assertNotNullish } = createAssert();

  assertColliders(assert, assertNotNullish, rawType);

  return errors;
}

export function assertObjectSprite(
  assert: Assert,
  objectSprite: ProcessedRawObjectSprites,
  placementPosition: PlacementPosition,
  canOpen: boolean,
  canActivate: boolean,
  spriteCount: number,
  accentSpriteCounts: Record<string, number>,
  prefix: string
) {
  if (assert(spriteCount > 0, `${prefix} No sprites`)) {
    if (isNotNullish(accentSpriteCounts)) {
      for (const groundType of GROUND_TYPES) {
        assert(
          isNullish(accentSpriteCounts[groundType]) ||
            accentSpriteCounts[groundType] === 0 ||
            accentSpriteCounts[groundType] === spriteCount,
          `${prefix} Accent "${groundType}": Sprite count (${accentSpriteCounts[groundType]}) does not match main sprite count (${spriteCount})`
        );
      }
    }

    if (placementPosition === PLACEMENT_POSITION_EDGE) {
      assert(!canOpen || spriteCount >= 4, `${prefix} Objects that can open and can be placed on edges must have at least 4 sprites`);
    } else {
      assert(!canOpen || spriteCount >= 2, `${prefix} Objects that can open must have at least 2 sprites`);
    }

    assert(!canActivate || spriteCount >= 2, `${prefix} Objects that can be activated must have at least 2 sprites`);
  }
  assert(objectSprite.width >= 16, `${prefix} Sprite width must be at least 16`);
  assert(objectSprite.width % 1 == 0, `${prefix} Sprite width must be a whole number`);
  assert(objectSprite.height >= 16, `${prefix} Sprite height must be at least 16`);
  assert(objectSprite.height % 1 == 0, `${prefix} Sprite height must be a whole number`);

  if (isNotNullish(objectSprite.pivotOffset)) {
    assert(objectSprite.pivotOffset.x % 1 == 0, `${prefix} Sprite pivot offset x must be a whole number`);
    assert(objectSprite.pivotOffset.y % 1 == 0, `${prefix} Sprite pivot offset y must be a whole number`);
  }

  if (isNotNullish(objectSprite.sprites)) {
    for (const key of Object.keys(objectSprite.sprites)) {
      const keyAsNumber = Number(key);
      if (assert(!Number.isNaN(keyAsNumber), `Sprite key '${key}' must be a number`)) {
        const individualObjectSprite = objectSprite.sprites[key];
        if (isNotNullish(individualObjectSprite)) {
          if (isNotNullish(individualObjectSprite.pivotOffset)) {
            assert(individualObjectSprite.pivotOffset?.x % 1 == 0, `Sprite ${keyAsNumber + 1} pivot offset x must be a whole number`);
            assert(individualObjectSprite.pivotOffset?.y % 1 == 0, `Sprite ${keyAsNumber + 1} pivot offset y must be a whole number`);
          }

          if (isNotNullish(individualObjectSprite.spriteOffset)) {
            assert(individualObjectSprite.spriteOffset?.x % 1 == 0, `Sprite ${keyAsNumber + 1} sprite offset x must be a whole number`);
            assert(individualObjectSprite.spriteOffset?.y % 1 == 0, `Sprite ${keyAsNumber + 1} sprite offset y must be a whole number`);
          }

          if (isNotNullish(individualObjectSprite.placementLayer)) {
            assert(
              PLACEMENT_LAYERS.includes(individualObjectSprite.placementLayer as PlacementLayer),
              `Sprite ${keyAsNumber + 1} Invalid placement layer: ${individualObjectSprite.placementLayer}`
            );
          }
        }
      }
    }
  }
}

export function assertGrowableStage(
  assert: Assert,
  assertNotNullish: AssertNotNullish,
  stage: ProcessedRawObjectTypeStage,
  index: number,
  total: number
) {
  if (!stage.pause && (index < total || (isNotNullish(stage.jumpToStage) && stage.jumpCondition === STAGE_JUMP_CONDITION_TIME))) {
    assert(stage.growthDays > 0, `Stage ${index}: Growth days must be greater than 0`);
    assert(stage.growthDays % 1 == 0, `Stage ${index}: Growth days must be a whole number`);
  }
  if (isNotNullish(stage.jumpToStage)) {
    assertNotNullish(stage.jumpCondition, `Stage ${index}: No jump condition (required when jump to stage is set)`);
  }
  if (isNotNullish(stage.jumpCondition)) {
    assert(
      STAGE_JUMP_CONDITIONS.includes(stage.jumpCondition as StageJumpCondition),
      `Stage ${index}: Invalid jump condition: ${stage.jumpCondition}. Only ${STAGE_JUMP_CONDITION_TIME} and ${STAGE_JUMP_CONDITION_HARVEST} are allowed`
    );
    if (stage.jumpCondition === STAGE_JUMP_CONDITION_HARVEST) {
      assert(stage.harvestable, `Stage ${index}: Stages with a jump condition of ${STAGE_JUMP_CONDITION_HARVEST} must be harvestable`);
    }
  }
}

export function assertHealthStage(assert: Assert, stage: ProcessedRawObjectTypeStage, index: number) {
  assert(stage.health >= 0, `Stage ${index}: No health`);
  assert(stage.health % 1 === 0, `Stage ${index}: Health must be a whole number`);
}

export function assertBreakableStage(assert: Assert, type: ProcessedRawObjectType, stage: ProcessedRawObjectTypeStage, index: number) {
  assert(stage.threshold <= 100 && stage.threshold >= 0, `Stage ${index + 1}: Threshold must be between 0 and 100 inclusive`);
  if (index != 0) {
    const previousStageThreshold = type.stages?.[index - 1].threshold;
    if (isNotNullish(previousStageThreshold)) {
      assert(previousStageThreshold != stage.threshold, `Stage ${index + 1}: Has the same threshold as stage ${index}`);
      assert(previousStageThreshold > stage.threshold, `Stage ${index + 1}: Has a threshold greater than previous stage ${index}`);
    }
  }
  assert(index != 0 || stage.threshold == 100, 'The first stage must have a threshold of 100');
  assert(stage.threshold % 1 === 0, `Stage ${index + 1}: Threshold must be a whole number`);
}

export function assertSpawningConditions(assert: Assert, spawningConditions: string[] | undefined) {
  if (isNotNullish(spawningConditions) && spawningConditions.length > 0) {
    for (const condition of spawningConditions) {
      assert(CONDITIONS.includes(condition as SpawningCondition), `Invalid spawning condition: ${condition}`);
    }
  }
}

export function assertSubCategorySpriteRules(
  assert: Assert,
  assertNotNullish: AssertNotNullish,
  name: string,
  spriteRules: ProcessedRawObjectSpriteRuleset | undefined
) {
  if (isNotNullish(spriteRules)) {
    if (isNotNullish(spriteRules.rules) && spriteRules.rules.length > 0) {
      let ruleIndex = 1;
      for (const rule of spriteRules.rules) {
        if (
          assertNotNullish(rule.sprites, `${name} ${ruleIndex}: No sprites`) &&
          assert(rule.sprites.length > 0, `${name} ${ruleIndex}: There must be at least one sprite`)
        ) {
          for (const sprite of rule.sprites) {
            assert(sprite >= 0, `${name} ${ruleIndex}: Sprite index must be greater than 0`);
          }
        }
        if (
          assertNotNullish(rule.conditions, `${name} ${ruleIndex}: No conditions`) &&
          assert(Object.keys(rule.conditions).length > 0, `${name} ${ruleIndex}: There must be at least one condition`)
        ) {
          for (const direction of Object.keys(rule.conditions)) {
            assert(
              SPRITE_RULE_DIRECTIONS.includes(direction as ObjectSpriteRulePosition),
              `${name} ${ruleIndex}: ${direction} is not a valid direction`
            );
          }
        }
        ruleIndex++;
      }
    }
  }
}

export function assertColliders(
  assert: Assert,
  assertNotNullish: AssertNotNullish,
  type: ProcessedRawObjectType | ProcessedRawObjectCategory | ProcessedRawObjectSubCategory | ProcessedRawCreatureType
) {
  if (isNotNullish(type.colliders)) {
    dataValidation.assertObjectColliders(assert, assertNotNullish, type.colliders, 'Generic collider');
  }
  if (isNotNullish(type.sprite) && isNotNullish(type.sprite.sprites)) {
    dataValidation.assertObjectSpriteColliders(assert, assertNotNullish, type.sprite.sprites);
  }
}

export function assertObjectSpriteColliders(
  assert: Assert,
  assertNotNullish: AssertNotNullish,
  sprites: Record<string, ProcessedRawSprite>
) {
  for (const key of Object.keys(sprites)) {
    const colliders = sprites[key].colliders;
    if (isNotNullish(colliders)) {
      dataValidation.assertObjectColliders(assert, assertNotNullish, colliders, `Sprite ${key} Collider`);
    }
  }
}

export function assertObjectColliders(assert: Assert, assertNotNullish: AssertNotNullish, colliders: ProcessedRawCollider[], type: string) {
  for (let i = 0; i < colliders.length; i++) {
    dataValidation.assertObjectCollider(assert, assertNotNullish, colliders[i], type, i + 1);
  }
}

export function assertObjectCollider(
  assert: Assert,
  assertNotNullish: AssertNotNullish,
  collider: ProcessedRawCollider,
  type: string,
  index: number
) {
  if (assertNotNullish(collider.type, `${type} ${index}: No collider type`)) {
    if (
      assert(
        COLLIDER_TYPES.includes(collider.type as ColliderType),
        `${type} ${index}: Invalid collider type: ${collider.type}. Only ${POLYGON_COLLIDER_TYPE} and ${BOX_COLLIDER_TYPE} are allowed`
      )
    ) {
      switch (collider.type) {
        case POLYGON_COLLIDER_TYPE:
          break;
        case AUTO_BOX_COLLIDER_TYPE:
          break;
        case BOX_COLLIDER_TYPE:
          dataValidation.assertBoxCollider(assertNotNullish, collider, type, index);
          break;
      }
    }
  }
}

export function assertBoxCollider(assertNotNullish: AssertNotNullish, collider: ProcessedRawCollider, type: string, index: number) {
  if (assertNotNullish(collider, `${type} ${index}: Not configured`)) {
    assertNotNullish(collider.size, `${type} ${index}: No size`);
    assertNotNullish(collider.offset, `${type} ${index}: No offset`);
  }
}

export function checkObjectsRequiredSettings(
  allErrors: AllErrors,
  objectTypes: ObjectType[],
  objectCategoriesByKey: Record<string, ObjectCategory>,
  objectSubCategoriesByKey: Record<string, ObjectSubCategory>,
  objectsByKey: Record<string, ObjectType>
) {
  const objectErrors: Record<string, string[]> = allErrors[OBJECTS_DATA_FILE]?.[ERROR_SECTION_OBJECTS] ?? {};

  for (const type of objectTypes) {
    const key = type.key;

    const placementLayer = getObjectSetting('placementLayer', type, objectCategoriesByKey, objectSubCategoriesByKey).value;
    if (isNotNullish(placementLayer) && isNotNullish(type.settings)) {
      const errors = [
        ...checkObjectRequiredBelowSettings(placementLayer, type.settings, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey),
        ...checkObjectRequiredAdjacentSettings(placementLayer, type.settings, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey)
      ];

      if (errors.length > 0) {
        if (key in objectErrors) {
          objectErrors[key].push(...errors);
        } else {
          objectErrors[key] = errors;
        }
      }
    }
  }

  if (Object.keys(objectErrors).length > 0) {
    allErrors[OBJECTS_DATA_FILE] = {
      ...(allErrors[OBJECTS_DATA_FILE] ?? {}),
      [ERROR_SECTION_OBJECTS]: objectErrors
    };
  }
}

export function checkObjectRequiredBelowSettings(
  placementLayer: PlacementLayer,
  objectSettings: ObjectSettings,
  objectCategoriesByKey: Record<string, ObjectCategory>,
  objectSubCategoriesByKey: Record<string, ObjectSubCategory>,
  objectsByKey: Record<string, ObjectType>
) {
  const { errors, assert, assertNotNullish } = createAssert();

  let layerBelow: string | undefined;
  if (placementLayer === PLACEMENT_LAYER_ON_GROUND) {
    layerBelow = PLACEMENT_LAYER_IN_GROUND;
  } else if (placementLayer === PLACEMENT_LAYER_IN_AIR) {
    layerBelow = PLACEMENT_LAYER_ON_GROUND;
  }

  if (isNotNullish(objectSettings.requiredBelowObjectCategoryKeys)) {
    for (const key of objectSettings.requiredBelowObjectCategoryKeys) {
      const category = objectCategoriesByKey[key];
      if (assertNotNullish(category, `Invalid required below category ${key}`)) {
        assert(
          category.settings?.placementLayer === layerBelow,
          `Required below category ${key} is in the wrong placement layer ${category.settings?.placementLayer}. Should be ${layerBelow}`
        );
      }
    }
  }

  if (isNotNullish(objectSettings.requiredBelowObjectSubCategoryKeys)) {
    for (const key of objectSettings.requiredBelowObjectSubCategoryKeys) {
      const subCategory = objectSubCategoriesByKey[key];
      if (assertNotNullish(subCategory, `Invalid required below sub category ${key}`)) {
        const subCategoryPlacementLayer = getObjectSetting('placementLayer', subCategory, objectCategoriesByKey).value;
        assert(
          subCategoryPlacementLayer === layerBelow,
          `Required below sub category ${key} is in the wrong placement layer ${subCategoryPlacementLayer}. Should be ${layerBelow}`
        );
      }
    }
  }

  if (isNotNullish(objectSettings.requiredBelowObjectKeys)) {
    for (const key of objectSettings.requiredBelowObjectKeys) {
      const type = objectsByKey[key];
      if (assertNotNullish(type, `Invalid required below object ${key}`)) {
        const objectPlacementLayer = getObjectSetting('placementLayer', type, objectCategoriesByKey, objectSubCategoriesByKey).value;
        assert(
          objectPlacementLayer === layerBelow,
          `Required below object ${key} is in the wrong placement layer ${objectPlacementLayer}. Should be ${layerBelow}`
        );
      }
    }
  }

  return errors;
}

export function checkObjectRequiredAdjacentSettings(
  placementLayer: PlacementLayer,
  objectSettings: ObjectSettings,
  objectCategoriesByKey: Record<string, ObjectCategory>,
  objectSubCategoriesByKey: Record<string, ObjectSubCategory>,
  objectsByKey: Record<string, ObjectType>
) {
  const { errors, assert, assertNotNullish } = createAssert();

  if (isNotNullish(objectSettings.requiredAdjacentObjectCategoryKeys)) {
    for (const key of objectSettings.requiredAdjacentObjectCategoryKeys) {
      const category = objectCategoriesByKey[key];
      if (assertNotNullish(category, `Invalid required adjacent category ${key}`)) {
        assert(
          category.settings?.placementLayer === placementLayer,
          `Required adjacent category ${key} is in the wrong placement layer ${category.settings?.placementLayer}. Should be ${placementLayer}`
        );
      }
    }
  }

  if (isNotNullish(objectSettings.requiredAdjacentObjectSubCategoryKeys)) {
    for (const key of objectSettings.requiredAdjacentObjectSubCategoryKeys) {
      const subCategory = objectSubCategoriesByKey[key];
      if (assertNotNullish(subCategory, `Invalid required adjacent sub category ${key}`)) {
        const subCategoryPlacementLayer = getObjectSetting('placementLayer', subCategory, objectCategoriesByKey).value;
        assert(
          subCategoryPlacementLayer === placementLayer,
          `Required adjacent sub category ${key} is in the wrong placement layer ${subCategoryPlacementLayer}. Should be ${placementLayer}`
        );
      }
    }
  }

  if (isNotNullish(objectSettings.requiredAdjacentObjectKeys)) {
    for (const key of objectSettings.requiredAdjacentObjectKeys) {
      const type = objectsByKey[key];
      if (assertNotNullish(type, `Invalid required adjacent object ${key}`)) {
        const objectPlacementLayer = getObjectSetting('placementLayer', type, objectCategoriesByKey, objectSubCategoriesByKey).value;
        assert(
          objectPlacementLayer === placementLayer,
          `Required adjacent object ${key} is in the wrong placement layer ${objectPlacementLayer}. Should be ${placementLayer}`
        );
      }
    }
  }

  return errors;
}

/**
 * Starting Items
 */
export function validatePlayerData(
  allErrors: AllErrors,
  rawPlayerData: ProcessedRawPlayerData | null | undefined,
  itemsByKey: Record<string, ItemType>
): PlayerData {
  const playerData = validatePlayerDataGeneralTab(allErrors, rawPlayerData, itemsByKey);

  validatePlayerDataLevelsTab(allErrors, playerData);

  return playerData;
}

export function validatePlayerDataGeneralTab(
  allErrors: AllErrors,
  rawPlayerData: ProcessedRawPlayerData | null | undefined,
  itemsByKey: Record<string, ItemType>
) {
  const playerData = toPlayerData(toProcessedRawPlayerData(undefined));

  if (!isNotNullish(rawPlayerData)) {
    return playerData;
  }

  const startingStatErrors = validateStartingStats(rawPlayerData);

  if (Object.keys(startingStatErrors).length > 0) {
    allErrors[PLAYER_DATA_FILE] = {
      ...(allErrors[PLAYER_DATA_FILE] ?? {}),
      [ERROR_SECTION_PLAYER_STATS]: startingStatErrors
    };
  }

  const startingItemErrors = validateStartingItems(rawPlayerData.startingItems, itemsByKey);

  if (Object.keys(startingItemErrors).length > 0) {
    allErrors[PLAYER_DATA_FILE] = {
      ...(allErrors[PLAYER_DATA_FILE] ?? {}),
      [ERROR_SECTION_PLAYER_STARTING_ITEMS]: startingItemErrors
    };
  }

  return playerData;
}

export function validatePlayerDataLevelsTab(allErrors: AllErrors, playerData: PlayerData) {
  const { errors, assert } = createAssert();

  for (let i = 0; i < playerData.nextLevelExp.length; i++) {
    assert(playerData.nextLevelExp[i] > 0, `Level ${i + 2} next level exp must be greater than 0`);
    assert(playerData.nextLevelExp[i] % 1 === 0, `Level ${i + 2} next level exp must be a whole number`);
  }

  if (errors.length > 0) {
    allErrors[PLAYER_DATA_FILE] = {
      ...(allErrors[PLAYER_DATA_FILE] ?? {}),
      [ERROR_SECTION_PLAYER_LEVELS]: errors
    };
  }

  return playerData;
}

export function validateStartingStats(rawPlayerData: ProcessedRawPlayerData) {
  const { errors, assert } = createAssert();

  assert(rawPlayerData.health > 0, 'Starting health must be greater than 0');
  assert(rawPlayerData.health % 1 === 0, 'Starting health must be a whole number');

  assert(rawPlayerData.healthMax > 0, 'Max health must be greater than 0');
  assert(rawPlayerData.healthMax % 1 === 0, 'Max health must be a whole number');

  assert(rawPlayerData.healthDepletionTime > 0, 'Health depletion time must be greater than 0');
  assert(rawPlayerData.healthRefillTime > 0, 'Health refill time must be greater than 0');
  assert(rawPlayerData.healthRefillHungerDepletionRate > 0, 'Health refill hunger depletion rate must be greater than 0');
  assert(rawPlayerData.healthRefillThirstDepletionRate > 0, 'Health refill thirst depletion rate must be greater than 0');

  assert(rawPlayerData.energy > 0, 'Starting energy must be greater than 0');
  assert(rawPlayerData.energy % 1 === 0, 'Starting energy must be a whole number');

  assert(rawPlayerData.energyMax > 0, 'Max energy must be greater than 0');
  assert(rawPlayerData.energyMax % 1 === 0, 'Max energy must be a whole number');

  assert(rawPlayerData.energyBaseUsageRate > 0, 'Base energy usage rate must be greater than 0');
  assert(rawPlayerData.energyRefillRate > 0, 'Energy refill rate must be greater than 0');
  assert(rawPlayerData.energyRefillHungerDepletionRate > 0, 'Energy refill hunger depletion rate must be greater than 0');
  assert(rawPlayerData.energyRefillThirstDepletionRate > 0, 'Energy refill thirst depletion rate must be greater than 0');

  assert(rawPlayerData.hunger > 0, 'Starting hunger must be greater than 0');
  assert(rawPlayerData.hunger % 1 === 0, 'Starting hunger must be a whole number');

  assert(rawPlayerData.hungerMax > 0, 'Max hunger must be greater than 0');
  assert(rawPlayerData.hungerMax % 1 === 0, 'Max hunger must be a whole number');

  assert(rawPlayerData.hungerInitialDelay > 0, 'Hunger initial delay must be greater than 0');
  assert(rawPlayerData.hungerInitialDelay % 1 === 0, 'Hunger initial delay must be a whole number');

  assert(rawPlayerData.hungerMaxedOutDelay > 0, 'Hunger maxed out delay must be greater than 0');
  assert(rawPlayerData.hungerMaxedOutDelay % 1 === 0, 'Hunger maxed out delay must be a whole number');

  assert(rawPlayerData.hungerDepletionRate > 0, 'Hunger depletion rate must be greater than 0');

  assert(rawPlayerData.thirst > 0, 'Starting thirst must be greater than 0');
  assert(rawPlayerData.thirst % 1 === 0, 'Starting thirst must be a whole number');

  assert(rawPlayerData.thirstMax > 0, 'Max thirst must be greater than 0');
  assert(rawPlayerData.thirstMax % 1 === 0, 'Max thirst must be a whole number');

  assert(rawPlayerData.thirstInitialDelay > 0, 'Thirst initial delay must be greater than 0');
  assert(rawPlayerData.thirstInitialDelay % 1 === 0, 'Thirst initial delay must be a whole number');

  assert(rawPlayerData.thirstMaxedOutDelay > 0, 'Thirst maxed out delay must be greater than 0');
  assert(rawPlayerData.thirstMaxedOutDelay % 1 === 0, 'Thirst maxed out delay must be a whole number');

  assert(rawPlayerData.thirstDepletionRate > 0, 'Thirst depletion rate must be greater than 0');

  assert(rawPlayerData.money > 0, 'Money must be greater than 0');
  assert(rawPlayerData.money % 1 === 0, 'Money must be a whole number');

  return errors;
}

export function validateStartingItems(startingItems: Record<string, number>, itemsByKey: Record<string, ItemType>) {
  const { errors, assert } = createAssert();

  Object.keys(startingItems ?? []).forEach((itemTypeKey, index) => {
    const header = `Starting Item ${index + 1}`;
    if (isNotEmpty(itemTypeKey)) {
      assert(itemTypeKey in itemsByKey, `${header}: No item with key ${itemTypeKey} exists`);
    }

    const itemAmount = startingItems[itemTypeKey];
    assert(itemAmount > 0 && itemAmount % 1 == 0, `${header}: Amount must be a positive whole number greater than 0`);
  });

  return errors;
}

/**
 * Dialogue
 */
export function validateDialogueTrees(
  allErrors: AllErrors,
  rawDialogueTrees: ProcessedRawDialogueTree[] | null | undefined,
  creaturesByKey: Record<string, CreatureType>,
  eventLogsByKey: Record<string, EventLog>,
  localization: Localization | null | undefined,
  localizationKeys: string[]
): {
  dialogueTrees: DialogueTree[];
  dialogueTreesByKey: Record<string, DialogueTree>;
} {
  const dialogueTrees: DialogueTree[] = [];
  const dialogueTreesByKey: Record<string, DialogueTree> = {};

  if (!isNotNullish(rawDialogueTrees)) {
    return { dialogueTrees, dialogueTreesByKey };
  }

  const dialogueErrors: Record<string, string[]> = {};
  const idsSeen: number[] = [];

  let i = 1;
  for (const rawDialogueTree of rawDialogueTrees) {
    let key: string;
    if (isNotNullish(rawDialogueTree.key)) {
      key = rawDialogueTree.key;
    } else {
      key = `Dialogue Tree #${i}`;
    }

    const errors = validateDialogueTree(rawDialogueTree, creaturesByKey, eventLogsByKey, localization, localizationKeys, idsSeen);

    i++;
    if (isNotNullish(rawDialogueTree.key)) {
      const type = toDialogueTree(rawDialogueTree);
      dialogueTrees.push(type);
      dialogueTreesByKey[type.key] = type;
      idsSeen.push(type.id);
    }

    if (errors.length > 0) {
      dialogueErrors[key] = errors;
    }
  }

  if (Object.keys(dialogueErrors).length > 0) {
    allErrors[DIALOGUE_DATA_FILE] = {
      ...(allErrors[DIALOGUE_DATA_FILE] ?? {}),
      [ERROR_SECTION_DIALOGUE_TREES]: dialogueErrors
    };
  }

  return { dialogueTrees, dialogueTreesByKey };
}

export function validateDialogueTree(
  rawType: ProcessedRawDialogueTree,
  creaturesByKey: Record<string, CreatureType>,
  eventLogsByKey: Record<string, EventLog>,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  idsSeen: number[]
): string[] {
  return [
    ...validateDialogueTreeGeneralTab(rawType, creaturesByKey, eventLogsByKey, idsSeen),
    ...validateDialogueTreeConditionsTab(rawType),
    ...validateDialogueTreeDialogueTab(rawType, localization, localizationKeys)
  ];
}

export function validateDialogueTreeGeneralTab(
  rawType: ProcessedRawDialogueTree,
  creaturesByKey: Record<string, CreatureType>,
  eventLogsByKey: Record<string, EventLog>,
  idsSeen: number[]
) {
  const { errors, assert, assertNotNullish } = createAssert();
  if (assertNotNullish(rawType.id, 'No id') && assert(rawType.id != 0, 'No id')) {
    assert(!idsSeen.includes(rawType.id), `Duplicate id: ${rawType.id}`);
  }
  assertNotNullish(rawType.key, 'No key');

  if (assertNotNullish(rawType.creatureKey, 'No creature')) {
    assert(rawType.creatureKey in creaturesByKey, `Invalid creature: ${rawType.creatureKey}`);
  }

  if (assertNotNullish(rawType.priority, 'No priority')) {
    assert(rawType.priority >= 0, 'Priority cannot be negative');
  }

  if (rawType.runOnlyOnce) {
    assertNotNullish(rawType.completionEvent, 'No completion event');
  }

  if (isNotNullish(rawType.completionEvent)) {
    assert(rawType.completionEvent in eventLogsByKey, `Invalid completion event: ${rawType.completionEvent}`);
  }

  return errors;
}

export function validateDialogueTreeConditionsTab(rawType: ProcessedRawDialogueTree) {
  const { errors, assert, assertNotNullish } = createAssert();

  if (isNotNullish(rawType.conditions)) {
    if (isNotNullish(rawType.conditions.days)) {
      for (const day of rawType.conditions.days) {
        assert(day >= 0 && day <= 6, `Invalid day '${day}'. Day must be between 0 and 6 (inclusive)`);
      }
    }

    if (isNotNullish(rawType.conditions.timesComparator)) {
      assert(
        TIME_COMPARATORS.includes(rawType.conditions.timesComparator as TimeComparator),
        `Invalid times comparator '${rawType.conditions.timesComparator}'`
      );
      if (TIME_COMPARATORS.includes(rawType.conditions.timesComparator as TimeComparator)) {
        switch (rawType.conditions.timesComparator) {
          case TIME_COMPARATOR_BEFORE:
            if (
              assertNotNullish(rawType.conditions.times, `No time for ${TIME_COMPARATOR_BEFORE} comparator`) &&
              assert((rawType.conditions.times?.length ?? 0) > 0, `One time is required for ${TIME_COMPARATOR_BEFORE} comparator`)
            ) {
              if (assert(rawType.conditions.times.length == 1, `Only provide one times for ${TIME_COMPARATOR_BEFORE} comparator`)) {
                assert(
                  rawType.conditions.times[0] >= 0 && rawType.conditions.times[0] <= DAY_LENGTH,
                  `Invalid time '${rawType.conditions.times[0]}'. Time must be between 0 and ${DAY_LENGTH} (inclusive)`
                );
              }
            }
            break;
          case TIME_COMPARATOR_AFTER:
            if (
              assertNotNullish(rawType.conditions.times, `No time for ${TIME_COMPARATOR_AFTER} comparator`) &&
              assert((rawType.conditions.times?.length ?? 0) > 0, `One time is required for ${TIME_COMPARATOR_AFTER} comparator`)
            ) {
              if (assert(rawType.conditions.times.length == 1, `Only provide one times for ${TIME_COMPARATOR_AFTER} comparator`)) {
                assert(
                  rawType.conditions.times[0] >= 0 && rawType.conditions.times[0] <= DAY_LENGTH,
                  `Invalid time '${rawType.conditions.times[0]}'. Time must be between 0 and ${DAY_LENGTH} (inclusive)`
                );
              }
            }
            break;
          case TIME_COMPARATOR_BETWEEN:
            if (
              assertNotNullish(rawType.conditions.times, `No time for ${TIME_COMPARATOR_BEFORE} TIME_COMPARATOR_BETWEEN`) &&
              assert((rawType.conditions.times?.length ?? 0) > 1, `Two times are required for ${TIME_COMPARATOR_BETWEEN} comparator`)
            ) {
              if (assert(rawType.conditions.times.length == 2, `Only provide two times for ${TIME_COMPARATOR_BETWEEN} comparator`)) {
                assert(
                  rawType.conditions.times[0] >= 0 && rawType.conditions.times[0] <= DAY_LENGTH,
                  `Invalid time 1 '${rawType.conditions.times[0]}'. Time 1 must be between 0 and ${DAY_LENGTH} (inclusive)`
                );
                assert(
                  rawType.conditions.times[1] >= 0 && rawType.conditions.times[1] <= DAY_LENGTH,
                  `Invalid time 2 '${rawType.conditions.times[1]}'. Time 2 must be between 0 and ${DAY_LENGTH} (inclusive)`
                );
              }
            }
            break;
        }
      }
    } else {
      assert((rawType.conditions.times?.length ?? 0) === 0, 'No times comparator');
    }
  }

  return errors;
}

export function validateDialogueTreeDialogueTab(
  rawType: ProcessedRawDialogueTree,
  localization: Localization | null | undefined,
  localizationKeys: string[]
) {
  const { errors, assert, assertNotNullish } = createAssert();

  if (assert(rawType.dialogues.length > 0, 'No dialogue')) {
    const dialoguesById: Record<number, ProcessedRawDialogue> = {};

    for (const dialogue of rawType.dialogues) {
      if (isNotNullish(dialogue.id)) {
        dialoguesById[dialogue.id] = dialogue;
      }
    }

    if (assertNotNullish(rawType.startingDialogueId, 'No starting dialogue')) {
      assert(rawType.startingDialogueId in dialoguesById, `Starting dialogue: No dialogue with key '${rawType.startingDialogueId}'`);
    }

    validateDialogues(assert, assertNotNullish, rawType.key, rawType.dialogues, dialoguesById, localization, localizationKeys);
  }

  return errors;
}

export function validateDialogues(
  assert: Assert,
  assertNotNullish: AssertNotNullish,
  dialogueTreeKey: string | undefined,
  dialogues: ProcessedRawDialogue[],
  dialoguesById: Record<number, ProcessedRawDialogue>,
  localization: Localization | null | undefined,
  localizationKeys: string[]
) {
  const dialogueIdsSeen: number[] = [];

  for (let i = 0; i < dialogues.length; i++) {
    const dialogue = dialogues[i];
    validateDialogue(
      assert,
      assertNotNullish,
      dialogueTreeKey,
      dialogue,
      dialoguesById,
      localization,
      localizationKeys,
      dialogueIdsSeen,
      `Dialogue '${dialogue.key ?? i}'`
    );

    dialogueIdsSeen.push(dialogue.id);
  }
}

export function validateDialogue(
  assert: Assert,
  assertNotNullish: AssertNotNullish,
  dialogueTreeKey: string | undefined,
  dialogue: ProcessedRawDialogue,
  dialoguesById: Record<number, ProcessedRawDialogue>,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  dialogueIdsSeen: number[],
  header: string
) {
  if (assertNotNullish(dialogue.id, `${header} No id`) && assert(dialogue.id != 0, `${header} Id must be greater than 0`)) {
    assert(!dialogueIdsSeen.includes(dialogue.id), `${header} Duplicate id: ${dialogue.id}`);
  }

  if (isNotNullish(dialogueTreeKey) && assertNotNullish(dialogue.key, `${header} No key`) && localization) {
    assert(
      isNotEmpty(
        getLocalizedValue(
          localization,
          localizationKeys,
          getLocalizationKey('dialogue-tree', `dialogue-${dialogue.key.toLowerCase()}-text`, dialogueTreeKey)
        )
      ),
      'No text'
    );
  }

  if (dialogue.responses.length > 0) {
    validateDialogueResponses(
      assert,
      assertNotNullish,
      dialogueTreeKey,
      dialogue.key,
      dialogue.responses,
      dialoguesById,
      localization,
      localizationKeys,
      header
    );
  }

  if (isNotNullish(dialogue.nextDialogId)) {
    assert(dialogue.nextDialogId in dialoguesById, `${header} Invalid next dialogue: ${dialogue.nextDialogId}`);
  }

  assert(dialogue.responses.length == 0 || isNullish(dialogue.nextDialogId), `${header} Cannot have both responses and next dialogue`);
}

export function validateDialogueResponses(
  assert: Assert,
  assertNotNullish: AssertNotNullish,
  dialogueTreeKey: string | undefined,
  dialogueKey: string | undefined,
  responses: ProcessedRawDialogueResponse[],
  dialoguesById: Record<number, ProcessedRawDialogue>,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  header: string
) {
  const responseIdsSeen: number[] = [];

  for (let i = 0; i < responses.length; i++) {
    const response = responses[i];
    validateDialogueResponse(
      assert,
      assertNotNullish,
      dialogueTreeKey,
      dialogueKey,
      response,
      dialoguesById,
      localization,
      localizationKeys,
      responseIdsSeen,
      `${header} Response '${response.key ?? i}'`
    );

    responseIdsSeen.push(response.id);
  }
}

export function validateDialogueResponse(
  assert: Assert,
  assertNotNullish: AssertNotNullish,
  dialogueTreeKey: string | undefined,
  dialogueKey: string | undefined,
  response: ProcessedRawDialogueResponse,
  dialoguesById: Record<number, ProcessedRawDialogue>,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  responseIdsSeen: number[],
  header: string
) {
  if (assertNotNullish(response.id, `${header} No id`) && assert(response.id != 0, `${header} Id cannot be 0`)) {
    assert(!responseIdsSeen.includes(response.id), `${header} Duplicate id: ${response.id}`);
  }

  if (isNotNullish(dialogueTreeKey) && isNotNullish(dialogueKey) && assertNotNullish(response.key, `${header} No key`) && localization) {
    assert(
      isNotEmpty(
        getLocalizedValue(
          localization,
          localizationKeys,
          getLocalizationKey(
            'dialogue-tree',
            `dialogue-${dialogueKey.toLowerCase()}-response-${response.key.toLowerCase()}-text`,
            dialogueTreeKey
          )
        )
      ),
      'No text'
    );
  }

  if (isNotNullish(response.nextDialogId)) {
    assert(response.nextDialogId in dialoguesById, `${header} Invalid next dialogue: ${response.nextDialogId}`);
  }
}

/**
 * Event Log
 */
export function validateEventLogs(
  allErrors: AllErrors,
  rawEventLogs: ProcessedRawEventLog[] | null | undefined,
  localization: Localization | null | undefined,
  localizationKeys: string[]
): {
  eventLogs: EventLog[];
  eventLogsById: Record<number, EventLog>;
  eventLogsByKey: Record<string, EventLog>;
} {
  const eventLogs: EventLog[] = [];
  const eventLogsById: Record<number, EventLog> = {};
  const eventLogsByKey: Record<string, EventLog> = {};

  if (!isNotNullish(rawEventLogs)) {
    return { eventLogs, eventLogsById, eventLogsByKey };
  }

  const evengLogErrors: Record<string, string[]> = {};
  const idsSeen: number[] = [];

  let i = 1;
  for (const rawType of rawEventLogs) {
    const errors = validateEventLog(rawType, localization, localizationKeys, idsSeen);

    if (isNotNullish(rawType.id) && rawType.id > 0) {
      const type = toEventLog(rawType);
      eventLogs.push(type);
      eventLogsById[type.id] = type;
      eventLogsByKey[type.key] = type;
      idsSeen.push(type.id);
    }

    if (errors.length > 0) {
      evengLogErrors[rawType.key ?? rawType.id ?? `Event Log ${i}`] = errors;
    }

    i++;
  }

  if (Object.keys(evengLogErrors).length > 0) {
    allErrors[EVENTS_DATA_FILE] = evengLogErrors;
  }

  return { eventLogs, eventLogsById, eventLogsByKey };
}

export function validateEventLog(
  rawType: ProcessedRawEventLog,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  idsSeen: number[]
): string[] {
  const { errors, assert, assertNotNullish } = createAssert();

  if (assertNotNullish(rawType.id, 'No id') && assert(rawType.id != 0, 'Id cannot be 0')) {
    assert(!idsSeen.includes(rawType.id), `Duplicate id: ${rawType.id}`);
  }

  if (assertNotNullish(rawType.key, 'No key') && localization) {
    assert(
      isNotEmpty(getLocalizedValue(localization, localizationKeys, getLocalizationKey('event-log', 'flavor-text', rawType.key))),
      'No flavor text'
    );
  }

  return errors;
}

/**
 * World Settings
 */
export function validateWorldSettings(allErrors: AllErrors, rawWorldSettings: ProcessedRawWorldSettings | null | undefined): WorldSettings {
  const worldSettings = toWorldSettings(toProcessedRawWorldSettings(undefined));

  if (!isNotNullish(rawWorldSettings)) {
    return worldSettings;
  }

  validateWorldSettingsWeatherTab(allErrors, rawWorldSettings);

  return toWorldSettings(toProcessedRawWorldSettings(rawWorldSettings));
}

export function validateWorldSettingsWeatherTab(allErrors: AllErrors, rawWorldSettings: ProcessedRawWorldSettings) {
  const { errors, assert } = createAssert();

  assert(rawWorldSettings.weather.rainChance > 0, 'Rain chance must be greater than 0');
  assert(rawWorldSettings.weather.rainChance <= 100, 'Rain chance must be less than or equal to 100');

  assert(rawWorldSettings.weather.snowChance > 0, 'Snow chance must be greater than 0');
  assert(rawWorldSettings.weather.snowChance <= 100, 'Snow chance must be less than or equal to 100');

  if (errors.length > 0) {
    allErrors[WORLD_DATA_FILE] = {
      ...(allErrors[WORLD_DATA_FILE] ?? {}),
      [ERROR_SECTION_PLAYER_WORLD_WEATHER]: errors
    };
  }
}

/**
 * Fishing Zones
 */
export function validateFishingZones(
  allErrors: AllErrors,
  rawFishingZones: ProcessedRawFishingZone[] | null | undefined,
  lootTablesByKey: Record<string, LootTable>
): {
  fishingZones: FishingZone[];
  fishingZonesById: Record<number, FishingZone>;
} {
  const fishingZones: FishingZone[] = [];
  const fishingZonesById: Record<number, FishingZone> = {};

  if (!isNotNullish(rawFishingZones)) {
    return { fishingZones, fishingZonesById };
  }

  const fishingZonesErrors: Record<string, string[]> = {};
  const idsSeen: number[] = [];

  let i = 1;
  for (const rawFishingZone of rawFishingZones) {
    const errors = validateFishingZone(rawFishingZone, lootTablesByKey, idsSeen);

    if (isNotNullish(rawFishingZone.id) && rawFishingZone.id > 0) {
      const fishingZone = toFishingZone(rawFishingZone);
      fishingZones.push(fishingZone);
      fishingZonesById[fishingZone.id] = fishingZone;
      idsSeen.push(fishingZone.id);
    }

    if (errors.length > 0) {
      fishingZonesErrors[rawFishingZone.key ?? rawFishingZone.id ?? `Fishing Zone ${i}`] = errors;
    }

    i++;
  }

  if (Object.keys(fishingZonesErrors).length > 0) {
    allErrors[FISHING_DATA_FILE] = {
      ...allErrors[FISHING_DATA_FILE],
      [ERROR_SECTION_FISHING_ZONES]: fishingZonesErrors
    };
  }

  return { fishingZones, fishingZonesById };
}

export function validateFishingZone(
  rawFishingZone: ProcessedRawFishingZone,
  lootTablesByKey: Record<string, LootTable>,
  idsSeen: number[]
): string[] {
  const { errors, assert, assertNotNullish, assertNotEmpty } = createAssert();

  if (assertNotNullish(rawFishingZone.id, 'No id') && assert(rawFishingZone.id != 0, 'Id cannot be 0')) {
    assert(!idsSeen.includes(rawFishingZone.id), `Duplicate id: ${rawFishingZone.id}`);
  }

  assertNotEmpty(rawFishingZone.key, 'No key');
  if (assertNotEmpty(rawFishingZone.lootTableKey, 'No loot table key')) {
    assert(rawFishingZone.lootTableKey in lootTablesByKey, `No loot table with key ${rawFishingZone.lootTableKey} exists`);
  }

  return errors;
}

/**
 * Skills
 */
export function validateSkills(
  allErrors: AllErrors,
  rawSkills: ProcessedRawSkill[] | null | undefined,
  localization: Localization | null | undefined,
  localizationKeys: string[]
): {
  skills: Skill[];
  skillsById: Record<number, Skill>;
  skillsByKey: Record<number, Skill>;
} {
  const skills: Skill[] = [];
  const skillsById: Record<number, Skill> = {};
  const skillsByKey: Record<string, Skill> = {};

  if (!isNotNullish(rawSkills)) {
    return { skills, skillsById, skillsByKey };
  }

  const skillErrors: Record<string, string[]> = {};
  const idsSeen: number[] = [];

  let i = 1;
  for (const rawSkill of rawSkills) {
    const errors = validateSkill(rawSkill, localization, localizationKeys, idsSeen);

    if (isNotNullish(rawSkill.key) && isNotNullish(rawSkill.id) && rawSkill.id > 0) {
      const fishingZone = toSkill(rawSkill);
      skills.push(fishingZone);
      skillsById[fishingZone.id] = fishingZone;
      skillsByKey[fishingZone.key] = fishingZone;
      idsSeen.push(fishingZone.id);
    }

    if (errors.length > 0) {
      skillErrors[rawSkill.key ?? rawSkill.id ?? `Skill ${i}`] = errors;
    }

    i++;
  }

  if (Object.keys(skillErrors).length > 0) {
    allErrors[SKILLS_DATA_FILE] = {
      ...allErrors[SKILLS_DATA_FILE],
      [ERROR_SECTION_SKILLS]: skillErrors
    };
  }

  return { skills, skillsById, skillsByKey };
}

export function validateSkill(
  rawSkill: ProcessedRawSkill,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  idsSeen: number[]
): string[] {
  const { errors, assert, assertNotNullish, assertNotEmpty } = createAssert();
  if (assertNotNullish(rawSkill.id, 'No id') && assert(rawSkill.id != 0, 'Id cannot be 0')) {
    assert(!idsSeen.includes(rawSkill.id), `Duplicate id: ${rawSkill.id}`);
  }

  if (assertNotNullish(rawSkill.key, 'No key') && localization) {
    assertNotEmpty(getLocalizedValue(localization, localizationKeys, getLocalizationKey('skill', 'name', rawSkill.key)), 'No name');
  }

  assert(rawSkill.levels.length > 0, 'No levels');
  assert(rawSkill.levels.length <= 5, 'Too many levels. Skills can only have 5 levels');
  for (let i = 0; i < rawSkill.levels.length; i++) {
    assertSkillLevel(assert, assertNotNullish, rawSkill.key, rawSkill.levels[i], localization, localizationKeys, i);
  }

  return errors;
}

export function assertSkillLevel(
  assert: Assert,
  assertNotNullish: AssertNotNullish,
  skillKey: string | undefined,
  skillLevel: ProcessedRawSkillLevel,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  index: number
) {
  const header = skillLevel.key ?? `Skill Level ${index}`;

  if (isNotNullish(skillKey) && assertNotNullish(skillLevel.key, `${header} No key`) && localization) {
    assert(
      isNotEmpty(
        getLocalizedValue(
          localization,
          localizationKeys,
          getLocalizationKey('skill', `skill-level-${skillLevel.key.toLowerCase()}-name`, skillKey)
        )
      ),
      `${header} No name`
    );
    assert(
      isNotEmpty(
        getLocalizedValue(
          localization,
          localizationKeys,
          getLocalizationKey('skill', `skill-level-${skillLevel.key.toLowerCase()}-description`, skillKey)
        )
      ),
      `${header} No description`
    );
  }

  assert(
    skillLevel.damageIncrease >= 0 && skillLevel.damageIncrease <= 250,
    `${header} Damage increase must be between 0 and 250, inclusive`
  );
  assert(
    skillLevel.healthRegenIncrease >= 0 && skillLevel.healthRegenIncrease <= 250,
    `${header} Health regen increase must be between 0 and 250, inclusive`
  );
  assert(
    skillLevel.energyRegenIncrease >= 0 && skillLevel.energyRegenIncrease <= 250,
    `${header} Energy regen increase must be between 0 and 250, inclusive`
  );
  assert(
    skillLevel.energyUseDescrease >= 0 && skillLevel.energyUseDescrease <= 100,
    `${header} Energy regen increase must be between 0 and 100, inclusive`
  );
  assert(
    skillLevel.craftingSpeedIncrease >= 0 && skillLevel.craftingSpeedIncrease <= 250,
    `${header} Crafting speed increase must be between 0 and 250, inclusive`
  );
  assert(
    skillLevel.monsterLootIncrease >= 0 && skillLevel.monsterLootIncrease <= 250,
    `${header} Monster loot drop rate increase must be between 0 and 250, inclusive`
  );
  assert(
    skillLevel.damageReduction >= 0 && skillLevel.damageReduction <= 100,
    `${header} Damage reduction must be between 0 and 100, inclusive`
  );
  assert(
    skillLevel.doubleCropChance >= 0 && skillLevel.doubleCropChance <= 100,
    `${header} Double crop chance must be between 0 and 100, inclusive`
  );
  assert(
    skillLevel.fishSizeChanceIncrease >= 0 && skillLevel.fishSizeChanceIncrease <= 250,
    `${header} Fish size chance increase must be between 0 and 250, inclusive`
  );
  assert(
    skillLevel.fishBiteSpeedIncrease >= 0 && skillLevel.fishBiteSpeedIncrease <= 250,
    `${header} Fish bite speed increase must be between 0 and 250, inclusive`
  );
  assert(
    skillLevel.sellPriceIncrease >= 0 && skillLevel.sellPriceIncrease <= 250,
    `${header} Sell price increase must be between 0 and 250, inclusive`
  );
  assert(skillLevel.buyDiscount >= 0 && skillLevel.buyDiscount <= 100, `${header} Buy discount must be between 0 and 100, inclusive`);
}

/**
 * Localizations
 */
export function validateLocalizationKeys(
  allErrors: AllErrors,
  rawLocalizationKeys: string[] | null | undefined
): {
  localizationKeys: string[];
} {
  const localizationKeys: string[] = [];
  const localizationKeysErrors: Record<string, string[]> = {};

  if (!isNotNullish(rawLocalizationKeys)) {
    return { localizationKeys };
  }

  let i = 1;
  for (const key of rawLocalizationKeys) {
    const errors = validateLocalizationKey(key, i);

    if (isNotEmpty(key)) {
      localizationKeys.push(key);
    }

    if (errors.length > 0) {
      localizationKeysErrors[`Localization Key ${i}`] = errors;
    }

    i++;
  }

  if (Object.keys(localizationKeysErrors).length > 0) {
    allErrors[LOCALIZATION_DATA_FILE] = {
      ...allErrors[LOCALIZATION_DATA_FILE],
      [ERROR_SECTION_LOCALIZATION_KEYS]: localizationKeysErrors
    };
  }

  return { localizationKeys };
}

export function validateLocalizationKey(key: string, index: number): string[] {
  const { errors, assertNotEmpty } = createAssert();

  assertNotEmpty(key, `Key ${index} cannot be empty`);

  return errors;
}

export function validateLocalizations(
  allErrors: AllErrors,
  rawLocalizations: ProcessedRawLocalization[] | null | undefined,
  keys: string[]
): {
  localizations: Localization[];
  localizationsByKey: Record<string, Localization>;
} {
  const localizations: Localization[] = [];
  const localizationsByKey: Record<string, Localization> = {};

  if (!isNotNullish(rawLocalizations)) {
    return { localizations, localizationsByKey };
  }

  const localizationsErrors: Record<string, string[]> = {};

  let i = 1;
  for (const rawLocalization of rawLocalizations) {
    const errors = validateLocalization(rawLocalization, keys);

    if (isNotEmpty(rawLocalization.key)) {
      const localization = toLocalization(rawLocalization);
      localizations.push(localization);
      localizationsByKey[localization.key] = localization;
    }

    if (errors.length > 0) {
      localizationsErrors[rawLocalization.key ?? rawLocalization.name ?? `Localization ${i}`] = errors;
    }

    i++;
  }

  if (Object.keys(localizationsErrors).length > 0) {
    allErrors[LOCALIZATION_DATA_FILE] = {
      ...allErrors[LOCALIZATION_DATA_FILE],
      [ERROR_SECTION_LOCALIZATIONS]: localizationsErrors
    };
  }

  return { localizations, localizationsByKey };
}

export function validateLocalization(localization: ProcessedRawLocalization, keys: string[]): string[] {
  const { errors, assert, assertNotEmpty } = createAssert();
  assertNotEmpty(localization.key, 'No key');
  assertNotEmpty(localization.name, 'No name');

  keys.forEach((key) => {
    if (assert(key in localization.values, `No value for key '${key}'`)) {
      assertNotEmpty(localization.values[key], `Value for key '${key}' is empty`);
    }
  });

  return errors;
}

/**
 * Quests
 */
export function validateQuests(
  allErrors: AllErrors,
  rawQuests: ProcessedRawQuest[] | null | undefined,
  itemsByKey: Record<string, ItemType>,
  craftingRecipesByKey: Record<string, CraftingRecipe>,
  creaturesByKey: Record<string, CreatureType>,
  dialogueTreesByKey: Record<string, DialogueTree>,
  eventLogsByKey: Record<string, EventLog>,
  localization: Localization | null,
  localizationKeys: string[]
): {
  quests: Quest[];
  questsById: Record<number, Quest>;
  questsByKey: Record<string, Quest>;
} {
  const quests: Quest[] = [];
  const questsById: Record<number, Quest> = {};
  const questsByKey: Record<string, Quest> = {};

  if (!isNotNullish(rawQuests)) {
    return { quests, questsById, questsByKey };
  }

  const questsErrors: Record<string, string[]> = {};

  let i = 1;
  const idsSeen: number[] = [];
  for (const rawQuest of rawQuests) {
    const errors = validateQuest(
      rawQuest,
      itemsByKey,
      craftingRecipesByKey,
      creaturesByKey,
      dialogueTreesByKey,
      eventLogsByKey,
      localization,
      localizationKeys,
      idsSeen
    );

    if (isNotEmpty(rawQuest.key)) {
      const quest = toQuest(rawQuest);
      quests.push(quest);
      idsSeen.push(quest.id);
      questsById[quest.id] = quest;
      questsByKey[quest.key] = quest;
    }

    if (errors.length > 0) {
      questsErrors[rawQuest.key ?? `Quest ${i}`] = errors;
    }

    i++;
  }

  if (Object.keys(questsErrors).length > 0) {
    allErrors[QUESTS_DATA_FILE] = {
      ...allErrors[QUESTS_DATA_FILE],
      [ERROR_SECTION_QUESTS]: questsErrors
    };
  }

  return { quests, questsById, questsByKey };
}

export function validateQuest(
  quest: ProcessedRawQuest,
  itemsByKey: Record<string, ItemType>,
  craftingRecipesByKey: Record<string, CraftingRecipe>,
  creaturesByKey: Record<string, CreatureType>,
  dialogueTreesByKey: Record<string, DialogueTree>,
  eventLogsByKey: Record<string, EventLog>,
  localization: Localization | null,
  localizationKeys: string[],
  idsSeen: number[]
): string[] {
  return [
    ...validateQuestGeneralTab(quest, creaturesByKey, dialogueTreesByKey, eventLogsByKey, localization, localizationKeys, idsSeen),
    ...validateQuestTasksTab(quest, itemsByKey, craftingRecipesByKey, creaturesByKey, dialogueTreesByKey),
    ...validateQuestRewardsTab(quest, itemsByKey)
  ];
}

export function validateQuestGeneralTab(
  quest: ProcessedRawQuest,
  creaturesByKey: Record<string, CreatureType>,
  dialogueTreesByKey: Record<string, DialogueTree>,
  eventLogsByKey: Record<string, EventLog>,
  localization: Localization | null,
  localizationKeys: string[],
  idsSeen: number[]
): string[] {
  const { errors, assert, assertNotNullish, assertNotEmpty } = createAssert();
  if (assertNotNullish(quest.id, 'No id')) {
    assert(quest.id > 0 && quest.id % 1 === 0, 'Id must be a positive whole number greater than 0');
    assert(!idsSeen.includes(quest.id), `Duplicate id: ${quest.id}`);
  }

  if (assertNotNullish(quest.key, 'No key') && localization) {
    assertNotEmpty(getLocalizedValue(localization, localizationKeys, getLocalizationKey('quest', 'name', quest.key)), 'No name');
    assertNotEmpty(getLocalizedValue(localization, localizationKeys, getLocalizationKey('quest', 'text', quest.key)), 'No text');
  }

  quest.prerequisiteEventKeys.forEach((eventKey) => {
    assert(eventKey in eventLogsByKey, `No event log with key ${eventKey} exists`);
  });

  if (isNotEmpty(quest.source)) {
    assert(QUEST_SOURCES.includes(quest.source), `Invalid source '${quest.source}'`);

    switch (quest.source) {
      case QUEST_SOURCE_CREATURE:
        if (assertNotEmpty(quest.sourceCreatureTypeKey, 'Source: No creature type key')) {
          assert(quest.sourceCreatureTypeKey in creaturesByKey, `Source: No creature with key ${quest.sourceCreatureTypeKey} exists`);
        }
        if (isNotEmpty(quest.sourceCreatureDialogueTreeKey)) {
          assert(
            quest.sourceCreatureDialogueTreeKey in dialogueTreesByKey,
            `Source: No dialogue tree with key ${quest.sourceCreatureDialogueTreeKey} exists`
          );
          if (quest.sourceCreatureDialogueTreeKey in dialogueTreesByKey) {
            const dialogueTree = dialogueTreesByKey[quest.sourceCreatureDialogueTreeKey];
            assert(
              dialogueTree.creatureKey === quest.sourceCreatureTypeKey,
              'Source: Creature type key and dialogue tree creature key do not match'
            );
          }
        }
        break;
      default:
        break;
    }
  }

  if (assertNotEmpty(quest.completionTrigger, 'No completion trigger')) {
    assert(
      QUEST_COMPLETION_TRIGGERS.includes(quest.completionTrigger as QuestCompletionTrigger),
      `Invalid completion trigger '${quest.completionTrigger}'`
    );

    switch (quest.completionTrigger) {
      case QUEST_OBJECTIVE_TYPE_TALK_TO_CREATURE:
        if (assertNotEmpty(quest.completionCreatureTypeKey, 'Completion Trigger: No creature type key')) {
          assert(
            quest.completionCreatureTypeKey in creaturesByKey,
            `Completion Trigger: No creature with key ${quest.completionCreatureTypeKey} exists`
          );
        }
        if (isNotEmpty(quest.completionCreatureDialogueTreeKey)) {
          assert(
            quest.completionCreatureDialogueTreeKey in dialogueTreesByKey,
            `Completion Trigger: No dialogue tree with key ${quest.completionCreatureDialogueTreeKey} exists`
          );
          if (quest.completionCreatureDialogueTreeKey in dialogueTreesByKey) {
            const dialogueTree = dialogueTreesByKey[quest.completionCreatureDialogueTreeKey];
            assert(
              dialogueTree.creatureKey === quest.completionCreatureTypeKey,
              'Completion Trigger: Creature type key and dialogue tree creature key do not match'
            );
          }
        }
        break;
      default:
        break;
    }
  }

  return errors;
}

export function validateQuestTasksTab(
  quest: ProcessedRawQuest,
  itemsByKey: Record<string, ItemType>,
  craftingRecipesByKey: Record<string, CraftingRecipe>,
  creaturesByKey: Record<string, CreatureType>,
  dialogueTreesByKey: Record<string, DialogueTree>
): string[] {
  const { errors, assert, assertNotNullish, assertNotEmpty } = createAssert();

  assert(quest.tasks.length > 0, 'There must be at least one task');

  const taskIdsSeen: number[] = [];
  quest.tasks.forEach((task, index) => {
    assertQuestTask(
      assert,
      assertNotNullish,
      assertNotEmpty,
      task,
      itemsByKey,
      craftingRecipesByKey,
      creaturesByKey,
      dialogueTreesByKey,
      taskIdsSeen,
      `Task ${index + 1}`
    );

    if (isNotNullish(task.id)) {
      taskIdsSeen.push(task.id);
    }
  });

  return errors;
}

export function assertQuestTask(
  assert: Assert,
  assertNotNullish: AssertNotNullish,
  assertNotEmpty: AssertNotEmpty,
  task: ProcessedRawQuestTask,
  itemsByKey: Record<string, ItemType>,
  craftingRecipesByKey: Record<string, CraftingRecipe>,
  creaturesByKey: Record<string, CreatureType>,
  dialogueTreesByKey: Record<string, DialogueTree>,
  idsSeen: number[],
  header: string
) {
  if (assertNotNullish(task.id, `${header}: No id`)) {
    assert(task.id > 0 && task.id % 1 === 0, `${header}: Id must be a positive whole number greater than 0`);
    assert(!idsSeen.includes(task.id), `${header}: Duplicate id: ${task.id}`);
  }

  assertNotEmpty(task.key, `${header}: No key`);

  assert(task.objectives.length > 0, `${header}: There must be at least one objective`);
  assert(task.objectives.length <= 5, `${header}: There can only be a max of five objectives per task`);

  task.objectives.forEach((objective, index) => {
    assertQuestObjective(
      assert,
      assertNotNullish,
      assertNotEmpty,
      objective,
      itemsByKey,
      craftingRecipesByKey,
      creaturesByKey,
      dialogueTreesByKey,
      `${header} / Objective ${index + 1}`
    );
  });
}

export function assertQuestObjective(
  assert: Assert,
  assertNotNullish: AssertNotNullish,
  assertNotEmpty: AssertNotEmpty,
  objective: ProcessedRawQuestObjective,
  itemsByKey: Record<string, ItemType>,
  craftingRecipesByKey: Record<string, CraftingRecipe>,
  creaturesByKey: Record<string, CreatureType>,
  dialogueTreesByKey: Record<string, DialogueTree>,
  header: string
) {
  if (assertNotEmpty(objective.objectiveType, `${header}: No objective type`)) {
    assert(
      QUEST_OBJECTIVE_TYPES.includes(objective.objectiveType as QuestObjectiveType),
      `${header}: Invalid objective type '${objective.objectiveType}'`
    );

    switch (objective.objectiveType) {
      case QUEST_OBJECTIVE_TYPE_GATHER:
        if (assertNotEmpty(objective.itemTypeKey, `${header}: No item type key`)) {
          assert(objective.itemTypeKey in itemsByKey, `${header}: No item with key ${objective.itemTypeKey} exists`);
        }

        if (assertNotNullish(objective.itemAmount, `${header}: No item amount`)) {
          assert(
            objective.itemAmount > 0 && objective.itemAmount % 1 == 0,
            `${header}: Item amount must be a positive whole number greater than 0`
          );
        }
        break;
      case QUEST_OBJECTIVE_TYPE_CRAFT:
        if (assertNotEmpty(objective.craftingRecipeKey, `${header}: No crafting recipe key`)) {
          assert(
            objective.craftingRecipeKey in craftingRecipesByKey,
            `${header}: No crafting recipe with key ${objective.craftingRecipeKey} exists`
          );
        }

        if (assertNotNullish(objective.craftingAmount, `${header}: No crafting amount`)) {
          assert(
            objective.craftingAmount > 0 && objective.craftingAmount % 1 == 0,
            `${header}: Crafting amount must be a positive whole number greater than 0`
          );
        }
        break;
      case QUEST_OBJECTIVE_TYPE_DESTINATION:
        if (assertNotNullish(objective.destinationPosition, `${header}: No destination position`)) {
          assertNotNullish(objective.destinationPosition.x, `${header}: No destination position x coordinate`);
          assertNotNullish(objective.destinationPosition.y, `${header}: No destination position y coordinate`);
        }
        break;
      case QUEST_OBJECTIVE_TYPE_TALK_TO_CREATURE:
        if (assertNotEmpty(objective.creatureTypeKey, `${header}: No creature type key`)) {
          assert(objective.creatureTypeKey in creaturesByKey, `${header}: No creature with key ${objective.creatureTypeKey} exists`);
        }
        if (isNotEmpty(objective.creatureDialogueTreeKey)) {
          if (
            assert(
              objective.creatureDialogueTreeKey in dialogueTreesByKey,
              `${header}: No dialogue tree with key ${objective.creatureDialogueTreeKey} exists`
            )
          ) {
            const dialogueTree = dialogueTreesByKey[objective.creatureDialogueTreeKey];
            assert(
              dialogueTree.creatureKey === objective.creatureTypeKey,
              `${header}: Creature type key and dialogue tree creature key do not match`
            );
          }
        }
        break;
      default:
        break;
    }
  }
}

export function validateQuestRewardsTab(quest: ProcessedRawQuest, itemsByKey: Record<string, ItemType>): string[] {
  const { errors, assert } = createAssert();

  assert(quest.experienceReward > 0, 'No experience reward');

  if (isNotNullish(quest.itemRewards)) {
    Object.keys(quest.itemRewards).forEach((itemTypeKey, index) => {
      const header = `Item Reward ${index + 1}`;
      if (isNotEmpty(itemTypeKey)) {
        assert(itemTypeKey in itemsByKey, `${header}: No item with key ${itemTypeKey} exists`);
      }

      const itemAmount = quest.itemRewards[itemTypeKey];
      assert(itemAmount > 0 && itemAmount % 1 == 0, `${header}: Amount must be a positive whole number greater than 0`);
    });
  }

  return errors;
}
