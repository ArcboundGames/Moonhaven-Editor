import { createSlice } from '@reduxjs/toolkit';

import {
  toCraftingRecipe,
  toCraftingRecipeCategory,
  toProcessedRawCraftingRecipe,
  toProcessedRawCraftingRecipeCategory
} from '../../../../../SharedLibrary/src/util/converters.util';
import { getLocalizationKey, getLocalizedValue } from '../../../../../SharedLibrary/src/util/localization.util';
import { isNotEmpty } from '../../../../../SharedLibrary/src/util/string.util';
import {
  validateCraftingRecipeCategories as validateDataCraftingRecipeCategories,
  validateCraftingRecipes as validateDataCraftingRecipes
} from '../../util/validate.util';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type {
  CraftingRecipe,
  CraftingRecipeCategory,
  CraftingRecipeDataFile,
  ItemType,
  Localization,
  LocalizedCraftingRecipe,
  Skill
} from '../../../../../SharedLibrary/src/interface';

// Define a type for the slice state
export interface CraftingRecipesState {
  rawData: string;
  craftingRecipes: CraftingRecipe[];
  craftingRecipesByKey: Record<string, CraftingRecipe>;
  localizedCraftingRecipes: LocalizedCraftingRecipe[];
  localizedCraftingRecipesByKey: Record<string, LocalizedCraftingRecipe>;
  craftingRecipeCategories: CraftingRecipeCategory[];
  craftingRecipeCategoriesByKey: Record<string, CraftingRecipeCategory>;
  errors: {
    recipes: Record<string, string[]>;
    recipeCategories: Record<string, string[]>;
  };
  selectedCategory: string;
}

// Define the initial state using that type
const initialState: CraftingRecipesState = {
  rawData: '',
  craftingRecipes: [],
  craftingRecipesByKey: {},
  localizedCraftingRecipes: [],
  localizedCraftingRecipesByKey: {},
  craftingRecipeCategories: [],
  craftingRecipeCategoriesByKey: {},
  errors: {
    recipes: {},
    recipeCategories: {}
  },
  selectedCategory: 'ALL'
};

export const craftingRecipesSlice = createSlice({
  name: 'craftingRecipes',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setRawCraftingRecipeData: (state, action: PayloadAction<string>) => ({ ...state, rawData: action.payload }),
    setSelectedCraftingRecipeCategory: (state, action: PayloadAction<string | undefined>) => {
      if (state.selectedCategory === action.payload) {
        return state;
      }
      return { ...state, selectedCategory: action.payload ?? 'ALL' };
    },
    clearCraftingRecipeSelections: (state) => {
      return { ...state, selectedCategory: 'ALL' };
    },
    updateCraftingRecipeCategories: (state, action: PayloadAction<CraftingRecipeCategory[]>) => {
      const craftingRecipeCategoriesByKey: Record<string, CraftingRecipeCategory> = {};
      action.payload.forEach((category) => {
        craftingRecipeCategoriesByKey[category.key] = category;
      });
      return {
        ...state,
        craftingRecipeCategories: action.payload,
        craftingRecipeCategoriesByKey
      };
    },
    updateCraftingRecipes: (state, action: PayloadAction<CraftingRecipe[]>) => {
      const craftingRecipesByKey: Record<string, CraftingRecipe> = {};
      action.payload.forEach((craftingRecipe) => {
        craftingRecipesByKey[craftingRecipe.key] = craftingRecipe;
      });
      return {
        ...state,
        craftingRecipes: action.payload,
        craftingRecipesByKey
      };
    },
    validateCraftingRecipeCategories: (
      state,
      action: PayloadAction<{
        craftingRecipeCategories: CraftingRecipeCategory[];
      }>
    ) => {
      const { craftingRecipeCategories } = action.payload;

      return {
        ...state,
        errors: {
          ...state.errors,
          recipeCategories: validateDataCraftingRecipeCategories(craftingRecipeCategories)
        }
      };
    },
    validateCraftingRecipes: (
      state,
      action: PayloadAction<{
        craftingRecipes: CraftingRecipe[];
        craftingRecipeCategoriesByKey: Record<string, CraftingRecipeCategory>;
        skillsByKey: Record<string, Skill>;
        itemsByKey: Record<string, ItemType>;
        workstationKeys: string[];
      }>
    ) => {
      const { craftingRecipes, craftingRecipeCategoriesByKey, skillsByKey, itemsByKey, workstationKeys } =
        action.payload;

      return {
        ...state,
        errors: {
          ...state.errors,
          recipes: validateDataCraftingRecipes(
            craftingRecipes,
            craftingRecipeCategoriesByKey,
            skillsByKey,
            itemsByKey,
            workstationKeys
          )
        }
      };
    },
    loadCraftingRecipeData: (state, action: PayloadAction<string>) => {
      if (action.payload === state.rawData) {
        return state;
      }

      const data = JSON.parse(action.payload) as CraftingRecipeDataFile;

      const craftingRecipeCategoriesByKey: Record<string, CraftingRecipeCategory> = {};
      const craftingRecipeCategories =
        data.categories?.map<CraftingRecipeCategory>((rawCategory, index) => {
          const category: CraftingRecipeCategory = toCraftingRecipeCategory(
            toProcessedRawCraftingRecipeCategory(rawCategory),
            index
          );
          craftingRecipeCategoriesByKey[category.key] = category;
          return category;
        }) ?? [];

      const craftingRecipesByKey: Record<string, CraftingRecipe> = {};
      const craftingRecipes =
        data.recipes?.map<CraftingRecipe>((rawCraftingRecipe, index) => {
          const craftingRecipe: CraftingRecipe = toCraftingRecipe(
            toProcessedRawCraftingRecipe(rawCraftingRecipe),
            index
          );
          craftingRecipesByKey[craftingRecipe.key] = craftingRecipe;
          return craftingRecipe;
        }) ?? [];

      return {
        ...state,
        craftingRecipes,
        craftingRecipesByKey,
        craftingRecipeCategories,
        craftingRecipeCategoriesByKey,
        rawData: action.payload
      };
    },
    localizeCraftingRecipes: (
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

      const localizedCraftingRecipes: LocalizedCraftingRecipe[] = state.craftingRecipes.map((craftingRecipe) => {
        const craftingRecipeName = getLocalizedValue(
          localization,
          localizationKeys,
          getLocalizationKey('item', 'name', craftingRecipe.itemTypeKey)
        );

        return {
          ...craftingRecipe,
          name: isNotEmpty(craftingRecipeName) ? craftingRecipeName : craftingRecipe.itemTypeKey ?? craftingRecipe.key
        };
      });
      localizedCraftingRecipes.sort((a, b) => a.name.localeCompare(b.name));

      const localizedCraftingRecipesByKey: Record<string, LocalizedCraftingRecipe> = {};
      localizedCraftingRecipes.forEach((craftingRecipe) => {
        localizedCraftingRecipesByKey[craftingRecipe.key] = craftingRecipe;
      });

      return {
        ...state,
        localizedCraftingRecipes,
        localizedCraftingRecipesByKey
      };
    }
  }
});

