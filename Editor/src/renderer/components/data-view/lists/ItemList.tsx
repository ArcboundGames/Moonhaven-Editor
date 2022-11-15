import Box from '@mui/system/Box';
import { useCallback, useMemo } from 'react';

import { useAppDispatch, useAppSelector, useDebounce } from '../../../hooks';
import { selectSearch } from '../../../store/slices/data';
import {
  incrementItemsIconsVersion,
  selectItemErrors,
  selectItemTypesByCategory,
  selectSelectedItemCategory
} from '../../../store/slices/items';
import useDebouncedDispatch from '../../hooks/useDebouncedDispatch';
import DataViewList from '../DataViewList';

import type { DataViewListItem } from '../DataViewList';

const ItemList = () => {
  const dispatch = useAppDispatch();

  const selectedItemCategory = useAppSelector(selectSelectedItemCategory);
  const items = useAppSelector(useMemo(() => selectItemTypesByCategory(selectedItemCategory), [selectedItemCategory]));

  const errors = useAppSelector(selectItemErrors);

  const searchTerm = useAppSelector(selectSearch);
  const debouncedSearchTerm = useDebounce(searchTerm?.toLowerCase(), 250);

  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm) {
      return items;
    }
    return items.filter((item) => (item.name ?? item.key).toLowerCase().includes(debouncedSearchTerm));
  }, [debouncedSearchTerm, items]);

  const listItems: DataViewListItem[] = filteredItems.map((item) => {
    return {
      dataKey: item.key,
      name: item.name ?? item.key,
      sprite: {
        width: 16,
        height: 16,
        default: 0
      },
      errors: errors[item.key]
    };
  });

  const debouncedDispatch = useDebouncedDispatch(dispatch, incrementItemsIconsVersion);
  const onSpritesChange = useCallback(() => debouncedDispatch.dispatch(), [debouncedDispatch]);

  return (
    <Box sx={{ height: '100%' }}>
      <DataViewList section="item" items={listItems} onSpritesChange={onSpritesChange} />
    </Box>
  );
};

export default ItemList;
