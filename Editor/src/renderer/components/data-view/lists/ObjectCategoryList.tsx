import Box from '@mui/system/Box';
import { useMemo } from 'react';

import { toTitleCaseFromKey } from '../../../../../../SharedLibrary/src/util/string.util';
import { useAppSelector, useDebounce } from '../../../hooks';
import { selectSearch } from '../../../store/slices/data';
import { selectObjectCategories, selectObjectCategoryErrors } from '../../../store/slices/objects';
import DataViewList from '../DataViewList';

import type { DataViewListItem } from '../DataViewList';

const ObjectCategoryList = () => {
  const objectCategories = useAppSelector(selectObjectCategories);

  const errors = useAppSelector(selectObjectCategoryErrors);

  const searchTerm = useAppSelector(selectSearch);
  const debouncedSearchTerm = useDebounce(searchTerm?.toLowerCase(), 250);

  const filteredObjectCategoriess = useMemo(() => {
    if (!debouncedSearchTerm) {
      return objectCategories;
    }
    return objectCategories.filter((objectCategory) =>
      toTitleCaseFromKey(objectCategory.key).toLowerCase().includes(debouncedSearchTerm)
    );
  }, [debouncedSearchTerm, objectCategories]);

  const listItems: DataViewListItem[] = filteredObjectCategoriess.map((category) => {
    return {
      dataKey: category.key,
      name: toTitleCaseFromKey(category.key),
      errors: errors[category.key]
    };
  });

  return (
    <Box sx={{ height: '100%' }}>
      <DataViewList section="object-category" items={listItems} search="?tab=0" />
    </Box>
  );
};

export default ObjectCategoryList;
