import Box from '@mui/material/Box';

import type { SxProps } from '@mui/system';
import type { ReactNode } from 'react';

export function a11yProps(index: number) {
  return {
    id: `object-type-view-tab-${index}`,
    'aria-controls': `object-type-view-tabpanel-${index}`
  };
}

interface TabPanelProps {
  children: ReactNode;
  value: number;
  index: number;
  sx?: SxProps;
}

export default function TabPanel({ children, value, index, sx }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`object-type-view-tabpanel-${index}`}
      aria-labelledby={`object-type-view-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 1, ...sx }}>{children}</Box>}
    </div>
  );
}
