import { createSlice } from '@reduxjs/toolkit';

import { toPlayerData, toProcessedRawPlayerData } from '../../../../../SharedLibrary/src/util/converters.util';
import { validatePlayerData as validateDataPlayerData } from '../../util/validate.util';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type { ItemType, PlayerData, RawPlayerData } from '../../../../../SharedLibrary/src/interface';

// Define a type for the slice state
export interface PlayerState {
  rawData: string;
  data: PlayerData;
  errors: string[];
}

// Define the initial state using that type
const initialState: PlayerState = {
  rawData: '',
  data: toPlayerData(toProcessedRawPlayerData({})),
  errors: []
};

export const playerSlice = createSlice({
  name: 'player',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setRawPlayerData: (state, action: PayloadAction<string>) => ({ ...state, rawData: action.payload }),
    updatePlayerData: (state, action: PayloadAction<PlayerData>) => ({
      ...state,
      data: action.payload
    }),
    validatePlayerData: (
      state,
      action: PayloadAction<{
        playerData: PlayerData;
        itemsByKey: Record<string, ItemType>;
      }>
    ) => {
      const { playerData, itemsByKey } = action.payload;

      return {
        ...state,
        errors: validateDataPlayerData(playerData, itemsByKey)
      };
    },
    loadPlayerData: (state, action: PayloadAction<string>) => {
      if (action.payload === state.rawData) {
        return state;
      }

      const data = JSON.parse(action.payload) as RawPlayerData;

      const playerData = toPlayerData(toProcessedRawPlayerData(data));

      return {
        ...state,
        data: playerData,
        rawData: action.payload
      };
    }
  }
});

export const { setRawPlayerData, updatePlayerData, validatePlayerData, loadPlayerData } = playerSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectRawPlayerData = (state: RootState) => state.player.rawData;

export const selectPlayerData = (state: RootState) => state.player.data;

export const selectPlayerDataErrors = (state: RootState) => state.player.errors;

export default playerSlice.reducer;
