import { createSlice } from '@reduxjs/toolkit';

import { toProcessedRawWorldSettings, toWorldSettings } from '../../../../../SharedLibrary/src/util/converters.util';
import { validateWorldSettings as validateDataWorldSettings } from '../../util/validate.util';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type { RawWorldSettings, WorldSettings } from '../../../../../SharedLibrary/src/interface';

// Define a type for the slice state
export interface WorldState {
  rawData: string;
  data: WorldSettings;
  errors: string[];
}

// Define the initial state using that type
const initialState: WorldState = {
  rawData: '',
  data: toWorldSettings(toProcessedRawWorldSettings({})),
  errors: []
};

export const worldSlice = createSlice({
  name: 'world',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setRawWorldSettingsData: (state, action: PayloadAction<string>) => ({ ...state, rawData: action.payload }),
    updateWorldSettings: (state, action: PayloadAction<WorldSettings>) => ({
      ...state,
      data: action.payload
    }),
    validateWorldSettings: (
      state,
      action: PayloadAction<{
        worldSettings: WorldSettings;
      }>
    ) => {
      const { worldSettings } = action.payload;

      return {
        ...state,
        errors: validateDataWorldSettings(worldSettings)
      };
    },
    loadWorldSettingsData: (state, action: PayloadAction<string>) => {
      if (action.payload === state.rawData) {
        return state;
      }

      const data = JSON.parse(action.payload) as RawWorldSettings;

      const worldSettings = toWorldSettings(toProcessedRawWorldSettings(data));

      return {
        ...state,
        data: worldSettings,
        rawData: action.payload
      };
    }
  }
});

export const { setRawWorldSettingsData, updateWorldSettings, validateWorldSettings, loadWorldSettingsData } =
  worldSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectRawWorldSettings = (state: RootState) => state.world.rawData;

export const selectWorldSettings = (state: RootState) => state.world.data;

export const selectWorldSettingsErrors = (state: RootState) => state.world.errors;

export default worldSlice.reducer;
