import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  toItemCategory,
  toItemType,
  toProcessedRawItemCategory,
  toProcessedRawItemType
} from '../../../../../SharedLibrary/src/util/converters.util';
import { getLocalizationKey, getLocalizedValue } from '../../../../../SharedLibrary/src/util/localization.util';
import { isNotEmpty } from '../../../../../SharedLibrary/src/util/string.util';
import {
  validateItemCategories as validateDataItemCategories,
  validateItems as validateDataItems
} from '../../util/validate.util';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunkOptions, RootState } from '..';
import type {
  ItemCategory,
  ItemDataFile,
  ItemType,
  Localization,
  LocalizedItemType,
  ObjectType,
  Skill
} from '../../../../../SharedLibrary/src/interface';

// Define a type for the slice state
export interface ItemsState {
  rawData: string;
  categories: ItemCategory[];
  items: ItemType[];
  categoriesByKey: Record<string, ItemCategory>;
  itemsById: Record<number, ItemType>;
  itemsByKey: Record<string, ItemType>;
  localizedItems: LocalizedItemType[];
  localizedItemsById: Record<number, LocalizedItemType>;
  localizedItemsByKey: Record<string, LocalizedItemType>;
  selectedCategory: string;
  errors: {
    items: Record<string, string[]>;
    itemCategories: Record<string, string[]>;
  };
  iconsVersion: number;
}

// Define the initial state using that type
const initialState: ItemsState = {
  rawData: '',
  selectedCategory: 'ALL',
  categories: [],
  items: [],
  categoriesByKey: {},
  itemsById: {},
  itemsByKey: {},
  localizedItems: [],
  localizedItemsById: {},
  localizedItemsByKey: {},
  errors: {
    items: {},
    itemCategories: {}
  },
  iconsVersion: 0
};

interface ValidateItemsPayload {
  items: ItemType[];
  itemsByKey: Record<string, ItemType>;
  itemCategoriesByKey: Record<string, ItemCategory>;
  objectsByKey: Record<string, ObjectType>;
  skillsByKey: Record<string, Skill>;
  localization: Localization | null | undefined;
  localizationKeys: string[];
  damagableObjectKeys: string[];
  damagableObjectCategoryKeys: string[];
  damagableObjectSubCategoryKeys: string[];
  damagableCreatureKeys: string[];
  damagableCreatureCategoryKeys: string[];
  projectileItemKeys: string[];
  projectileItemCategoryKeys: string[];
  path: string | undefined;
}

const validateItems = createAsyncThunk<Record<string, string[]>, ValidateItemsPayload, AppThunkOptions>(
  'items/validateItemsStatus',
  async (payload: ValidateItemsPayload) => {
    const {
      items,
      itemsByKey,
      itemCategoriesByKey,
      objectsByKey,
      skillsByKey,
      localization,
      localizationKeys,
      damagableObjectKeys,
      damagableObjectCategoryKeys,
      damagableObjectSubCategoryKeys,
      damagableCreatureKeys,
      damagableCreatureCategoryKeys,
      projectileItemKeys,
      projectileItemCategoryKeys,
      path
    } = payload;

    return validateDataItems(
      items,
      itemsByKey,
      itemCategoriesByKey,
      objectsByKey,
      skillsByKey,
      localization,
      localizationKeys,
      damagableObjectKeys,
      damagableObjectCategoryKeys,
      damagableObjectSubCategoryKeys,
      damagableCreatureKeys,
      damagableCreatureCategoryKeys,
      projectileItemKeys,
      projectileItemCategoryKeys,
      path
    );
  }
);

