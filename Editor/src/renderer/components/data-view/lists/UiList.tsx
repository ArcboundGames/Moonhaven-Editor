import Box from '@mui/system/Box';
import { useMemo } from 'react';

import { toTitleCaseFromVariableName } from '../../../../../../SharedLibrary/src/util/string.util';
import { useAppSelector, useDebounce } from '../../../hooks';
import { selectSearch } from '../../../store/slices/data';
import { selectUiErrors, selectUiSectionKeys } from '../../../store/slices/ui';
import DataViewList from '../DataViewList';

import type { DataViewListItem } from '../DataViewList';

const UiList = () => {
  const uiSections = useAppSelector(selectUiSectionKeys);

  const mappedUiSections = useMemo(
    () =>
      uiSections.map((key) => ({
        key,
        name: toTitleCaseFromVariableName(key)
      })),
    [uiSections]
  );

  const errors = useAppSelector(selectUiErrors);

  const searchTerm = useAppSelector(selectSearch);
  const debouncedSearchTerm = useDebounce(searchTerm?.toLowerCase(), 250);

  const filteredUiSections = useMemo(() => {
    if (!debouncedSearchTerm) {
      return mappedUiSections;
    }
    return mappedUiSections.filter((uiSection) => uiSection.name.toLowerCase().includes(debouncedSearchTerm));
  }, [debouncedSearchTerm, mappedUiSections]);

  const listItems: DataViewListItem[] = filteredUiSections.map((uiSection) => {
    return {
      dataKey: uiSection.key,
      name: uiSection.name,
      errors: errors[uiSection.key as keyof typeof errors]
    };
  });

  return (
    <Box sx={{ height: '100%' }}>
      <DataViewList section="ui" items={listItems} />
    </Box>
  );
};

export default UiList;
