import Box from '@mui/material/Box';

export function a11yProps(index: number) {
  return {
    id: `object-type-view-tab-${index}`,
    'aria-controls': `object-type-view-tabpanel-${index}`
  };
}

interface TabPanelProps {
  children: JSX.Element;
  value: number;
  index: number;
}

export default function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`object-type-view-tabpanel-${index}`}
      aria-labelledby={`object-type-view-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}
