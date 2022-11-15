import Box from '@mui/system/Box';
import { useMemo } from 'react';

import { toTitleCaseFromKey } from '../../../../../../SharedLibrary/src/util/string.util';
import { useAppSelector, useDebounce } from '../../../hooks';
import { selectSearch } from '../../../store/slices/data';
import { selectFishingZoneErrors, selectFishingZones } from '../../../store/slices/fishing';
import DataViewList from '../DataViewList';

import type { DataViewListItem } from '../DataViewList';

const FishingZoneList = () => {
  const fishingZones = useAppSelector(selectFishingZones);

  const errors = useAppSelector(selectFishingZoneErrors);

  const searchTerm = useAppSelector(selectSearch);
  const debouncedSearchTerm = useDebounce(searchTerm?.toLowerCase(), 250);

  const filteredFishingZones = useMemo(() => {
    if (!debouncedSearchTerm) {
      return fishingZones;
    }
    return fishingZones.filter((fishingZone) =>
      toTitleCaseFromKey(fishingZone.key).replace(/_/g, ' ').toLowerCase().includes(debouncedSearchTerm)
    );
  }, [debouncedSearchTerm, fishingZones]);

  const listItems: DataViewListItem[] = filteredFishingZones.map((fishingZone) => {
    return {
      dataKey: fishingZone.key,
      name: toTitleCaseFromKey(fishingZone.key),
      errors: errors[fishingZone.key]
    };
  });

  return (
    <Box sx={{ height: '100%' }}>
      <DataViewList section="fishing-zone" items={listItems} />
    </Box>
  );
};

export default FishingZoneList;
