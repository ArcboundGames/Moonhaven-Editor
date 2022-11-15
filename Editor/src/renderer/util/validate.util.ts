import {
  CRAFTING_RECIPES_DATA_FILE,
  CREATURES_DATA_FILE,
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
  FISHING_DATA_FILE,
  IMAGE_FILE_EXTENSION,
  ITEMS_DATA_FILE,
  LOCALIZATION_DATA_FILE,
  LOOT_TABLES_DATA_FILE,
  OBJECTS_DATA_FILE,
  PLAYER_DATA_FILE,
  PLAYER_SPRITE_HEIGHT,
  PLAYER_SPRITE_WIDTH,
  QUESTS_DATA_FILE,
  SKILLS_DATA_FILE,
  WORLD_DATA_FILE
} from '../../../../SharedLibrary/src/constants';
import * as dataValidation from '../../../../SharedLibrary/src/dataValidation';
import { isNotNullish } from '../../../../SharedLibrary/src/util/null.util';
import { getObjectSetting } from '../../../../SharedLibrary/src/util/objectType.util';
import {
  getObjectSpriteCountsWithSeason,
  getObjectsSpritesCountsWithSeason,
  getSectionPath,
  getSpriteCount,
  getSpriteCountFromImagePath
} from './sprite.util';

import type { ISizeCalculationResult } from 'image-size/dist/types/interface';
import type {
  AllErrors,
  CraftingRecipe,
  CraftingRecipeCategory,
  CreatureCategory,
  CreatureType,
  DestructionMenu,
  DialogueTree,
  EventLog,
  FishingZone,
  ItemCategory,
  ItemType,
  Localization,
  LootTable,
  ObjectCategory,
  ObjectSubCategory,
  ObjectType,
  PlayerData,
  Quest,
  Skill,
  WorldSettings
} from '../../../../SharedLibrary/src/interface';

const PLAYER_PATH = '../player';

export async function validateCreature(
  creature: CreatureType,
  creaturesByKey: Record<string, CreatureType>,
  categoriesByKey: Record<string, CreatureCategory>,
  itemsByKey: Record<string, ItemType>,
  lootTablesByKey: Record<string, LootTable>,
  eventLogsByKey: Record<string, EventLog>,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  path?: string
): Promise<string[]> {
  const portraitSize = await (path
    ? window.api.sizeOf(
        (
          await window.api.join(
            path,
            '..',
            getSectionPath('creature'),
            `${creature.key.toLowerCase()}-portrait${IMAGE_FILE_EXTENSION}`
          )
        ).replace(/\\/g, '/')
      )
    : Promise.resolve({
        width: undefined,
        height: undefined
      } as ISizeCalculationResult));

  return [
    ...dataValidation.validateCreature(
      creature,
      categoriesByKey,
      itemsByKey,
      lootTablesByKey,
      eventLogsByKey,
      localization,
      localizationKeys,
      await getSpriteCount(path, 'creature', creature.key, creature.sprite?.width, creature.sprite?.height),
      portraitSize,
      []
    ),
    ...dataValidation.checkCreatureConnections(creature, creaturesByKey, categoriesByKey)
  ];
}

export async function validateCreatureGeneralTab(
  creature: CreatureType,
  categoriesByKey: Record<string, CreatureCategory>,
  lootTablesByKey: Record<string, LootTable>,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  path?: string
): Promise<string[]> {
  const portraitSize = await (path
    ? window.api.sizeOf(
        (
          await window.api.join(
            path,
            '..',
            getSectionPath('creature'),
            `${creature.key.toLowerCase()}-portrait${IMAGE_FILE_EXTENSION}`
          )
        ).replace(/\\/g, '/')
      )
    : Promise.resolve({
        width: undefined,
        height: undefined
      } as ISizeCalculationResult));

  const errors = dataValidation.validateCreatureGeneralTab(
    creature,
    categoriesByKey,
    lootTablesByKey,
    localization,
    localizationKeys,
    portraitSize,
    []
  );

  return errors;
}

