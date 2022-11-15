import Box from '@mui/material/Box';
import MuiCheckbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useMemo } from 'react';

import type { SxProps, Theme } from '@mui/material/styles';

interface CheckboxProps {
  label: string;
  checked: boolean | undefined;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  helperText?: React.ReactNode;
  sx?: SxProps<Theme> | undefined;
  size?: 'small' | 'medium' | undefined;
}

const Checkbox = ({ label, checked, onChange, disabled = false, helperText, sx, size }: CheckboxProps) => {
  const id = useMemo(() => label.toLowerCase().replace(' ', '_'), [label]);

  return (
    <Box sx={sx}>
      <Box>
        <FormControlLabel
          id={id}
          label={label}
          control={
            <MuiCheckbox
              size={size}
              checked={checked ?? false}
              onChange={onChange ? (event) => onChange(event.target.checked) : undefined}
              disabled={disabled}
            />
          }
        />
      </Box>
      {helperText ? <Box>{helperText}</Box> : null}
    </Box>
  );
};

export default Checkbox;
