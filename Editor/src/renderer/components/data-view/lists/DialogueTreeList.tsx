import Box from '@mui/system/Box';
import { useMemo } from 'react';

import { toTitleCaseFromKey } from '../../../../../../SharedLibrary/src/util/string.util';
import { useAppSelector, useDebounce } from '../../../hooks';
import { selectCreatureTypesByKeyWithName } from '../../../store/slices/creatures';
import { selectSearch } from '../../../store/slices/data';
import {
  selectDialogueTreeErrors,
  selectDialogueTreesByCreature,
  selectSelectedDialogueCreature
} from '../../../store/slices/dialogue';
import DataViewList from '../DataViewList';

import type { DataViewListItem } from '../DataViewList';

const DialogueTreeList = () => {
  const selectedCreature = useAppSelector(selectSelectedDialogueCreature);
  const dialogueTrees = useAppSelector(
    useMemo(() => selectDialogueTreesByCreature(selectedCreature), [selectedCreature])
  );
  const creaturesByKey = useAppSelector(selectCreatureTypesByKeyWithName);

  const errors = useAppSelector(selectDialogueTreeErrors);

  const searchTerm = useAppSelector(selectSearch);
  const debouncedSearchTerm = useDebounce(searchTerm?.toLowerCase(), 250);

  const filteredDialogueTrees = useMemo(() => {
    if (!debouncedSearchTerm) {
      return dialogueTrees;
    }
    return dialogueTrees.filter((dialogueTree) =>
      dialogueTree.key.replace('_', ' ').toLowerCase().includes(debouncedSearchTerm)
    );
  }, [debouncedSearchTerm, dialogueTrees]);

  const listDialogueTrees: DataViewListItem[] = filteredDialogueTrees.map((dialogueTree) => {
    let creatureName = 'Unknown Creature';
    if (dialogueTree.creatureKey) {
      creatureName = creaturesByKey[dialogueTree.creatureKey]?.name ?? dialogueTree.creatureKey;
    }
    return {
      dataKey: dialogueTree.key,
      name: `${creatureName} - ${toTitleCaseFromKey(dialogueTree.key)}`,
      errors: errors[dialogueTree.key]
    };
  });

  return (
    <Box
      sx={{
        height: '100%'
      }}
    >
      <DataViewList section="dialogue-tree" items={listDialogueTrees} search="?tab=0" />
    </Box>
  );
};

export default DialogueTreeList;
