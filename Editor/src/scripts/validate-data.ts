import { existsSync, readFileSync } from 'fs';
import sizeOf from 'image-size';
import { join, resolve } from 'path';

import { GROUND_TYPES, PLAYER_SPRITE_HEIGHT, PLAYER_SPRITE_WIDTH, SEASONS } from '../../../SharedLibrary/src/constants';
import { validateData } from '../../../SharedLibrary/src/dataValidation';
import {
  toObjectCategory,
  toObjectSubCategory,
  toObjectType,
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
  toProcessedRawWorldZone
} from '../../../SharedLibrary/src/util/converters.util';
import { getObjectSetting } from '../../../SharedLibrary/src/util/objectType.util';
import { applyAcceptedBaseline } from './content/baseline';
import { CONTENT_REGISTRY, getValueAtPath } from './content/registry';

import type {
  AllErrors,
  CraftingRecipeDataFile,
  CreatureDataFile,
  DialogueDataFile,
  EventsFile,
  FishingDataFile,
  ItemDataFile,
  LootTableDataFile,
  ObjectDataFile,
  QuestDataFile,
  RawLocalizationFile,
  RawPlayerData,
  RawWorldSettings,
  SkillDataFile,
  WorldZonesDataFile
} from '../../../SharedLibrary/src/interface';
import type { ContentDiagnostic } from './content/types';

interface CliOptions {
  dataDir: string;
  assetsDir: string;
  format: 'human' | 'json';
}

const KEY_PATTERN = /^[A-Z][A-Z0-9_]*$/;

function parseOptions(): CliOptions {
  const args = process.argv.slice(2);
  const value = (name: string) => {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : undefined;
  };
  const dataDir = value('--data-dir') ?? process.env.STREAMING_DATA_PATH;
  const assetsDir = value('--assets-dir') ?? (dataDir ? resolve(dataDir, '..') : undefined);
  if (!dataDir || !assetsDir) {
    throw new Error('Usage: data:validate -- --data-dir <data> --assets-dir <StreamingAssets> [--format json]');
  }
  return {
    dataDir: resolve(dataDir),
    assetsDir: resolve(assetsDir),
    format: value('--format') === 'json' || args.includes('--json') ? 'json' : 'human'
  };
}

function readJson<T>(dataDir: string, file: string, diagnostics: ContentDiagnostic[]): T {
  const path = join(dataDir, `${file}.json`);
  if (!existsSync(path)) {
    diagnostics.push({
      severity: 'error',
      code: 'FILE_MISSING',
      file: `${file}.json`,
      message: `Required data file is missing: ${path}`
    });
    return {} as T;
  }
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as T;
  } catch (error) {
    diagnostics.push({
      severity: 'error',
      code: 'JSON_INVALID',
      file: `${file}.json`,
      message: error instanceof Error ? error.message : 'Invalid JSON'
    });
    return {} as T;
  }
}

function imageSize(path: string): { width: number | undefined; height: number | undefined } {
  if (!existsSync(path)) {
    return { width: undefined, height: undefined };
  }
  try {
    const result = sizeOf(path);
    return { width: result.width, height: result.height };
  } catch {
    return { width: undefined, height: undefined };
  }
}

function spriteCount(path: string, width: number | undefined, height: number | undefined): number {
  if (!width || !height) {
    return 0;
  }
  const size = imageSize(path);
  if (!size.width || !size.height) {
    return 0;
  }
  return Math.floor(size.width / width) * Math.floor(size.height / height);
}

