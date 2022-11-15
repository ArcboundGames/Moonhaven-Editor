import { useMemo } from 'react';

import { useAppSelector } from '../../../../hooks';
import { selectItemTypesSortedWithName } from '../../../../store/slices/items';
import MultiSelect from '../MultiSelect';

import type { SxProps, Theme } from '@mui/material/styles';
import type { LocalizedItemType } from '../../../../../../../SharedLibrary/src/interface';

interface ItemSelectProps {
  label: string;
  values: string[] | undefined;
  items?: LocalizedItemType[];
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
  items,
  onChange,
  required = false,
  error = false,
  disabled = false,
  helperText,
  sx
}: ItemSelectProps) => {
  const allItems = useAppSelector(selectItemTypesSortedWithName);

  const finalItems = useMemo(() => {
    if (items) {
      return items;
    }

    return allItems;
  }, [allItems, items]);

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
      options={finalItems.map((option) => ({
        label: option.name,
        value: option.key
      }))}
    />
  );
};

export default ItemMultiSelect;
