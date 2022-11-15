import { createSlice } from '@reduxjs/toolkit';

import { toDialogueTree, toProcessedRawDialogueTree } from '../../../../../SharedLibrary/src/util/converters.util';
import { validateDialogueTrees as validateDataDialogueTrees } from '../../util/validate.util';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type {
  CreatureType,
  DialogueDataFile,
  DialogueTree,
  EventLog,
  Localization
} from '../../../../../SharedLibrary/src/interface';

// Define a type for the slice state
export interface DialogueTreesState {
  rawData: string;
  dialogueTrees: DialogueTree[];
  dialogueTreesByKey: Record<string, DialogueTree>;
  selectedCreature: string;
  errors: {
    dialogueTrees: Record<string, string[]>;
  };
}

// Define the initial state using that type
const initialState: DialogueTreesState = {
  rawData: '',
  dialogueTrees: [],
  dialogueTreesByKey: {},
  selectedCreature: 'ALL',
  errors: {
    dialogueTrees: {}
  }
};

export const dialogueSlice = createSlice({
  name: 'dialogue',
  initialState,
  reducers: {
    setRawDialogueData: (state, action: PayloadAction<string>) => ({ ...state, rawData: action.payload }),
    setSelectedDialogueCreature: (state, action: PayloadAction<string | undefined>) => {
      if (state.selectedCreature === action.payload) {
        return state;
      }
      return { ...state, selectedCreature: action.payload ?? 'ALL' };
    },
    clearCreatureSelections: (state) => {
      return { ...state, selectedCreature: 'ALL' };
    },
    updateDialogueTrees: (state, action: PayloadAction<DialogueTree[]>) => {
      const dialogueTreesByKey: Record<string, DialogueTree> = {};
      action.payload.forEach((dialogueTree) => {
        dialogueTreesByKey[dialogueTree.key] = dialogueTree;
      });

      return {
        ...state,
        dialogueTrees: action.payload.sort((a, b) => a.key.localeCompare(b.key)),
        dialogueTreesByKey
      };
    },
    validateDialogueTrees: (
      state,
      action: PayloadAction<{
        dialogueTrees: DialogueTree[];
        creaturesByKey: Record<string, CreatureType>;
        eventLogsByKey: Record<string, EventLog>;
        localization: Localization | null | undefined;
        localizationKeys: string[];
      }>
    ) => {
      const { dialogueTrees, creaturesByKey, eventLogsByKey, localization, localizationKeys } = action.payload;

      return {
        ...state,
        errors: {
          ...state.errors,
          dialogueTrees: validateDataDialogueTrees(
            dialogueTrees,
            creaturesByKey,
            eventLogsByKey,
            localization,
            localizationKeys
          )
        }
      };
    },
    loadDialogueData: (state, action: PayloadAction<string>) => {
      if (action.payload === state.rawData) {
        return state;
      }

      const data = JSON.parse(action.payload) as DialogueDataFile;

      const dialogueTreesByKey: Record<string, DialogueTree> = {};
      const dialogueTrees =
        data.dialogueTrees?.map<DialogueTree>((rawDialogueTree) => {
          const dialogueTree = toDialogueTree(toProcessedRawDialogueTree(rawDialogueTree));
          dialogueTreesByKey[dialogueTree.key] = dialogueTree;
          return dialogueTree;
        }) ?? [];

      dialogueTrees.sort((a, b) => a.key.localeCompare(b.key));

      return {
        ...state,
        dialogueTrees,
        dialogueTreesByKey,
        rawData: action.payload
      };
    }
  }
});

export const {
  setSelectedDialogueCreature,
  setRawDialogueData,
  updateDialogueTrees,
  validateDialogueTrees,
  loadDialogueData
} = dialogueSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectRawDialogueData = (state: RootState) => state.dialogue.rawData;

export const selectDialogueTrees = (state: RootState) => state.dialogue.dialogueTrees;
export const selectDialogueTreesByCreature = (creatureKey?: string) => (state: RootState) => {
  if (!creatureKey) {
    return [];
  }
  if (creatureKey === 'ALL') {
    return state.dialogue.dialogueTrees;
  }
  return state.dialogue.dialogueTrees?.filter((dialogueTree) => dialogueTree.creatureKey === creatureKey);
};

export const selectDialogueTreesByKey = (state: RootState) => state.dialogue.dialogueTreesByKey;

export const selectDialogueTree = (key?: string) => (state: RootState) =>
  key ? state.dialogue.dialogueTreesByKey?.[key] : undefined;

export const selectDialogueTreeErrors = (state: RootState) => state.dialogue.errors.dialogueTrees;

export const selectSelectedDialogueCreature = (state: RootState) => state.dialogue.selectedCreature;

export default dialogueSlice.reducer;
