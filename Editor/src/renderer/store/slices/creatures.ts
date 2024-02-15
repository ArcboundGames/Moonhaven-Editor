import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  toCreatureCategory,
  toCreatureType,
  toProcessedRawCreatureCategory,
  toProcessedRawCreatureType
} from '../../../../../SharedLibrary/src/util/converters.util';
import { getLocalizationKey, getLocalizedValue } from '../../../../../SharedLibrary/src/util/localization.util';
import { isNotEmpty } from '../../../../../SharedLibrary/src/util/string.util';
import {
  validateCreatureCategories as validateDataCreatureCategories,
  validateCreatures as validateDataCreatures
} from '../../util/validate.util';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunkOptions, RootState } from '..';
import type {
  CreatureCategory,
  CreatureDataFile,
  CreatureType,
  EventLog,
  ItemType,
  Localization,
  LocalizedCreatureType,
  LootTable
} from '../../../../../SharedLibrary/src/interface';

// Define a type for the slice state
export interface CreaturesState {
  rawData: string;
  categories: CreatureCategory[];
  creatures: CreatureType[];
  creatureNamesByKey: Record<string, string>;
  categoriesByKey: Record<string, CreatureCategory>;
  creaturesByKey: Record<string, CreatureType>;
  localizedCreatures: LocalizedCreatureType[];
  localizedCreaturesByKey: Record<string, LocalizedCreatureType>;
  selectedCategory: string;
  errors: {
    creatures: Record<string, string[]>;
    creatureCategories: Record<string, string[]>;
  };
  spritesVersion: number;
}

// Define the initial state using that type
const initialState: CreaturesState = {
  rawData: '',
  selectedCategory: 'ALL',
  categories: [],
  creatures: [],
  creatureNamesByKey: {},
  categoriesByKey: {},
  creaturesByKey: {},
  localizedCreatures: [],
  localizedCreaturesByKey: {},
  errors: {
    creatures: {},
    creatureCategories: {}
  },
  spritesVersion: 0
};

interface ValidateCreaturesPayload {
  creatures: CreatureType[];
  creaturesByKey: Record<string, CreatureType>;
  creatureCategoriesByKey: Record<string, CreatureCategory>;
  itemsByKey: Record<string, ItemType>;
  lootTablesByKey: Record<string, LootTable>;
  eventLogsByKey: Record<string, EventLog>;
  localization: Localization | null | undefined;
  localizationKeys: string[];
  path: string | undefined;
}

const validateCreatures = createAsyncThunk<Record<string, string[]>, ValidateCreaturesPayload, AppThunkOptions>(
  'creatures/validateCreaturesStatus',
  async (payload: ValidateCreaturesPayload) => {
    const {
      creatures,
      creaturesByKey,
      creatureCategoriesByKey,
      itemsByKey,
      lootTablesByKey,
      eventLogsByKey,
      localization,
      localizationKeys,
      path
    } = payload;

    return validateDataCreatures(
      creatures,
      creaturesByKey,
      creatureCategoriesByKey,
      itemsByKey,
      lootTablesByKey,
      eventLogsByKey,
      localization,
      localizationKeys,
      path
    );
  }
);

