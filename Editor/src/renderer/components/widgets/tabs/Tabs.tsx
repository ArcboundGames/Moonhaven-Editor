import Box from '@mui/material/Box';
import MuiTabs from '@mui/material/Tabs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery } from '../../../hooks';
import Tab from './Tab';

import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system';
import type { Section } from '../../../../../../SharedLibrary/src/interface';

export interface TabType<T> {
  label: string;
  disabled?: boolean;
  validate?: (data: T) => string[] | Promise<string[]>;
}

export interface TabsProps<T> {
  data: T | undefined;
  dataKey?: string;
  section: Section;
  children: TabType<T> | TabType<T>[];
  sxRoot?: SxProps<Theme> | undefined;
  sxWrapper?: SxProps<Theme> | undefined;
  sxTabs?: SxProps<Theme> | undefined;
  ariaLabel?: string;
  endAdornment?: React.ReactNode;
  onChange?: (tab: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-constraint
const Tabs = <T extends any = unknown>({
  data,
  dataKey,
  section,
  children,
  ariaLabel,
  sxRoot = {},
  sxWrapper = {},
  sxTabs = {},
  endAdornment,
  onChange
}: TabsProps<T>) => {
  const query = useQuery();
  const navigate = useNavigate();

  const queryTab = Number(query.get('tab') ?? 0);
  const [tab, setTab] = useState(0);
  useEffect(() => {
    if (!Number.isNaN(queryTab) && queryTab !== tab) {
      setTab(queryTab);
      if (onChange) {
        onChange(queryTab);
      }
    }
  }, [onChange, queryTab, tab]);

  const handleTabChange = useCallback(
    (_: React.SyntheticEvent<Element, Event>, newTab: number) => {
      if (tab === newTab || !data) {
        return;
      }
      if (onChange) {
        onChange(newTab);
      }
      if (dataKey) {
        navigate(`/${section}/${dataKey}?tab=${newTab}`);
      } else {
        navigate(`/${section}?tab=${newTab}`);
      }
    },
    [tab, data, onChange, navigate, section, dataKey]
  );

  const tabs = useMemo(() => {
    return !Array.isArray(children) ? [children] : children;
  }, [children]);

  return (
    <Box
      sx={{
        position: 'sticky',
        top: -16,
        background: 'rgb(38, 38, 38)',
        zIndex: 100,
        ml: -1,
        mr: -1,
        pl: 1,
        pr: 1,
        ...sxRoot
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          ...sxWrapper
        }}
      >
        <MuiTabs value={tab} onChange={handleTabChange} aria-label={ariaLabel} sx={sxTabs}>
          {tabs.map((child, index) => (
            <Tab
              key={`tab-${child.label}`}
              label={child.label}
              index={index}
              data={data}
              validate={child.validate}
              disabled={Boolean(child.disabled)}
            />
          ))}
        </MuiTabs>
        {endAdornment}
      </Box>
    </Box>
  );
};

export default Tabs;