export async function validateCreatures(
  creatures: CreatureType[],
  creaturesByKey: Record<string, CreatureType>,
  categoriesByKey: Record<string, CreatureCategory>,
  itemsByKey: Record<string, ItemType>,
  lootTablesByKey: Record<string, LootTable>,
  eventLogsByKey: Record<string, EventLog>,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  path?: string
): Promise<Record<string, string[]>> {
  const allErrors: AllErrors = {};

  const rawCreatureAnimations = await Promise.all(
    creatures.map(async (creature) => ({
      key: creature.key,
      animationSpriteCount: await getSpriteCount(
        path,
        'creature',
        creature.key,
        creature.sprite?.width,
        creature.sprite?.height
      )
    }))
  );

  const creatureAnimations = rawCreatureAnimations.reduce((animations, creatureAnimationData) => {
    animations[creatureAnimationData.key] = creatureAnimationData.animationSpriteCount;
    return animations;
  }, {} as Record<string, number>);

  const rawCreaturePortraits = await Promise.all(
    creatures.map(async (creature) => {
      return {
        creature,
        size: path
          ? await window.api.sizeOf(
              (
                await window.api.join(
                  path,
                  '..',
                  getSectionPath('creature'),
                  `${creature.key.toLowerCase()}-portrait${IMAGE_FILE_EXTENSION}`
                )
              ).replace(/\\/g, '/')
            )
          : ({
              width: undefined,
              height: undefined
            } as ISizeCalculationResult)
      };
    })
  );

  const creaturePortraits = rawCreaturePortraits.reduce(
    (portraits, { size, creature }) => {
      portraits[creature.key] = size;
      return portraits;
    },
    {} as Record<
      string,
      {
        width: number | undefined;
        height: number | undefined;
      }
    >
  );

  dataValidation.validateCreatures(
    allErrors,
    creatures,
    categoriesByKey,
    itemsByKey,
    lootTablesByKey,
    eventLogsByKey,
    localization,
    localizationKeys,
    creatureAnimations,
    creaturePortraits
  );

  dataValidation.checkCreaturesConnections(allErrors, creatures, creaturesByKey, categoriesByKey);

  return allErrors[CREATURES_DATA_FILE]?.[ERROR_SECTION_CREATURES] ?? {};
}

export async function validateCreatureSpriteStageTab(
  creature: CreatureType,
  path: string | undefined
): Promise<string[]> {
  const spriteCount = await getSpriteCount(
    path,
    'creature',
    creature.key,
    creature.sprite?.width,
    creature.sprite?.height
  );

  return dataValidation.validateCreatureSpriteStageTab(creature, spriteCount);
}

export function validateCreatureCategory(creatureCategory: CreatureCategory): string[] {
  return dataValidation.validateCreatureCategory(creatureCategory);
}

export function validateCreatureCategories(creatureCategories: CreatureCategory[]): Record<string, string[]> {
  const allErrors: AllErrors = {};

  dataValidation.validateCreatureCategories(allErrors, creatureCategories);

  return allErrors[CREATURES_DATA_FILE]?.[ERROR_SECTION_CREATURE_CATEGORIES] ?? {};
}

export async function validateItem(
  item: ItemType,
  itemsByKey: Record<string, ItemType>,
  categoriesByKey: Record<string, ItemCategory>,
  objectsByKey: Record<string, ObjectType>,
  skillsByKey: Record<string, Skill>,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  damagableObjectKeys: string[],
  damagableObjectCategoryKeys: string[],
  damagableObjectSubCategoryKeys: string[],
  damagableCreatureKeys: string[],
  damagableCreatureCategoryKeys: string[],
  projectileItemOptions: string[],
  projectileItemCategoryOptions: string[],
  path?: string
): Promise<string[]> {
  const iconSize = await (path
    ? window.api.sizeOf(
        (
          await window.api.join(path, '..', getSectionPath('item'), `${item.key.toLowerCase()}${IMAGE_FILE_EXTENSION}`)
        ).replace(/\\/g, '/')
      )
    : Promise.resolve({
        width: undefined,
        height: undefined
      } as ISizeCalculationResult));

  const errors = dataValidation.validateItem(
    item,
    categoriesByKey,
    skillsByKey,
    iconSize,
    path
      ? await getSpriteCountFromImagePath(
          (
            await window.api.join(path, PLAYER_PATH, `${item.key.toLowerCase()}${IMAGE_FILE_EXTENSION}`)
          ).replace(/\\/g, '/'),
          PLAYER_SPRITE_WIDTH,
          PLAYER_SPRITE_HEIGHT
        )
      : 0,
    [],
    localization,
    localizationKeys
  );

  errors.push(
    ...dataValidation.checkItemGeneralConnections(item, itemsByKey, categoriesByKey, objectsByKey),
    ...dataValidation.checkItemCombatConnections(
      item,
      categoriesByKey,
      damagableObjectKeys,
      damagableObjectCategoryKeys,
      damagableObjectSubCategoryKeys,
      damagableCreatureKeys,
      damagableCreatureCategoryKeys,
      projectileItemOptions,
      projectileItemCategoryOptions
    )
  );

  return errors;
}

