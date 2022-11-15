import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  toObjectCategory,
  toObjectSubCategory,
  toObjectType,
  toProcessedRawObjectCategory,
  toProcessedRawObjectSubCategory,
  toProcessedRawObjectType
} from '../../../../../SharedLibrary/src/util/converters.util';
import { getLocalizationKey, getLocalizedValue } from '../../../../../SharedLibrary/src/util/localization.util';
import { isNotEmpty } from '../../../../../SharedLibrary/src/util/string.util';
import {
  validateObjectCategories as validateDataObjectCategories,
  validateObjects as validateDataObjects,
  validateObjectSubCategories as validateDataObjectSubCategories
} from '../../util/validate.util';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunkOptions, RootState } from '..';
import type {
  Localization,
  LocalizedObjectType,
  LootTable,
  ObjectCategory,
  ObjectDataFile,
  ObjectSubCategory,
  ObjectType
} from '../../../../../SharedLibrary/src/interface';

// Define a type for the slice state
export interface ObjectsState {
  rawData: string;
  loaded: boolean;
  categories: ObjectCategory[];
  subCategories: ObjectSubCategory[];
  objects: ObjectType[];
  categoriesByKey: Record<string, ObjectCategory>;
  subCategoriesByKey: Record<string, ObjectSubCategory>;
  objectsByKey: Record<string, ObjectType>;
  localizedObjects: LocalizedObjectType[];
  localizedObjectsByKey: Record<string, LocalizedObjectType>;
  selectedCategory: string;
  selectedSubCategory: string;
  errors: {
    objects: Record<string, string[]>;
    objectCategories: Record<string, string[]>;
    objectSubCategories: Record<string, string[]>;
  };
  spritesVersion: number;
}

// Define the initial state using that type
const initialState: ObjectsState = {
  rawData: '',
  loaded: false,
  selectedCategory: 'ALL',
  selectedSubCategory: 'ALL',
  categories: [],
  subCategories: [],
  objects: [],
  categoriesByKey: {},
  subCategoriesByKey: {},
  objectsByKey: {},
  localizedObjects: [],
  localizedObjectsByKey: {},
  errors: {
    objects: {},
    objectCategories: {},
    objectSubCategories: {}
  },
  spritesVersion: 0
};

interface ValidateObjectsPayload {
  objects: ObjectType[];
  objectCategoriesByKey: Record<string, ObjectCategory>;
  objectSubCategories: ObjectSubCategory[];
  objectSubCategoriesByKey: Record<string, ObjectSubCategory>;
  lootTablesByKey: Record<string, LootTable>;
  objectsByKey: Record<string, ObjectType>;
  localization: Localization | null | undefined;
  localizationKeys: string[];
  path: string | undefined;
}

const validateObjects = createAsyncThunk<Record<string, string[]>, ValidateObjectsPayload, AppThunkOptions>(
  'objects/validateObjectsStatus',
  async (payload: ValidateObjectsPayload) => {
    const {
      objects,
      objectCategoriesByKey,
      objectSubCategories,
      objectSubCategoriesByKey,
      lootTablesByKey,
      objectsByKey,
      localization,
      localizationKeys,
      path
    } = payload;

    return validateDataObjects(
      objects,
      objectCategoriesByKey,
      objectSubCategories,
      objectSubCategoriesByKey,
      lootTablesByKey,
      objectsByKey,
      localization,
      localizationKeys,
      path
    );
  }
);

