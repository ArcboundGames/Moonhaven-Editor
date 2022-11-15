import { useMemo } from 'react';

import { useAppSelector } from '../../../../hooks';
import { selectCreatureTypesSortedWithName } from '../../../../store/slices/creatures';
import MultiSelect from '../MultiSelect';

import type { SxProps, Theme } from '@mui/material/styles';
import type { LocalizedCreatureType } from '../../../../../../../SharedLibrary/src/interface';

interface CreatureSelectProps {
  label: string;
  values: string[] | undefined;
  creatures?: LocalizedCreatureType[];
  onChange?: (value: string[]) => void;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
  helperText?: React.ReactNode;
  sx?: SxProps<Theme> | undefined;
}

const CreatureMultiSelect = ({
  label,
  values,
  creatures,
  onChange,
  required = false,
  error = false,
  disabled = false,
  helperText,
  sx
}: CreatureSelectProps) => {
  const allCreatures = useAppSelector(selectCreatureTypesSortedWithName);

  const finalCreatures = useMemo(() => {
    if (creatures) {
      return creatures;
    }

    return allCreatures;
  }, [allCreatures, creatures]);

  return (
    <MultiSelect
      label={label}
      required={required}
      disabled={disabled}
      error={error}
      helperText={helperText}
      sx={sx}
      values={values}
      onChange={onChange}
      options={finalCreatures.map((option) => ({
        label: option.name,
        value: option.key
      }))}
    />
  );
};

export default CreatureMultiSelect;