export async function validateItemGeneralTab(
  item: ItemType,
  itemsByKey: Record<string, ItemType>,
  categoriesByKey: Record<string, ItemCategory>,
  objectsByKey: Record<string, ObjectType>,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  path?: string
): Promise<string[]> {
  const iconSize = await (path
    ? window.api.sizeOf(
        (
          await window.api.join(path, '..', getSectionPath('item'), `${item.key.toLowerCase()}${IMAGE_FILE_EXTENSION}`)
        ).replace(/\\/g, '/')
      )
    : Promise.resolve({
        width: undefined,
        height: undefined
      } as ISizeCalculationResult));

  const errors = dataValidation.validateItemGeneralTab(
    item,
    categoriesByKey,
    iconSize,
    path
      ? await getSpriteCountFromImagePath(
          (
            await window.api.join(path, PLAYER_PATH, `${item.key.toLowerCase()}${IMAGE_FILE_EXTENSION}`)
          ).replace(/\\/g, '/'),
          PLAYER_SPRITE_WIDTH,
          PLAYER_SPRITE_HEIGHT
        )
      : 0,
    [],
    localization,
    localizationKeys
  );

  errors.push(...dataValidation.checkItemGeneralConnections(item, itemsByKey, categoriesByKey, objectsByKey));

  return errors;
}

export function validateItemCombatTab(
  item: ItemType,
  categoriesByKey: Record<string, ItemCategory>,
  skillsByKey: Record<string, Skill>,
  damagableObjectKeys: string[],
  damagableObjectCategoryKeys: string[],
  damagableObjectSubCategoryKeys: string[],
  damagableCreatureKeys: string[],
  damagableCreatureCategoryKeys: string[],
  projectileItemOptions: string[],
  projectileItemCategoryOptions: string[]
): string[] {
  const errors = dataValidation.validateItemCombatTab(item, categoriesByKey, skillsByKey);

  errors.push(
    ...dataValidation.checkItemCombatConnections(
      item,
      categoriesByKey,
      damagableObjectKeys,
      damagableObjectCategoryKeys,
      damagableObjectSubCategoryKeys,
      damagableCreatureKeys,
      damagableCreatureCategoryKeys,
      projectileItemOptions,
      projectileItemCategoryOptions
    )
  );

  return errors;
}

export function validateItemFishingTab(item: ItemType, categoriesByKey: Record<string, ItemCategory>): string[] {
  return dataValidation.validateItemFishingTab(item, categoriesByKey);
}

export async function validateItems(
  items: ItemType[],
  itemsByKey: Record<string, ItemType>,
  categoriesByKey: Record<string, ItemCategory>,
  objectsByKey: Record<string, ObjectType>,
  skillsByKey: Record<string, Skill>,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  damagableObjectKeys: string[],
  damagableObjectCategoryKeys: string[],
  damagableObjectSubCategoryKeys: string[],
  damagableCreatureKeys: string[],
  damagableCreatureCategoryKeys: string[],
  projectileItemKeys: string[],
  projectileItemCategoryKeys: string[],
  path?: string
): Promise<Record<string, string[]>> {
  const allErrors: AllErrors = {};

  const rawItemSizes = await Promise.all(
    items.map(async (item) => {
      return {
        item,
        size: path
          ? await window.api.sizeOf(
              (
                await window.api.join(
                  path,
                  '..',
                  getSectionPath('item'),
                  `${item.key.toLowerCase()}${IMAGE_FILE_EXTENSION}`
                )
              ).replace(/\\/g, '/')
            )
          : ({
              width: undefined,
              height: undefined
            } as ISizeCalculationResult)
      };
    })
  );

  const itemSizes = rawItemSizes.reduce(
    (icons, { size, item }) => {
      icons[item.key] = size;
      return icons;
    },
    {} as Record<
      string,
      {
        width: number | undefined;
        height: number | undefined;
      }
    >
  );

  const rawItemAnimations = await Promise.all(
    items.map(async (item) => ({
      key: item.key,
      animationSpriteCount: path
        ? await getSpriteCountFromImagePath(
            (
              await window.api.join(path, PLAYER_PATH, `${item.key.toLowerCase()}${IMAGE_FILE_EXTENSION}`)
            ).replace(/\\/g, '/'),
            PLAYER_SPRITE_WIDTH,
            PLAYER_SPRITE_HEIGHT
          )
        : 0
    }))
  );

  const itemAnimations = rawItemAnimations.reduce((animations, itemAnimationData) => {
    animations[itemAnimationData.key] = itemAnimationData.animationSpriteCount;
    return animations;
  }, {} as Record<string, number>);

  dataValidation.validateItems(
    allErrors,
    items,
    categoriesByKey,
    skillsByKey,
    itemSizes,
    itemAnimations,
    localization,
    localizationKeys
  );

  dataValidation.checkItemsConnections(
    allErrors,
    items,
    itemsByKey,
    categoriesByKey,
    objectsByKey,
    damagableObjectKeys,
    damagableObjectCategoryKeys,
    damagableObjectSubCategoryKeys,
    damagableCreatureKeys,
    damagableCreatureCategoryKeys,
    projectileItemKeys,
    projectileItemCategoryKeys
  );

  return allErrors[ITEMS_DATA_FILE]?.[ERROR_SECTION_ITEMS] ?? {};
}

