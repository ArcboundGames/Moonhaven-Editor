import { createSlice } from '@reduxjs/toolkit';

import { toUiDataFile } from '../../../../../SharedLibrary/src/util/converters.util';
import { validateObjectDestructionMenu as validateDataObjectDestructionMenu } from '../../util/validate.util';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type {
  DestructionMenu,
  Localization,
  ObjectCategory,
  ObjectSubCategory,
  ObjectType,
  RawUiDataFile,
  UiSection
} from '../../../../../SharedLibrary/src/interface';

// Define a type for the slice state
export interface UiState {
  rawData: string;
  sections: {
    objectDestructionMenu: DestructionMenu;
  };
  errors: {
    objectDestructionMenu: string[];
  };
}

// Define the initial state using that type
const initialState: UiState = {
  rawData: '',
  sections: {
    objectDestructionMenu: {
      diameter: 0
    }
  },
  errors: {
    objectDestructionMenu: []
  }
};

export const uiSlice = createSlice({
  name: 'ui',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setRawUiData: (state, action: PayloadAction<string>) => ({ ...state, rawData: action.payload }),
    updateObjectDestructionMenu: (state, action: PayloadAction<DestructionMenu>) => ({
      ...state,
      sections: {
        ...state.sections,
        objectDestructionMenu: action.payload
      }
    }),
    validateObjectDestructionMenu: (
      state,
      action: PayloadAction<{
        objectDestructionMenu: DestructionMenu;
        objectsByKey: Record<string, ObjectType>;
        objectCategoriesByKey: Record<string, ObjectCategory>;
        objectSubCategoriesByKey: Record<string, ObjectSubCategory>;
        localization: Localization | null | undefined;
        localizationKeys: string[];
      }>
    ) => {
      const {
        objectDestructionMenu,
        objectsByKey,
        objectCategoriesByKey,
        objectSubCategoriesByKey,
        localization,
        localizationKeys
      } = action.payload;

      return {
        ...state,
        errors: {
          ...state.errors,
          objectDestructionMenu: validateDataObjectDestructionMenu(
            objectDestructionMenu,
            objectsByKey,
            objectCategoriesByKey,
            objectSubCategoriesByKey,
            localization,
            localizationKeys
          )
        }
      };
    },
    loadUiData: (state, action: PayloadAction<string>) => {
      if (action.payload === state.rawData) {
        return state;
      }

      const data = JSON.parse(action.payload) as RawUiDataFile;

      const uiData = toUiDataFile(data);

      return {
        ...state,
        sections: {
          objectDestructionMenu: uiData.objectDestructionMenu || {
            diameter: 0
          }
        },
        rawData: action.payload
      };
    }
  }
});

export const { setRawUiData, loadUiData, updateObjectDestructionMenu, validateObjectDestructionMenu } = uiSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectRawUiData = (state: RootState) => state.ui.rawData;

export const selectUiSectionKeys = (state: RootState) => Object.keys(state.ui.sections);

export const selectUiSections = (state: RootState) => state.ui.sections;

export const selectUiSection = (section: UiSection) => (state: RootState) => state.ui.sections[section];

export const selectUiErrors = (state: RootState) => state.ui.errors;

export const selectUiSectionErrors = (section: UiSection) => (state: RootState) => state.ui.errors[section];

export default uiSlice.reducer;
