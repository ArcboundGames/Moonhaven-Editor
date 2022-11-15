import Box from '@mui/system/Box';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { useAppSelector, useDebounce } from '../../../hooks';
import { selectSearch } from '../../../store/slices/data';
import {
  selectLocalizationKeysErrors,
  selectLocalizations,
  selectLocalizationsErrors
} from '../../../store/slices/localizations';
import DataViewList from '../DataViewList';

import type { DataViewListItem } from '../DataViewList';

const LocalizationList = () => {
  const location = useLocation();
  const localizations = useAppSelector(selectLocalizations);

  const localizationKeysErrors = useAppSelector(selectLocalizationKeysErrors);
  const errors = useAppSelector(selectLocalizationsErrors);

  const searchTerm = useAppSelector(selectSearch);
  const debouncedSearchTerm = useDebounce(searchTerm?.toLowerCase(), 250);

  const filteredLocalizations = useMemo(() => {
    if (!debouncedSearchTerm) {
      return localizations;
    }

    return localizations.filter(
      (localization) =>
        location.pathname === `/localization/${localization.key}` ||
        localization.name.replace(/_/g, ' ').toLowerCase().includes(debouncedSearchTerm)
    );
  }, [debouncedSearchTerm, localizations, location.pathname]);

  const keysErrors = useMemo(
    () =>
      Object.keys(localizationKeysErrors).reduce((array, key) => {
        array.push(...localizationKeysErrors[key]);
        return array;
      }, [] as string[]),
    [localizationKeysErrors]
  );

  const listItems: DataViewListItem[] = useMemo(
    () => [
      {
        dataKey: 'main',
        name: 'Main',
        errors: keysErrors,
        pinned: true
      },
      ...filteredLocalizations.map((localization) => ({
        dataKey: `${localization.key}`,
        name: localization.name,
        errors: errors[localization.key]
      }))
    ],
    [errors, filteredLocalizations, keysErrors]
  );

  return (
    <Box sx={{ height: '100%' }}>
      <DataViewList section="localization" items={listItems} />
    </Box>
  );
};

export default LocalizationList;
