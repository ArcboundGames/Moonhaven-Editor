import Box from '@mui/material/Box';

import NumberTextField from '../../../../widgets/form/NumberTextField';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';
import ItemsListCard from '../widgets/ItemsListCard';

import type { Quest } from '../../../../../../../../SharedLibrary/src/interface';

export interface QuestRewardsTabProps {
  data: Quest;
  disabled: boolean;
  handleOnChange: (input: Partial<Quest>) => void;
}

const QuestRewardsTab = ({ data, disabled, handleOnChange }: QuestRewardsTabProps) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 3fr' }}>
      <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
        <Card header="Experience">
          <FormBox>
            <NumberTextField
              label="Experience"
              value={data.experienceReward}
              onChange={(value) =>
                handleOnChange({
                  experienceReward: value
                })
              }
              required
              min={1}
              disabled={disabled}
              wholeNumber
            />
          </FormBox>
        </Card>
      </Box>
      <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
        <ItemsListCard
          data={data.itemRewards}
          label="Item Reward"
          pluralLabel="Item Rewards"
          disabled={disabled}
          onChange={(itemRewards) => handleOnChange({ itemRewards })}
        />
      </Box>
    </Box>
  );
};

export default QuestRewardsTab;
