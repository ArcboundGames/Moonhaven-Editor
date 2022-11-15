import { createSlice } from '@reduxjs/toolkit';

import { toProcessedRawQuest, toQuest } from '../../../../../SharedLibrary/src/util/converters.util';
import { getLocalizationKey, getLocalizedValue } from '../../../../../SharedLibrary/src/util/localization.util';
import { isNotEmpty } from '../../../../../SharedLibrary/src/util/string.util';
import { validateQuests as validateDataQuests } from '../../util/validate.util';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type {
  CraftingRecipe,
  CreatureType,
  DialogueTree,
  EventLog,
  ItemType,
  Localization,
  LocalizedQuest,
  Quest,
  QuestDataFile
} from '../../../../../SharedLibrary/src/interface';

// Define a type for the slice state
export interface QuestsState {
  rawData: string;
  quests: Quest[];
  questsById: Record<number, Quest>;
  questsByKey: Record<string, Quest>;
  localizedQuests: LocalizedQuest[];
  localizedQuestsById: Record<number, LocalizedQuest>;
  localizedQuestsByKey: Record<string, LocalizedQuest>;
  errors: Record<string, string[]>;
}

// Define the initial state using that type
const initialState: QuestsState = {
  rawData: '',
  quests: [],
  questsById: {},
  questsByKey: {},
  localizedQuests: [],
  localizedQuestsById: {},
  localizedQuestsByKey: {},
  errors: {}
};

export const questsSlice = createSlice({
  name: 'quests',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setRawQuestData: (state, action: PayloadAction<string>) => ({ ...state, rawData: action.payload }),
    updateQuests: (state, action: PayloadAction<Quest[]>) => {
      const questsById: Record<number, Quest> = {};
      const questsByKey: Record<string, Quest> = {};
      action.payload.forEach((quest) => {
        questsById[quest.id] = quest;
        questsByKey[quest.key] = quest;
      });

      return {
        ...state,
        questsById,
        questsByKey,
        quests: action.payload
      };
    },
    validateQuests: (
      state,
      action: PayloadAction<{
        quests: Quest[];
        itemsByKey: Record<string, ItemType>;
        craftingRecipesByKey: Record<string, CraftingRecipe>;
        creaturesByKey: Record<string, CreatureType>;
        dialogueTreesByKey: Record<string, DialogueTree>;
        eventLogsByKey: Record<string, EventLog>;
        localization: Localization | null;
        localizationKeys: string[];
      }>
    ) => {
      const {
        quests,
        itemsByKey,
        craftingRecipesByKey,
        creaturesByKey,
        dialogueTreesByKey,
        eventLogsByKey,
        localization,
        localizationKeys
      } = action.payload;

      return {
        ...state,
        errors: validateDataQuests(
          quests,
          itemsByKey,
          craftingRecipesByKey,
          creaturesByKey,
          dialogueTreesByKey,
          eventLogsByKey,
          localization,
          localizationKeys
        )
      };
    },
    loadQuestData: (state, action: PayloadAction<string>) => {
      if (action.payload === state.rawData) {
        return state;
      }

      const data = JSON.parse(action.payload) as QuestDataFile;

      const quests = data.quests?.map((rawQuest) => toQuest(toProcessedRawQuest(rawQuest))) ?? [];

      const questsById: Record<number, Quest> = {};
      const questsByKey: Record<string, Quest> = {};
      quests.forEach((quest) => {
        questsById[quest.id] = quest;
        questsByKey[quest.key] = quest;
      });

      return {
        ...state,
        quests,
        questsById,
        questsByKey,
        rawData: action.payload
      };
    },
    localizeQuests: (
      state,
      action: PayloadAction<{
        localization: Localization | null;
        localizationKeys: string[];
      }>
    ) => {
      const { localization, localizationKeys } = action.payload;
      if (!localization) {
        return state;
      }

      const localizedQuests: LocalizedQuest[] = state.quests.map((quest) => {
        const questName = getLocalizedValue(
          localization,
          localizationKeys,
          getLocalizationKey('quest', 'name', quest.key)
        );

        const questText = getLocalizedValue(
          localization,
          localizationKeys,
          getLocalizationKey('quest', 'text', quest.key)
        );

        return {
          ...quest,
          name: isNotEmpty(questName) ? questName : quest.key,
          text: questText
        };
      });
      localizedQuests.sort((a, b) => a.name.localeCompare(b.name));

      const localizedQuestsById: Record<number, LocalizedQuest> = {};
      const localizedQuestsByKey: Record<string, LocalizedQuest> = {};
      localizedQuests.forEach((quest) => {
        localizedQuestsById[quest.id] = quest;
        localizedQuestsByKey[quest.key] = quest;
      });

      return {
        ...state,
        localizedQuests,
        localizedQuestsById,
        localizedQuestsByKey
      };
    }
  }
});

export const { setRawQuestData, loadQuestData, updateQuests, validateQuests, localizeQuests } = questsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectRawQuestData = (state: RootState) => state.quests.rawData;

export const selectQuests = (state: RootState) => state.quests.quests;

export const selectQuestsById = (state: RootState) => state.quests.questsById;

export const selectQuestsByKey = (state: RootState) => state.quests.questsByKey;

export const selectQuestById = (id?: number) => (state: RootState) => id ? state.quests.questsById?.[id] : undefined;
export const selectQuestByKey = (key?: string) => (state: RootState) =>
  key ? state.quests.questsByKey?.[key] : undefined;

export const selectQuestsSortedWithName = (state: RootState) => state.quests.localizedQuests;

export const selectQuestsByIdWithName = (state: RootState) => state.quests.localizedQuestsById;

export const selectQuestsByKeyWithName = (state: RootState) => state.quests.localizedQuestsByKey;

export const selectQuestErrors = (state: RootState) => state.quests.errors;

export default questsSlice.reducer;