export function validateItemCategory(
  itemCategory: ItemCategory,
  skillsByKey: Record<string, Skill>,
  damagableObjectKeys: string[],
  damagableObjectCategoryKeys: string[],
  damagableObjectSubCategoryKeys: string[],
  damagableCreatureKeys: string[],
  damagableCreatureCategoryKeys: string[],
  projectileItemKeys: string[],
  projectileItemCategoryKeys: string[]
): string[] {
  const errors = dataValidation.validateItemCategory(itemCategory, skillsByKey);

  errors.push(
    ...dataValidation.checkItemCategoryConnection(
      itemCategory,
      damagableObjectKeys,
      damagableObjectCategoryKeys,
      damagableObjectSubCategoryKeys,
      damagableCreatureKeys,
      damagableCreatureCategoryKeys,
      projectileItemKeys,
      projectileItemCategoryKeys
    )
  );

  return errors;
}

export function validateItemCategoryGeneralTab(itemCategory: ItemCategory): string[] {
  return dataValidation.validateItemCategoryGeneralTab(itemCategory);
}

export function validateItemCategoryCombatTab(
  itemCategory: ItemCategory,
  skillsByKey: Record<string, Skill>,
  damagableObjectKeys: string[],
  damagableObjectCategoryKeys: string[],
  damagableObjectSubCategoryKeys: string[],
  damagableCreatureKeys: string[],
  damagableCreatureCategoryKeys: string[],
  projectileItemKeys: string[],
  projectileItemCategoryKeys: string[]
): string[] {
  const errors = dataValidation.validateItemCategoryCombatTab(itemCategory, skillsByKey);

  errors.push(
    ...dataValidation.checkItemCategoryConnection(
      itemCategory,
      damagableObjectKeys,
      damagableObjectCategoryKeys,
      damagableObjectSubCategoryKeys,
      damagableCreatureKeys,
      damagableCreatureCategoryKeys,
      projectileItemKeys,
      projectileItemCategoryKeys
    )
  );

  return errors;
}

export function validateItemCategories(
  itemCategories: ItemCategory[],
  skillsByKey: Record<string, Skill>,
  damagableObjectKeys: string[],
  damagableObjectCategoryKeys: string[],
  damagableObjectSubCategoryKeys: string[],
  damagableCreatureKeys: string[],
  damagableCreatureCategoryKeys: string[],
  projectileItemKeys: string[],
  projectileItemCategoryKeys: string[]
): Record<string, string[]> {
  const allErrors: AllErrors = {};

  dataValidation.validateItemCategories(allErrors, itemCategories, skillsByKey);

  dataValidation.checkItemCategoryConnections(
    allErrors,
    itemCategories,
    damagableObjectKeys,
    damagableObjectCategoryKeys,
    damagableObjectSubCategoryKeys,
    damagableCreatureKeys,
    damagableCreatureCategoryKeys,
    projectileItemKeys,
    projectileItemCategoryKeys
  );

  return allErrors[ITEMS_DATA_FILE]?.[ERROR_SECTION_ITEM_CATEGORIES] ?? {};
}

export function validateCraftingRecipeCategories(categories: CraftingRecipeCategory[]): Record<string, string[]> {
  const allErrors: AllErrors = {};

  dataValidation.validateCraftingRecipeCategories(allErrors, categories);

  return allErrors[CRAFTING_RECIPES_DATA_FILE]?.[ERROR_SECTION_CRAFTING_RECIPE_CATEGORIES] ?? {};
}

export function validateCraftingRecipes(
  craftingRecipes: CraftingRecipe[],
  craftingRecipeCategoriesByKey: Record<string, CraftingRecipeCategory>,
  skillsByKey: Record<string, Skill>,
  itemsByKey: Record<string, ItemType>,
  workstationKeys: string[]
): Record<string, string[]> {
  const allErrors: AllErrors = {};

  dataValidation.validateCraftingRecipes(
    allErrors,
    craftingRecipes,
    craftingRecipeCategoriesByKey,
    skillsByKey,
    itemsByKey,
    workstationKeys
  );

  return allErrors[CRAFTING_RECIPES_DATA_FILE]?.[ERROR_SECTION_CRAFTING_RECIPES] ?? {};
}

