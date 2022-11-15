import Box from '@mui/system/Box';
import { useMemo } from 'react';

import { toTitleCaseFromKey } from '../../../../../../SharedLibrary/src/util/string.util';
import { useAppSelector, useDebounce } from '../../../hooks';
import { selectSearch } from '../../../store/slices/data';
import { selectLootTableErrors, selectLootTables } from '../../../store/slices/lootTables';
import DataViewList from '../DataViewList';

import type { DataViewListItem } from '../DataViewList';

const LootTableList = () => {
  const lootTables = useAppSelector(selectLootTables);

  const errors = useAppSelector(selectLootTableErrors);

  const searchTerm = useAppSelector(selectSearch);
  const debouncedSearchTerm = useDebounce(searchTerm?.toLowerCase(), 250);

  const filteredLootTables = useMemo(() => {
    if (!debouncedSearchTerm) {
      return lootTables;
    }
    return lootTables.filter((lootTable) =>
      lootTable.key.replace(/_/g, ' ').toLowerCase().includes(debouncedSearchTerm)
    );
  }, [debouncedSearchTerm, lootTables]);

  const listItems: DataViewListItem[] = filteredLootTables.map((lootTable) => {
    return {
      dataKey: lootTable.key,
      name: toTitleCaseFromKey(lootTable.key),
      errors: errors[lootTable.key]
    };
  });

  return (
    <Box sx={{ height: '100%' }}>
      <DataViewList section="loot-table" items={listItems} />
    </Box>
  );
};

export default LootTableList;
