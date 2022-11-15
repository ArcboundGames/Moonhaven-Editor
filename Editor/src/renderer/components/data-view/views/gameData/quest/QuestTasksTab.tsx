import Box from '@mui/material/Box';

import QuestTaskCards from './widgets/QuestTaskCards';

import type { Quest } from '../../../../../../../../SharedLibrary/src/interface';

export interface QuestTasksTabProps {
  data: Quest;
  disabled: boolean;
  handleOnChange: (input: Partial<Quest>) => void;
}

const QuestTasksTab = ({ data, disabled, handleOnChange }: QuestTasksTabProps) => {
  return (
    <Box>
      <QuestTaskCards tasks={data.tasks} disabled={disabled} onChange={(tasks) => handleOnChange({ tasks })} />
    </Box>
  );
};

export default QuestTasksTab;