export function validateLootTables(
  lootTables: LootTable[],
  itemsByKey: Record<string, ItemType>
): Record<string, string[]> {
  const allErrors: AllErrors = {};

  dataValidation.validateLootTables(allErrors, lootTables, itemsByKey);

  return allErrors[LOOT_TABLES_DATA_FILE] ?? {};
}

export function validateObjectCategories(
  objectCategories: ObjectCategory[],
  categoriesByKey: Record<string, ObjectCategory>,
  subCategoriesByKey: Record<string, ObjectSubCategory>,
  objectsByKey: Record<string, ObjectType>
): Record<string, string[]> {
  const allErrors: AllErrors = {};

  dataValidation.validateObjectCategories(allErrors, objectCategories);

  dataValidation.checkObjectCategoriesRequiredSettings(
    allErrors,
    objectCategories,
    categoriesByKey,
    subCategoriesByKey,
    objectsByKey
  );

  return allErrors[OBJECTS_DATA_FILE]?.[ERROR_SECTION_OBJECT_CATEGORIES] ?? {};
}

export function validateObjectCategory(
  objectCategory: ObjectCategory,
  categoriesByKey: Record<string, ObjectCategory>,
  subCategoriesByKey: Record<string, ObjectSubCategory>,
  objectsByKey: Record<string, ObjectType>
): string[] {
  const placementLayer = objectCategory.settings?.placementLayer;
  return [
    ...dataValidation.validateObjectCategory(objectCategory),
    ...(isNotNullish(placementLayer) && isNotNullish(objectCategory.settings)
      ? dataValidation.checkObjectRequiredBelowSettings(
          placementLayer,
          objectCategory.settings,
          categoriesByKey,
          subCategoriesByKey,
          objectsByKey
        )
      : []),
    ...(isNotNullish(placementLayer) && isNotNullish(objectCategory.settings)
      ? dataValidation.checkObjectRequiredAdjacentSettings(
          placementLayer,
          objectCategory.settings,
          categoriesByKey,
          subCategoriesByKey,
          objectsByKey
        )
      : [])
  ];
}

export function validateObjectCategoryPlacementSpawningTab(
  category: ObjectCategory,
  categoriesByKey: Record<string, ObjectCategory>,
  subCategoriesByKey: Record<string, ObjectSubCategory>,
  objectsByKey: Record<string, ObjectType>
): string[] {
  const placementLayer = category.settings?.placementLayer;
  return [
    ...dataValidation.validateObjectCategoryPlacementSpawningTab(category),
    ...(isNotNullish(placementLayer) && isNotNullish(category.settings)
      ? dataValidation.checkObjectRequiredBelowSettings(
          placementLayer,
          category.settings,
          categoriesByKey,
          subCategoriesByKey,
          objectsByKey
        )
      : []),
    ...(isNotNullish(placementLayer) && isNotNullish(category.settings)
      ? dataValidation.checkObjectRequiredAdjacentSettings(
          placementLayer,
          category.settings,
          categoriesByKey,
          subCategoriesByKey,
          objectsByKey
        )
      : [])
  ];
}

export function validateObjectSubCategories(
  objectSubCategories: ObjectSubCategory[],
  categoriesByKey: Record<string, ObjectCategory>,
  subCategoriesByKey: Record<string, ObjectSubCategory>,
  objectsByKey: Record<string, ObjectType>
): Record<string, string[]> {
  const allErrors: AllErrors = {};

  dataValidation.validateObjectSubCategories(allErrors, objectSubCategories, categoriesByKey);

  dataValidation.checkObjectSubCategoriesRequiredSettings(
    allErrors,
    objectSubCategories,
    categoriesByKey,
    subCategoriesByKey,
    objectsByKey
  );

  return allErrors[OBJECTS_DATA_FILE]?.[ERROR_SECTION_OBJECT_SUB_CATEGORIES] ?? {};
}

export function validateObjectSubCategory(
  subCategory: ObjectSubCategory,
  categoriesByKey: Record<string, ObjectCategory>,
  subCategoriesByKey: Record<string, ObjectSubCategory>,
  objectsByKey: Record<string, ObjectType>
): string[] {
  const placementLayer = getObjectSetting('placementLayer', subCategory, categoriesByKey).value;
  return [
    ...dataValidation.validateObjectSubCategory(subCategory, categoriesByKey),
    ...(isNotNullish(placementLayer) && isNotNullish(subCategory.settings)
      ? dataValidation.checkObjectRequiredBelowSettings(
          placementLayer,
          subCategory.settings,
          categoriesByKey,
          subCategoriesByKey,
          objectsByKey
        )
      : []),
    ...(isNotNullish(placementLayer) && isNotNullish(subCategory.settings)
      ? dataValidation.checkObjectRequiredAdjacentSettings(
          placementLayer,
          subCategory.settings,
          categoriesByKey,
          subCategoriesByKey,
          objectsByKey
        )
      : [])
  ];
}

