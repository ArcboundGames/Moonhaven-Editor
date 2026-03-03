import {
  generateKey,
  getNewCreature,
  getNewCreatureCategory,
  getNewItem,
  getNewItemCategory,
  getNewCraftingRecipe,
  getNewCraftingRecipeCategory,
  getNewLootTable,
  getNewObjectCategory,
  getNewObjectSubCategory,
  getNewObject,
  getNewDialogueTree,
  getNewDialogue,
  getNewDialogueResponse
} from '../section.util';

import type {
  CreatureType,
  CreatureCategory,
  ItemType,
  ItemCategory,
  CraftingRecipe,
  CraftingRecipeCategory,
  LootTable,
  ObjectCategory,
  ObjectSubCategory,
  ObjectType,
  DialogueTree,
  Dialogue,
  DialogueResponse
} from '../../../../../SharedLibrary/src/interface';

describe('generateKey', () => {
  it('returns the base key when it does not exist', () => {
    expect(generateKey('NEW_KEY', {})).toBe('NEW_KEY');
  });

  it('appends _1 when base key already exists', () => {
    expect(generateKey('KEY', { KEY: true })).toBe('KEY_1');
  });

  it('increments suffix until a unique key is found', () => {
    expect(generateKey('KEY', { KEY: true, KEY_1: true, KEY_2: true })).toBe('KEY_3');
  });
});

describe('getNewCreature', () => {
  it('returns a creature with a generated key', () => {
    const result = getNewCreature({});
    expect(result.key).toBe('NEW_CREATURE_TYPE');
  });

  it('avoids key collision', () => {
    const existing: Record<string, CreatureType> = {
      NEW_CREATURE_TYPE: { key: 'NEW_CREATURE_TYPE' } as CreatureType
    };
    const result = getNewCreature(existing);
    expect(result.key).toBe('NEW_CREATURE_TYPE_1');
  });
});

describe('getNewCreatureCategory', () => {
  it('returns a category with a generated key', () => {
    const result = getNewCreatureCategory({});
    expect(result.key).toBe('NEW_CREATURE_CATEGORY');
  });

  it('avoids key collision', () => {
    const existing: Record<string, CreatureCategory> = {
      NEW_CREATURE_CATEGORY: { key: 'NEW_CREATURE_CATEGORY' } as CreatureCategory
    };
    const result = getNewCreatureCategory(existing);
    expect(result.key).toBe('NEW_CREATURE_CATEGORY_1');
  });
});

describe('getNewItem', () => {
  it('returns an item with a generated key', () => {
    const result = getNewItem({});
    expect(result.key).toBe('NEW_ITEM_TYPE');
    expect(result.settings).toBeDefined();
  });

  it('avoids key collision', () => {
    const existing: Record<number, ItemType> = {};
    (existing as unknown as Record<string, ItemType>)['NEW_ITEM_TYPE'] = { key: 'NEW_ITEM_TYPE' } as ItemType;
    const result = getNewItem(existing);
    expect(result.key).toBe('NEW_ITEM_TYPE_1');
  });
});

describe('getNewItemCategory', () => {
  it('returns an item category with a generated key', () => {
    const result = getNewItemCategory({});
    expect(result.key).toBe('NEW_ITEM_CATEGORY');
    expect(result.settings).toBeDefined();
  });

  it('avoids key collision', () => {
    const existing: Record<string, ItemCategory> = {
      NEW_ITEM_CATEGORY: { key: 'NEW_ITEM_CATEGORY' } as ItemCategory
    };
    const result = getNewItemCategory(existing);
    expect(result.key).toBe('NEW_ITEM_CATEGORY_1');
  });
});

describe('getNewCraftingRecipe', () => {
  it('returns a recipe with a generated key', () => {
    const result = getNewCraftingRecipe({});
    expect(result.key).toBe('NEW_CRAFTING_RECIPE');
  });

  it('avoids key collision', () => {
    const existing: Record<string, CraftingRecipe> = {
      NEW_CRAFTING_RECIPE: { key: 'NEW_CRAFTING_RECIPE' } as CraftingRecipe
    };
    const result = getNewCraftingRecipe(existing);
    expect(result.key).toBe('NEW_CRAFTING_RECIPE_1');
  });
});

describe('getNewCraftingRecipeCategory', () => {
  it('returns a recipe category with a generated key', () => {
    const result = getNewCraftingRecipeCategory({});
    expect(result.key).toBe('NEW_CRAFTING_RECIPE_CATEGORY');
  });

  it('avoids key collision', () => {
    const existing: Record<string, CraftingRecipeCategory> = {
      NEW_CRAFTING_RECIPE_CATEGORY: { key: 'NEW_CRAFTING_RECIPE_CATEGORY' } as CraftingRecipeCategory
    };
    const result = getNewCraftingRecipeCategory(existing);
    expect(result.key).toBe('NEW_CRAFTING_RECIPE_CATEGORY_1');
  });
});

