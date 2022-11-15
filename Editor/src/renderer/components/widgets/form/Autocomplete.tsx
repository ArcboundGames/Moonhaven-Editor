import MuiAutocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useMemo } from 'react';

interface AutocompleteProps<T> {
  label: string;
  value: T | undefined;
  options: {
    label: string;
    id: T;
  }[];
  onChange: (value: T | undefined) => void;
}

const Autocomplete = <T extends string | number>({ label, value, options, onChange }: AutocompleteProps<T>) => {
  const id = useMemo(() => label.toLowerCase().replace(' ', '_'), [label]);

  const selectedOption = useMemo(() => options.find((option) => option.id === value), [options, value]);

  return (
    <MuiAutocomplete
      disablePortal
      id={id}
      options={options}
      renderInput={(params) => <TextField {...params} label={label} />}
      value={selectedOption}
      onChange={onChange ? (_, newValue) => onChange(newValue?.id) : undefined}
      fullWidth
    />
  );
};

export default Autocomplete;
