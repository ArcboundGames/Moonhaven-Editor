import { createSlice } from '@reduxjs/toolkit';

import { ENGLISH_LOCALIZATION } from '../../../../../SharedLibrary/src/constants';
import {
  toLocalizationFile,
  toProcessedRawLocalizationFile
} from '../../../../../SharedLibrary/src/util/converters.util';
import { sortLocalization } from '../../../../../SharedLibrary/src/util/localization.util';
import {
  validateLocalizationKeys as validateDataLocalizationKeys,
  validateLocalizations as validateDataLocalizations
} from '../../util/validate.util';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type { Localization, RawLocalizationFile } from '../../../../../SharedLibrary/src/interface';

// Define a type for the slice state
export interface LocalizationsState {
  rawData: string;
  keys: string[];
  localizations: Localization[];
  localizationsByKey: Record<string, Localization>;
  errors: {
    keys: Record<string, string[]>;
    localizations: Record<string, string[]>;
  };
}

// Define the initial state using that type
const initialState: LocalizationsState = {
  rawData: '',
  keys: [],
  localizations: [],
  localizationsByKey: {},
  errors: {
    keys: {},
    localizations: {}
  }
};

export const localizationsSlice = createSlice({
  name: 'localizations',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setRawLocalizationData: (state, action: PayloadAction<string>) => ({ ...state, rawData: action.payload }),
    updateLocalizationKeys: (state, action: PayloadAction<string[]>) => {
      const keys = [...action.payload];
      keys.sort((a, b) => a.localeCompare(b));
      return {
        ...state,
        keys
      };
    },
    updateLocalizations: (state, action: PayloadAction<Localization[]>) => {
      const localizationsByKey: Record<string, Localization> = {};
      action.payload.forEach((localization) => {
        localizationsByKey[localization.key] = localization;
      });
      return {
        ...state,
        localizations: action.payload,
        localizationsByKey
      };
    },
    updateLocalizationsAndKeys: (state, action: PayloadAction<{ keys: string[]; localizations: Localization[] }>) => {
      const localizationsByKey: Record<string, Localization> = {};
      action.payload.localizations.forEach((localization) => {
        localizationsByKey[localization.key] = localization;
      });

      const keys = [...action.payload.keys];
      keys.sort((a, b) => a.localeCompare(b));

      return {
        ...state,
        keys,
        localizations: action.payload.localizations.map(sortLocalization),
        localizationsByKey
      };
    },
    validateLocalizationKeys: (
      state,
      action: PayloadAction<{
        localizationKeys: string[];
      }>
    ) => {
      const { localizationKeys } = action.payload;

      return {
        ...state,
        errors: {
          ...state.errors,
          keys: validateDataLocalizationKeys(localizationKeys)
        }
      };
    },
    validateLocalizations: (
      state,
      action: PayloadAction<{
        localizations: Localization[];
        localizationKeys: string[];
      }>
    ) => {
      const { localizations, localizationKeys } = action.payload;

      return {
        ...state,
        errors: {
          ...state.errors,
          localizations: validateDataLocalizations(localizations, localizationKeys)
        }
      };
    },
    loadLocalizationData: (state, action: PayloadAction<string>) => {
      if (action.payload === state.rawData) {
        return state;
      }

      const { keys, localizations } = toLocalizationFile(
        toProcessedRawLocalizationFile(JSON.parse(action.payload) as RawLocalizationFile)
      );

      const localizationsByKey: Record<string, Localization> = {};
      localizations.forEach((localization) => {
        localizationsByKey[localization.key] = localization;
      });

      keys.sort((a, b) => a.localeCompare(b));

      return {
        ...state,
        keys,
        localizations,
        localizationsByKey,
        rawData: action.payload
      };
    },
    updateAddLocalizationKeys: (state, action: PayloadAction<Record<string, string>>) => {
      const englishIndex = state.localizations.findIndex(
        (localization) => localization.key.toLowerCase() === ENGLISH_LOCALIZATION.toLowerCase()
      );
      if (englishIndex < 0) {
        return state;
      }

      const newLocalizations = [...state.localizations];
      const englishLocalization = state.localizations[englishIndex];
      const newEnglishLocalization = {
        ...englishLocalization,
        values: {
          ...englishLocalization.values,
          ...action.payload
        }
      };
      newLocalizations[englishIndex] = newEnglishLocalization;

      const newLocalizationsByKey = {
        ...state.localizationsByKey,
        [newEnglishLocalization.key]: newEnglishLocalization
      };

      let newKeys = [...state.keys, ...Object.keys(action.payload)];
      newKeys = newKeys.filter((value, index, self) => self.indexOf(value) === index);
      newKeys.sort((a, b) => a.localeCompare(b));

      return {
        ...state,
        keys: newKeys,
        localizations: newLocalizations,
        localizationsByKey: newLocalizationsByKey
      };
    }
  }
});

export const {
  setRawLocalizationData,
  loadLocalizationData,
  updateLocalizationKeys,
  updateLocalizations,
  validateLocalizationKeys,
  validateLocalizations,
  updateAddLocalizationKeys,
  updateLocalizationsAndKeys
} = localizationsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectRawLocalizationData = (state: RootState) => state.localizations.rawData;

export const selectLocalizationKeys = (state: RootState) => state.localizations.keys;

export const selectLocalizations = (state: RootState) => state.localizations.localizations;

export const selectLocalizationsByKey = (state: RootState) => state.localizations.localizationsByKey;

export const selectLocalization = (key?: string) => (state: RootState) =>
  key ? state.localizations.localizationsByKey?.[key] : undefined;

export const selectLocalizationKeysErrors = (state: RootState) => state.localizations.errors.keys;

export const selectLocalizationsErrors = (state: RootState) => state.localizations.errors.localizations;

export default localizationsSlice.reducer;
