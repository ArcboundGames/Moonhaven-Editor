import { createSlice } from '@reduxjs/toolkit';

import { toProcessedRawWorldZone, toWorldZone } from '../../../../../SharedLibrary/src/util/converters.util';
import { validateWorldZones as validateDataWorldZones } from '../../util/validate.util';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type { CreatureType, WorldZone, WorldZonesDataFile } from '../../../../../SharedLibrary/src/interface';

// Define a type for the slice state
export interface WorldZonesState {
  rawData: string;
  worldZones: WorldZone[];
  worldZonesById: Record<number, WorldZone>;
  worldZonesByKey: Record<string, WorldZone>;
  errors: Record<string, string[]>;
}

// Define the initial state using that type
const initialState: WorldZonesState = {
  rawData: '',
  worldZones: [],
  worldZonesById: {},
  worldZonesByKey: {},
  errors: {}
};

export const worldZonesSlice = createSlice({
  name: 'worldZones',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setRawWorldZoneData: (state, action: PayloadAction<string>) => ({ ...state, rawData: action.payload }),
    updateWorldZones: (state, action: PayloadAction<WorldZone[]>) => {
      const worldZonesById: Record<number, WorldZone> = {};
      const worldZonesByKey: Record<string, WorldZone> = {};
      action.payload.forEach((worldZone) => {
        worldZonesById[worldZone.id] = worldZone;
        worldZonesByKey[worldZone.key] = worldZone;
      });

      return {
        ...state,
        worldZonesById,
        worldZonesByKey,
        worldZones: action.payload
      };
    },
    validateWorldZones: (
      state,
      action: PayloadAction<{
        worldZones: WorldZone[];
        creaturesByKey: Record<string, CreatureType>;
      }>
    ) => {
      const { worldZones, creaturesByKey } = action.payload;

      return {
        ...state,
        errors: validateDataWorldZones(worldZones, creaturesByKey)
      };
    },
    loadWorldZoneData: (state, action: PayloadAction<string>) => {
      if (action.payload === state.rawData) {
        return state;
      }

      const data = JSON.parse(action.payload) as WorldZonesDataFile;

      const worldZones = data.zones?.map((rawWorldZone) => toWorldZone(toProcessedRawWorldZone(rawWorldZone))) ?? [];

      const worldZonesById: Record<number, WorldZone> = {};
      const worldZonesByKey: Record<string, WorldZone> = {};
      worldZones.forEach((worldZone) => {
        worldZonesById[worldZone.id] = worldZone;
        worldZonesByKey[worldZone.key] = worldZone;
      });

      return {
        ...state,
        worldZones,
        worldZonesById,
        worldZonesByKey,
        rawData: action.payload
      };
    }
  }
});

export const { setRawWorldZoneData, loadWorldZoneData, updateWorldZones, validateWorldZones } = worldZonesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectRawWorldZoneData = (state: RootState) => state.worldZones.rawData;

export const selectWorldZones = (state: RootState) => state.worldZones.worldZones;

export const selectWorldZonesById = (state: RootState) => state.worldZones.worldZonesById;

export const selectWorldZonesByKey = (state: RootState) => state.worldZones.worldZonesByKey;

export const selectWorldZoneById = (id?: number) => (state: RootState) =>
  id ? state.worldZones.worldZonesById?.[id] : undefined;

export const selectWorldZoneByKey = (key?: string) => (state: RootState) =>
  key ? state.worldZones.worldZonesByKey?.[key] : undefined;

export const selectWorldZoneErrors = (state: RootState) => state.worldZones.errors;

export default worldZonesSlice.reducer;
