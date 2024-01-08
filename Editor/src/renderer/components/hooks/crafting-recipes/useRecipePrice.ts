import type { CraftingRecipe, ItemType } from '../../../../../../SharedLibrary/src/interface';

const SUGGESTED_PRICE_MARKUP = 1.1;

export default function useRecipePrice(recipes: CraftingRecipe[], itemsByKey: Record<string, ItemType>) {
  let largestPrice = 0;

  for (const recipe of recipes) {
    if (!recipe.ingredients) {
      continue;
    }

    let price = 0;

    for (const ingredientKey in recipe.ingredients) {
      if (!(ingredientKey in itemsByKey)) {
        continue;
      }

      const amount = recipe.ingredients[ingredientKey];
      const itemPrice = itemsByKey[ingredientKey].sellPrice;

      price += itemPrice * amount;
    }

    if (recipe.hiddenResultsTypeKeys) {
      for (const hiddenResultsTypeKey of recipe.hiddenResultsTypeKeys) {
        const itemPrice = itemsByKey[hiddenResultsTypeKey].sellPrice;

        price -= itemPrice;
      }
    }

    price /= recipe.amount || 1;

    if (price > largestPrice) {
      largestPrice = price;
    }
  }

  return Math.round(Math.max(largestPrice * SUGGESTED_PRICE_MARKUP, 1));
}
