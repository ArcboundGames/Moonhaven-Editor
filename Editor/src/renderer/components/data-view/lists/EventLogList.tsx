import Box from '@mui/system/Box';
import { useMemo } from 'react';

import { toTitleCaseFromKey } from '../../../../../../SharedLibrary/src/util/string.util';
import { useAppSelector, useDebounce } from '../../../hooks';
import { selectSearch } from '../../../store/slices/data';
import { selectEventLogErrors, selectEventLogs } from '../../../store/slices/eventLogs';
import DataViewList from '../DataViewList';

import type { DataViewListItem } from '../DataViewList';

const EventLogList = () => {
  const eventLogs = useAppSelector(selectEventLogs);

  const errors = useAppSelector(selectEventLogErrors);

  const searchTerm = useAppSelector(selectSearch);
  const debouncedSearchTerm = useDebounce(searchTerm?.toLowerCase(), 250);

  const filteredEventLogs = useMemo(() => {
    if (!debouncedSearchTerm) {
      return eventLogs;
    }
    return eventLogs.filter((eventLog) =>
      toTitleCaseFromKey(eventLog.key).replace(/_/g, ' ').toLowerCase().includes(debouncedSearchTerm)
    );
  }, [debouncedSearchTerm, eventLogs]);

  const listItems: DataViewListItem[] = filteredEventLogs.map((eventLog) => {
    return {
      dataKey: eventLog.key,
      name: toTitleCaseFromKey(eventLog.key),
      errors: errors[eventLog.key]
    };
  });

  return (
    <Box sx={{ height: '100%' }}>
      <DataViewList section="event-log" items={listItems} />
    </Box>
  );
};

export default EventLogList;
