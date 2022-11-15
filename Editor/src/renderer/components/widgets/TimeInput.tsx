/* eslint-disable react/no-array-index-key */
import TextField from '@mui/material/TextField';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import getHours from 'date-fns/getHours';
import getMinutes from 'date-fns/getMinutes';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import { useCallback, useEffect, useState } from 'react';

import { ONE_HOUR, ONE_MINUTE } from '../../../../../SharedLibrary/src/constants';
import { isNullish } from '../../../../../SharedLibrary/src/util/null.util';
import FormBox from './layout/FormBox';

export interface TimeInputProps {
  label?: string;
  value: number;
  disabled?: boolean;
  required?: boolean;
  onChange: (value: number) => void;
}

const TimeInput = ({ label, value, disabled = false, required = false, onChange }: TimeInputProps) => {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    if (value === -1) {
      setDate(null);
      return;
    }

    const hours = Math.floor(value / ONE_HOUR);
    const minutes = Math.floor((value - hours * ONE_HOUR) / ONE_MINUTE);

    let newDate = new Date();
    newDate = setHours(newDate, hours);
    newDate = setMinutes(newDate, minutes);
    setDate(newDate);
  }, [value]);

  const onTimeChange = useCallback(
    (newDate: Date | null) => {
      setDate(newDate);

      if (isNullish(newDate)) {
        onChange(-1);
      } else {
        const hours = getHours(newDate);
        const minutes = getMinutes(newDate);

        onChange(hours * ONE_HOUR + minutes * ONE_MINUTE);
      }
    },
    [onChange]
  );

  return (
    <FormBox>
      <TimePicker
        label={label}
        value={date}
        onChange={onTimeChange}
        renderInput={(params) => (
          <TextField
            {...params}
            disabled={disabled}
            required={required}
            error={value < (required ? 0 : -1) || value > 1080}
          />
        )}
      />
    </FormBox>
  );
};

export default TimeInput;
