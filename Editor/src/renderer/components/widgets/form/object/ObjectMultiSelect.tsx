import { useMemo } from 'react';

import { useAppSelector } from '../../../../hooks';
import { selectObjectTypesSortedWithName } from '../../../../store/slices/objects';
import MultiSelect from '../MultiSelect';

import type { SxProps, Theme } from '@mui/material/styles';
import type { LocalizedObjectType } from '../../../../../../../SharedLibrary/src/interface';

interface ItemSelectProps {
  label: string;
  values: string[] | undefined;
  objects?: LocalizedObjectType[];
  onChange?: (value: string[]) => void;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
  helperText?: React.ReactNode;
  sx?: SxProps<Theme> | undefined;
}

const ItemMultiSelect = ({
  label,
  values,
  objects,
  onChange,
  required = false,
  error = false,
  disabled = false,
  helperText,
  sx
}: ItemSelectProps) => {
  const allObjects = useAppSelector(selectObjectTypesSortedWithName);

  const finalObjects = useMemo(() => {
    if (objects) {
      return objects;
    }

    return allObjects;
  }, [allObjects, objects]);

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
      options={finalObjects.map((option) => ({
        label: option.name,
        value: option.key
      }))}
    />
  );
};

export default ItemMultiSelect;
