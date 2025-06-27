import { readFileSync } from 'fs';
import { join } from 'path';

import {
  toCraftingRecipe,
  toCraftingRecipeCategory,
  toCreatureCategory,
  toCreatureType,
  toFishingZone,
  toItemCategory,
  toItemType,
  toLocalizationFile,
  toLootTable,
  toObjectCategory,
  toObjectSubCategory,
  toObjectType,
  toProcessedRawCraftingRecipe,
  toProcessedRawCraftingRecipeCategory,
  toProcessedRawCreatureCategory,
  toProcessedRawCreatureType,
  toProcessedRawFishingZone,
  toProcessedRawItemCategory,
  toProcessedRawItemType,
  toProcessedRawLocalizationFile,
  toProcessedRawLootTable,
  toProcessedRawObjectCategory,
  toProcessedRawObjectSubCategory,
  toProcessedRawObjectType
} from '../../../SharedLibrary/src/util/converters.util';
import { getLocalizationKey, getLocalizedValue } from '../../../SharedLibrary/src/util/localization.util';
import toRecord from '../../../SharedLibrary/src/util/record.util';
import { getStreamingDataPath } from './wiki.util';

import type {
  CraftingRecipeDataFile,
  CreatureDataFile,
  FishingDataFile,
  ItemDataFile,
  Localization,
  LocalizedCraftingRecipe,
  LocalizedCreatureType,
  LocalizedItemType,
  LocalizedObjectType,
  LootTableDataFile,
  ObjectDataFile,
  RawLocalizationFile
} from '../../../SharedLibrary/src/interface';

function toKeyLookup<T extends { key: string }>(array: T[]): Record<string, T> {
  return toRecord(array, (entry) => entry.key);
}

export function getItems(localization: Localization, localizationKeys: string[]) {
  const data = JSON.parse(
    readFileSync(join(__dirname, `${getStreamingDataPath()}/items.json`), 'utf8')
  ) as ItemDataFile;

  const items: LocalizedItemType[] = (data.items ?? [])
    .map((entry) => toItemType(toProcessedRawItemType(entry)))
    .map((item) => ({
      ...item,
      name: getLocalizedValue(
        localization,
        localizationKeys,
        getLocalizationKey('item', 'name', item.key.toLowerCase())
      ),
      description: getLocalizedValue(
        localization,
        localizationKeys,
        getLocalizationKey('item', 'description', item.key.toLowerCase())
      )
    }));
  items.sort((a, b) => a.name.localeCompare(b.name));

  const itemCategories = (data.categories ?? []).map((entry) => toItemCategory(toProcessedRawItemCategory(entry)));
  itemCategories.sort((a, b) => a.key.localeCompare(b.key));

  return {
    items,
    itemsByKey: toKeyLookup(items),
    itemCategories,
    itemCategoriesByKey: toKeyLookup(itemCategories)
  };
}

export function getLootTables() {
  const data = JSON.parse(
    readFileSync(join(__dirname, `${getStreamingDataPath()}/loot_tables.json`), 'utf8')
  ) as LootTableDataFile;

  const lootTables = (data.lootTables ?? []).map((entry) => toLootTable(toProcessedRawLootTable(entry)));
  lootTables.sort((a, b) => a.key.localeCompare(b.key));

  return {
    lootTables,
    lootTablesByKey: toKeyLookup(lootTables)
  };
}

