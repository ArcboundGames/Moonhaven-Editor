import Box from '@mui/material/Box';
import { useCallback } from 'react';

import {
  DAYS_IN_A_WEEK,
  DAYS_OF_THE_WEEK,
  FIVE_PM,
  NINE_AM
} from '../../../../../../../../../SharedLibrary/src/constants';
import Checkbox from '../../../../../widgets/form/Checkbox';
import Card from '../../../../../widgets/layout/Card';
import FormBox from '../../../../../widgets/layout/FormBox';
import TimeInput from '../../../../../widgets/TimeInput';

import type { CreatureShop } from '../../../../../../../../../SharedLibrary/src/interface';

export interface ShopTimesCardProps {
  openTimes: number[];
  closeTimes: number[];
  disabled?: boolean;
  onChange: (changes: Partial<CreatureShop>) => void;
}

const ShopTimesCard = ({ openTimes, closeTimes, disabled = true, onChange }: ShopTimesCardProps) => {
  const updateTimes = useCallback(
    (day: number, openTime: number, closeTime: number) => {
      const newOpenTimes = [...openTimes];
      newOpenTimes[day] = openTime;

      const newCloseTimes = [...closeTimes];
      newCloseTimes[day] = closeTime;

      onChange({ openTimes: newOpenTimes, closeTimes: newCloseTimes });
    },
    [closeTimes, onChange, openTimes]
  );

  return (
    <Card header="Times">
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      {[...Array(DAYS_IN_A_WEEK)].map((_, day) => {
        return (
          <Box
            key={`shop-time-${day}`}
            sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', alignItems: 'center' }}
          >
            <FormBox>
              <Checkbox
                label={DAYS_OF_THE_WEEK[day].name}
                checked={(openTimes[day] !== -1 || closeTimes[day] !== -1) ?? false}
                onChange={(value) => {
                  if (value) {
                    updateTimes(day, NINE_AM, FIVE_PM);
                  } else {
                    updateTimes(day, -1, -1);
                  }
                }}
                disabled={disabled}
              />
            </FormBox>
            <TimeInput
              label="Open Time"
              value={openTimes[day]}
              onChange={(openTime) => updateTimes(day, openTime, closeTimes[day])}
            />
            <TimeInput
              label="Close Time"
              value={closeTimes[day]}
              onChange={(closeTime) => updateTimes(day, openTimes[day], closeTime)}
            />
          </Box>
        );
      })}
    </Card>
  );
};

export default ShopTimesCard;
