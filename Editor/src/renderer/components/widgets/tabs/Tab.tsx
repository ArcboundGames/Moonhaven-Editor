/* eslint-disable @typescript-eslint/no-explicit-any */
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Box from '@mui/material/Box';
import MuiTab from '@mui/material/Tab';
import { useEffect, useState } from 'react';

import { a11yProps } from '../TabPanel';

import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system';

export interface TabProps<T> {
  label: React.ReactNode;
  index: number;
  data: T | undefined;
  validate?: (data: T) => string[] | Promise<string[]>;
  sx?: SxProps<Theme> | undefined;

  // Tab pass through props
  indicator?: unknown;
  selected?: boolean;
  selectionFollowsFocus?: unknown;
  onChange?: any;
  textColor?: unknown;
  value?: unknown;
  tabIndex?: number;

  disabled: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
const Tab = <T extends any = unknown>({
  label,
  index,
  data,
  validate,
  disabled,
  sx = {},
  ...otherProps
}: TabProps<T>) => {
  const [errors, setErrors] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    if (!data || !validate) {
      return;
    }

    let alive = true;

    const validateFn = async () => {
      const newErrors = await validate(data);

      if (alive) {
        setErrors(newErrors);
      }
    };

    validateFn();

    return () => {
      alive = false;
    };
  }, [data, validate]);

  return (
    <MuiTab
      label={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box>{label}</Box>
          {errors && errors.length > 0 ? (
            <ReportProblemIcon color="error" sx={{ ml: 1 }} titleAccess={errors.join(', ')} />
          ) : null}
        </Box>
      }
      sx={sx}
      disabled={disabled}
      {...otherProps}
      {...a11yProps(index)}
    />
  );
};

export default Tab;