export function validateObjectSubCategoryPlacementSpawningTab(
  subCategory: ObjectSubCategory,
  categoriesByKey: Record<string, ObjectCategory>,
  subCategoriesByKey: Record<string, ObjectSubCategory>,
  objectsByKey: Record<string, ObjectType>
): string[] {
  const placementLayer = getObjectSetting('placementLayer', subCategory, categoriesByKey).value;
  return [
    ...dataValidation.validateObjectSubCategoryPlacementSpawningTab(subCategory, categoriesByKey),
    ...(isNotNullish(placementLayer) && isNotNullish(subCategory.settings)
      ? dataValidation.checkObjectRequiredBelowSettings(
          placementLayer,
          subCategory.settings,
          categoriesByKey,
          subCategoriesByKey,
          objectsByKey
        )
      : []),
    ...(isNotNullish(placementLayer) && isNotNullish(subCategory.settings)
      ? dataValidation.checkObjectRequiredAdjacentSettings(
          placementLayer,
          subCategory.settings,
          categoriesByKey,
          subCategoriesByKey,
          objectsByKey
        )
      : [])
  ];
}

export async function validateObject(
  type: ObjectType,
  categoriesByKey: Record<string, ObjectCategory>,
  subCategories: ObjectSubCategory[],
  subCategoriesByKey: Record<string, ObjectSubCategory>,
  lootTablesByKey: Record<string, LootTable>,
  objectsByKey: Record<string, ObjectType>,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  path: string | undefined
): Promise<string[]> {
  const { value: changesSpritesWithSeason = undefined } = getObjectSetting(
    'changesSpritesWithSeason',
    type,
    categoriesByKey,
    subCategoriesByKey
  );

  const { spriteCounts, accentSpritesCounts } = await getObjectSpriteCountsWithSeason(
    type,
    path,
    changesSpritesWithSeason
  );

  const placementLayer = getObjectSetting('placementLayer', type, categoriesByKey, subCategoriesByKey).value;

  return [
    ...dataValidation.validateObject(
      type,
      categoriesByKey,
      subCategories,
      subCategoriesByKey,
      lootTablesByKey,
      spriteCounts,
      accentSpritesCounts,
      localization,
      localizationKeys,
      []
    ),
    ...(isNotNullish(placementLayer) && isNotNullish(type.settings)
      ? dataValidation.checkObjectRequiredBelowSettings(
          placementLayer,
          type.settings,
          categoriesByKey,
          subCategoriesByKey,
          objectsByKey
        )
      : []),
    ...(isNotNullish(placementLayer) && isNotNullish(type.settings)
      ? dataValidation.checkObjectRequiredAdjacentSettings(
          placementLayer,
          type.settings,
          categoriesByKey,
          subCategoriesByKey,
          objectsByKey
        )
      : [])
  ];
}

export function validateObjectPlacementSpawningTab(
  type: ObjectType,
  categoriesByKey: Record<string, ObjectCategory>,
  subCategoriesByKey: Record<string, ObjectSubCategory>,
  objectsByKey: Record<string, ObjectType>
): string[] {
  const placementLayer = getObjectSetting('placementLayer', type, categoriesByKey, subCategoriesByKey).value;
  return [
    ...dataValidation.validateObjectPlacementSpawningTab(type, categoriesByKey, subCategoriesByKey),
    ...(isNotNullish(placementLayer) && isNotNullish(type.settings)
      ? dataValidation.checkObjectRequiredBelowSettings(
          placementLayer,
          type.settings,
          categoriesByKey,
          subCategoriesByKey,
          objectsByKey
        )
      : []),
    ...(isNotNullish(placementLayer) && isNotNullish(type.settings)
      ? dataValidation.checkObjectRequiredAdjacentSettings(
          placementLayer,
          type.settings,
          categoriesByKey,
          subCategoriesByKey,
          objectsByKey
        )
      : [])
  ];
}

export async function validateObjectSpriteStageTab(
  type: ObjectType,
  categoriesByKey: Record<string, ObjectCategory>,
  subCategoriesByKey: Record<string, ObjectSubCategory>,
  lootTablesByKey: Record<string, LootTable>,
  path: string | undefined
): Promise<string[]> {
  const { value: changesSpritesWithSeason = undefined } = getObjectSetting(
    'changesSpritesWithSeason',
    type,
    categoriesByKey,
    subCategoriesByKey
  );

  const { spriteCounts, accentSpritesCounts } = await getObjectSpriteCountsWithSeason(
    type,
    path,
    changesSpritesWithSeason
  );

  return dataValidation.validateObjectSpriteStageTab(
    type,
    categoriesByKey,
    subCategoriesByKey,
    lootTablesByKey,
    spriteCounts,
    accentSpritesCounts
  );
}

