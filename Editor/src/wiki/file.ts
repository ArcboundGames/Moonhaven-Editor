import { readFileSync } from 'fs';
import { join } from 'path';

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
  toLocalizationFile,
  toLootTable,
  toObjectCategory,
  toObjectSubCategory,
  toObjectType,
  toPlayerData,
  toProcessedRawCraftingRecipe,
  toProcessedRawCraftingRecipeCategory,
  toProcessedRawCreatureCategory,
  toProcessedRawCreatureType,
  toProcessedRawDialogueTree,
  toProcessedRawEventLog,
  toProcessedRawFishingZone,
  toProcessedRawItemCategory,
  toProcessedRawItemType,
  toProcessedRawLocalizationFile,
  toProcessedRawLootTable,
  toProcessedRawObjectCategory,
  toProcessedRawObjectSubCategory,
  toProcessedRawObjectType,
  toProcessedRawPlayerData,
  toProcessedRawQuest,
  toProcessedRawSkill,
  toProcessedRawWorldSettings,
  toProcessedRawWorldZone,
  toQuest,
  toSkill,
  toWorldSettings,
  toWorldZone
} from '../../../SharedLibrary/src/util/converters.util';
import { getLocalizationKey, getLocalizedValue } from '../../../SharedLibrary/src/util/localization.util';
import toRecord from '../../../SharedLibrary/src/util/record.util';
import { toTitleCaseFromKey } from '../../../SharedLibrary/src/util/string.util';

import type {
  CraftingRecipeDataFile,
  CreatureDataFile,
  DialogueDataFile,
  EventsFile,
  FishingDataFile,
  ItemDataFile,
  Localization,
  LocalizedCraftingRecipe,
  LocalizedCreatureType,
  LocalizedItemType,
  LocalizedObjectType,
  LootTableDataFile,
  ObjectDataFile,
  QuestDataFile,
  RawLocalizationFile,
  RawPlayerData,
  RawWorldSettings,
  SkillDataFile,
  WorldZonesDataFile
} from '../../../SharedLibrary/src/interface';

let dataDir = '';

export function setWikiDataDir(directory: string) {
  dataDir = directory;
}

function readJson<T>(file: string): T {
  if (!dataDir) {
    throw new Error('Wiki data directory was not set');
  }
  return JSON.parse(readFileSync(join(dataDir, `${file}.json`), 'utf8')) as T;
}

function toKeyLookup<T extends { key: string }>(array: T[]): Record<string, T> {
  return toRecord(array, (entry) => entry.key);
}

function localizedName(
  localization: Localization | undefined,
  localizationKeys: string[],
  section: 'creature' | 'item' | 'object' | 'fishing-zone' | 'dialogue-tree' | 'event-log' | 'quest' | 'skill' | 'world-zone',
  key: string,
  field = 'name'
) {
  if (!localization) {
    return toTitleCaseFromKey(key);
  }
  return (
    getLocalizedValue(localization, localizationKeys, getLocalizationKey(section, field, key.toLowerCase())) ||
    toTitleCaseFromKey(key)
  );
}