export const objectsSlice = createSlice({
  name: 'objects',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    incrementSpritesVersion: (state) => ({ ...state, spritesVersion: state.spritesVersion + 1 }),
    setRawObjectData: (state, action: PayloadAction<string>) => ({ ...state, rawData: action.payload }),
    setSelectedObjectCategory: (state, action: PayloadAction<string | undefined>) => {
      if (state.selectedCategory === action.payload) {
        return state;
      }
      return { ...state, selectedCategory: action.payload ?? 'ALL', selectedSubCategory: 'ALL' };
    },
    setSelectedObjectSubCategory: (state, action: PayloadAction<string | undefined>) => {
      if (state.selectedSubCategory === action.payload) {
        return state;
      }
      let selectedSubCategory = 'ALL';
      if (
        action.payload !== 'ALL' &&
        state.selectedCategory &&
        action.payload &&
        state.subCategoriesByKey?.[action.payload].categoryKey === state.selectedCategory
      ) {
        selectedSubCategory = action.payload;
      }
      return { ...state, selectedSubCategory };
    },
    clearObjectSelections: (state) => {
      return { ...state, selectedCategory: 'ALL', selectedSubCategory: 'ALL' };
    },
    loadObjectData: (state, action: PayloadAction<string>) => {
      if (action.payload === state.rawData) {
        return state;
      }

      const data = JSON.parse(action.payload) as ObjectDataFile;

      const categoriesByKey: Record<string, ObjectCategory> = {};
      const categories =
        data.categories?.map<ObjectCategory>((rawCategory, index) => {
          const category: ObjectCategory = toObjectCategory(toProcessedRawObjectCategory(rawCategory), index);
          categoriesByKey[category.key] = category;
          return category;
        }) ?? [];

      const subCategoriesByKey: Record<string, ObjectSubCategory> = {};
      const subCategories =
        data.subCategories?.map<ObjectSubCategory>((rawSubCategory, index) => {
          const subCategory: ObjectSubCategory = toObjectSubCategory(
            toProcessedRawObjectSubCategory(rawSubCategory),
            index
          );
          subCategoriesByKey[subCategory.key] = subCategory;
          return subCategory;
        }) ?? [];

      const unprocessedObjects =
        data.objects?.map<ObjectType>((rawObject, index) => toObjectType(toProcessedRawObjectType(rawObject), index)) ??
        [];

      const objectsByKey: Record<string, ObjectType> = {};
      unprocessedObjects?.forEach((object) => {
        objectsByKey[object.key] = object;
      });

      return {
        ...state,
        rawData: action.payload,
        loaded: true,
        categories,
        subCategories,
        objects: unprocessedObjects,
        objectsByKey,
        categoriesByKey,
        subCategoriesByKey
      };
    },
    updateObjects: (state, action: PayloadAction<ObjectType[]>) => {
      const objectsByKey: Record<string, ObjectType> = {};
      action.payload?.forEach((object) => {
        objectsByKey[object.key] = object;
      });

      return {
        ...state,
        objects: action.payload,
        objectsByKey
      };
    },
    updateObjectCategories: (state, action: PayloadAction<ObjectCategory[]>) => {
      const categoriesByKey: Record<string, ObjectCategory> = {};
      action.payload.forEach((category) => {
        categoriesByKey[category.key] = category;
      });
      return {
        ...state,
        categories: action.payload,
        categoriesByKey
      };
    },
    updateObjectSubCategories: (state, action: PayloadAction<ObjectSubCategory[]>) => {
      const subCategoriesByKey: Record<string, ObjectSubCategory> = {};
      action.payload.forEach((subCategory) => {
        subCategoriesByKey[subCategory.key] = subCategory;
      });
      return {
        ...state,
        subCategories: action.payload,
        subCategoriesByKey
      };
    },
    validateObjectCategories: (
      state,
      action: PayloadAction<{
        objectCategories: ObjectCategory[];
        objectCategoriesByKey: Record<string, ObjectCategory>;
        objectSubCategoriesByKey: Record<string, ObjectSubCategory>;
        objectsByKey: Record<string, ObjectType>;
      }>
    ) => {
      const { objectCategories, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey } = action.payload;

      return {
        ...state,
        errors: {
          ...state.errors,
          objectCategories: validateDataObjectCategories(
            objectCategories,
            objectCategoriesByKey,
            objectSubCategoriesByKey,
            objectsByKey
          )
        }
      };
    },
    validateObjectSubCategories: (
      state,
      action: PayloadAction<{
        objectSubCategories: ObjectSubCategory[];
        objectCategoriesByKey: Record<string, ObjectCategory>;
        objectSubCategoriesByKey: Record<string, ObjectSubCategory>;
        objectsByKey: Record<string, ObjectType>;
      }>
    ) => {
      const { objectSubCategories, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey } = action.payload;

      return {
        ...state,
        errors: {
          ...state.errors,
          objectSubCategories: validateDataObjectSubCategories(
            objectSubCategories,
            objectCategoriesByKey,
            objectSubCategoriesByKey,
            objectsByKey
          )
        }
      };
    },
    localizeObjects: (
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

      const objectNamesByKey = state.objects.reduce((namesByKey, object) => {
        namesByKey[object.key] = getLocalizedValue(
          localization,
          localizationKeys,
          getLocalizationKey('object', 'name', object.key)
        );
        return namesByKey;
      }, {} as Record<string, string>);

      const localizedObjects: LocalizedObjectType[] = state.objects.map((object) => ({
        ...object,
        name: isNotEmpty(objectNamesByKey[object.key]) ? objectNamesByKey[object.key] : object.key
      }));

      const localizedObjectsByKey: Record<string, LocalizedObjectType> = {};
      localizedObjects?.forEach((object) => {
        localizedObjectsByKey[object.key] = object;
      });

      return {
        ...state,
        localizedObjects,
        localizedObjectsByKey
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(validateObjects.fulfilled, (state, action) => ({
      ...state,
      errors: {
        ...state.errors,
        objects: action.payload
      }
    }));
  }
});

export const {
  incrementSpritesVersion,
  setRawObjectData,
  setSelectedObjectCategory,
  setSelectedObjectSubCategory,
  clearObjectSelections,
  loadObjectData,
  updateObjects,
  updateObjectCategories,
  updateObjectSubCategories,
  validateObjectCategories,
  validateObjectSubCategories,
  localizeObjects
} = objectsSlice.actions;

export { validateObjects };

// Other code such as selectors can use the imported `RootState` type
export const selectSpritesVersion = (state: RootState) => state.objects.spritesVersion;

export const selectRawObjectData = (state: RootState) => state.objects.rawData;

export const selectObjectDataFileLoaded = (state: RootState) => state.objects.loaded;

export const selectObjectTypes = (state: RootState) => state.objects.objects;

export const selectObjectTypesByKey = (state: RootState) => state.objects.objectsByKey;

export const selectObjectTypesSortedWithName = (state: RootState) => state.objects.localizedObjects;

export const selectObjectTypesByKeyWithName = (state: RootState) => state.objects.localizedObjectsByKey;

export const selectObjectTypesByCategory = (categoryKey: string) => (state: RootState) =>
  state.objects.localizedObjects?.filter((object) => object.categoryKey === categoryKey);

export const selectObjectTypesByCategoryAndSubCategory =
  (categoryKey?: string, subCategoryKey?: string) =>
  (state: RootState): LocalizedObjectType[] => {
    if (!categoryKey || !subCategoryKey) {
      return [];
    }
    if (categoryKey === 'ALL') {
      return state.objects.localizedObjects;
    }
    if (subCategoryKey === 'ALL') {
      return state.objects.localizedObjects?.filter((object) => object.categoryKey === categoryKey);
    }
    return state.objects.localizedObjects?.filter(
      (object) => object.categoryKey === categoryKey && object.subCategoryKey === subCategoryKey
    );
  };

export const selectObjectCategories = (state: RootState) => state.objects.categories;

export const selectObjectCategoriesByKey = (state: RootState) => state.objects.categoriesByKey;

export const selectObjectSubCategories = (state: RootState) => state.objects.subCategories;

export const selectObjectSubCategoriesByKey = (state: RootState) => state.objects.subCategoriesByKey;

interface SelectOptions {
  allBehavior?: 'include' | 'exclude';
}

export const selectObjectSubCategoriesByCategory =
  (categoryKey?: string, options?: SelectOptions) => (state: RootState) => {
    const { allBehavior = 'exclude' } = options || {};

    if (!categoryKey || categoryKey === 'ALL') {
      return allBehavior === 'include' ? state.objects.subCategories : [];
    }
    return state.objects.subCategories?.filter((subCategory) => subCategory.categoryKey === categoryKey);
  };

export const selectObjectType = (key?: string) => (state: RootState) =>
  key ? state.objects.objectsByKey?.[key] : undefined;

export const selectObjectCategory = (key?: string) => (state: RootState) =>
  key ? state.objects.categoriesByKey?.[key] : undefined;

export const selectObjectSubCategory = (key?: string) => (state: RootState) =>
  key ? state.objects.subCategoriesByKey?.[key] : undefined;

export const selectSelectedObjectCategory = (state: RootState) => state.objects.selectedCategory;

export const selectSelectedObjectSubCategory = (state: RootState) => state.objects.selectedSubCategory;

export const selectObjectErrors = (state: RootState) => state.objects.errors.objects;
export const selectObjectCategoryErrors = (state: RootState) => state.objects.errors.objectCategories;
export const selectObjectSubCategoryErrors = (state: RootState) => state.objects.errors.objectSubCategories;

export default objectsSlice.reducer;
