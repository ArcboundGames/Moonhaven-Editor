import {
  ALL_SEASONS,
  AUTO_BOX_COLLIDER_TYPE,
  BOX_COLLIDER_TYPE,
  DAYS_IN_A_WEEK,
  FALL,
  FARMLAND_CONDITION,
  FILLED_FROM_TYPE_NONE,
  FILLED_FROM_TYPE_SAND,
  FILLED_FROM_TYPE_WATER,
  FISHING_ITEM_TYPE_FISH,
  FISHING_ITEM_TYPE_LURE,
  FISHING_ITEM_TYPE_NONE,
  FISHING_ITEM_TYPE_POLE,
  GRASSLAND_CONDITION,
  INSIDE_CONDITION,
  INVENTORY_TYPE_LARGE,
  INVENTORY_TYPE_NONE,
  INVENTORY_TYPE_SMALL,
  LOOT_TYPE_DROP,
  LOOT_TYPE_NONE,
  LOOT_TYPE_STAGE_DROP,
  PLACEMENT_LAYER_IN_AIR,
  PLACEMENT_LAYER_IN_GROUND,
  PLACEMENT_LAYER_ON_GROUND,
  PLACEMENT_POSITION_CENTER,
  PLACEMENT_POSITION_EDGE,
  PLAYER_ANIMATION_SAMPLE_RATE,
  POLYGON_COLLIDER_TYPE,
  QUEST_COMPLETION_TRIGGER_AUTO_COMPLETE,
  QUEST_COMPLETION_TRIGGER_TALK_TO_CREATURE,
  QUEST_OBJECTIVE_TYPE_CRAFT,
  QUEST_OBJECTIVE_TYPE_DESTINATION,
  QUEST_OBJECTIVE_TYPE_GATHER,
  QUEST_OBJECTIVE_TYPE_TALK_TO_CREATURE,
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
import { isNotNullish, isNullish } from './null.util';

import type {
  AccentType,
  CampSpawn,
  Collider,
  ColliderType,
  CraftingRecipe,
  CraftingRecipeCategory,
  CreatureCategory,
  CreatureSettings,
  CreatureShop,
  CreatureSprites,
  CreatureType,
  DeepNullish,
  DestructionMenu,
  DestructionMenuButton,
  DestructionMenuButtonConditions,
  Dialogue,
  DialogueConditions,
  DialogueResponse,
  DialogueTree,
  EventLog,
  FilledFromType,
  FishingItemType,
  FishingPoleAnchorPoints,
  FishingZone,
  InventoryType,
  ItemCategory,
  ItemSettings,
  ItemType,
  Localization,
  LocalizationFile,
  LootTable,
  LootTableComponent,
  LootTableComponentGroup,
  LootType,
  ObjectCategory,
  ObjectCategorySprite,
  ObjectSettings,
  ObjectSpriteRule,
  ObjectSpriteRulePosition,
  ObjectSpriteRuleset,
  ObjectSprites,
  ObjectSubCategory,
  ObjectType,
  ObjectTypeStage,
  PlacementLayer,
  PlacementPosition,
  PlayerData,
  ProcessedRawCampSpawn,
  ProcessedRawCollider,
  ProcessedRawCraftingRecipe,
  ProcessedRawCraftingRecipeCategory,
  ProcessedRawCreatureCategory,
  ProcessedRawCreatureSettings,
  ProcessedRawCreatureShop,
  ProcessedRawCreatureSprites,
  ProcessedRawCreatureType,
  ProcessedRawDialogue,
  ProcessedRawDialogueConditions,
  ProcessedRawDialogueResponse,
  ProcessedRawDialogueTree,
  ProcessedRawEventLog,
  ProcessedRawFishingZone,
  ProcessedRawItemCategory,
  ProcessedRawItemSettings,
  ProcessedRawItemType,
  ProcessedRawLocalization,
  ProcessedRawLocalizationFile,
  ProcessedRawLootTable,
  ProcessedRawLootTableComponent,
  ProcessedRawLootTableComponentGroup,
  ProcessedRawObjectCategory,
  ProcessedRawObjectCategorySprite,
  ProcessedRawObjectSettings,
  ProcessedRawObjectSpriteRule,
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
  ProcessedRawWeatherSettings,
  ProcessedRawWorldSettings,
  Quest,
  QuestCompletionTrigger,
  QuestObjective,
  QuestObjectiveType,
  QuestSource,
  QuestTask,
  RawCampSpawn,
  RawCollider,
  RawCraftingRecipe,
  RawCraftingRecipeCategory,
  RawCreatureCategory,
  RawCreatureSettings,
  RawCreatureShop,
  RawCreatureSprites,
  RawCreatureType,
  RawDestructionMenu,
  RawDestructionMenuButton,
  RawDestructionMenuButtonConditions,
  RawDialogue,
  RawDialogueConditions,
  RawDialogueResponse,
  RawDialogueTree,
  RawEventLog,
  RawFishingZone,
  RawItemCategory,
  RawItemSettings,
  RawItemType,
  RawLocalization,
  RawLocalizationFile,
  RawLootTable,
  RawLootTableComponent,
  RawLootTableComponentGroup,
  RawObjectCategory,
  RawObjectCategorySprite,
  RawObjectSettings,
  RawObjectSpriteRule,
  RawObjectSpriteRuleset,
  RawObjectSprites,
  RawObjectSubCategory,
  RawObjectType,
  RawObjectTypeStage,
  RawPlayerData,
  RawQuest,
  RawQuestObjective,
  RawQuestTask,
  RawSkill,
  RawSkillLevel,
  RawSprite,
  RawUiDataFile,
  RawWeatherSettings,
  RawWorldSettings,
  Season,
  Section,
  Skill,
  SkillLevel,
  SpawningCondition,
  Sprite,
  StageJumpCondition,
  StagesType,
  TimeComparator,
  UiDataFile,
  Vector2,
  WeaponType,
  WeatherSettings,
  WorldSettings
} from '../interface';

export function toDataObject<T>(section: Section, fileSection: string | undefined, raw: unknown): T {
  switch (section) {
    case 'creature':
      return toCreatureType(raw as ProcessedRawCreatureType) as T;
    case 'creature-category':
      return toCreatureCategory(raw as ProcessedRawCreatureCategory) as T;
    case 'object-category':
      return toObjectCategory(raw as ProcessedRawObjectCategory) as T;
    case 'object-sub-category':
      return toObjectSubCategory(raw as ProcessedRawObjectSubCategory) as T;
    case 'item':
      return toItemType(raw as ProcessedRawItemType) as T;
    case 'item-category':
      return toItemCategory(raw as ProcessedRawItemCategory) as T;
    case 'loot-table':
      return toLootTable(raw as ProcessedRawLootTable) as T;
    case 'crafting-recipe':
      return toCraftingRecipe(raw as ProcessedRawCraftingRecipe) as T;
    case 'crafting-recipe-category':
      return toCraftingRecipeCategory(raw as ProcessedRawCraftingRecipeCategory) as T;
    case 'dialogue-tree':
      return toDialogueTree(raw as ProcessedRawDialogueTree) as T;
    case 'player-data':
      return toPlayerData(raw as ProcessedRawPlayerData) as T;
    case 'event-log':
      return toEventLog(raw as ProcessedRawEventLog) as T;
    case 'world-settings':
      return toWorldSettings(raw as ProcessedRawWorldSettings) as T;
    case 'fishing-zone':
      return toFishingZone(raw as ProcessedRawFishingZone) as T;
    case 'skill':
      return toSkill(raw as ProcessedRawSkill) as T;
    case 'localization-key':
      return raw as T;
    case 'localization':
      return toLocalization(raw as ProcessedRawLocalization) as T;
    case 'ui':
      switch (fileSection) {
        default:
          return toDestructionMenu(raw as DestructionMenu) as T;
      }
    case 'quest':
      return toQuest(raw as ProcessedRawQuest) as T;
    default:
      return toObjectType(raw as ProcessedRawObjectType) as T;
  }
}

export function toCreatureCategory(processedRawCategory: ProcessedRawCreatureCategory, index?: number): CreatureCategory {
  return {
    ...processedRawCategory,
    key: processedRawCategory.key ?? (index ? `CREATURE_CATEGORY_${index}` : 'UNKNOWN_CREATURE_CATEGORY'),
    settings: toCreatureSettings(processedRawCategory?.settings)
  };
}

export function toProcessedRawCreatureCategory(rawCreatureCategory: RawCreatureCategory | undefined | null): ProcessedRawCreatureCategory {
  return {
    ...rawCreatureCategory,
    key: fromNullish(rawCreatureCategory?.key),
    settings: toProcessedRawCreatureSettings(rawCreatureCategory?.settings)
  };
}

export function toCreatureType(processedRawCreature: ProcessedRawCreatureType, index?: number): CreatureType {
  return {
    ...processedRawCreature,
    key: processedRawCreature.key ?? (index ? `CREATURE_${index}` : 'UNKNOWN_CREATURE'),
    colliders: isNullish(processedRawCreature.colliders) ? undefined : toColliders(processedRawCreature.colliders),
    sprite: toCreatureSprites(processedRawCreature.sprite),
    settings: toCreatureSettings(processedRawCreature?.settings),
    shop: toCreatureShop(processedRawCreature?.shop),
    campSpawns: processedRawCreature?.campSpawns.map(toCampSpawn)
  };
}

export function toProcessedRawCreatureType(rawCreatureType: RawCreatureType | undefined | null): ProcessedRawCreatureType {
  return {
    ...rawCreatureType,
    id: rawCreatureType?.id ?? 0,
    key: fromNullish(rawCreatureType?.key),
    categoryKey: fromNullish(rawCreatureType?.categoryKey),
    colliders:
      isNullish(rawCreatureType) || isNullish(rawCreatureType.colliders) ? undefined : toProcessedRawColliders(rawCreatureType.colliders),
    sprite: toProcessedRawCreatureSprites(rawCreatureType?.sprite),
    settings: toProcessedRawCreatureSettings(rawCreatureType?.settings),
    shop: toProcessedRawCreatureShop(rawCreatureType?.shop),
    health: rawCreatureType?.health ?? 0,
    lootTableKey: fromNullish(rawCreatureType?.lootTableKey),
    experience: rawCreatureType?.experience ?? 0,

    walkSpeed: rawCreatureType?.walkSpeed ?? 0,
    runSpeed: rawCreatureType?.runSpeed ?? 0,

    wanderBehaviorEnabled: rawCreatureType?.wanderBehaviorEnabled ?? false,
    wanderTime: rawCreatureType?.wanderTime ?? 0,
    wanderRadius: rawCreatureType?.wanderRadius ?? 0,
    wanderUseCustomAnchor: rawCreatureType?.wanderUseCustomAnchor ?? false,
    wanderUseSpawnAnchor: rawCreatureType?.wanderUseSpawnAnchor ?? false,
    wanderAnchor: toVector2(rawCreatureType?.wanderAnchor, { x: 0, y: 0 }),
    wanderUseHardLeash: rawCreatureType?.wanderUseHardLeash ?? false,
    wanderHardLeashRange: rawCreatureType?.wanderHardLeashRange ?? 0,

    dangerBehaviorEnabled: rawCreatureType?.dangerBehaviorEnabled ?? false,
    dangerRadius: rawCreatureType?.dangerRadius ?? 0,
    dangerTolerance: rawCreatureType?.dangerTolerance ?? 0,
    dangerFromPlayers: rawCreatureType?.dangerFromPlayers ?? false,
    dangerCreatureCategoryKeys: fromNullishArray(rawCreatureType?.dangerCreatureCategoryKeys, (value) => value ?? '') ?? [],
    dangerCreatureKeys: fromNullishArray(rawCreatureType?.dangerCreatureKeys, (value) => value ?? '') ?? [],

    attackBehaviorEnabled: rawCreatureType?.attackBehaviorEnabled ?? false,
    attackRadius: rawCreatureType?.attackRadius ?? 0,
    attackDesiredRangeMin: rawCreatureType?.attackDesiredRangeMin ?? 0,
    attackDesiredRangeMax: rawCreatureType?.attackDesiredRangeMax ?? 0,
    attackTargetPlayers: rawCreatureType?.attackTargetPlayers ?? false,
    attackTargetCreatureCategoryKeys: fromNullishArray(rawCreatureType?.attackTargetCreatureCategoryKeys, (value) => value ?? '') ?? [],
    attackTargetCreatureKeys: fromNullishArray(rawCreatureType?.attackTargetCreatureKeys, (value) => value ?? '') ?? [],
    attackUseStrafing: rawCreatureType?.attackUseStrafing ?? false,
    attackStrafingTimeMin: rawCreatureType?.attackStrafingTimeMin ?? 0,
    attackStrafingTimeMax: rawCreatureType?.attackStrafingTimeMax ?? 0,

    randomSpawnsEnabled: rawCreatureType?.randomSpawnsEnabled ?? false,
    spawnDistanceFromPlayers: rawCreatureType?.spawnDistanceFromPlayers ?? 0,
    maxPopulation: rawCreatureType?.maxPopulation ?? 0,

    campSpawns: fromNullishArray(rawCreatureType?.campSpawns, toProcessedRawCampSpawn) ?? []
  };
}

export function createCampSpawn(): CampSpawn {
  return {
    position: { x: 0, y: 0 },
    maxPopulation: 0
  };
}

export function toProcessedRawCampSpawn(rawCampSpawn: RawCampSpawn | null | undefined): ProcessedRawCampSpawn {
  return {
    ...rawCampSpawn,
    position: toVector2(rawCampSpawn?.position, { x: 0, y: 0 }),
    maxPopulation: rawCampSpawn?.maxPopulation ?? 0
  };
}

export function toCampSpawn(processedRawCampSpawn: ProcessedRawCampSpawn): CampSpawn {
  return {
    ...processedRawCampSpawn
  };
}

export function toProcessedRawCreatureShop(rawCreatureShop: RawCreatureShop | null | undefined): ProcessedRawCreatureShop | undefined {
  if (isNullish(rawCreatureShop)) {
    return undefined;
  }

  return {
    ...rawCreatureShop,
    openingEvent: fromNullish(rawCreatureShop.openingEvent),
    prices: fromNullishRecord(rawCreatureShop?.prices, (price) => price ?? 0) || {},
    openTimes: fromNullishArray(rawCreatureShop?.openTimes, (time) => time ?? -1) || (Array(DAYS_IN_A_WEEK) as number[]),
    closeTimes: fromNullishArray(rawCreatureShop?.closeTimes, (time) => time ?? -1) || (Array(DAYS_IN_A_WEEK) as number[])
  };
}

export function createCreatureShop(): CreatureShop {
  return {
    prices: {},
    openTimes: Array(DAYS_IN_A_WEEK) as number[],
    closeTimes: Array(DAYS_IN_A_WEEK) as number[]
  };
}

export function toCreatureShop(processedRawCreatureShop: ProcessedRawCreatureShop | undefined): CreatureShop | undefined {
  if (isNullish(processedRawCreatureShop)) {
    return undefined;
  }

  return {
    ...processedRawCreatureShop
  };
}

export function toProcessedRawCreatureSprites(creatureSprites: RawCreatureSprites | null | undefined): ProcessedRawCreatureSprites {
  return {
    ...creatureSprites,
    width: creatureSprites?.width ?? 0,
    height: creatureSprites?.height ?? 0,
    pivotOffset: isNullish(creatureSprites?.pivotOffset)
      ? undefined
      : {
          x: creatureSprites?.pivotOffset.x ?? 0,
          y: creatureSprites?.pivotOffset?.y ?? 0
        },
    sprites: toProcessedRawSprites(creatureSprites?.sprites)
  };
}

export function toCreatureSprites(objectSprites: ProcessedRawCreatureSprites): CreatureSprites {
  return {
    ...objectSprites,
    sprites: toSprites(objectSprites.sprites)
  };
}

export function createCreatureSprites(): CreatureSprites {
  return {
    width: 0,
    height: 0
  };
}

export function toItemCategory(processedRawCategory: ProcessedRawItemCategory, index?: number): ItemCategory {
  return {
    ...processedRawCategory,
    key: processedRawCategory.key ?? (index ? `ITEM_CATEGORY_${index}` : 'UNKNOWN_ITEM_CATEGORY'),
    settings: toItemSettings(processedRawCategory?.settings)
  };
}

export function toProcessedRawItemCategory(rawItemCategory: RawItemCategory | undefined | null): ProcessedRawItemCategory {
  return {
    ...rawItemCategory,
    key: fromNullish(rawItemCategory?.key),
    settings: toProcessedRawItemSettings(rawItemCategory?.settings)
  };
}

export function toItemType(processedRawItem: ProcessedRawItemType, index?: number): ItemType {
  return {
    ...processedRawItem,
    key: processedRawItem.key ?? (index ? `ITEM_${index}` : 'UNKNOWN_ITEM'),
    settings: toItemSettings(processedRawItem?.settings)
  };
}

export function toProcessedRawItemType(rawItemType: RawItemType | undefined | null): ProcessedRawItemType {
  return {
    ...rawItemType,
    id: rawItemType?.id ?? 0,
    key: fromNullish(rawItemType?.key),
    categoryKey: fromNullish(rawItemType?.categoryKey),
    objectTypeKey: fromNullish(rawItemType?.objectTypeKey),
    maxStackSize: rawItemType?.maxStackSize ?? 0,
    damage: rawItemType?.damage ?? 0,
    damageArcRadius: rawItemType?.damageArcRadius ?? 0,
    settings: toProcessedRawItemSettings(rawItemType?.settings),
    durability: rawItemType?.durability ?? 0,
    hungerIncrease: rawItemType?.hungerIncrease ?? 0,
    thirstIncrease: rawItemType?.thirstIncrease ?? 0,
    energyIncrease: rawItemType?.energyIncrease ?? 0,
    edibleLeftoverItemTypeKey: fromNullish(rawItemType?.edibleLeftoverItemTypeKey),
    filledLevel: rawItemType?.filledLevel ?? 0,
    filledItemTypeKey: fromNullish(rawItemType?.filledItemTypeKey),
    sellPrice: rawItemType?.sellPrice ?? 0,
    lightLevel: fromNullish(rawItemType?.lightLevel),
    lightPosition: toVector2(rawItemType?.lightPosition),
    animationSampleRate: rawItemType?.animationSampleRate ?? PLAYER_ANIMATION_SAMPLE_RATE,
    projectileSpeed: rawItemType?.projectileSpeed ?? 0,
    projectileDistance: rawItemType?.projectileDistance ?? 0,
    fishingPoleAnchorPointsNorth: toFishingPoleAnchorPoints(rawItemType?.fishingPoleAnchorPointsNorth),
    fishingPoleAnchorPointsEast: toFishingPoleAnchorPoints(rawItemType?.fishingPoleAnchorPointsEast),
    fishingPoleAnchorPointsSouth: toFishingPoleAnchorPoints(rawItemType?.fishingPoleAnchorPointsSouth),
    fishingPoleAnchorPointsWest: toFishingPoleAnchorPoints(rawItemType?.fishingPoleAnchorPointsWest),
    fishExperience: rawItemType?.fishExperience ?? 0
  };
}

export function toLootTable(rawLootTable: ProcessedRawLootTable, index?: number): LootTable {
  return {
    ...rawLootTable,
    key: rawLootTable.key ?? (index ? `LOOT_TABLE_${index}` : 'UNKNOWN_LOOT_TABLE'),
    defaultGroup: toLootTableComponentGroup(rawLootTable.defaultGroup),
    groups: rawLootTable.groups.map(toLootTableComponentGroup)
  };
}

export function toProcessedRawLootTable(rawLootTable: RawLootTable | undefined | null): ProcessedRawLootTable {
  if (isNullish(rawLootTable)) {
    return {
      defaultGroup: toProcessedRawLootTableComponentGroup(null),
      groups: []
    };
  }

  return {
    ...rawLootTable,
    key: isNullish(rawLootTable.key) ? undefined : rawLootTable.key,
    defaultGroup: toProcessedRawLootTableComponentGroup(rawLootTable.defaultGroup),
    groups: isNullish(rawLootTable.groups) ? [] : rawLootTable.groups.map(toProcessedRawLootTableComponentGroup)
  };
}

export function toCraftingRecipeCategory(
  rawCraftingRecipeCategory: ProcessedRawCraftingRecipeCategory,
  index?: number
): CraftingRecipeCategory {
  return {
    ...rawCraftingRecipeCategory,
    key: rawCraftingRecipeCategory.key ?? (index ? `CRAFTING_RECIPE_CATEGORY_${index}` : 'UNKNOWN_CRAFTING_RECIPE_CATEGORY')
  };
}

export function toProcessedRawCraftingRecipeCategory(
  rawCraftingRecipeCategory: RawCraftingRecipeCategory | undefined | null
): ProcessedRawCraftingRecipeCategory {
  return {
    ...rawCraftingRecipeCategory,
    key: fromNullish(rawCraftingRecipeCategory?.key)
  };
}

export function toCraftingRecipe(rawCraftingRecipe: ProcessedRawCraftingRecipe, index?: number): CraftingRecipe {
  return {
    ...rawCraftingRecipe,
    key: rawCraftingRecipe.key ?? (index ? `CRAFTING_RECIPE_${index}` : 'UNKNOWN_CRAFTING_RECIPE')
  };
}

export function toProcessedRawCraftingRecipe(rawCraftingRecipe: RawCraftingRecipe | undefined | null): ProcessedRawCraftingRecipe {
  return {
    ...rawCraftingRecipe,
    key: fromNullish(rawCraftingRecipe?.key),
    categoryKey: fromNullish(rawCraftingRecipe?.categoryKey),
    itemTypeKey: fromNullish(rawCraftingRecipe?.itemTypeKey),
    amount: rawCraftingRecipe?.amount ?? 0,
    hiddenResultsTypeKeys: fromNullishArray(rawCraftingRecipe?.hiddenResultsTypeKeys, (entry) => entry ?? ''),
    craftingAttribute: fromNullish(rawCraftingRecipe?.craftingAttribute),
    workstation: fromNullish(rawCraftingRecipe?.workstation),
    craftingTime: fromNullish(rawCraftingRecipe?.craftingTime) ?? 0,
    searchCategories: fromNullishArray(rawCraftingRecipe?.searchCategories, (entry) => entry ?? ''),
    ingredients: fromNullishRecord(rawCraftingRecipe?.ingredients, (value) => value ?? 0),
    requiredSkillKey: fromNullish(rawCraftingRecipe?.requiredSkillKey),
    requiredSkillLevelKey: fromNullish(rawCraftingRecipe?.requiredSkillLevelKey)
  };
}

export function toObjectCategory(rawObjectCategory: ProcessedRawObjectCategory, index?: number): ObjectCategory {
  return {
    ...rawObjectCategory,
    key: rawObjectCategory.key ?? (index ? `OBJECT_CATEGORY_${index}` : 'UNKNOWN_OBJECT_CATEGORY'),
    settings: toObjectSettings(rawObjectCategory.settings),
    colliders: isNullish(rawObjectCategory.colliders) ? undefined : toColliders(rawObjectCategory.colliders),
    sprite: toCategorySprite(rawObjectCategory.sprite)
  };
}

export function toProcessedRawObjectCategory(rawObjectCategory: RawObjectCategory | undefined | null): ProcessedRawObjectCategory {
  return {
    ...rawObjectCategory,
    key: fromNullish(rawObjectCategory?.key),
    settings: isNullish(rawObjectCategory?.settings) ? undefined : toProcessedRawObjectSettings(rawObjectCategory?.settings),
    colliders:
      isNullish(rawObjectCategory) || isNullish(rawObjectCategory.colliders)
        ? undefined
        : toProcessedRawColliders(rawObjectCategory.colliders),
    sprite: toProcessedRawCategorySprite(rawObjectCategory?.sprite)
  };
}

export function toObjectSubCategory(rawObjectSubCategory: ProcessedRawObjectSubCategory, index?: number): ObjectSubCategory {
  return {
    ...rawObjectSubCategory,
    key: rawObjectSubCategory.key ?? (index ? `OBJECT_SUB_CATEGORY_${index}` : 'UNKNOWN_OBJECT_SUB_CATEGORY'),
    settings: toObjectSettings(rawObjectSubCategory?.settings),
    colliders: isNullish(rawObjectSubCategory.colliders) ? undefined : toColliders(rawObjectSubCategory.colliders),
    sprite: toCategorySprite(rawObjectSubCategory?.sprite),
    rulesets: isNullish(rawObjectSubCategory.rulesets) ? undefined : rawObjectSubCategory.rulesets.map(toObjectSpriteRules)
  };
}

export function toProcessedRawObjectSubCategory(
  rawObjectSubCategory: RawObjectSubCategory | undefined | null
): ProcessedRawObjectSubCategory {
  return {
    ...rawObjectSubCategory,
    key: fromNullish(rawObjectSubCategory?.key),
    settings: isNullish(rawObjectSubCategory?.settings) ? undefined : toProcessedRawObjectSettings(rawObjectSubCategory?.settings),
    colliders:
      isNullish(rawObjectSubCategory) || isNullish(rawObjectSubCategory?.colliders)
        ? undefined
        : toProcessedRawColliders(rawObjectSubCategory?.colliders),
    sprite: toProcessedRawCategorySprite(rawObjectSubCategory?.sprite),
    categoryKey: isNullish(rawObjectSubCategory?.categoryKey) ? undefined : rawObjectSubCategory?.categoryKey,
    rulesets: isNullish(rawObjectSubCategory?.rulesets) ? undefined : rawObjectSubCategory?.rulesets.map(toProcessedRawObjectSpriteRules)
  };
}

export function toObjectType(rawObjectType: ProcessedRawObjectType, index?: number): ObjectType {
  return {
    ...rawObjectType,
    key: rawObjectType.key ?? (index ? `OBJECT_${index}` : 'UNKNOWN_OBJECT'),
    settings: toObjectSettings(rawObjectType?.settings),
    colliders: isNullish(rawObjectType.colliders) ? undefined : toColliders(rawObjectType.colliders),
    sprite: toObjectSprites(rawObjectType.sprite),
    stages: isNullish(rawObjectType.stages) ? undefined : rawObjectType.stages.map(toObjectTypeStage),
    season: toSeason(rawObjectType.season)
  };
}

export function toProcessedRawObjectType(rawObjectType: RawObjectType | undefined | null): ProcessedRawObjectType {
  return {
    ...rawObjectType,
    id: rawObjectType?.id ?? 0,
    key: fromNullish(rawObjectType?.key),
    categoryKey: fromNullish(rawObjectType?.categoryKey),
    subCategoryKey: fromNullish(rawObjectType?.subCategoryKey),
    lootTableKey: fromNullish(rawObjectType?.lootTableKey),
    health: fromNullish(rawObjectType?.health) ?? 0,
    expireChance: fromNullish(rawObjectType?.expireChance) ?? 0,
    settings: toProcessedRawObjectSettings(rawObjectType?.settings),
    stages: rawObjectType?.stages?.map(toProcessedRawObjectTypeStage),
    colliders:
      isNotNullish(rawObjectType) && isNotNullish(rawObjectType?.colliders) ? toProcessedRawColliders(rawObjectType.colliders) : undefined,
    sprite: toProcessedRawObjectSprites(rawObjectType?.sprite),
    worldSize: toVector2(rawObjectType?.worldSize, { x: 1, y: 1 }),
    experience: rawObjectType?.experience ?? 0,
    season: fromNullish(rawObjectType?.season),
    craftingSpeedIncreaseSkillKey: fromNullish(rawObjectType?.craftingSpeedIncreaseSkillKey),
    lightLevel: fromNullish(rawObjectType?.lightLevel),
    lightPosition: toVector2(rawObjectType?.lightPosition)
  };
}

export function createObjectSprites(): ObjectSprites {
  return {
    defaultSprite: 0,
    width: 0,
    height: 0
  };
}

export function toProcessedRawObjectSprites(objectSprites: RawObjectSprites | null | undefined): ProcessedRawObjectSprites {
  return {
    ...objectSprites,
    defaultSprite: objectSprites?.defaultSprite ?? 0,
    width: objectSprites?.width ?? 0,
    height: objectSprites?.height ?? 0,
    pivotOffset: isNullish(objectSprites?.pivotOffset)
      ? undefined
      : {
          x: objectSprites?.pivotOffset.x ?? 0,
          y: objectSprites?.pivotOffset?.y ?? 0
        },
    sprites: toProcessedRawSprites(objectSprites?.sprites)
  };
}

export function toObjectSprites(objectSprites: ProcessedRawObjectSprites): ObjectSprites {
  return {
    ...objectSprites,
    sprites: toSprites(objectSprites.sprites)
  };
}

export function createObjectSprite(): Sprite {
  return {};
}

export function toProcessedRawSprites(
  sprites: Record<string, RawSprite | null | undefined> | null | undefined
): Record<string, ProcessedRawSprite> | undefined {
  return fromNullishRecord(sprites, toProcessedRawSprite);
}

export function toProcessedRawSprite(objectSprite: RawSprite | null | undefined): ProcessedRawSprite {
  return {
    ...objectSprite,
    pivotOffset: toVector2(objectSprite?.pivotOffset),
    spriteOffset: toVector2(objectSprite?.spriteOffset, { x: 0, y: 0 }),
    placementLayer: fromNullish(objectSprite?.placementLayer),
    colliders: isNullish(objectSprite?.colliders) ? undefined : objectSprite?.colliders.map(toProcessedRawObjectCollider)
  };
}

export function toSprites(sprites: Record<string, ProcessedRawSprite> | undefined): Record<string, Sprite> | undefined {
  return isNullish(sprites)
    ? undefined
    : Object.keys(sprites).reduce((spriteSettings, sprite) => {
        const objectSprite = sprites?.[sprite];
        if (isNotNullish(objectSprite)) {
          spriteSettings[sprite] = toSprite(objectSprite);
        }
        return spriteSettings;
      }, {} as Record<string, Sprite>);
}

export function toSprite(objectSprite: ProcessedRawSprite): Sprite {
  return {
    ...objectSprite,
    placementLayer: toPlacementLayer(objectSprite.placementLayer),
    colliders: isNullish(objectSprite.colliders) ? undefined : objectSprite.colliders.map(toObjectCollider)
  };
}

export function toProcessedRawObjectCollider(rawObjectCollider: RawCollider | undefined | null): ProcessedRawCollider {
  return {
    ...rawObjectCollider,
    isTrigger: fromNullish(rawObjectCollider?.isTrigger) ?? false,
    usedByComposite: fromNullish(rawObjectCollider?.usedByComposite) ?? false,
    type: fromNullish(rawObjectCollider?.type),
    size: toVector2(rawObjectCollider?.size),
    offset: toVector2(rawObjectCollider?.offset)
  };
}

export function toObjectCollider(processedRawObjectCollider: ProcessedRawCollider): Collider {
  return {
    ...processedRawObjectCollider,
    type: toColliderType(processedRawObjectCollider.type)
  };
}

export function toProcessedRawColliders(rawObjectCollider: (RawCollider | undefined | null)[]): ProcessedRawCollider[] {
  return rawObjectCollider.map(toProcessedRawObjectCollider);
}

export function toColliders(processedRawObjectCollider: ProcessedRawCollider[]): Collider[] {
  return processedRawObjectCollider.map(toObjectCollider);
}

export function toProcessedRawCategorySprite(
  rawCategorySprite: RawObjectCategorySprite | undefined | null
): ProcessedRawObjectCategorySprite {
  return {
    sprites: toProcessedRawSprites(rawCategorySprite?.sprites)
  };
}

export function toCategorySprite(
  processedRawCategorySprite: ProcessedRawObjectCategorySprite | undefined
): ObjectCategorySprite | undefined {
  if (isNullish(processedRawCategorySprite)) {
    return undefined;
  }

  return {
    sprites: toSprites(processedRawCategorySprite.sprites)
  };
}

export function toProcessedRawSpriteColliders(
  rawSpriteColliders: Record<string, (RawCollider | undefined | null)[]> | undefined | null
): Record<string, ProcessedRawCollider[]> {
  if (isNullish(rawSpriteColliders)) {
    return {};
  }

  return Object.keys(rawSpriteColliders).reduce((spriteColliders, sprite) => {
    spriteColliders[sprite] = rawSpriteColliders?.[sprite]?.map(toProcessedRawObjectCollider) ?? [];
    return spriteColliders;
  }, {} as Record<string, ProcessedRawCollider[]>);
}

export function toSpriteColliders(
  rawSpriteColliders: Record<string, ProcessedRawCollider[]> | undefined | null
): Record<string, Collider[]> {
  if (isNullish(rawSpriteColliders)) {
    return {};
  }

  return Object.keys(rawSpriteColliders).reduce((spriteColliders, sprite) => {
    spriteColliders[sprite] = rawSpriteColliders?.[sprite]?.map(toObjectCollider) ?? [];
    return spriteColliders;
  }, {} as Record<string, Collider[]>);
}

export function toProcessedRawObjectSpriteRules(rawRulset: RawObjectSpriteRuleset | undefined | null): ProcessedRawObjectSpriteRuleset {
  return {
    ...rawRulset,
    rules: fromNullish(rawRulset?.rules)?.map(toProcessedRawObjectSpriteRule),
    defaultSprite: fromNullish(rawRulset?.defaultSprite) ?? 0
  };
}

export function toObjectSpriteRules(rawRulset: ProcessedRawObjectSpriteRuleset): ObjectSpriteRuleset {
  return {
    ...rawRulset,
    rules: rawRulset?.rules?.map(toObjectSpriteRule),
    defaultSprite: rawRulset?.defaultSprite ?? 0
  };
}

export function toProcessedRawObjectSpriteRule(rawRule: RawObjectSpriteRule | undefined | null): ProcessedRawObjectSpriteRule {
  return {
    ...rawRule,
    sprites: fromNullishArray(rawRule?.sprites, (entry) => entry ?? 0),
    conditions: fromNullishRecord(rawRule?.conditions, (value) => value ?? false)
  };
}

export function toObjectSpriteRule(rule: ProcessedRawObjectSpriteRule): ObjectSpriteRule {
  return {
    ...rule,
    conditions: toTypedKeyRecord(rule?.conditions, toObjectSpriteRulePosition)
  };
}

export function toObjectTypeStage(rawStage: ProcessedRawObjectTypeStage): ObjectTypeStage {
  return {
    ...rawStage,
    jumpCondition: toStageJumpCondition(rawStage.jumpCondition)
  };
}

export function toProcessedRawObjectTypeStage(rawStage: RawObjectTypeStage | undefined | null): ProcessedRawObjectTypeStage {
  return {
    ...rawStage,
    lootTableKey: fromNullish(rawStage?.lootTableKey),
    growthDays: fromNullish(rawStage?.growthDays) ?? 0,
    health: fromNullish(rawStage?.health) ?? 0,
    threshold: fromNullish(rawStage?.threshold) ?? 0,
    harvestable: fromNullish(rawStage?.harvestable) ?? false,
    pause: fromNullish(rawStage?.pause) ?? false,
    jumpToStage: fromNullish(rawStage?.jumpToStage),
    jumpCondition: fromNullish(rawStage?.jumpCondition)
  };
}

export function createObjectTypeStage(): ObjectTypeStage {
  return {
    growthDays: 0,
    health: 0,
    threshold: 0,
    harvestable: false,
    pause: false
  };
}

export function toProcessedRawLootTableComponentGroup(
  rawLootTableComponentGroup: RawLootTableComponentGroup | undefined | null
): ProcessedRawLootTableComponentGroup {
  if (isNullish(rawLootTableComponentGroup)) {
    return {
      probability: 0,
      components: []
    };
  }

  return {
    ...rawLootTableComponentGroup,
    probability: isNotNullish(rawLootTableComponentGroup?.probability) ? rawLootTableComponentGroup?.probability : 0,
    components: isNullish(rawLootTableComponentGroup.components)
      ? []
      : rawLootTableComponentGroup.components.map(toProcessedRawLootTableComponent)
  };
}

export function toLootTableComponentGroup(
  processedRawLootTableComponentGroup: ProcessedRawLootTableComponentGroup
): LootTableComponentGroup {
  return {
    ...processedRawLootTableComponentGroup,
    components: processedRawLootTableComponentGroup.components.map(toLootTableComponent)
  };
}

export function toProcessedRawLootTableComponent(
  rawLootTableComponent: RawLootTableComponent | undefined | null
): ProcessedRawLootTableComponent {
  if (isNullish(rawLootTableComponent)) {
    return {
      min: 0,
      max: 0,
      probability: 0
    };
  }

  return {
    ...rawLootTableComponent,
    typeKey: isNullish(rawLootTableComponent?.typeKey) ? undefined : rawLootTableComponent?.typeKey,
    min: isNotNullish(rawLootTableComponent?.min) ? rawLootTableComponent?.min : 0,
    max: isNotNullish(rawLootTableComponent?.max) ? rawLootTableComponent?.max : 0,
    probability: isNotNullish(rawLootTableComponent?.probability) ? rawLootTableComponent?.probability : 0
  };
}

export function toLootTableComponent(processedRawLootTableComponent: ProcessedRawLootTableComponent): LootTableComponent {
  return {
    ...processedRawLootTableComponent
  };
}

export function toDialogueTree(processedRawDialogueTree: ProcessedRawDialogueTree): DialogueTree {
  return {
    ...processedRawDialogueTree,
    key:
      processedRawDialogueTree.key ?? (processedRawDialogueTree.id ? `DIALOG_TREE_${processedRawDialogueTree.id}` : 'UNKNOWN_DIALOG_TREE'),
    conditions: toDialogueConditions(processedRawDialogueTree.conditions),
    dialogues: processedRawDialogueTree.dialogues.map(toDialogue)
  };
}

export function toProcessedRawDialogueTree(rawDialogueTree: RawDialogueTree | undefined | null): ProcessedRawDialogueTree {
  return {
    ...rawDialogueTree,
    id: rawDialogueTree?.id ?? 0,
    key: fromNullish(rawDialogueTree?.key),
    creatureKey: fromNullish(rawDialogueTree?.creatureKey),
    conditions: toProcessedRawDialogueConditions(rawDialogueTree?.conditions),
    dialogues: fromNullishArray(rawDialogueTree?.dialogues, toProcessedRawDialogue) ?? [],
    startingDialogueId: rawDialogueTree?.startingDialogueId ?? 0,
    priority: rawDialogueTree?.priority ?? 0,
    runOnlyOnce: rawDialogueTree?.runOnlyOnce ?? false,
    completionEvent: fromNullish(rawDialogueTree?.completionEvent)
  };
}

export function toDialogueConditions(
  processedRawDialogueConditions: ProcessedRawDialogueConditions | undefined
): DialogueConditions | undefined {
  if (!processedRawDialogueConditions) {
    return undefined;
  }

  return {
    ...processedRawDialogueConditions,
    timesComparator: toTimeComparator(processedRawDialogueConditions?.timesComparator)
  };
}

export function toProcessedRawDialogueConditions(
  rawDialogueConditions: RawDialogueConditions | undefined | null
): ProcessedRawDialogueConditions | undefined {
  if (!rawDialogueConditions) {
    return undefined;
  }

  return {
    ...rawDialogueConditions,
    days: fromNullishArray(rawDialogueConditions?.days, (value) => value ?? 0),
    times: fromNullishArray(rawDialogueConditions?.times, (value) => value ?? 0),
    timesComparator: fromNullish(rawDialogueConditions?.timesComparator)
  };
}

export function toDialogue(processedRawDialogue: ProcessedRawDialogue): Dialogue {
  return {
    ...processedRawDialogue,
    key: processedRawDialogue.key ?? (processedRawDialogue.id ? `DIALOG_${processedRawDialogue.id}` : 'UNKNOWN_DIALOG'),
    responses: processedRawDialogue.responses.map(toDialogueResponse)
  };
}

export function toProcessedRawDialogue(rawDialogue: RawDialogue | undefined | null): ProcessedRawDialogue {
  return {
    ...rawDialogue,
    id: rawDialogue?.id ?? 0,
    key: fromNullish(rawDialogue?.key),
    responses: fromNullishArray(rawDialogue?.responses, toProcessedRawDialogueResponse) ?? [],
    nextDialogId: fromNullish(rawDialogue?.nextDialogId)
  };
}

export function toDialogueResponse(processedRawDialogueResponse: ProcessedRawDialogueResponse): DialogueResponse {
  return {
    ...processedRawDialogueResponse,
    key:
      processedRawDialogueResponse.key ??
      (processedRawDialogueResponse.id ? `DIALOG_RESPONSE_${processedRawDialogueResponse.id}` : 'UNKNOWN_DIALOG_RESPONSE')
  };
}

export function toProcessedRawDialogueResponse(rawDialogueResponse: RawDialogueResponse | undefined | null): ProcessedRawDialogueResponse {
  return {
    ...rawDialogueResponse,
    id: rawDialogueResponse?.id ?? 0,
    key: fromNullish(rawDialogueResponse?.key),
    nextDialogId: fromNullish(rawDialogueResponse?.nextDialogId)
  };
}

export function toPlayerData(processedRawPlayerData: ProcessedRawPlayerData): PlayerData {
  return {
    ...processedRawPlayerData
  };
}

export function toProcessedRawPlayerData(rawPlayerData: RawPlayerData | undefined | null): ProcessedRawPlayerData {
  return {
    ...rawPlayerData,
    health: rawPlayerData?.health ?? 0,
    healthMax: rawPlayerData?.healthMax ?? 0,
    healthDepletionTime: rawPlayerData?.healthDepletionTime ?? 0,
    healthRefillTime: rawPlayerData?.healthRefillTime ?? 0,
    healthRefillHungerDepletionRate: rawPlayerData?.healthRefillHungerDepletionRate ?? 0,
    healthRefillThirstDepletionRate: rawPlayerData?.healthRefillThirstDepletionRate ?? 0,
    hunger: rawPlayerData?.hunger ?? 0,
    hungerMax: rawPlayerData?.hungerMax ?? 0,
    hungerInitialDelay: rawPlayerData?.hungerInitialDelay ?? 0,
    hungerMaxedOutDelay: rawPlayerData?.hungerMaxedOutDelay ?? 0,
    hungerDepletionRate: rawPlayerData?.hungerDepletionRate ?? 0,
    thirst: rawPlayerData?.thirst ?? 0,
    thirstMax: rawPlayerData?.thirstMax ?? 0,
    thirstInitialDelay: rawPlayerData?.thirstInitialDelay ?? 0,
    thirstMaxedOutDelay: rawPlayerData?.thirstMaxedOutDelay ?? 0,
    thirstDepletionRate: rawPlayerData?.thirstDepletionRate ?? 0,
    energy: rawPlayerData?.energy ?? 0,
    energyMax: rawPlayerData?.energyMax ?? 0,
    energyBaseUsageRate: rawPlayerData?.energyBaseUsageRate ?? 0,
    energyRefillRate: rawPlayerData?.energyRefillRate ?? 0,
    energyRefillHungerDepletionRate: rawPlayerData?.energyRefillHungerDepletionRate ?? 0,
    energyRefillThirstDepletionRate: rawPlayerData?.energyRefillThirstDepletionRate ?? 0,
    money: rawPlayerData?.money ?? 0,
    startingItems: fromNullishRecord(rawPlayerData?.startingItems, (value) => value ?? 0) ?? {},
    nextLevelExp: fromNullishArray(rawPlayerData?.nextLevelExp, (exp) => exp ?? 0) ?? []
  };
}

export function toEventLog(processedRawEventLog: ProcessedRawEventLog): EventLog {
  return {
    ...processedRawEventLog
  };
}

export function toProcessedRawEventLog(rawEventLog: RawEventLog | undefined | null): ProcessedRawEventLog {
  return {
    ...rawEventLog,
    id: rawEventLog?.id ?? 0,
    key: fromNullish(rawEventLog?.key) ?? 'UNKNOWN_EVENT_LOG'
  };
}

export function toWorldSettings(processedRawWorldSettings: ProcessedRawWorldSettings): WorldSettings {
  return {
    ...processedRawWorldSettings,
    weather: toWeatherSettings(processedRawWorldSettings?.weather)
  };
}

export function toProcessedRawWorldSettings(rawWorldSettings: RawWorldSettings | undefined | null): ProcessedRawWorldSettings {
  return {
    ...rawWorldSettings,
    weather: toProcessedRawWeatherSettings(rawWorldSettings?.weather)
  };
}

export function toWeatherSettings(processedRawWeatherSettings: ProcessedRawWeatherSettings): WeatherSettings {
  return {
    ...processedRawWeatherSettings
  };
}

export function toProcessedRawWeatherSettings(rawWeatherSettings: RawWeatherSettings | undefined | null): ProcessedRawWeatherSettings {
  return {
    ...rawWeatherSettings,
    rainChance: rawWeatherSettings?.rainChance ?? 0
  };
}

export function toFishingZone(processedRawFishingZone: ProcessedRawFishingZone): FishingZone {
  return {
    ...processedRawFishingZone
  };
}

export function toProcessedRawFishingZone(rawFishingZone: RawFishingZone | undefined | null): ProcessedRawFishingZone {
  return {
    ...rawFishingZone,
    id: rawFishingZone?.id ?? 0,
    key: fromNullish(rawFishingZone?.key) ?? 'UNKNOWN_FISHING_ZONE',
    lootTableKey: fromNullish(rawFishingZone?.lootTableKey) ?? ''
  };
}

export function toSkill(processedRawSkill: ProcessedRawSkill): Skill {
  return {
    ...processedRawSkill,
    id: processedRawSkill.id ?? 0,
    key: processedRawSkill.key ?? 'UNKNOWN_SKILL',
    levels: processedRawSkill.levels.map(toSkillLevel)
  };
}

export function toProcessedRawSkill(rawSkill: RawSkill | undefined | null): ProcessedRawSkill {
  return {
    ...rawSkill,
    id: fromNullish(rawSkill?.id),
    key: fromNullish(rawSkill?.key),
    levels: fromNullishArray(rawSkill?.levels, toProcessedRawSkillLevel) ?? []
  };
}

export function toSkillLevel(processedRawSkillLevel: ProcessedRawSkillLevel): SkillLevel {
  return {
    ...processedRawSkillLevel,
    key: processedRawSkillLevel?.key ?? 'UNKNOWN_SKILL_LEVEL'
  };
}

export function toProcessedRawSkillLevel(rawSkillLevel: RawSkillLevel | undefined | null): ProcessedRawSkillLevel {
  return {
    ...rawSkillLevel,
    key: fromNullish(rawSkillLevel?.key),
    damageIncrease: rawSkillLevel?.damageIncrease ?? 0,
    healthRegenIncrease: rawSkillLevel?.healthRegenIncrease ?? 0,
    energyRegenIncrease: rawSkillLevel?.energyRegenIncrease ?? 0,
    energyUseDescrease: rawSkillLevel?.energyUseDescrease ?? 0,
    craftingSpeedIncrease: rawSkillLevel?.craftingSpeedIncrease ?? 0,
    monsterLootIncrease: rawSkillLevel?.monsterLootIncrease ?? 0,
    damageReduction: rawSkillLevel?.damageReduction ?? 0,
    doubleCropChance: rawSkillLevel?.doubleCropChance ?? 0,
    fishSizeChanceIncrease: rawSkillLevel?.fishSizeChanceIncrease ?? 0,
    fishBiteSpeedIncrease: rawSkillLevel?.fishBiteSpeedIncrease ?? 0,
    sellPriceIncrease: rawSkillLevel?.sellPriceIncrease ?? 0,
    buyDiscount: rawSkillLevel?.buyDiscount ?? 0
  };
}

export function toLocalizationFile(localizationFile: ProcessedRawLocalizationFile): LocalizationFile {
  return {
    ...localizationFile,
    localizations: localizationFile.localizations.map(toLocalization)
  };
}

export function toProcessedRawLocalizationFile(localizationFile: RawLocalizationFile): ProcessedRawLocalizationFile {
  return {
    ...localizationFile,
    keys: fromNullishArray(localizationFile?.keys, (value) => value ?? '') ?? [],
    localizations: fromNullishArray(localizationFile?.localizations, toProcessedRawLocalization) ?? []
  };
}

export function toLocalization(localization: ProcessedRawLocalization): Localization {
  return {
    ...localization
  };
}

export function toProcessedRawLocalization(localization: RawLocalization | undefined | null): ProcessedRawLocalization {
  return {
    ...localization,
    key: localization?.key ?? '',
    name: localization?.name ?? '',
    values: fromNullishRecord(localization?.values, (value) => value ?? '') || {}
  };
}

export function toQuest(quest: ProcessedRawQuest): Quest {
  return {
    ...quest,
    id: quest.id ?? 0,
    key: quest.key ?? '',
    tasks: quest.tasks.map(toQuestTask),
    source: toQuestSource(quest.source),
    completionTrigger: toQuestCompletionTrigger(quest.completionTrigger)
  };
}

export function toProcessedRawQuest(quest: RawQuest | undefined | null): ProcessedRawQuest {
  return {
    ...quest,
    id: fromNullish(quest?.id),
    key: fromNullish(quest?.key),
    tasks: fromNullishArray(quest?.tasks, toProcessedRawQuestTask) ?? [],
    prerequisiteEventKeys: fromNullishArray(quest?.prerequisiteEventKeys, (value) => value ?? '') || [],
    source: fromNullish(quest?.source),
    sourceCreatureTypeKey: fromNullish(quest?.sourceCreatureTypeKey),
    sourceCreatureDialogueTreeKey: fromNullish(quest?.sourceCreatureDialogueTreeKey),
    completionTrigger: fromNullish(quest?.completionTrigger),
    completionCreatureTypeKey: fromNullish(quest?.completionCreatureTypeKey),
    completionCreatureDialogueTreeKey: fromNullish(quest?.completionCreatureDialogueTreeKey),
    experienceReward: quest?.experienceReward ?? 0,
    itemRewards: fromNullishRecord(quest?.itemRewards, (value) => value ?? 0) ?? {}
  };
}

export function createQuestTask(): QuestTask {
  return {
    id: 0,
    key: 'NEW_TASK',
    objectives: [{}]
  };
}

export function toQuestTask(questTask: ProcessedRawQuestTask): QuestTask {
  return {
    ...questTask,
    id: questTask?.id ?? 0,
    key: questTask?.key ?? '',
    objectives: questTask.objectives.map(toQuestObjective)
  };
}

export function toProcessedRawQuestTask(questTask: RawQuestTask | undefined | null): ProcessedRawQuestTask {
  return {
    ...questTask,
    id: fromNullish(questTask?.id),
    key: fromNullish(questTask?.key),
    objectives: fromNullishArray(questTask?.objectives, toProcessedRawQuestObjective) || []
  };
}

export function createQuestObjective(): QuestObjective {
  return {};
}

export function toQuestObjective(questObjective: ProcessedRawQuestObjective): QuestObjective {
  return {
    ...questObjective,
    objectiveType: toQuestObjectiveType(questObjective.objectiveType)
  };
}

export function toProcessedRawQuestObjective(questObjective: RawQuestObjective | undefined | null): ProcessedRawQuestObjective {
  return {
    ...questObjective,
    objectiveType: fromNullish(questObjective?.objectiveType),
    itemTypeKey: fromNullish(questObjective?.itemTypeKey),
    itemAmount: fromNullish(questObjective?.itemAmount),
    craftingRecipeKey: fromNullish(questObjective?.craftingRecipeKey),
    destinationPosition: toVector2(questObjective?.destinationPosition),
    destinationRadius: fromNullish(questObjective?.destinationRadius),
    creatureTypeKey: fromNullish(questObjective?.creatureTypeKey),
    creatureDialogueTreeKey: fromNullish(questObjective?.creatureDialogueTreeKey)
  };
}

export function createVector2(): Vector2 {
  return {
    x: 0,
    y: 0
  };
}

export function toLootType(rawLootType: string | undefined): LootType | undefined {
  let lootType: LootType | undefined = undefined;
  switch (rawLootType) {
    case LOOT_TYPE_NONE:
    case LOOT_TYPE_DROP:
    case LOOT_TYPE_STAGE_DROP:
      lootType = rawLootType;
      break;
    default:
      break;
  }
  return lootType;
}

export function toStagesType(rawStagesType: string | undefined): StagesType | undefined {
  let stagesType: StagesType | undefined = undefined;
  switch (rawStagesType) {
    case STAGES_TYPE_NONE:
    case STAGES_TYPE_GROWABLE:
    case STAGES_TYPE_GROWABLE_WITH_HEALTH:
    case STAGES_TYPE_BREAKABLE:
      stagesType = rawStagesType;
      break;
    default:
      break;
  }
  return stagesType;
}

export function toPlacementPosition(rawPlacementPosition: string | undefined): PlacementPosition | undefined {
  let placementPosition: PlacementPosition | undefined = undefined;
  switch (rawPlacementPosition) {
    case PLACEMENT_POSITION_CENTER:
    case PLACEMENT_POSITION_EDGE:
      placementPosition = rawPlacementPosition;
      break;
    default:
      break;
  }
  return placementPosition;
}

export function toPlacementLayer(rawPlacementLayer: string | undefined | null): PlacementLayer | undefined {
  let placementLayer: PlacementLayer | undefined = undefined;
  switch (rawPlacementLayer) {
    case PLACEMENT_LAYER_IN_GROUND:
    case PLACEMENT_LAYER_ON_GROUND:
    case PLACEMENT_LAYER_IN_AIR:
      placementLayer = rawPlacementLayer;
      break;
    default:
      break;
  }
  return placementLayer;
}

export function toColliderType(rawColliderType: string | undefined): ColliderType | undefined {
  let colliderType: ColliderType | undefined = undefined;
  switch (rawColliderType) {
    case POLYGON_COLLIDER_TYPE:
    case AUTO_BOX_COLLIDER_TYPE:
    case BOX_COLLIDER_TYPE:
      colliderType = rawColliderType;
      break;
    default:
      break;
  }
  return colliderType;
}

export function toObjectSpriteRulePosition(rawObjectSpriteRulePosition: string | undefined): ObjectSpriteRulePosition | undefined {
  let objectSpriteRulePosition: ObjectSpriteRulePosition | undefined = undefined;
  switch (rawObjectSpriteRulePosition) {
    case SPRITE_RULE_DIRECTION_UP:
    case SPRITE_RULE_DIRECTION_UP_RIGHT:
    case SPRITE_RULE_DIRECTION_RIGHT:
    case SPRITE_RULE_DIRECTION_DOWN_RIGHT:
    case SPRITE_RULE_DIRECTION_DOWN:
    case SPRITE_RULE_DIRECTION_DOWN_LEFT:
    case SPRITE_RULE_DIRECTION_LEFT:
    case SPRITE_RULE_DIRECTION_UP_LEFT:
      objectSpriteRulePosition = rawObjectSpriteRulePosition;
      break;
    default:
      break;
  }
  return objectSpriteRulePosition;
}

export function toStageJumpCondition(rawStageJumpCondition: string | undefined): StageJumpCondition | undefined {
  let stageJumpCondition: StageJumpCondition | undefined = undefined;
  switch (rawStageJumpCondition) {
    case STAGE_JUMP_CONDITION_TIME:
    case STAGE_JUMP_CONDITION_HARVEST:
      stageJumpCondition = rawStageJumpCondition;
      break;
    default:
      break;
  }
  return stageJumpCondition;
}

export function toSpawningCondition(rawSpawningCondition: string | undefined): SpawningCondition | undefined {
  let spawningCondition: SpawningCondition | undefined = undefined;
  switch (rawSpawningCondition) {
    case FARMLAND_CONDITION:
    case GRASSLAND_CONDITION:
    case INSIDE_CONDITION:
      spawningCondition = rawSpawningCondition;
      break;
    default:
      break;
  }
  return spawningCondition;
}

export function toInventoryType(rawInventoryType: string | undefined): InventoryType | undefined {
  let inventoryType: InventoryType | undefined = undefined;
  switch (rawInventoryType) {
    case INVENTORY_TYPE_NONE:
    case INVENTORY_TYPE_SMALL:
    case INVENTORY_TYPE_LARGE:
      inventoryType = rawInventoryType;
      break;
    default:
      break;
  }
  return inventoryType;
}

export function toFilledFromType(rawFilledFromType: string | undefined): FilledFromType | undefined {
  let filledFromType: FilledFromType | undefined = undefined;
  switch (rawFilledFromType) {
    case FILLED_FROM_TYPE_NONE:
    case FILLED_FROM_TYPE_WATER:
    case FILLED_FROM_TYPE_SAND:
      filledFromType = rawFilledFromType;
      break;
    default:
      break;
  }
  return filledFromType;
}

export function toTimeComparator(rawTimeComparator: string | undefined): TimeComparator | undefined {
  let timeComparator: TimeComparator | undefined = undefined;
  switch (rawTimeComparator) {
    case TIME_COMPARATOR_BEFORE:
    case TIME_COMPARATOR_AFTER:
    case TIME_COMPARATOR_BETWEEN:
      timeComparator = rawTimeComparator;
      break;
    default:
      break;
  }
  return timeComparator;
}

export function toWeaponType(rawWeaponType: string | undefined): WeaponType | undefined {
  let weaponType: WeaponType | undefined = undefined;
  switch (rawWeaponType) {
    case WEAPON_TYPE_NONE:
    case WEAPON_TYPE_POINT:
    case WEAPON_TYPE_ARC:
    case WEAPON_TYPE_PROJECTILE_LAUNCHER:
    case WEAPON_TYPE_PROJECTILE:
      weaponType = rawWeaponType;
      break;
    default:
      break;
  }
  return weaponType;
}

export function toFishingItemType(rawFishingItemType: string | undefined): FishingItemType | undefined {
  let fishingItemType: FishingItemType | undefined = undefined;
  switch (rawFishingItemType) {
    case FISHING_ITEM_TYPE_NONE:
    case FISHING_ITEM_TYPE_POLE:
    case FISHING_ITEM_TYPE_LURE:
    case FISHING_ITEM_TYPE_FISH:
      fishingItemType = rawFishingItemType;
      break;
    default:
      break;
  }
  return fishingItemType;
}

export function toSeason(rawSeason: string | undefined): Season | typeof ALL_SEASONS | undefined {
  let season: Season | typeof ALL_SEASONS | undefined = undefined;
  switch (rawSeason) {
    case SPRING:
    case SUMMER:
    case FALL:
    case WINTER:
    case ALL_SEASONS:
      season = rawSeason;
      break;
    default:
      break;
  }
  return season;
}

export function toQuestObjectiveType(rawQuestObjectiveType: string | undefined): QuestObjectiveType | undefined {
  let questObjectiveType: QuestObjectiveType | undefined = undefined;
  switch (rawQuestObjectiveType) {
    case QUEST_OBJECTIVE_TYPE_GATHER:
    case QUEST_OBJECTIVE_TYPE_CRAFT:
    case QUEST_OBJECTIVE_TYPE_DESTINATION:
    case QUEST_OBJECTIVE_TYPE_TALK_TO_CREATURE:
      questObjectiveType = rawQuestObjectiveType;
      break;
    default:
      break;
  }
  return questObjectiveType;
}

export function toQuestCompletionTrigger(rawQuestCompletionTrigger: string | undefined): QuestCompletionTrigger | undefined {
  let questCompletionTrigger: QuestCompletionTrigger | undefined = undefined;
  switch (rawQuestCompletionTrigger) {
    case QUEST_COMPLETION_TRIGGER_AUTO_COMPLETE:
    case QUEST_COMPLETION_TRIGGER_TALK_TO_CREATURE:
      questCompletionTrigger = rawQuestCompletionTrigger;
      break;
    default:
      break;
  }
  return questCompletionTrigger;
}

export function toQuestSource(rawQuestSource: string | undefined): QuestSource | undefined {
  let questSource: QuestSource | undefined = undefined;
  switch (rawQuestSource) {
    case QUEST_SOURCE_CREATURE:
      questSource = rawQuestSource;
      break;
    default:
      break;
  }
  return questSource;
}

export function toAccentType(rawAccentType: string | undefined): AccentType | undefined {
  return toSpawningCondition(rawAccentType);
}

export function toProcessedRawObjectSettings(rawObjectSettings: RawObjectSettings | undefined | null): ProcessedRawObjectSettings {
  if (isNullish(rawObjectSettings)) {
    return {};
  }

  return {
    ...rawObjectSettings,
    lootType: fromNullish(rawObjectSettings.lootType),
    hasHealth: fromNullish(rawObjectSettings.hasHealth),
    requiresWater: fromNullish(rawObjectSettings.requiresWater),
    stagesType: fromNullish(rawObjectSettings.stagesType),
    isWorkstation: fromNullish(rawObjectSettings.isWorkstation),
    placementPosition: fromNullish(rawObjectSettings.placementPosition),
    placementLayer: fromNullish(rawObjectSettings.placementLayer),
    requiredBelowObjectCategoryKeys: fromNullish(rawObjectSettings.requiredBelowObjectCategoryKeys)?.map((entry) => entry ?? ''),
    requiredBelowObjectSubCategoryKeys: fromNullish(rawObjectSettings.requiredBelowObjectSubCategoryKeys)?.map((entry) => entry ?? ''),
    requiredBelowObjectKeys: fromNullish(rawObjectSettings.requiredBelowObjectKeys)?.map((entry) => entry ?? ''),
    requiredAdjacentObjectCategoryKeys: fromNullish(rawObjectSettings.requiredAdjacentObjectCategoryKeys)?.map((entry) => entry ?? ''),
    requiredAdjacentObjectSubCategoryKeys: fromNullish(rawObjectSettings.requiredAdjacentObjectSubCategoryKeys)?.map(
      (entry) => entry ?? ''
    ),
    requiredAdjacentObjectKeys: fromNullish(rawObjectSettings.requiredAdjacentObjectKeys)?.map((entry) => entry ?? ''),
    spawningConditions: fromNullish(rawObjectSettings.spawningConditions)?.map((entry) => entry ?? ''),
    destroyOnHarvest: fromNullish(rawObjectSettings.destroyOnHarvest),
    canHarvestWithHand: fromNullish(rawObjectSettings.canHarvestWithHand),
    breakable: fromNullish(rawObjectSettings.breakable),
    inventoryType: fromNullish(rawObjectSettings.inventoryType),
    canOpen: fromNullish(rawObjectSettings.canOpen),
    changesSpritesWithSeason: fromNullish(rawObjectSettings.changesSpritesWithSeason),
    hasLight: fromNullish(rawObjectSettings?.hasLight)
  };
}

export function toObjectSettings(processedRawObjectSettings: ProcessedRawObjectSettings | undefined): ObjectSettings | undefined {
  if (!processedRawObjectSettings) {
    return undefined;
  }

  return {
    ...processedRawObjectSettings,
    lootType: toLootType(processedRawObjectSettings.lootType),
    stagesType: toStagesType(processedRawObjectSettings.stagesType),
    placementPosition: toPlacementPosition(processedRawObjectSettings.placementPosition),
    placementLayer: toPlacementLayer(processedRawObjectSettings.placementLayer),
    spawningConditions: toTypedArray(processedRawObjectSettings.spawningConditions, toSpawningCondition),
    inventoryType: toInventoryType(processedRawObjectSettings.inventoryType)
  };
}

export function toProcessedRawItemSettings(rawItemSettings: RawItemSettings | undefined | null): ProcessedRawItemSettings {
  return {
    ...rawItemSettings,
    placeable: fromNullish(rawItemSettings?.placeable),
    requiredObjectCategoryKey: fromNullish(rawItemSettings?.requiredObjectCategoryKey),
    watersGround: fromNullish(rawItemSettings?.watersGround),
    createsFarmland: fromNullish(rawItemSettings?.createsFarmland),
    destroysFarmland: fromNullish(rawItemSettings?.destroysFarmland),
    weaponType: fromNullish(rawItemSettings?.weaponType),
    damagesObjectCategoryKeys: fromNullishArray(rawItemSettings?.damagesObjectCategoryKeys, (entry) => entry ?? ''),
    damagesObjectSubCategoryKeys: fromNullishArray(rawItemSettings?.damagesObjectSubCategoryKeys, (entry) => entry ?? ''),
    damagesObjectKeys: fromNullishArray(rawItemSettings?.damagesObjectKeys, (objectKey) => objectKey ?? ''),
    damagesCreatureCategoryKeys: fromNullishArray(rawItemSettings?.damagesCreatureCategoryKeys, (objectKey) => objectKey ?? ''),
    damagesCreatureKeys: fromNullishArray(rawItemSettings?.damagesCreatureKeys, (objectKey) => objectKey ?? ''),
    hasDurability: fromNullish(rawItemSettings?.hasDurability),
    isEdible: fromNullish(rawItemSettings?.isEdible),
    filledFromType: fromNullish(rawItemSettings?.filledFromType),
    hasLight: fromNullish(rawItemSettings?.hasLight),
    hasCombatPriority: fromNullish(rawItemSettings?.hasCombatPriority),
    resetTriggerOnAttack: fromNullish(rawItemSettings?.resetTriggerOnAttack),
    projectileItemCategoryKeys: fromNullishArray(rawItemSettings?.projectileItemCategoryKeys, (entry) => entry ?? ''),
    projectileItemKeys: fromNullishArray(rawItemSettings?.projectileItemKeys, (entry) => entry ?? ''),
    fishingItemType: fromNullish(rawItemSettings?.fishingItemType),
    damagedIncreasedBySkillKey: fromNullish(rawItemSettings?.damagedIncreasedBySkillKey)
  };
}

export function toItemSettings(processedRawItemSettings: ProcessedRawItemSettings | undefined): ItemSettings | undefined {
  if (!processedRawItemSettings) {
    return undefined;
  }

  return {
    ...processedRawItemSettings,
    filledFromType: toFilledFromType(processedRawItemSettings?.filledFromType),
    weaponType: toWeaponType(processedRawItemSettings?.weaponType),
    fishingItemType: toFishingItemType(processedRawItemSettings?.fishingItemType)
  };
}

export function toProcessedRawCreatureSettings(rawCreatureSettings: RawCreatureSettings | undefined | null): ProcessedRawCreatureSettings {
  if (isNullish(rawCreatureSettings)) {
    return {};
  }

  return {
    ...rawCreatureSettings,
    hasDialogue: fromNullish(rawCreatureSettings.hasDialogue),
    isShopkeeper: fromNullish(rawCreatureSettings.isShopkeeper),
    hasHealth: fromNullish(rawCreatureSettings.hasHealth)
  };
}

export function toCreatureSettings(processedRawCreatureSettings: ProcessedRawCreatureSettings | undefined): CreatureSettings | undefined {
  if (!processedRawCreatureSettings) {
    return undefined;
  }

  return {
    ...processedRawCreatureSettings
  };
}

export function toUiDataFile(rawDestructionMenu: RawUiDataFile | undefined | null): UiDataFile {
  return {
    objectDestructionMenu: toDestructionMenu(rawDestructionMenu?.objectDestructionMenu)
  };
}

export function toDestructionMenu(rawDestructionMenu: RawDestructionMenu | null | undefined): DestructionMenu {
  return {
    diameter: fromNullish(rawDestructionMenu?.diameter) ?? 0,
    buttons: fromNullish(rawDestructionMenu?.buttons)?.map(toDestructionMenuButton)
  };
}

export function toDestructionMenuButton(rawButton: RawDestructionMenuButton | null | undefined): DestructionMenuButton {
  return {
    ...rawButton,
    categories: toDestructionMenuButtonConditions(rawButton?.categories),
    subCategories: toDestructionMenuButtonConditions(rawButton?.subCategories),
    objects: toDestructionMenuButtonConditions(rawButton?.objects),
    placementLayer: toPlacementLayer(rawButton?.placementLayer)
  };
}

export function toDestructionMenuButtonConditions(
  rawConditions: RawDestructionMenuButtonConditions | null | undefined
): DestructionMenuButtonConditions {
  return {
    include: fromNullishArray(rawConditions?.include, (entry) => entry ?? ''),
    exclude: fromNullishArray(rawConditions?.exclude, (entry) => entry ?? '')
  };
}

export function toVector2(rawVector: DeepNullish<Vector2> | undefined | null): Vector2 | undefined;
export function toVector2(rawVector: DeepNullish<Vector2> | undefined | null, defaultValue: Vector2): Vector2;
export function toVector2(rawVector: DeepNullish<Vector2> | undefined | null, defaultValue?: Vector2): Vector2 | undefined {
  return rawVector
    ? {
        x: rawVector?.x ?? defaultValue?.x ?? 0,
        y: rawVector?.y ?? defaultValue?.y ?? 0
      }
    : defaultValue;
}

export function toFishingPoleAnchorPoints(raw: Partial<FishingPoleAnchorPoints>): FishingPoleAnchorPoints;
export function toFishingPoleAnchorPoints(
  raw: DeepNullish<FishingPoleAnchorPoints> | undefined | null
): FishingPoleAnchorPoints | undefined;
export function toFishingPoleAnchorPoints(
  raw: DeepNullish<FishingPoleAnchorPoints> | undefined | null
): FishingPoleAnchorPoints | undefined {
  return raw
    ? {
        idle: toVector2(raw.idle, { x: 0, y: 0 }),
        casting: toVector2(raw.casting, { x: 0, y: 0 }),
        pulling: toVector2(raw.pulling, { x: 0, y: 0 })
      }
    : undefined;
}

export function fromNullish<T>(input: T | undefined | null): T | undefined {
  return isNullish(input) ? undefined : input;
}

export function fromNullishArray<U, T>(
  input: (U | undefined | null)[] | undefined | null,
  converter: (value: U | undefined | null) => T
): T[] | undefined {
  return fromNullish(input)?.map((entry) => converter(entry));
}

export function fromNullishRecord<U, T>(
  input: Record<string, U | undefined | null> | undefined | null,
  converter: (value: U | undefined | null) => T
): Record<string, T> | undefined {
  const rawRecord = fromNullish(input);
  if (!rawRecord) {
    return undefined;
  }

  return Object.keys(rawRecord).reduce((record, key) => {
    record[key] = converter(rawRecord[key]);
    return record;
  }, {} as Record<string, T>);
}

export function toTypedArray<T>(input: string[] | undefined, converter: (value: string) => T | undefined): T[] | undefined {
  if (!input) {
    return undefined;
  }

  return input.reduce((values, rawValue) => {
    const value = converter(rawValue);
    if (value) {
      values.push(value);
    }
    return values;
  }, [] as T[]);
}

export function toTypedKeyRecord<K extends string, V>(
  input: Record<string, V> | undefined,
  converter: (value: string) => K | undefined
): Record<K, V> | undefined {
  if (!input) {
    return undefined;
  }

  return Object.keys(input).reduce((map, key) => {
    const newKey = converter(key);
    if (newKey) {
      map[newKey] = input[key];
    }
    return map;
  }, {} as Record<K, V>);
}

export function mapTypedKeyRecord<K extends string | number, U, V>(input: Record<K, U>, converter: (value: U) => V): Record<K, V> {
  return (Object.keys(input) as K[]).reduce((map, key) => {
    map[key] = converter(input[key]);
    return map;
  }, {} as Record<K, V>);
}
