import useSortedLocalizedRecipes from './useSortedLocalizedRecipes';

import type { LocalizedCraftingRecipe } from '../../../../../../SharedLibrary/src/interface';

export default function useLocalizedRecipesByItemType(itemTypeKey: string | undefined) {
  const localizedCraftingRecipes = useSortedLocalizedRecipes();

  const localizedCraftingRecipesByItemTypeKey: Record<string, LocalizedCraftingRecipe[]> = {};
  localizedCraftingRecipes.forEach((craftingRecipe) => {
    if (!craftingRecipe.itemTypeKey) {
      return;
    }

    if (!(craftingRecipe.itemTypeKey in localizedCraftingRecipesByItemTypeKey)) {
      localizedCraftingRecipesByItemTypeKey[craftingRecipe.itemTypeKey] = [];
    }

    localizedCraftingRecipesByItemTypeKey[craftingRecipe.itemTypeKey].push(craftingRecipe);
  });

  if (!itemTypeKey || !(itemTypeKey in localizedCraftingRecipesByItemTypeKey)) {
    return [];
  }

  return localizedCraftingRecipesByItemTypeKey[itemTypeKey] ?? [];
}