function addRegistryDiagnostics(files: Record<string, unknown>, diagnostics: ContentDiagnostic[]) {
  for (const definition of CONTENT_REGISTRY) {
    const fileName = `${definition.file}.json`;
    const file = files[definition.file];
    for (const collection of definition.collections) {
      const value = getValueAtPath(file, collection.path);
      if (!Array.isArray(value)) {
        diagnostics.push({
          severity: 'error',
          code: 'ROOT_SHAPE_INVALID',
          file: fileName,
          section: collection.path,
          message: `Expected ${collection.path} to be an array`
        });
        continue;
      }
      const keys = new Set<string>();
      const ids = new Set<number>();
      value.forEach((entry, index) => {
        if (typeof entry !== 'object' || entry === null) {
          return;
        }
        const record = entry as Record<string, unknown>;
        const key = record.key;
        if (typeof key === 'string') {
          if (collection.enforceUpperSnakeKey !== false && !KEY_PATTERN.test(key)) {
            diagnostics.push({
              severity: 'error',
              code: 'KEY_CASE_INVALID',
              file: fileName,
              section: collection.path,
              entity: key,
              message: `Key must be UPPER_SNAKE_CASE: ${key}`
            });
          }
          if (keys.has(key)) {
            diagnostics.push({
              severity: 'error',
              code: 'KEY_DUPLICATE',
              file: fileName,
              section: collection.path,
              entity: key,
              message: `Duplicate key in ${collection.keyScope}: ${key}`
            });
          }
          keys.add(key);
        }
        if (collection.idScope && typeof record.id === 'number') {
          if (ids.has(record.id)) {
            diagnostics.push({
              severity: 'error',
              code: 'ID_DUPLICATE',
              file: fileName,
              section: collection.path,
              entity: typeof key === 'string' ? key : String(index),
              message: `Duplicate ID ${record.id} in ${collection.idScope}`
            });
          }
          ids.add(record.id);
        }
      });
    }
  }

  const localization = files.localizations as { keys?: unknown } | undefined;
  if (Array.isArray(localization?.keys)) {
    const seen = new Set<string>();
    for (const value of localization.keys) {
      if (typeof value === 'string' && seen.has(value)) {
        diagnostics.push({
          severity: 'error',
          code: 'LOCALIZATION_KEY_DUPLICATE',
          file: 'localizations.json',
          section: 'keys',
          entity: value,
          message: `Duplicate localization key: ${value}`
        });
      }
      if (typeof value === 'string') {
        seen.add(value);
      }
    }
  }
}

function flattenSharedErrors(errors: AllErrors | null): ContentDiagnostic[] {
  if (!errors) {
    return [];
  }
  const diagnostics: ContentDiagnostic[] = [];
  const walk = (value: unknown, path: string[]) => {
    if (Array.isArray(value)) {
      for (const message of value) {
        diagnostics.push({
          severity: 'error',
          code: 'SHARED_VALIDATION',
          file: `${path[0] ?? 'data'}.json`,
          section: path[1],
          entity: path.length > 2 ? path.slice(2).join('.') : undefined,
          message: String(message)
        });
      }
      return;
    }
    if (typeof value === 'object' && value !== null) {
      for (const [key, child] of Object.entries(value)) {
        walk(child, [...path, key]);
      }
    }
  };
  walk(errors, []);
  return diagnostics;
}

