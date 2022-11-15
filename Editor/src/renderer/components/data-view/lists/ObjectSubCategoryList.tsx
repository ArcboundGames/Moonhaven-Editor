import Box from '@mui/system/Box';
import { useMemo } from 'react';

import { toTitleCaseFromKey } from '../../../../../../SharedLibrary/src/util/string.util';
import { useAppSelector, useDebounce } from '../../../hooks';
import { selectSearch } from '../../../store/slices/data';
import {
  selectObjectSubCategoriesByCategory,
  selectObjectSubCategoryErrors,
  selectSelectedObjectCategory
} from '../../../store/slices/objects';
import DataViewList from '../DataViewList';

import type { DataViewListItem } from '../DataViewList';

const ObjectSubCategoryList = () => {
  const selectedObjectCategory = useAppSelector(selectSelectedObjectCategory);
  const objectSubCategories = useAppSelector(
    useMemo(
      () => selectObjectSubCategoriesByCategory(selectedObjectCategory, { allBehavior: 'include' }),
      [selectedObjectCategory]
    )
  );

  const errors = useAppSelector(selectObjectSubCategoryErrors);

  const searchTerm = useAppSelector(selectSearch);
  const debouncedSearchTerm = useDebounce(searchTerm?.toLowerCase(), 250);

  const filteredSubCategories = useMemo(() => {
    if (!debouncedSearchTerm) {
      return objectSubCategories;
    }
    return objectSubCategories.filter((subCategory) =>
      toTitleCaseFromKey(subCategory.key).toLowerCase().includes(debouncedSearchTerm)
    );
  }, [debouncedSearchTerm, objectSubCategories]);

  const listItems: DataViewListItem[] = filteredSubCategories.map((subCategory) => {
    return {
      dataKey: subCategory.key,
      name: toTitleCaseFromKey(subCategory.key),
      errors: errors[subCategory.key]
    };
  });

  return (
    <Box sx={{ height: '100%' }}>
      <DataViewList section="object-sub-category" items={listItems} search="?tab=0" />
    </Box>
  );
};

export default ObjectSubCategoryList;