export async function validateObjects(
  objects: ObjectType[],
  categoriesByKey: Record<string, ObjectCategory>,
  subCategories: ObjectSubCategory[],
  subCategoriesByKey: Record<string, ObjectSubCategory>,
  lootTablesByKey: Record<string, LootTable>,
  objectsByKey: Record<string, ObjectType>,
  localization: Localization | null | undefined,
  localizationKeys: string[],
  path: string | undefined
): Promise<Record<string, string[]>> {
  const allErrors: AllErrors = {};

  const { allSpriteCounts, allAccentSpritesCounts } = await getObjectsSpritesCountsWithSeason(
    objects,
    path,
    categoriesByKey,
    subCategoriesByKey
  );

  dataValidation.validateObjects(
    allErrors,
    objects,
    categoriesByKey,
    subCategories,
    subCategoriesByKey,
    lootTablesByKey,
    allSpriteCounts,
    allAccentSpritesCounts,
    localization,
    localizationKeys
  );

  dataValidation.checkObjectsRequiredSettings(allErrors, objects, categoriesByKey, subCategoriesByKey, objectsByKey);

  return allErrors[OBJECTS_DATA_FILE]?.[ERROR_SECTION_OBJECTS] ?? {};
}

/**
 * Validate UI
 */
export function validateObjectDestructionMenu(
  objectDestructionMenu: DestructionMenu,
  objectsByKey: Record<string, ObjectType>,
  objectCategoriesByKey: Record<string, ObjectCategory>,
  objectSubCategoriesByKey: Record<string, ObjectSubCategory>,
  localization: Localization | null | undefined,
  localizationKeys: string[]
): string[] {
  return dataValidation.validateObjectDestructionMenu(
    objectDestructionMenu,
    objectsByKey,
    objectCategoriesByKey,
    objectSubCategoriesByKey,
    localization,
    localizationKeys
  );
}

/**
 * Validate Dialogue
 */
export function validateDialogueTree(
  dialogueTree: DialogueTree,
  creaturesBykey: Record<string, CreatureType>,
  eventLogsByKey: Record<number, EventLog>,
  localization: Localization | null | undefined,
  localizationKeys: string[]
): string[] {
  return dataValidation.validateDialogueTree(
    dialogueTree,
    creaturesBykey,
    eventLogsByKey,
    localization,
    localizationKeys,
    []
  );
}

export function validateDialogueTrees(
  dialogueTrees: DialogueTree[],
  creaturesByKey: Record<string, CreatureType>,
  eventLogsByKey: Record<string, EventLog>,
  localization: Localization | null | undefined,
  localizationKeys: string[]
): Record<string, string[]> {
  const allErrors: AllErrors = {};

  dataValidation.validateDialogueTrees(
    allErrors,
    dialogueTrees,
    creaturesByKey,
    eventLogsByKey,
    localization,
    localizationKeys
  );

  return allErrors[DIALOGUE_DATA_FILE]?.[ERROR_SECTION_DIALOGUE_TREES] ?? {};
}

/**
 * Validate Player Data
 */
export function validatePlayerData(playerData: PlayerData, itemsByKey: Record<string, ItemType>): string[] {
  const allErrors: AllErrors = {};

  dataValidation.validatePlayerData(allErrors, playerData, itemsByKey);

  const stats = allErrors[PLAYER_DATA_FILE]?.[ERROR_SECTION_PLAYER_STATS] ?? [];
  const startingItems = allErrors[PLAYER_DATA_FILE]?.[ERROR_SECTION_PLAYER_STARTING_ITEMS] ?? [];

  return [...stats, ...startingItems];
}

export function validatePlayerDataGeneralTab(playerData: PlayerData, itemsByKey: Record<string, ItemType>): string[] {
  const allErrors: AllErrors = {};

  dataValidation.validatePlayerDataGeneralTab(allErrors, playerData, itemsByKey);

  const stats = allErrors[PLAYER_DATA_FILE]?.[ERROR_SECTION_PLAYER_STATS] ?? [];
  const startingItems = allErrors[PLAYER_DATA_FILE]?.[ERROR_SECTION_PLAYER_STARTING_ITEMS] ?? [];

  return [...stats, ...startingItems];
}

export function validatePlayerDataLevelsTab(playerData: PlayerData): string[] {
  const allErrors: AllErrors = {};

  dataValidation.validatePlayerDataLevelsTab(allErrors, playerData);

  return allErrors[PLAYER_DATA_FILE]?.[ERROR_SECTION_PLAYER_LEVELS] ?? [];
}

