import Box from '@mui/material/Box';

import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system';

export interface FormBoxProps {
  children?: React.ReactNode;
  sx?: SxProps<Theme> | undefined;
}

const FormBox = ({ children, sx = {} }: FormBoxProps) => {
  return (
    <Box display="flex" alignItems="center" sx={{ p: 1, width: '100%', boxSizing: 'border-box', mt: 2, mb: 1, ...sx }}>
      {children}
    </Box>
  );
};

export default FormBox;
