import Box from '@mui/material/Box';

import {
  TIME_COMPARATOR_AFTER,
  TIME_COMPARATOR_BEFORE,
  TIME_COMPARATOR_BETWEEN
} from '../../../../../SharedLibrary/src/constants';
import { formatTimeOfDay } from '../../../../../SharedLibrary/src/util/time.util';

import type { SxProps, Theme } from '@mui/material/styles';
import type { TimeComparator } from '../../../../../SharedLibrary/src/interface';

export interface TimesBoxProps {
  times?: number[];
  timesComparator?: TimeComparator;
  sx?: SxProps<Theme> | undefined;
}

const TimesBox = ({ times, timesComparator, sx = {} }: TimesBoxProps) => {
  if (!times || !timesComparator) {
    return null;
  }

  let text;
  // eslint-disable-next-line default-case
  switch (timesComparator) {
    case TIME_COMPARATOR_BEFORE:
      if (times.length === 1) {
        text = `Before ${formatTimeOfDay(times[0])}`;
      }
      break;
    case TIME_COMPARATOR_AFTER:
      if (times.length === 1) {
        text = `After ${formatTimeOfDay(times[0])}`;
      }
      break;
    case TIME_COMPARATOR_BETWEEN:
      if (times.length === 2) {
        text = `Between ${formatTimeOfDay(times[0])} and ${formatTimeOfDay(times[1])}`;
      }
      break;
  }

  return text ? (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx
      }}
    >
      {text}
    </Box>
  ) : null;
};

export default TimesBox;
