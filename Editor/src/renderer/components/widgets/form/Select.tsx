import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import MuiSelect from '@mui/material/Select';
import { useCallback, useMemo } from 'react';

import { isEmpty, toTitleCaseFromKey } from '../../../../../../SharedLibrary/src/util/string.util';

import type { SelectChangeEvent } from '@mui/material/Select';
import type { SxProps, Theme } from '@mui/material/styles';

export interface NotRequiredSelectProps<T> extends BaseSelectProps<T> {
  onChange?: (value: T | undefined) => void;
  required?: false;
}

export interface RequiredSelectProps<T> extends BaseSelectProps<T> {
  onChange?: (value: T) => void;
  required: true;
}

interface BaseSelectProps<T> {
  label: string;
  value: T | undefined;
  options: {
    label: string;
    value: T | undefined;
    emphasize?: boolean;
  }[];
  error?: boolean;
  disabled?: boolean;
  helperText?: React.ReactNode;
  sx?: SxProps<Theme> | undefined;
}

type SelectProps<T> = RequiredSelectProps<T> | NotRequiredSelectProps<T>;

function isRequired<T>(props: SelectProps<T>): props is RequiredSelectProps<T> {
  return Boolean(props.required);
}

const Select = <T extends string | number>(props: SelectProps<T>) => {
  const { label, value, options, required = false, error = false, disabled = false, helperText, sx } = props;

  const id = useMemo(() => label.toLowerCase().replace(' ', '_'), [label]);
  const labelId = useMemo(() => `${id}-label`, [id]);
  const valueInOptions = useMemo(() => Boolean(options.find((option) => option.value === value)), [options, value]);

  const handleOnChange = useCallback(
    (event: SelectChangeEvent<string | number>) => {
      if (!props.onChange) {
        return;
      }

      const value = event.target.value;
      if (typeof value === 'string' && isEmpty(value)) {
        if (!isRequired(props)) {
          props.onChange(undefined);
        }
        return;
      }

      props.onChange(value as T);
    },
    [props]
  );

  return (
    <FormControl
      fullWidth
      disabled={disabled || options.length === 0}
      error={Boolean(error || (required && !value) || (value && !valueInOptions))}
      required={required}
      sx={sx}
    >
      <InputLabel id={labelId} shrink>
        {label}
      </InputLabel>
      <MuiSelect
        labelId={labelId}
        id={id}
        value={value ?? ''}
        label={label}
        onChange={handleOnChange}
        displayEmpty
        notched
      >
        {!required ? (
          <MenuItem key="NONE" value="">
            <em>None</em>
          </MenuItem>
        ) : null}
        {value && !valueInOptions ? (
          <MenuItem key={value} value={value}>
            <em>{typeof value === 'string' ? toTitleCaseFromKey(value) : value}</em>
          </MenuItem>
        ) : null}
        {options?.map((option) => (
          <MenuItem key={option.label} value={option.value}>
            {option.emphasize === true ? <em>{option.label}</em> : option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText ? <Box>{helperText}</Box> : null}
    </FormControl>
  );
};

export default Select;
