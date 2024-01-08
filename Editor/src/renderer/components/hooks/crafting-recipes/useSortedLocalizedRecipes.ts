import { useAppSelector } from 'renderer/hooks';
import { selectCraftingRecipes } from 'renderer/store/slices/craftingRecipes';
import { isNotEmpty } from '../../../../../../SharedLibrary/src/util/string.util';
import useLocalization from '../useLocalization.hook';

import type { LocalizedCraftingRecipe } from '../../../../../../SharedLibrary/src/interface';

export default function useSortedLocalizedRecipes() {
  const craftingRecipes = useAppSelector(selectCraftingRecipes);

  const { getLocalizedValue, getLocalizationKey } = useLocalization();

  const localizedCraftingRecipes: LocalizedCraftingRecipe[] = craftingRecipes.map((craftingRecipe) => {
    const craftingRecipeName = getLocalizedValue(getLocalizationKey('item', 'name', craftingRecipe.itemTypeKey));

    return {
      ...craftingRecipe,
      name: isNotEmpty(craftingRecipeName) ? craftingRecipeName : craftingRecipe.itemTypeKey ?? craftingRecipe.key
    };
  });
  localizedCraftingRecipes.sort((a, b) => a.name.localeCompare(b.name));

  return localizedCraftingRecipes;
}