function runValidation(options: CliOptions) {
  const diagnostics: ContentDiagnostic[] = [];
  const files: Record<string, unknown> = {};
  for (const definition of CONTENT_REGISTRY) {
    files[definition.file] = readJson(options.dataDir, definition.file, diagnostics);
  }
  addRegistryDiagnostics(files, diagnostics);

  const itemFile = files.items as ItemDataFile;
  const creatureFile = files.creatures as CreatureDataFile;
  const objectFile = files.objects as ObjectDataFile;
  const recipeFile = files.crafting_recipes as CraftingRecipeDataFile;
  const lootFile = files.loot_tables as LootTableDataFile;
  const dialogueFile = files.dialogue as DialogueDataFile;
  const eventsFile = files.events as EventsFile;
  const questFile = files.quests as QuestDataFile;
  const skillFile = files.skills as SkillDataFile;
  const fishingFile = files.fishing as FishingDataFile;
  const worldZoneFile = files.world_zones as WorldZonesDataFile;
  const localizationFile = files.localizations as RawLocalizationFile;

  const rawItemCategories = (itemFile.categories ?? []).map(toProcessedRawItemCategory);
  const rawItems = (itemFile.items ?? []).map(toProcessedRawItemType);
  const rawCreatureCategories = (creatureFile.categories ?? []).map(toProcessedRawCreatureCategory);
  const rawCreatures = (creatureFile.creatures ?? []).map(toProcessedRawCreatureType);
  const rawObjectCategories = (objectFile.categories ?? []).map(toProcessedRawObjectCategory);
  const rawObjectSubCategories = (objectFile.subCategories ?? []).map(toProcessedRawObjectSubCategory);
  const rawObjects = (objectFile.objects ?? []).map(toProcessedRawObjectType);
  const rawRecipeCategories = (recipeFile.categories ?? []).map(toProcessedRawCraftingRecipeCategory);
  const rawRecipes = (recipeFile.recipes ?? []).map(toProcessedRawCraftingRecipe);
  const rawLootTables = (lootFile.lootTables ?? []).map(toProcessedRawLootTable);
  const rawDialogueTrees = (dialogueFile.dialogueTrees ?? []).map(toProcessedRawDialogueTree);
  const rawEvents = (eventsFile.eventLogs ?? []).map(toProcessedRawEventLog);
  const rawQuests = (questFile.quests ?? []).map(toProcessedRawQuest);
  const rawSkills = (skillFile.skills ?? []).map(toProcessedRawSkill);
  const rawFishingZones = (fishingFile.zones ?? []).map(toProcessedRawFishingZone);
  const rawWorldZones = (worldZoneFile.zones ?? []).map(toProcessedRawWorldZone);
  const rawPlayer = toProcessedRawPlayerData(files.player as RawPlayerData);
  const rawWorld = toProcessedRawWorldSettings(files.world as RawWorldSettings);
  const rawLocalization = toProcessedRawLocalizationFile(localizationFile);

  const itemIconSizes: Record<string, { width: number | undefined; height: number | undefined }> = {};
  const itemAnimations: Record<string, number> = {};
  for (const item of rawItems) {
    const key = item.key ?? '';
    itemIconSizes[key] = imageSize(join(options.assetsDir, 'items', `${key.toLowerCase()}.png`));
    itemAnimations[key] = spriteCount(
      join(options.assetsDir, 'player', `${key.toLowerCase()}.png`),
      PLAYER_SPRITE_WIDTH,
      PLAYER_SPRITE_HEIGHT
    );
  }

  const creatureAnimations: Record<string, number> = {};
  const creaturePortraits: Record<string, { width: number | undefined; height: number | undefined }> = {};
  for (const creature of rawCreatures) {
    const key = creature.key ?? '';
    creatureAnimations[key] = spriteCount(
      join(options.assetsDir, 'creatures', `${key.toLowerCase()}.png`),
      creature.sprite?.width,
      creature.sprite?.height
    );
    creaturePortraits[key] = imageSize(
      join(options.assetsDir, 'creatures', `${key.toLowerCase()}-portrait.png`)
    );
  }

  const categories = rawObjectCategories.map(toObjectCategory);
  const subCategories = rawObjectSubCategories.map(toObjectSubCategory);
  const objects = rawObjects.map(toObjectType);
  const categoriesByKey = Object.fromEntries(categories.map((entry) => [entry.key, entry]));
  const subCategoriesByKey = Object.fromEntries(subCategories.map((entry) => [entry.key, entry]));
  const objectSpriteCounts: Record<string, number> = {};
  const objectAccentSpriteCounts: Record<string, Record<string, number>> = {};
  for (const object of objects) {
    const seasonal =
      getObjectSetting(
        'changesSpritesWithSeason',
        object,
        categoriesByKey,
        subCategoriesByKey
      ).value === true;
    const keys = seasonal ? SEASONS.map((season) => `${object.key}-${season}`) : [object.key];
    for (const key of keys) {
      objectSpriteCounts[key] = spriteCount(
        join(options.assetsDir, 'objects', `${key.toLowerCase()}.png`),
        object.sprite?.width,
        object.sprite?.height
      );
      objectAccentSpriteCounts[key] = Object.fromEntries(
        GROUND_TYPES.map((ground) => [
          ground,
          spriteCount(
            join(options.assetsDir, 'objects', `${key.toLowerCase()}-${ground.toLowerCase()}.png`),
            object.sprite?.width,
            object.sprite?.height
          )
        ])
      );
    }
  }

  const sharedErrors = validateData(
    rawCreatureCategories,
    rawCreatures,
    creatureAnimations,
    creaturePortraits,
    rawItemCategories,
    rawItems,
    itemIconSizes,
    itemAnimations,
    rawLootTables,
    rawRecipeCategories,
    rawRecipes,
    rawObjectCategories,
    rawObjectSubCategories,
    rawObjects,
    objectSpriteCounts,
    objectAccentSpriteCounts,
    rawPlayer,
    rawDialogueTrees,
    rawEvents,
    rawWorld,
    rawFishingZones,
    rawSkills,
    rawLocalization.keys,
    rawLocalization.localizations,
    rawQuests,
    rawWorldZones
  );
  diagnostics.push(...flattenSharedErrors(sharedErrors));
  return diagnostics.map(applyAcceptedBaseline);
}

try {
  const options = parseOptions();
  const diagnostics = runValidation(options);
  const errors = diagnostics.filter((entry) => entry.severity === 'error');
  if (options.format === 'json') {
    console.info(JSON.stringify({ version: 1, diagnostics, errorCount: errors.length }, null, 2));
  } else if (diagnostics.length === 0) {
    console.info('Production data validation passed with no diagnostics.');
  } else {
    for (const diagnostic of diagnostics) {
      const location = [diagnostic.file, diagnostic.section, diagnostic.entity].filter(Boolean).join(' / ');
      console.info(`${diagnostic.severity.toUpperCase()} ${diagnostic.code} ${location}: ${diagnostic.message}`);
    }
    console.info(`\n${errors.length} error(s), ${diagnostics.length - errors.length} warning(s)`);
  }
  if (errors.length > 0) {
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