/**
 * Validate Event Logs
 */
export function validateEventLogs(
  eventLogs: EventLog[],
  localization: Localization | null | undefined,
  localizationKeys: string[]
): Record<string, string[]> {
  const allErrors: AllErrors = {};

  dataValidation.validateEventLogs(allErrors, eventLogs, localization, localizationKeys);

  return allErrors[EVENTS_DATA_FILE] ?? {};
}

/**
 * Validate World Settings
 */
export function validateWorldSettingsWeatherTab(worldSettings: WorldSettings): string[] {
  const allErrors: AllErrors = {};

  dataValidation.validateWorldSettingsWeatherTab(allErrors, worldSettings);

  return allErrors[WORLD_DATA_FILE]?.[ERROR_SECTION_PLAYER_WORLD_WEATHER] ?? [];
}

export function validateWorldSettings(worldSettings: WorldSettings): string[] {
  return [...validateWorldSettingsWeatherTab(worldSettings)];
}

/**
 * Validate Fishing Zones
 */
export function validateFishingZones(
  fishingZones: FishingZone[],
  lootTablesByKey: Record<string, LootTable>
): Record<string, string[]> {
  const allErrors: AllErrors = {};

  dataValidation.validateFishingZones(allErrors, fishingZones, lootTablesByKey);

  return allErrors[FISHING_DATA_FILE]?.[ERROR_SECTION_FISHING_ZONES] ?? {};
}

export function validateFishingZone(fishingZones: FishingZone, lootTablesByKey: Record<string, LootTable>): string[] {
  return dataValidation.validateFishingZone(fishingZones, lootTablesByKey, []);
}

/**
 * Validate Skills
 */
export function validateSkills(
  skills: Skill[],
  localization: Localization | null | undefined,
  localizationKeys: string[]
): Record<string, string[]> {
  const allErrors: AllErrors = {};

  dataValidation.validateSkills(allErrors, skills, localization, localizationKeys);

  return allErrors[SKILLS_DATA_FILE]?.[ERROR_SECTION_SKILLS] ?? {};
}

export function validateSkill(
  skill: Skill,
  localization: Localization | null | undefined,
  localizationKeys: string[]
): string[] {
  return dataValidation.validateSkill(skill, localization, localizationKeys, []);
}

/**
 * Validate Localizations
 */
export function validateLocalizationKeys(localizationKeys: string[]): Record<string, string[]> {
  const allErrors: AllErrors = {};

  dataValidation.validateLocalizationKeys(allErrors, localizationKeys);

  return allErrors[LOCALIZATION_DATA_FILE]?.[ERROR_SECTION_LOCALIZATION_KEYS] ?? {};
}

export function validateLocalizations(
  localizations: Localization[],
  localizationKeys: string[]
): Record<string, string[]> {
  const allErrors: AllErrors = {};

  dataValidation.validateLocalizations(allErrors, localizations, localizationKeys);

  return allErrors[LOCALIZATION_DATA_FILE]?.[ERROR_SECTION_LOCALIZATIONS] ?? {};
}

/**
 * Validate Quests
 */
export function validateQuests(
  quests: Quest[],
  itemsByKey: Record<string, ItemType>,
  craftingRecipesByKey: Record<string, CraftingRecipe>,
  creaturesByKey: Record<string, CreatureType>,
  dialogueTreesByKey: Record<string, DialogueTree>,
  eventLogsByKey: Record<string, EventLog>,
  localization: Localization | null,
  localizationKeys: string[]
): Record<string, string[]> {
  const allErrors: AllErrors = {};

  dataValidation.validateQuests(
    allErrors,
    quests,
    itemsByKey,
    craftingRecipesByKey,
    creaturesByKey,
    dialogueTreesByKey,
    eventLogsByKey,
    localization,
    localizationKeys
  );

  return allErrors[QUESTS_DATA_FILE]?.[ERROR_SECTION_QUESTS] ?? {};
}

export function validateQuest(
  quest: Quest,
  itemsByKey: Record<string, ItemType>,
  craftingRecipesByKey: Record<string, CraftingRecipe>,
  creaturesByKey: Record<string, CreatureType>,
  dialogueTreesByKey: Record<string, DialogueTree>,
  eventLogsByKey: Record<string, EventLog>,
  localization: Localization | null,
  localizationKeys: string[]
): string[] {
  return dataValidation.validateQuest(
    quest,
    itemsByKey,
    craftingRecipesByKey,
    creaturesByKey,
    dialogueTreesByKey,
    eventLogsByKey,
    localization,
    localizationKeys,
    []
  );
}
