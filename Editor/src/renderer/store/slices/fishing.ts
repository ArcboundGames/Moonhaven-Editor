import { createSlice } from '@reduxjs/toolkit';

import { toFishingZone, toProcessedRawFishingZone } from '../../../../../SharedLibrary/src/util/converters.util';
import { validateFishingZones as validateDataFishingZones } from '../../util/validate.util';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type { FishingDataFile, FishingZone, LootTable } from '../../../../../SharedLibrary/src/interface';

// Define a type for the slice state
export interface FishingState {
  rawData: string;
  fishingZones: FishingZone[];
  fishingZonesById: Record<number, FishingZone>;
  fishingZonesByKey: Record<string, FishingZone>;
  errors: {
    fishingZones: Record<string, string[]>;
  };
}

// Define the initial state using that type
const initialState: FishingState = {
  rawData: '',
  fishingZones: [],
  fishingZonesById: {},
  fishingZonesByKey: {},
  errors: {
    fishingZones: {}
  }
};

export const fishingSlice = createSlice({
  name: 'fishing',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setRawFishingData: (state, action: PayloadAction<string>) => ({ ...state, rawData: action.payload }),
    updateFishingZones: (state, action: PayloadAction<FishingZone[]>) => {
      const fishingZonesById: Record<number, FishingZone> = {};
      const fishingZonesByKey: Record<string, FishingZone> = {};
      action.payload.forEach((fishingZone) => {
        fishingZonesById[fishingZone.id] = fishingZone;
        fishingZonesByKey[fishingZone.key] = fishingZone;
      });
      return {
        ...state,
        fishingZones: action.payload,
        fishingZonesById,
        fishingZonesByKey
      };
    },
    validateFishingZones: (
      state,
      action: PayloadAction<{
        fishingZones: FishingZone[];
        lootTablesByKey: Record<string, LootTable>;
      }>
    ) => {
      const { fishingZones, lootTablesByKey } = action.payload;

      return {
        ...state,
        errors: {
          ...state.errors,
          fishingZones: validateDataFishingZones(fishingZones, lootTablesByKey)
        }
      };
    },
    loadFishingData: (state, action: PayloadAction<string>) => {
      if (action.payload === state.rawData) {
        return state;
      }

      const data = JSON.parse(action.payload) as FishingDataFile;

      const fishingZonesById: Record<number, FishingZone> = {};
      const fishingZonesByKey: Record<string, FishingZone> = {};
      const fishingZones =
        data.zones?.map<FishingZone>((rawFishingZone) => {
          const fishingZone: FishingZone = toFishingZone(toProcessedRawFishingZone(rawFishingZone));
          fishingZonesById[fishingZone.id] = fishingZone;
          fishingZonesByKey[fishingZone.key] = fishingZone;
          return fishingZone;
        }) ?? [];

      return {
        ...state,
        fishingZones,
        fishingZonesById,
        fishingZonesByKey,
        rawData: action.payload
      };
    }
  }
});

export const { setRawFishingData, loadFishingData, updateFishingZones, validateFishingZones } = fishingSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectRawFishingData = (state: RootState) => state.fishing.rawData;

export const selectFishingZones = (state: RootState) => state.fishing.fishingZones;

export const selectFishingZonesById = (state: RootState) => state.fishing.fishingZonesById;

export const selectFishingZoneById = (id?: number) => (state: RootState) =>
  id ? state.fishing.fishingZonesById?.[id] : undefined;

export const selectFishingZoneByKey = (key?: string) => (state: RootState) =>
  key ? state.fishing.fishingZonesByKey?.[key] : undefined;

export const selectFishingZoneErrors = (state: RootState) => state.fishing.errors.fishingZones;

export default fishingSlice.reducer;
