import Box from '@mui/system/Box';
import { useMemo } from 'react';

import { toTitleCaseFromKey } from '../../../../../../SharedLibrary/src/util/string.util';
import { useAppSelector, useDebounce } from '../../../hooks';
import { selectSearch } from '../../../store/slices/data';
import { selectItemCategories, selectItemCategoryErrors } from '../../../store/slices/items';
import DataViewList from '../DataViewList';

import type { DataViewListItem } from '../DataViewList';

const ItemCategoryList = () => {
  const categories = useAppSelector(selectItemCategories);

  const errors = useAppSelector(selectItemCategoryErrors);

  const searchTerm = useAppSelector(selectSearch);
  const debouncedSearchTerm = useDebounce(searchTerm?.toLowerCase(), 250);

  const filteredCategories = useMemo(() => {
    if (!debouncedSearchTerm) {
      return categories;
    }
    return categories.filter((category) =>
      toTitleCaseFromKey(category.key).toLowerCase().includes(debouncedSearchTerm)
    );
  }, [debouncedSearchTerm, categories]);

  const listItems: DataViewListItem[] = filteredCategories.map((category) => {
    return {
      dataKey: category.key,
      name: toTitleCaseFromKey(category.key),
      errors: errors[category.key]
    };
  });

  return (
    <Box
      sx={{
        height: '100%'
      }}
    >
      <DataViewList section="item-category" items={listItems} />
    </Box>
  );
};

export default ItemCategoryList;
