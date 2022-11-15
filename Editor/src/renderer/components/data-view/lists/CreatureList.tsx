import Box from '@mui/system/Box';
import { useCallback, useMemo } from 'react';

import { useAppDispatch, useAppSelector, useDebounce } from '../../../hooks';
import {
  incrementCreatureSpritesVersion,
  selectCreatureErrors,
  selectCreatureTypesByCategory,
  selectSelectedCreatureCategory
} from '../../../store/slices/creatures';
import { selectSearch } from '../../../store/slices/data';
import useDebouncedDispatch from '../../hooks/useDebouncedDispatch';
import DataViewList from '../DataViewList';

import type { DataViewListItem } from '../DataViewList';

const CreatureList = () => {
  const dispatch = useAppDispatch();

  const selectedCreatureCategory = useAppSelector(selectSelectedCreatureCategory);
  const creatures = useAppSelector(
    useMemo(() => selectCreatureTypesByCategory(selectedCreatureCategory), [selectedCreatureCategory])
  );

  const errors = useAppSelector(selectCreatureErrors);

  const searchTerm = useAppSelector(selectSearch);
  const debouncedSearchTerm = useDebounce(searchTerm?.toLowerCase(), 250);

  const filteredCreatures = useMemo(() => {
    if (!debouncedSearchTerm) {
      return creatures;
    }
    return creatures.filter((creatureType) =>
      (creatureType.name ?? creatureType.key).toLowerCase().includes(debouncedSearchTerm)
    );
  }, [debouncedSearchTerm, creatures]);

  const listCreatures: DataViewListItem[] = filteredCreatures.map((creature) => ({
    dataKey: creature.key,
    name: creature.name ?? creature.key,
    sprite: {
      width: creature.sprite?.width,
      height: creature.sprite?.height,
      default: 0
    },
    errors: errors[creature.key]
  }));

  const debouncedDispatch = useDebouncedDispatch(dispatch, incrementCreatureSpritesVersion);
  const onSpritesChange = useCallback(() => debouncedDispatch.dispatch(), [debouncedDispatch]);

  return (
    <Box
      sx={{
        height: '100%'
      }}
    >
      <DataViewList section="creature" items={listCreatures} onSpritesChange={onSpritesChange} search="?tab=0" />
    </Box>
  );
};

export default CreatureList;