export function getItems(localization: Localization, localizationKeys: string[]) {
  const data = readJson<ItemDataFile>('items');
  const items: LocalizedItemType[] = (data.items ?? [])
    .map((entry) => toItemType(toProcessedRawItemType(entry)))
    .map((item) => ({
      ...item,
      name: getLocalizedValue(localization, localizationKeys, getLocalizationKey('item', 'name', item.key.toLowerCase())),
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
  const data = readJson<LootTableDataFile>('loot_tables');
  const lootTables = (data.lootTables ?? []).map((entry) => toLootTable(toProcessedRawLootTable(entry)));
  lootTables.sort((a, b) => a.key.localeCompare(b.key));
  return { lootTables, lootTablesByKey: toKeyLookup(lootTables) };
}

export function getObjects(localization: Localization, localizationKeys: string[]) {
  const data = readJson<ObjectDataFile>('objects');
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
  const data = readJson<CraftingRecipeDataFile>('crafting_recipes');
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

export function getFishingZones(localization?: Localization, localizationKeys: string[] = []) {
  const data = readJson<FishingDataFile>('fishing');
  const fishingZones = (data.zones ?? []).map((entry) => {
    const zone = toFishingZone(toProcessedRawFishingZone(entry));
    return {
      ...zone,
      name: localizedName(localization, localizationKeys, 'fishing-zone', zone.key)
    };
  });
  fishingZones.sort((a, b) => a.key.localeCompare(b.key));
  return { fishingZones, fishingZonesByKey: toKeyLookup(fishingZones) };
}

export function getCreatures(localization: Localization, localizationKeys: string[]) {
  const data = readJson<CreatureDataFile>('creatures');
  const creatures: LocalizedCreatureType[] = (data.creatures ?? [])
    .map((entry) => toCreatureType(toProcessedRawCreatureType(entry)))
    .map((creature) => ({
      ...creature,
      name: getLocalizedValue(
        localization,
        localizationKeys,
        getLocalizationKey('creature', 'name', creature.key.toLowerCase())
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
  const data = readJson<RawLocalizationFile>('localizations');
  const { keys, localizations } = toLocalizationFile(toProcessedRawLocalizationFile(data));
  return {
    localizationKeys: keys,
    localizations,
    localizationsByKey: toKeyLookup(localizations)
  };
}

export function getDialogue(localization: Localization, localizationKeys: string[]) {
  const data = readJson<DialogueDataFile>('dialogue');
  const dialogueTrees = (data.dialogueTrees ?? []).map((entry) => {
    const tree = toDialogueTree(toProcessedRawDialogueTree(entry));
    return {
      ...tree,
      name: localizedName(localization, localizationKeys, 'dialogue-tree', tree.key)
    };
  });
  return { dialogueTrees, dialogueTreesByKey: toKeyLookup(dialogueTrees) };
}

export function getEvents(localization: Localization, localizationKeys: string[]) {
  const data = readJson<EventsFile>('events');
  const eventLogs = (data.eventLogs ?? []).map((entry) => {
    const eventLog = toEventLog(toProcessedRawEventLog(entry));
    return {
      ...eventLog,
      name: localizedName(localization, localizationKeys, 'event-log', eventLog.key)
    };
  });
  return { eventLogs, eventLogsByKey: toKeyLookup(eventLogs) };
}

export function getQuests(localization: Localization, localizationKeys: string[]) {
  const data = readJson<QuestDataFile>('quests');
  const quests = (data.quests ?? []).map((entry) => {
    const quest = toQuest(toProcessedRawQuest(entry));
    return {
      ...quest,
      name: localizedName(localization, localizationKeys, 'quest', quest.key)
    };
  });
  return { quests, questsByKey: toKeyLookup(quests) };
}

export function getSkills(localization: Localization, localizationKeys: string[]) {
  const data = readJson<SkillDataFile>('skills');
  const skills = (data.skills ?? []).map((entry) => {
    const skill = toSkill(toProcessedRawSkill(entry));
    return {
      ...skill,
      name: localizedName(localization, localizationKeys, 'skill', skill.key)
    };
  });
  return { skills, skillsByKey: toKeyLookup(skills) };
}

export function getWorldZones(localization: Localization, localizationKeys: string[]) {
  const data = readJson<WorldZonesDataFile>('world_zones');
  const worldZones = (data.zones ?? []).map((entry) => {
    const zone = toWorldZone(toProcessedRawWorldZone(entry));
    return {
      ...zone,
      name: localizedName(localization, localizationKeys, 'world-zone', zone.key)
    };
  });
  return { worldZones, worldZonesByKey: toKeyLookup(worldZones) };
}

export function getPlayerSettings() {
  return { player: toPlayerData(toProcessedRawPlayerData(readJson<RawPlayerData>('player'))) };
}

export function getWorldSettings() {
  return { world: toWorldSettings(toProcessedRawWorldSettings(readJson<RawWorldSettings>('world'))) };
}