export function getObjects(localization: Localization, localizationKeys: string[]) {
  const data = JSON.parse(
    readFileSync(join(__dirname, `${getStreamingDataPath()}/objects.json`), 'utf8')
  ) as ObjectDataFile;

  const objects: LocalizedObjectType[] = (data.objects ?? [])
    .map((entry) => toObjectType(toProcessedRawObjectType(entry)))
    .map((object) => ({
      ...object,
      name: getLocalizedValue(localization, localizationKeys, getLocalizationKey('object', 'name', object.key))
    }));
  objects.sort((a, b) => a.name.localeCompare(b.name));

  const objectSubCategories = (data.subCategories ?? []).map((entry) =>
    toObjectSubCategory(toProcessedRawObjectSubCategory(entry))
  );
  objectSubCategories.sort((a, b) => a.key.localeCompare(b.key));

  const objectCategories = (data.categories ?? []).map((entry) =>
    toObjectCategory(toProcessedRawObjectCategory(entry))
  );
  objectCategories.sort((a, b) => a.key.localeCompare(b.key));

  return {
    objects,
    objectsByKey: toKeyLookup(objects),
    objectSubCategories,
    objectSubCategoriesByKey: toKeyLookup(objectSubCategories),
    objectCategories,
    objectCategoriesByKey: toKeyLookup(objectCategories)
  };
}

export function getCraftingRecipes(localization: Localization, localizationKeys: string[]) {
  const data = JSON.parse(
    readFileSync(join(__dirname, `${getStreamingDataPath()}/crafting_recipes.json`), 'utf8')
  ) as CraftingRecipeDataFile;

  const craftingRecipes: LocalizedCraftingRecipe[] = (data.recipes ?? [])
    .map((entry) => toCraftingRecipe(toProcessedRawCraftingRecipe(entry)))
    .map((craftingRecipe) => ({
      ...craftingRecipe,
      name: getLocalizedValue(
        localization,
        localizationKeys,
        getLocalizationKey('item', 'name', craftingRecipe.itemTypeKey?.toLowerCase() ?? '')
      )
    }));
  craftingRecipes.sort((a, b) => a.name.localeCompare(b.name));

  const craftingRecipeCategories = (data.categories ?? []).map((entry) =>
    toCraftingRecipeCategory(toProcessedRawCraftingRecipeCategory(entry))
  );
  craftingRecipeCategories.sort((a, b) => a.key.localeCompare(b.key));

  return {
    craftingRecipes,
    craftingRecipesByKey: toKeyLookup(craftingRecipes),
    craftingRecipeCategories,
    craftingRecipeCategoriesByKey: toKeyLookup(craftingRecipeCategories)
  };
}

export function getFishingZones() {
  const data = JSON.parse(
    readFileSync(join(__dirname, `${getStreamingDataPath()}/fishing.json`), 'utf8')
  ) as FishingDataFile;

  const fishingZones = (data.zones ?? []).map((entry) => toFishingZone(toProcessedRawFishingZone(entry)));
  fishingZones.sort((a, b) => a.key.localeCompare(b.key));

  return {
    fishingZones
  };
}

export function getCreatures(localization: Localization, localizationKeys: string[]) {
  const data = JSON.parse(
    readFileSync(join(__dirname, `${getStreamingDataPath()}/creatures.json`), 'utf8')
  ) as CreatureDataFile;

  const creatures: LocalizedCreatureType[] = (data.creatures ?? [])
    .map((entry) => toCreatureType(toProcessedRawCreatureType(entry)))
    .map((creature) => ({
      ...creature,
      name: getLocalizedValue(
        localization,
        localizationKeys,
        getLocalizationKey('item', 'name', creature.key.toLowerCase())
      )
    }));
  creatures.sort((a, b) => a.name.localeCompare(b.name));

  const creatureCategories = (data.categories ?? []).map((entry) =>
    toCreatureCategory(toProcessedRawCreatureCategory(entry))
  );
  creatureCategories.sort((a, b) => a.key.localeCompare(b.key));

  return {
    creatures,
    creaturesByKey: toKeyLookup(creatures),
    creatureCategories,
    creatureCategoriesByKey: toKeyLookup(creatureCategories)
  };
}

export function getLocalizations() {
  const data = JSON.parse(
    readFileSync(join(__dirname, `${getStreamingDataPath()}/localizations.json`), 'utf8')
  ) as RawLocalizationFile;

  const { keys, localizations } = toLocalizationFile(toProcessedRawLocalizationFile(data));

  return {
    localizationKeys: keys,
    localizations,
    localizationsByKey: toKeyLookup(localizations)
  };
}
