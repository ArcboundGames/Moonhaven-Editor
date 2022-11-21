import InputAdornment from '@mui/material/InputAdornment';
import MuiTextField from '@mui/material/TextField';
import { useEffect, useMemo, useState } from 'react';

import type { InputProps } from '@mui/material/Input';
import type { InputBaseComponentProps } from '@mui/material/InputBase';
import type { SxProps, Theme } from '@mui/material/styles';
import type { TextFieldProps } from '@mui/material/TextField';

export type NumberTextFieldProps = Omit<TextFieldProps, 'label' | 'value' | 'onChange' | 'error'> & {
  label: string;
  value: number | undefined;
  onChange?: (value: number) => void;
  error?: boolean;
  wholeNumber?: boolean;
  sx?: SxProps<Theme> | undefined;
  min?: number;
  max?: number;
  step?: number;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
};

const NumberTextField = ({
  label,
  value,
  onChange,
  required = false,
  error = false,
  disabled = false,
  wholeNumber = false,
  helperText,
  sx,
  min,
  max,
  step,
  startAdornment,
  endAdornment,
  InputLabelProps,
  ...otherProps
}: NumberTextFieldProps) => {
  const id = useMemo(() => label.toLowerCase().replace(' ', '_'), [label]);

  const [internalValue, setInternalValue] = useState<string>('');

  useEffect(() => {
    const internalNumberValue = Number(internalValue);
    if (internalNumberValue === value) {
      return;
    }
    setInternalValue(value !== undefined ? `${value}` : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const inputProps: Partial<InputProps> = useMemo(() => {
    const allInputProps: Partial<InputProps> = {};
    const baseInputProps: InputBaseComponentProps = {};

    if (min !== undefined) {
      baseInputProps.min = min;
    }

    if (max !== undefined) {
      baseInputProps.max = max;
    }

    if (step !== undefined) {
      baseInputProps.step = step;
    }

    if (startAdornment !== undefined) {
      allInputProps.startAdornment = <InputAdornment position="start">{startAdornment}</InputAdornment>;
    }

    if (endAdornment !== undefined) {
      allInputProps.endAdornment = <InputAdornment position="end">{endAdornment}</InputAdornment>;
    }

    allInputProps.inputProps = baseInputProps;
    return allInputProps;
  }, [endAdornment, max, min, startAdornment, step]);

  return (
    <MuiTextField
      id={id}
      label={label}
      variant="outlined"
      type="number"
      value={internalValue}
      onChange={
        onChange
          ? (event) => {
              const stringValue = event.target.value;
              setInternalValue(stringValue);

              const newValue = Number(stringValue);
              if (!Number.isNaN(newValue) && Boolean(stringValue)) {
                onChange(newValue);
              }
            }
          : undefined
      }
      onBlur={(event) => {
        const stringValue = event.target.value;

        const newValue = Number(stringValue);
        if (!Number.isNaN(newValue) && Boolean(stringValue)) {
          setInternalValue(`${newValue}`);
        }
      }}
      required={required}
      InputProps={inputProps}
      fullWidth
      error={Boolean(
        error ||
          (required && value === undefined) ||
          Number.isNaN(value) ||
          (value !== undefined &&
            ((wholeNumber && value % 1 !== 0) ||
              (min !== undefined && value < min) ||
              (max !== undefined && value > max)))
      )}
      disabled={disabled}
      helperText={helperText}
      sx={sx}
      InputLabelProps={{
        shrink: true,
        ...(InputLabelProps ?? {})
      }}
      {...otherProps}
    />
  );
};

export default NumberTextField;
