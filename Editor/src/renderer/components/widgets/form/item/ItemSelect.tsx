import { useMemo } from 'react';

import { useAppSelector } from '../../../../hooks';
import { selectItemTypesSortedWithName } from '../../../../store/slices/items';
import Select from '../Select';

import type { LocalizedItemType } from '../../../../../../../SharedLibrary/src/interface';
import type { NotRequiredSelectProps, RequiredSelectProps } from '../Select';

export interface ItemNotRequiredSelectProps<T>
  extends Omit<NotRequiredSelectProps<T> & BaseItemSelectProps<T>, 'options'> {
  onChange?: (value: T | undefined) => void;
  required?: false;
}

export interface ItemRequiredSelectProps<T> extends Omit<RequiredSelectProps<T> & BaseItemSelectProps<T>, 'options'> {
  onChange?: (value: T) => void;
  required: true;
}

interface BaseItemSelectProps<T> {
  valueGetter: (item: LocalizedItemType) => T;
  items?: LocalizedItemType[];
}

type ItemSelectProps<T extends string | number> = ItemNotRequiredSelectProps<T> | ItemRequiredSelectProps<T>;

const ItemSelect = <T extends string | number>({ items, valueGetter, ...selectProps }: ItemSelectProps<T>) => {
  const allItems = useAppSelector(selectItemTypesSortedWithName);

  const finalItems = useMemo(() => {
    if (items) {
      return items;
    }

    return allItems;
  }, [allItems, items]);

  return (
    <Select<T>
      {...selectProps}
      options={
        finalItems?.map((entry) => ({
          label: entry.name,
          value: valueGetter(entry)
        })) as {
          label: string;
          value: T;
          emphasize?: boolean;
        }[]
      }
    />
  );
};

export default ItemSelect;
