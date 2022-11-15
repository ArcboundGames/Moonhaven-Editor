import Box from '@mui/system/Box';
import { useMemo } from 'react';

import { useAppSelector, useDebounce } from '../../../hooks';
import {
  selectCraftingRecipeErrors,
  selectCraftingRecipesByCategory,
  selectSelectedCraftingRecipeCategory
} from '../../../store/slices/craftingRecipes';
import { selectSearch } from '../../../store/slices/data';
import { selectItemTypesByKeyWithName } from '../../../store/slices/items';
import DataViewList from '../DataViewList';

import type { DataViewListItem } from '../DataViewList';

const CraftingRecipeList = () => {
  const selectedCraftingRecipeCategory = useAppSelector(selectSelectedCraftingRecipeCategory);
  const craftingRecipes = useAppSelector(
    useMemo(() => selectCraftingRecipesByCategory(selectedCraftingRecipeCategory), [selectedCraftingRecipeCategory])
  );

  const itemsByKey = useAppSelector(selectItemTypesByKeyWithName);

  const errors = useAppSelector(selectCraftingRecipeErrors);

  const searchTerm = useAppSelector(selectSearch);
  const debouncedSearchTerm = useDebounce(searchTerm?.toLowerCase(), 250);

  const recipeNamesByKey = useMemo(() => {
    return craftingRecipes.reduce((namesByKey, recipe) => {
      let name = 'Unknown Crafting Recipe';
      if (recipe.itemTypeKey) {
        name = itemsByKey[recipe.itemTypeKey]?.name ?? recipe.itemTypeKey;
      }
      namesByKey[recipe.key] = name;
      return namesByKey;
    }, {} as Record<string, string>);
  }, [craftingRecipes, itemsByKey]);

  const filteredCraftingRecipes = useMemo(() => {
    if (!debouncedSearchTerm) {
      return craftingRecipes;
    }
    return craftingRecipes.filter((craftingRecipe) => {
      return recipeNamesByKey[craftingRecipe.key].toLowerCase().includes(debouncedSearchTerm);
    });
  }, [debouncedSearchTerm, craftingRecipes, recipeNamesByKey]);

  const listItems: DataViewListItem[] = filteredCraftingRecipes.map((recipe) => {
    return {
      dataKey: recipe.key,
      name: recipeNamesByKey[recipe.key],
      errors: errors[recipe.key],
      sprite: {
        key: recipe.itemTypeKey,
        section: 'item',
        width: 16,
        height: 16,
        default: 0
      }
    };
  });

  return (
    <Box
      sx={{
        height: '100%'
      }}
    >
      <DataViewList section="crafting-recipe" items={listItems} />
    </Box>
  );
};

export default CraftingRecipeList;
