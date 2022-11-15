import Box from '@mui/system/Box';
import { useMemo } from 'react';

import { useAppSelector, useDebounce } from '../../../hooks';
import { selectSearch } from '../../../store/slices/data';
import { selectQuestErrors, selectQuestsSortedWithName } from '../../../store/slices/quests';
import DataViewList from '../DataViewList';

import type { DataViewListItem } from '../DataViewList';

const QuestList = () => {
  const quests = useAppSelector(selectQuestsSortedWithName);

  const errors = useAppSelector(selectQuestErrors);

  const searchTerm = useAppSelector(selectSearch);
  const debouncedSearchTerm = useDebounce(searchTerm?.toLowerCase(), 250);

  const filteredQuests = useMemo(() => {
    if (!debouncedSearchTerm) {
      return quests;
    }
    return quests.filter((quest) => quest.name.replace(/_/g, ' ').toLowerCase().includes(debouncedSearchTerm));
  }, [debouncedSearchTerm, quests]);

  const listItems: DataViewListItem[] = filteredQuests.map((quest) => {
    return {
      dataKey: `${quest.key}`,
      name: quest.name,
      errors: errors[quest.key]
    };
  });

  return (
    <Box sx={{ height: '100%' }}>
      <DataViewList section="quest" items={listItems} />
    </Box>
  );
};

export default QuestList;
