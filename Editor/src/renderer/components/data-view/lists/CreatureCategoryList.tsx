import Box from '@mui/system/Box';
import { useMemo } from 'react';

import { toTitleCaseFromKey } from '../../../../../../SharedLibrary/src/util/string.util';
import { useAppSelector, useDebounce } from '../../../hooks';
import { selectCreatureCategories, selectCreatureCategoryErrors } from '../../../store/slices/creatures';
import { selectSearch } from '../../../store/slices/data';
import DataViewList from '../DataViewList';

import type { DataViewListItem } from '../DataViewList';

const CreatureCategoryList = () => {
  const categories = useAppSelector(selectCreatureCategories);

  const errors = useAppSelector(selectCreatureCategoryErrors);

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

  const listCreatures: DataViewListItem[] = filteredCategories.map((category) => {
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
      <DataViewList section="creature-category" items={listCreatures} />
    </Box>
  );
};

export default CreatureCategoryList;
