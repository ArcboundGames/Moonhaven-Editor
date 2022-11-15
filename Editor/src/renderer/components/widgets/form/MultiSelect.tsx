import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import MuiSelect from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';

import { toTitleCaseFromKey } from '../../../../../../SharedLibrary/src/util/string.util';

import type { SelectChangeEvent } from '@mui/material/Select';
import type { SxProps, Theme } from '@mui/material/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

function getStyles(value: string, values: readonly string[], theme: Theme) {
  return {
    fontWeight: values.indexOf(value) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
  };
}

interface MultiSelectProps {
  label: string;
  values: string[] | undefined;
  options: {
    label: string;
    value: string;
    emphasize?: boolean;
  }[];
  onChange?: (values: string[]) => void;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
  helperText?: React.ReactNode;
  sx?: SxProps<Theme> | undefined;
}

const MultiSelect = ({
  label,
  values,
  options,
  onChange,
  required = false,
  error = false,
  disabled = false,
  helperText,
  sx
}: MultiSelectProps) => {
  const theme = useTheme();

  const id = useMemo(() => label.toLowerCase().replace(' ', '_'), [label]);
  const labelId = useMemo(() => `${id}-label`, [id]);
  const inputId = useMemo(() => `${id}-input`, [id]);
  const optionValues = useMemo(() => options.map((option) => option.value), [options]);
  const allValuesValid = useMemo(
    () => Boolean(values?.reduce((valid, value) => valid && optionValues.includes(value), true)),
    [values, optionValues]
  );

  return (
    <FormControl
      fullWidth
      error={Boolean(
        error || (required && (!values || values.length === 0)) || (values && values.length > 0 && !allValuesValid)
      )}
      disabled={disabled}
      required={required}
      sx={sx}
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <MuiSelect
        labelId={labelId}
        id={id}
        multiple
        value={values ?? []}
        onChange={
          onChange
            ? ({ target: { value } }: SelectChangeEvent<string[]>) => {
                onChange(typeof value === 'string' ? value.split(',') : value);
              }
            : undefined
        }
        input={<OutlinedInput id={inputId} label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {selected.map((value) => (
              <Chip key={value} label={toTitleCaseFromKey(value)} sx={{ m: '2px' }} />
            ))}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
              width: 250
            }
          }
        }}
      >
        {values?.map((value) =>
          !optionValues.includes(value) ? (
            <MenuItem key={value} value={value}>
              <em>{toTitleCaseFromKey(value)}</em>
            </MenuItem>
          ) : null
        )}
        {options?.map((option) => (
          <MenuItem key={option.label} value={option.value} style={getStyles(option.value, optionValues, theme)}>
            {option.emphasize === true ? <em>{option.label}</em> : option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText ? <Box>{helperText}</Box> : null}
    </FormControl>
  );
};

export default MultiSelect;
