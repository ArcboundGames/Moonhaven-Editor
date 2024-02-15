import Box from '@mui/system/Box';
import { useMemo } from 'react';

import { toTitleCaseFromKey } from '../../../../../../SharedLibrary/src/util/string.util';
import { useAppSelector, useDebounce } from '../../../hooks';
import { selectSearch } from '../../../store/slices/data';
import { selectWorldZoneErrors, selectWorldZones } from '../../../store/slices/worldZones';
import DataViewList from '../DataViewList';

import type { DataViewListItem } from '../DataViewList';

const WorldZoneList = () => {
  const worldZones = useAppSelector(selectWorldZones);

  const errors = useAppSelector(selectWorldZoneErrors);

  const searchTerm = useAppSelector(selectSearch);
  const debouncedSearchTerm = useDebounce(searchTerm?.toLowerCase(), 250);

  const filteredWorldZones = useMemo(() => {
    if (!debouncedSearchTerm) {
      return worldZones;
    }
    return worldZones.filter((worldZone) =>
      toTitleCaseFromKey(worldZone.key).replace(/_/g, ' ').toLowerCase().includes(debouncedSearchTerm)
    );
  }, [debouncedSearchTerm, worldZones]);

  const listItems: DataViewListItem[] = filteredWorldZones.map((worldZone) => {
    return {
      dataKey: worldZone.key,
      name: toTitleCaseFromKey(worldZone.key),
      errors: errors[worldZone.key]
    };
  });

  return (
    <Box sx={{ height: '100%' }}>
      <DataViewList section="world-zone" items={listItems} />
    </Box>
  );
};

export default WorldZoneList;