export const creaturesSlice = createSlice({
  name: 'creatures',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    incrementCreatureSpritesVersion: (state) => ({ ...state, spritesVersion: state.spritesVersion + 1 }),
    setRawCreatureData: (state, action: PayloadAction<string>) => ({ ...state, rawData: action.payload }),
    setSelectedCreatureCategory: (state, action: PayloadAction<string | undefined>) => {
      if (state.selectedCategory === action.payload) {
        return state;
      }
      return { ...state, selectedCategory: action.payload ?? 'ALL' };
    },
    clearCreatureSelections: (state) => {
      return { ...state, selectedCategory: 'ALL' };
    },
    updateCreatureCategories: (state, action: PayloadAction<CreatureCategory[]>) => {
      const categoriesByKey: Record<string, CreatureCategory> = {};
      action.payload.forEach((category) => {
        categoriesByKey[category.key] = category;
      });
      return {
        ...state,
        categories: action.payload,
        categoriesByKey
      };
    },
    updateCreatures: (state, action: PayloadAction<CreatureType[]>) => {
      const creaturesByKey: Record<string, CreatureType> = {};
      action.payload.forEach((creature) => {
        creaturesByKey[creature.key] = creature;
      });

      return {
        ...state,
        creatures: action.payload,
        creaturesByKey
      };
    },
    validateCreatureCategories: (
      state,
      action: PayloadAction<{
        creatureCategories: CreatureCategory[];
      }>
    ) => {
      const { creatureCategories } = action.payload;

      return {
        ...state,
        errors: {
          ...state.errors,
          creatureCategories: validateDataCreatureCategories(creatureCategories)
        }
      };
    },
    loadCreatureData: (state, action: PayloadAction<string>) => {
      if (action.payload === state.rawData) {
        return state;
      }

      const data = JSON.parse(action.payload) as CreatureDataFile;

      const categoriesByKey: Record<string, CreatureCategory> = {};
      const categories =
        data.categories?.map<CreatureCategory>((rawCategory, index) => {
          const category: CreatureCategory = toCreatureCategory(toProcessedRawCreatureCategory(rawCategory), index);
          categoriesByKey[category.key] = category;
          return category;
        }) ?? [];

      const creatures =
        data.creatures?.map<CreatureType>((rawCreature, index) =>
          toCreatureType(toProcessedRawCreatureType(rawCreature), index)
        ) ?? [];

      const creaturesByKey: Record<string, CreatureType> = {};
      creatures.forEach((creature) => {
        creaturesByKey[creature.key] = creature;
      });

      return {
        ...state,
        categories,
        categoriesByKey,
        creatures,
        creaturesByKey,
        rawData: action.payload
      };
    },
    localizeCreatures: (
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

      const creatureNamesByKey = state.creatures.reduce((namesByKey, creature) => {
        namesByKey[creature.key] = getLocalizedValue(
          localization,
          localizationKeys,
          getLocalizationKey('creature', 'name', creature.key)
        );
        return namesByKey;
      }, {} as Record<string, string>);

      const localizedCreatures: LocalizedCreatureType[] = state.creatures.map((creature) => ({
        ...creature,
        name: isNotEmpty(creatureNamesByKey[creature.key]) ? creatureNamesByKey[creature.key] : creature.key
      }));

      const localizedCreaturesByKey: Record<string, LocalizedCreatureType> = {};
      localizedCreatures.forEach((creature) => {
        localizedCreaturesByKey[creature.key] = creature;
      });

      return {
        ...state,
        localizedCreatures,
        localizedCreaturesByKey
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(validateCreatures.fulfilled, (state, action) => ({
      ...state,
      errors: {
        ...state.errors,
        creatures: action.payload
      }
    }));
  }
});

export const {
  incrementCreatureSpritesVersion,
  setRawCreatureData,
  loadCreatureData,
  setSelectedCreatureCategory,
  clearCreatureSelections,
  updateCreatures,
  updateCreatureCategories,
  validateCreatureCategories,
  localizeCreatures
} = creaturesSlice.actions;

export { validateCreatures };

// Other code such as selectors can use the imported `RootState` type
export const selectCreatureSpritesVersion = (state: RootState) => state.creatures.spritesVersion;

export const selectRawCreatureData = (state: RootState) => state.creatures.rawData;

export const selectCreatureTypes = (state: RootState) => state.creatures.creatures;

export const selectCreatureTypesByKey = (state: RootState) => state.creatures.creaturesByKey;

export const selectCreatureTypesSortedWithName = (state: RootState) => state.creatures.localizedCreatures;

export const selectCreatureTypesByKeyWithName = (state: RootState) => state.creatures.localizedCreaturesByKey;

export const selectCreatureTypesByCategory = (categoryKey?: string) => (state: RootState) => {
  if (!categoryKey) {
    return [];
  }
  if (categoryKey === 'ALL') {
    return state.creatures.localizedCreatures;
  }
  return state.creatures.localizedCreatures?.filter((creature) => creature.categoryKey === categoryKey);
};

export const selectCreatureCategories = (state: RootState) => state.creatures.categories;

export const selectCreatureCategoriesByKey = (state: RootState) => state.creatures.categoriesByKey;

export const selectCreatureType = (key?: string) => (state: RootState) =>
  key ? state.creatures.creaturesByKey?.[key] : undefined;

export const selectCreatureCategory = (key?: string) => (state: RootState) =>
  key ? state.creatures.categoriesByKey?.[key] : undefined;

export const selectSelectedCreatureCategory = (state: RootState) => state.creatures.selectedCategory;

export const selectCreatureErrors = (state: RootState) => state.creatures.errors.creatures;
export const selectCreatureCategoryErrors = (state: RootState) => state.creatures.errors.creatureCategories;

export default creaturesSlice.reducer;
