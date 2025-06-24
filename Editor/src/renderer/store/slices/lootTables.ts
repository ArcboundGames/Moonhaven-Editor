import { createSlice } from '@reduxjs/toolkit';

import { toLootTable, toProcessedRawLootTable } from '../../../../../SharedLibrary/src/util/converters.util';
import { validateLootTables as validateDataLootTables } from '../../util/validate.util';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type { ItemType, LootTable, LootTableDataFile } from '../../../../../SharedLibrary/src/interface';

// Define a type for the slice state
export interface LootTablesState {
  rawData: string;
  lootTables: LootTable[];
  lootTablesByKey: Record<string, LootTable>;
  errors: Record<string, string[]>;
}

// Define the initial state using that type
const initialState: LootTablesState = {
  rawData: '',
  lootTables: [],
  lootTablesByKey: {},
  errors: {}
};

export const lootTablesSlice = createSlice({
  name: 'lootTables',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setRawLootTableData: (state, action: PayloadAction<string>) => ({ ...state, rawData: action.payload }),
    updateLootTables: (state, action: PayloadAction<LootTable[]>) => {
      const lootTables = [...action.payload];
      const lootTablesByKey: Record<string, LootTable> = {};
      action.payload.forEach((lootTable) => {
        lootTablesByKey[lootTable.key] = lootTable;
      });
      lootTables.sort((a, b) => a.key.localeCompare(b.key));
      return {
        ...state,
        lootTables,
        lootTablesByKey
      };
    },
    validateLootTables: (
      state,
      action: PayloadAction<{
        lootTables: LootTable[];
        itemsByKey: Record<string, ItemType>;
      }>
    ) => {
      const { lootTables, itemsByKey } = action.payload;

      return {
        ...state,
        errors: validateDataLootTables(lootTables, itemsByKey)
      };
    },
    loadLootTableData: (state, action: PayloadAction<string>) => {
      if (action.payload === state.rawData) {
        return state;
      }

      const data = JSON.parse(action.payload) as LootTableDataFile;

      const lootTablesByKey: Record<string, LootTable> = {};
      const lootTables =
        data.lootTables?.map<LootTable>((rawLootTable, index) => {
          const lootTable: LootTable = toLootTable(toProcessedRawLootTable(rawLootTable), index);
          lootTablesByKey[lootTable.key] = lootTable;
          return lootTable;
        }) ?? [];

      lootTables.sort((a, b) => a.key.localeCompare(b.key));

      return {
        ...state,
        lootTables,
        lootTablesByKey,
        rawData: action.payload
      };
    }
  }
});

export const { setRawLootTableData, loadLootTableData, updateLootTables, validateLootTables } = lootTablesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectRawLootTableData = (state: RootState) => state.lootTables.rawData;

export const selectLootTables = (state: RootState) => state.lootTables.lootTables;

export const selectLootTablesByKey = (state: RootState) => state.lootTables.lootTablesByKey;

export const selectLootTable = (key?: string) => (state: RootState) =>
  key ? state.lootTables.lootTablesByKey?.[key] : undefined;

export const selectLootTableErrors = (state: RootState) => state.lootTables.errors;

export default lootTablesSlice.reducer;