export const {
  setRawCraftingRecipeData,
  loadCraftingRecipeData,
  updateCraftingRecipes,
  validateCraftingRecipes,
  updateCraftingRecipeCategories,
  validateCraftingRecipeCategories,
  setSelectedCraftingRecipeCategory,
  clearCraftingRecipeSelections,
  localizeCraftingRecipes
} = craftingRecipesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectRawCraftingRecipeData = (state: RootState) => state.craftingRecipes.rawData;

export const selectCraftingRecipes = (state: RootState) => state.craftingRecipes.craftingRecipes;

export const selectCraftingRecipesByKey = (state: RootState) => state.craftingRecipes.craftingRecipesByKey;

export const selectCraftingRecipesSortedWithName = (state: RootState) => state.craftingRecipes.localizedCraftingRecipes;

export const selectCraftingRecipesByKeyWithName = (state: RootState) =>
  state.craftingRecipes.localizedCraftingRecipesByKey;

export const selectCraftingRecipe = (key?: string) => (state: RootState) =>
  key ? state.craftingRecipes.craftingRecipesByKey?.[key] : undefined;

export const selectCraftingRecipesByCategory = (categoryKey?: string) => (state: RootState) => {
  if (!categoryKey) {
    return [];
  }
  if (categoryKey === 'ALL') {
    return state.craftingRecipes.craftingRecipes;
  }
  return state.craftingRecipes.craftingRecipes?.filter((recipe) => recipe.categoryKey === categoryKey);
};

export const selectCraftingRecipeCategories = (state: RootState) => state.craftingRecipes.craftingRecipeCategories;

export const selectCraftingRecipeCategoriesByKey = (state: RootState) =>
  state.craftingRecipes.craftingRecipeCategoriesByKey;

export const selectCraftingRecipeCategory = (key?: string) => (state: RootState) =>
  key ? state.craftingRecipes.craftingRecipeCategoriesByKey?.[key] : undefined;

export const selectCraftingRecipeErrors = (state: RootState) => state.craftingRecipes.errors.recipes;

export const selectCraftingRecipeCategoryErrors = (state: RootState) => state.craftingRecipes.errors.recipeCategories;

export const selectSelectedCraftingRecipeCategory = (state: RootState) => state.craftingRecipes.selectedCategory;

export default craftingRecipesSlice.reducer;