export const itemsSlice = createSlice({
  name: 'items',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    incrementItemsIconsVersion: (state) => ({ ...state, iconsVersion: state.iconsVersion + 1 }),
    setRawItemData: (state, action: PayloadAction<string>) => ({ ...state, rawData: action.payload }),
    setSelectedItemCategory: (state, action: PayloadAction<string | undefined>) => {
      if (state.selectedCategory === action.payload) {
        return state;
      }
      return { ...state, selectedCategory: action.payload ?? 'ALL' };
    },
    clearItemSelections: (state) => {
      return { ...state, selectedCategory: 'ALL' };
    },
    updateItemCategories: (state, action: PayloadAction<ItemCategory[]>) => {
      const categoriesByKey: Record<string, ItemCategory> = {};
      action.payload.forEach((category) => {
        categoriesByKey[category.key] = category;
      });
      return {
        ...state,
        categories: action.payload,
        categoriesByKey
      };
    },
    updateItems: (state, action: PayloadAction<ItemType[]>) => {
      const itemsById: Record<number, ItemType> = {};
      const itemsByKey: Record<string, ItemType> = {};
      action.payload.forEach((item) => {
        itemsById[item.id] = item;
        itemsByKey[item.key] = item;
      });

      return {
        ...state,
        items: action.payload,
        itemsById,
        itemsByKey
      };
    },
    validateItemCategories: (
      state,
      action: PayloadAction<{
        itemCategories: ItemCategory[];
        skillsByKey: Record<string, Skill>;
        damagableObjectKeys: string[];
        damagableObjectCategoryKeys: string[];
        damagableObjectSubCategoryKeys: string[];
        damagableCreatureKeys: string[];
        damagableCreatureCategoryKeys: string[];
        projectileItemKeys: string[];
        projectileItemCategoryKeys: string[];
      }>
    ) => {
      const {
        itemCategories,
        skillsByKey,
        damagableObjectKeys,
        damagableObjectCategoryKeys,
        damagableObjectSubCategoryKeys,
        damagableCreatureKeys,
        damagableCreatureCategoryKeys,
        projectileItemKeys,
        projectileItemCategoryKeys
      } = action.payload;

      return {
        ...state,
        errors: {
          ...state.errors,
          itemCategories: validateDataItemCategories(
            itemCategories,
            skillsByKey,
            damagableObjectKeys,
            damagableObjectCategoryKeys,
            damagableObjectSubCategoryKeys,
            damagableCreatureKeys,
            damagableCreatureCategoryKeys,
            projectileItemKeys,
            projectileItemCategoryKeys
          )
        }
      };
    },
    loadItemData: (state, action: PayloadAction<string>) => {
      if (action.payload === state.rawData) {
        return state;
      }

      const data = JSON.parse(action.payload) as ItemDataFile;

      const categoriesByKey: Record<string, ItemCategory> = {};
      const categories =
        data.categories?.map<ItemCategory>((rawCategory, index) => {
          const category: ItemCategory = toItemCategory(toProcessedRawItemCategory(rawCategory), index);
          categoriesByKey[category.key] = category;
          return category;
        }) ?? [];

      const items =
        data.items?.map<ItemType>((rawItem, index) => toItemType(toProcessedRawItemType(rawItem), index)) ?? [];

      const itemsById: Record<number, ItemType> = {};
      const itemsByKey: Record<string, ItemType> = {};
      items.forEach((item) => {
        itemsById[item.id] = item;
        itemsByKey[item.key] = item;
      });

      return {
        ...state,
        categories,
        categoriesByKey,
        items,
        itemsById,
        itemsByKey,
        rawData: action.payload
      };
    },
    localizeItems: (
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

      const itemNamesByKey = state.items.reduce((namesByKey, item) => {
        namesByKey[item.key] = getLocalizedValue(
          localization,
          localizationKeys,
          getLocalizationKey('item', 'name', item.key)
        );
        return namesByKey;
      }, {} as Record<string, string>);

      const localizedItems: LocalizedItemType[] = state.items.map((item) => ({
        ...item,
        name: isNotEmpty(itemNamesByKey[item.key]) ? itemNamesByKey[item.key] : item.key
      }));

      const localizedItemsById: Record<number, LocalizedItemType> = {};
      const localizedItemsByKey: Record<string, LocalizedItemType> = {};
      localizedItems.forEach((item) => {
        localizedItemsById[item.id] = item;
        localizedItemsByKey[item.key] = item;
      });
      localizedItems.sort((a, b) => a.name.localeCompare(b.name));

      return {
        ...state,
        localizedItems,
        localizedItemsById,
        localizedItemsByKey
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(validateItems.fulfilled, (state, action) => ({
      ...state,
      errors: {
        ...state.errors,
        items: action.payload
      }
    }));
  }
});

export const {
  incrementItemsIconsVersion,
  setRawItemData,
  loadItemData,
  setSelectedItemCategory,
  clearItemSelections,
  updateItems,
  updateItemCategories,
  validateItemCategories,
  localizeItems
} = itemsSlice.actions;

export { validateItems };

// Other code such as selectors can use the imported `RootState` type
export const selectIconsVersion = (state: RootState) => state.items.iconsVersion;

export const selectRawItemData = (state: RootState) => state.items.rawData;

export const selectItemTypes = (state: RootState) => state.items.items;

export const selectItemTypesById = (state: RootState) => state.items.itemsById;
export const selectItemTypesByKey = (state: RootState) => state.items.itemsByKey;

export const selectItemTypesSortedWithName = (state: RootState) => state.items.localizedItems;

export const selectItemTypesByIdWithName = (state: RootState) => state.items.localizedItemsById;
export const selectItemTypesByKeyWithName = (state: RootState) => state.items.localizedItemsByKey;

export const selectItemTypesByCategory = (categoryKey?: string) => (state: RootState) => {
  if (!categoryKey) {
    return [];
  }
  if (categoryKey === 'ALL') {
    return state.items.localizedItems;
  }
  return state.items.localizedItems?.filter((item) => item.categoryKey === categoryKey);
};

export const selectItemCategories = (state: RootState) => state.items.categories;

export const selectItemCategoriesByKey = (state: RootState) => state.items.categoriesByKey;

export const selectItemType = (key?: string) => (state: RootState) => key ? state.items.itemsByKey?.[key] : undefined;

export const selectItemCategory = (key?: string) => (state: RootState) =>
  key ? state.items.categoriesByKey?.[key] : undefined;

export const selectSelectedItemCategory = (state: RootState) => state.items.selectedCategory;

export const selectItemErrors = (state: RootState) => state.items.errors.items;
export const selectItemCategoryErrors = (state: RootState) => state.items.errors.itemCategories;

export default itemsSlice.reducer;
