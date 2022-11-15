import {
  toCreatureType,
  toDialogue,
  toDialogueResponse,
  toDialogueTree,
  toItemSettings,
  toObjectCategory,
  toObjectSubCategory,
  toObjectType,
  toProcessedRawCraftingRecipe,
  toProcessedRawCraftingRecipeCategory,
  toProcessedRawCreatureCategory,
  toProcessedRawCreatureType,
  toProcessedRawDialogue,
  toProcessedRawDialogueResponse,
  toProcessedRawDialogueTree,
  toProcessedRawItemCategory,
  toProcessedRawItemType,
  toProcessedRawLootTable,
  toProcessedRawObjectCategory,
  toProcessedRawObjectSubCategory,
  toProcessedRawObjectType
} from '../../../../SharedLibrary/src/util/converters.util';
import { isNotNullish } from '../../../../SharedLibrary/src/util/null.util';

import type {
  CraftingRecipe,
  CraftingRecipeCategory,
  CreatureCategory,
  CreatureType,
  Dialogue,
  DialogueResponse,
  DialogueTree,
  ItemCategory,
  ItemType,
  LootTable,
  ObjectCategory,
  ObjectSubCategory,
  ObjectType
} from '../../../../SharedLibrary/src/interface';

export function generateKey(baseKey: string, sectionEntities: Record<string, unknown>) {
  let key = baseKey;
  let i = 1;

  while (key in sectionEntities) {
    key = `${baseKey}_${i}`;
    i += 1;
  }

  return key;
}

export function getNewCreature(creatureTypesByKey: Record<string, CreatureType>): CreatureType {
  const key = generateKey('NEW_CREATURE_TYPE', creatureTypesByKey);
  return toCreatureType({
    ...toProcessedRawCreatureType({}),
    key
  });
}

export function getNewCreatureCategory(creatureCategoriesByKey: Record<string, CreatureCategory>): CreatureCategory {
  const key = generateKey('NEW_CREATURE_CATEGORY', creatureCategoriesByKey);
  return {
    ...toProcessedRawCreatureCategory({}),
    key
  };
}

export function getNewItem(itemTypesByKey: Record<number, ItemType>): ItemType {
  const key = generateKey('NEW_ITEM_TYPE', itemTypesByKey);
  return {
    ...toProcessedRawItemType({}),
    key,
    settings: toItemSettings({})
  };
}

export function getNewItemCategory(itemCategoriesByKey: Record<string, ItemCategory>): ItemCategory {
  const key = generateKey('NEW_ITEM_CATEGORY', itemCategoriesByKey);
  return {
    ...toProcessedRawItemCategory({}),
    key,
    settings: toItemSettings({})
  };
}

export function getNewCraftingRecipe(craftingRecipesByKey: Record<string, CraftingRecipe>): CraftingRecipe {
  const key = generateKey('NEW_CRAFTING_RECIPE', craftingRecipesByKey);
  return {
    ...toProcessedRawCraftingRecipe({}),
    key
  };
}

export function getNewCraftingRecipeCategory(
  craftingRecipeCategoriesByKey: Record<string, CraftingRecipeCategory>
): CraftingRecipeCategory {
  const key = generateKey('NEW_CRAFTING_RECIPE_CATEGORY', craftingRecipeCategoriesByKey);
  return {
    ...toProcessedRawCraftingRecipeCategory({}),
    key
  };
}

export function getNewLootTable(lootTablesByKey: Record<string, LootTable>): LootTable {
  const key = generateKey('NEW_LOOT_TABLE', lootTablesByKey);
  return {
    ...toProcessedRawLootTable({}),
    key
  };
}

export function getNewObjectCategory(objectCategoriesByKey: Record<string, ObjectCategory>): ObjectCategory {
  const key = generateKey('NEW_OBJECT_CATEGORY', objectCategoriesByKey);
  return toObjectCategory({
    ...toProcessedRawObjectCategory({}),
    key
  });
}

export function getNewObjectSubCategory(
  objectSubCategoriesByKey: Record<string, ObjectSubCategory>
): ObjectSubCategory {
  const key = generateKey('NEW_OBJECT_SUB_CATEGORY', objectSubCategoriesByKey);
  return toObjectSubCategory({
    ...toProcessedRawObjectSubCategory({}),
    key
  });
}

export function getNewObject(objectsByKey: Record<string, ObjectType>): ObjectType {
  const key = generateKey('NEW_OBJECT_TYPE', objectsByKey);
  return toObjectType({
    ...toProcessedRawObjectType({}),
    key
  });
}

export function getNewDialogueTree(dialogueTreesByKey: Record<string, DialogueTree>): DialogueTree {
  const key = generateKey('NEW_DIALOGUE_TREE', dialogueTreesByKey);
  return toDialogueTree({
    ...toProcessedRawDialogueTree({}),
    key
  });
}

export function getNewDialogue(dialogues: Dialogue[] | undefined): Dialogue {
  const dialoguesByKey =
    dialogues?.reduce((byKey, value) => {
      byKey[value.key] = value;
      return byKey;
    }, {} as Record<string, Dialogue>) ?? {};

  let id = 1;
  if (isNotNullish(dialogues) && dialogues.length > 0) {
    id = Math.max(...dialogues.map((dialogue) => dialogue.id)) + 1;
  }

  const key = generateKey('DIALOGUE', dialoguesByKey);
  return toDialogue(toProcessedRawDialogue({ id, key }));
}

export function getNewDialogueResponse(dialogueResponses: DialogueResponse[] | undefined): DialogueResponse {
  const dialogueResponsesByKey =
    dialogueResponses?.reduce((byKey, value) => {
      byKey[value.key] = value;
      return byKey;
    }, {} as Record<string, DialogueResponse>) ?? {};

  let id = 1;
  if (isNotNullish(dialogueResponses) && dialogueResponses.length > 0) {
    id = Math.max(...dialogueResponses.map((dialogueResponse) => dialogueResponse.id)) + 1;
  }

  const key = generateKey('DAILOGUE_RESPONSE', dialogueResponsesByKey);
  return toDialogueResponse(toProcessedRawDialogueResponse({ id, key }));
}
