import Box from '@mui/system/Box';
import { useMemo } from 'react';

import { toTitleCaseFromKey } from '../../../../../../SharedLibrary/src/util/string.util';
import { useAppSelector, useDebounce } from '../../../hooks';
import {
  selectCraftingRecipeCategories,
  selectCraftingRecipeCategoryErrors
} from '../../../store/slices/craftingRecipes';
import { selectSearch } from '../../../store/slices/data';
import DataViewList from '../DataViewList';

import type { DataViewListItem } from '../DataViewList';

const CraftingRecipeCategoryList = () => {
  const craftingRecipeCategories = useAppSelector(selectCraftingRecipeCategories);

  const errors = useAppSelector(selectCraftingRecipeCategoryErrors);

  const searchTerm = useAppSelector(selectSearch);
  const debouncedSearchTerm = useDebounce(searchTerm?.toLowerCase(), 250);

  const filteredCraftingRecipeCategories = useMemo(() => {
    if (!debouncedSearchTerm) {
      return craftingRecipeCategories;
    }
    return craftingRecipeCategories.filter((category) =>
      toTitleCaseFromKey(category.key).toLowerCase().includes(debouncedSearchTerm)
    );
  }, [debouncedSearchTerm, craftingRecipeCategories]);

  const listItems: DataViewListItem[] = filteredCraftingRecipeCategories.map((category) => {
    return {
      dataKey: category.key,
      name: toTitleCaseFromKey(category.key),
      errors: errors[category.key]
    };
  });

  return (
    <Box sx={{ height: '100%' }}>
      <DataViewList section="crafting-recipe-category" items={listItems} />
    </Box>
  );
};

export default CraftingRecipeCategoryList;
