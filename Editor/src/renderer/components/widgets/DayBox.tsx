import Box from '@mui/material/Box';

import { DAYS_OF_THE_WEEK } from '../../../../../SharedLibrary/src/constants';

import type { SxProps, Theme } from '@mui/material/styles';

export interface DayBoxProps {
  day: number;
  active: boolean;
  sx?: SxProps<Theme> | undefined;
}

const DayBox = ({ day, active, sx = {} }: DayBoxProps) => {
  const dayOfTheWeek = DAYS_OF_THE_WEEK[day];
  return dayOfTheWeek ? (
    <Box
      title={dayOfTheWeek.name}
      sx={{
        display: 'flex',
        height: '32px',
        alignItems: 'center',
        justifyContent: 'center',
        background: active ? '#646464' : 'transparent',
        color: active ? 'white' : '#343434',
        pl: 0.75,
        pr: 0.75,
        ml: 0.5,
        mr: 0.5,
        borderRadius: '4px',
        ...sx
      }}
    >
      {dayOfTheWeek.abbreviation}
    </Box>
  ) : null;
};

export default DayBox;
