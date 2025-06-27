import MuiTextField from '@mui/material/TextField';
import { useCallback, useMemo, useState } from 'react';

import { isNotEmpty } from '../../../../../../SharedLibrary/src/util/string.util';

import type { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';

export type TextFieldProps = Omit<
  MuiTextFieldProps,
  'label' | 'value' | 'defaultValue' | 'onChange' | 'error' | 'type'
> & {
  label?: string;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: (value: string) => void;
  error?: boolean;
  multiline?: boolean;
};

const TextField = (props: TextFieldProps) => {
  const { onChange, error, ...otherProps } = props;
  const id = useMemo(() => otherProps.label?.toLowerCase().replace(' ', '_'), [otherProps.label]);

  const [isEmpty, setIsEmpty] = useState(
    !otherProps.value &&
      !isNotEmpty(otherProps.value) &&
      !otherProps.defaultValue &&
      !isNotEmpty(otherProps.defaultValue)
  );

  if ('value' in otherProps || !('defaultValue' in otherProps)) {
    otherProps.value = otherProps.value ?? '';
  }

  const handleOnChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback(
    (event) => {
      const { value } = event.target;
      setIsEmpty(!isNotEmpty(value));

      if (onChange) {
        onChange(value);
      }
    },
    [onChange]
  );

  return (
    <MuiTextField
      id={id}
      variant="outlined"
      onChange={handleOnChange}
      fullWidth
      error={error || (otherProps.required && isEmpty)}
      {...otherProps}
    />
  );
};

export default TextField;