describe('getNewLootTable', () => {
  it('returns a loot table with a generated key', () => {
    const result = getNewLootTable({});
    expect(result.key).toBe('NEW_LOOT_TABLE');
  });

  it('avoids key collision', () => {
    const existing: Record<string, LootTable> = {
      NEW_LOOT_TABLE: { key: 'NEW_LOOT_TABLE' } as LootTable
    };
    const result = getNewLootTable(existing);
    expect(result.key).toBe('NEW_LOOT_TABLE_1');
  });
});

describe('getNewObjectCategory', () => {
  it('returns an object category with a generated key', () => {
    const result = getNewObjectCategory({});
    expect(result.key).toBe('NEW_OBJECT_CATEGORY');
  });

  it('avoids key collision', () => {
    const existing: Record<string, ObjectCategory> = {
      NEW_OBJECT_CATEGORY: { key: 'NEW_OBJECT_CATEGORY' } as ObjectCategory
    };
    const result = getNewObjectCategory(existing);
    expect(result.key).toBe('NEW_OBJECT_CATEGORY_1');
  });
});

describe('getNewObjectSubCategory', () => {
  it('returns an object sub-category with a generated key', () => {
    const result = getNewObjectSubCategory({});
    expect(result.key).toBe('NEW_OBJECT_SUB_CATEGORY');
  });

  it('avoids key collision', () => {
    const existing: Record<string, ObjectSubCategory> = {
      NEW_OBJECT_SUB_CATEGORY: { key: 'NEW_OBJECT_SUB_CATEGORY' } as ObjectSubCategory
    };
    const result = getNewObjectSubCategory(existing);
    expect(result.key).toBe('NEW_OBJECT_SUB_CATEGORY_1');
  });
});

describe('getNewObject', () => {
  it('returns an object with a generated key', () => {
    const result = getNewObject({});
    expect(result.key).toBe('NEW_OBJECT_TYPE');
  });

  it('avoids key collision', () => {
    const existing: Record<string, ObjectType> = {
      NEW_OBJECT_TYPE: { key: 'NEW_OBJECT_TYPE' } as ObjectType
    };
    const result = getNewObject(existing);
    expect(result.key).toBe('NEW_OBJECT_TYPE_1');
  });
});

describe('getNewDialogueTree', () => {
  it('returns a dialogue tree with a generated key', () => {
    const result = getNewDialogueTree({});
    expect(result.key).toBe('NEW_DIALOGUE_TREE');
  });

  it('avoids key collision', () => {
    const existing: Record<string, DialogueTree> = {
      NEW_DIALOGUE_TREE: { key: 'NEW_DIALOGUE_TREE' } as DialogueTree
    };
    const result = getNewDialogueTree(existing);
    expect(result.key).toBe('NEW_DIALOGUE_TREE_1');
  });
});

describe('getNewDialogue', () => {
  it('returns a dialogue with id 1 and generated key when array is undefined', () => {
    const result = getNewDialogue(undefined);
    expect(result.id).toBe(1);
    expect(result.key).toBe('DIALOGUE');
  });

  it('returns a dialogue with id 1 and generated key when array is empty', () => {
    const result = getNewDialogue([]);
    expect(result.id).toBe(1);
    expect(result.key).toBe('DIALOGUE');
  });

  it('increments id from existing dialogues', () => {
    const existing: Dialogue[] = [
      { id: 1, key: 'DIALOGUE' } as Dialogue,
      { id: 3, key: 'DIALOGUE_1' } as Dialogue
    ];
    const result = getNewDialogue(existing);
    expect(result.id).toBe(4);
  });

  it('generates a unique key', () => {
    const existing: Dialogue[] = [
      { id: 1, key: 'DIALOGUE' } as Dialogue
    ];
    const result = getNewDialogue(existing);
    expect(result.key).toBe('DIALOGUE_1');
  });
});

describe('getNewDialogueResponse', () => {
  it('returns a response with id 1 and generated key when array is undefined', () => {
    const result = getNewDialogueResponse(undefined);
    expect(result.id).toBe(1);
    expect(result.key).toBe('DAILOGUE_RESPONSE');
  });

  it('returns a response with id 1 and generated key when array is empty', () => {
    const result = getNewDialogueResponse([]);
    expect(result.id).toBe(1);
    expect(result.key).toBe('DAILOGUE_RESPONSE');
  });

  it('increments id from existing responses', () => {
    const existing: DialogueResponse[] = [
      { id: 1, key: 'DAILOGUE_RESPONSE' } as DialogueResponse,
      { id: 5, key: 'DAILOGUE_RESPONSE_1' } as DialogueResponse
    ];
    const result = getNewDialogueResponse(existing);
    expect(result.id).toBe(6);
  });

  it('generates a unique key', () => {
    const existing: DialogueResponse[] = [
      { id: 1, key: 'DAILOGUE_RESPONSE' } as DialogueResponse
    ];
    const result = getNewDialogueResponse(existing);
    expect(result.key).toBe('DAILOGUE_RESPONSE_1');
  });
});
