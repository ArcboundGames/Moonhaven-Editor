import MuiAutocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useMemo } from 'react';

interface MultiAutocompleteProps<T> {
  label: string;
  values: T[] | undefined;
  options: {
    label: string;
    id: T;
  }[];
  onChange: (value: T[] | undefined) => void;
}

const MultiAutocomplete = <T extends string | number>({
  label,
  values,
  options,
  onChange
}: MultiAutocompleteProps<T>) => {
  const id = useMemo(() => label.toLowerCase().replace(' ', '_'), [label]);

  const selectedOption = useMemo(() => options.filter((option) => values?.includes(option.id)), [options, values]);

  return (
    <MuiAutocomplete
      multiple
      disablePortal
      id={id}
      options={options}
      renderInput={(params) => <TextField {...params} label={label} />}
      value={selectedOption}
      onChange={onChange ? (_, newValue) => onChange(newValue?.map((option) => option.id)) : undefined}
      fullWidth
    />
  );
};

export default MultiAutocomplete;
