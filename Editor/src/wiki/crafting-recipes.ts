import { isNotNullish, isNullish } from '../../../SharedLibrary/src/util/null.util';
import { toTitleCaseFromKey } from '../../../SharedLibrary/src/util/string.util';
import { getCraftingRecipes, getItems } from './file';

import type { CraftingRecipe, Localization } from '../../../SharedLibrary/src/interface';

export default function buildCraftingPage(localization: Localization, localizationKeys: string[]): string {
  const { craftingRecipes, craftingRecipeCategories } = getCraftingRecipes(localization, localizationKeys);
  const { itemsByKey } = getItems(localization, localizationKeys);

  const recipesByCategory = craftingRecipes.reduce((record, recipe) => {
    if (isNullish(recipe.categoryKey)) {
      return record;
    }

    if (!(recipe.categoryKey in record)) {
      record[recipe.categoryKey] = [];
    }
    record[recipe.categoryKey].push(recipe);
    return record;
  }, {} as Record<string, CraftingRecipe[]>);

  const finalOutput = craftingRecipeCategories.reduce(
    (output, category) => {
      let tempOutput = output;
      tempOutput += `===${toTitleCaseFromKey(category.key)}===
{|class="wikitable sortable roundedborder"
!Image
!Name
!Description
!Ingredients
!Recipe Source
!Sell Price\n`;

      recipesByCategory[category.key]?.forEach((recipe) => {
        const item = itemsByKey[recipe.itemTypeKey ?? ''];
        if (isNullish(item)) {
          return;
        }

        tempOutput += `|-
|[[File:${item.name}.png|center]]
|[[${item.name}]]
|{{Description|${item.name}}}\n|`;

        if (isNotNullish(recipe.ingredients)) {
          const tempIngredients = recipe.ingredients;
          const ingredientKeys = Object.keys(recipe.ingredients).sort();
          tempOutput += ingredientKeys.reduce((ingredients, ingredient) => {
            const ingredientItem = itemsByKey[ingredient];
            if (isNullish(ingredientItem)) {
              return ingredients;
            }

            return `${ingredients}{{name|${ingredientItem.name}|${tempIngredients[ingredient]}}}`;
          }, '');
        }

        tempOutput += `\n|class="no-wrap"|Starter
|{{price|${item.sellPrice}}}\n`;
      });

      tempOutput += `|}\n\n`;

      return tempOutput;
    },
    `'''Crafting''' is the activity of creating a new item as specified by a crafting recipe. Each recipe lists a set of ingredient items that are consumed in each crafting action.

The '''Crafting view''' can be accessed by opening the inventory or the appropriate workstation (using {{key|E}}}.

Clicking on a recipe will show the materials that you will need.

To craft an item, click on the Craft button once you have all the required ingredients. The newly crafted item will appear in the player's inventory.

`
  );

  return finalOutput;
}
