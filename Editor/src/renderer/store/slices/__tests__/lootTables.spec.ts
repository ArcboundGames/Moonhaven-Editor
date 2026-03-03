import { toLootTable, toProcessedRawLootTable } from '../../../../../../SharedLibrary/src/util/converters.util';
import * as validateMod from '../../../util/validate.util';
import reducer, {
  loadLootTableData,
  selectLootTable,
  selectLootTableErrors,
  selectLootTables,
  selectLootTablesByKey,
  selectRawLootTableData,
  setRawLootTableData,
  updateLootTables,
  validateLootTables,
  type LootTablesState
} from '../lootTables';

import type { LootTable } from '../../../../../../SharedLibrary/src/interface';
import type { RootState } from '../..';

jest.mock('../../../util/validate.util', () => ({
  validateLootTables: jest.fn(() => ({}))
}));

function makeLootTable(key: string, index: number): LootTable {
  return toLootTable(toProcessedRawLootTable({ key }), index);
}

const initialState: LootTablesState = {
  rawData: '',
  lootTables: [],
  lootTablesByKey: {},
  errors: {}
};

function mockRootState(overrides: Partial<LootTablesState> = {}): Pick<RootState, 'lootTables'> {
  return { lootTables: { ...initialState, ...overrides } } as Pick<RootState, 'lootTables'>;
}

describe('lootTables slice', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('initial state', () => {
    it('returns the correct initial state', () => {
      const state = reducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    describe('setRawLootTableData', () => {
      it('sets rawData', () => {
        const state = reducer(initialState, setRawLootTableData('raw'));
        expect(state.rawData).toBe('raw');
      });
    });

    describe('updateLootTables', () => {
      it('builds lookup by key and sorts by key', () => {
        const b = makeLootTable('B_TABLE', 1);
        const a = makeLootTable('A_TABLE', 0);
        const state = reducer(initialState, updateLootTables([b, a]));
        expect(state.lootTables[0].key).toBe('A_TABLE');
        expect(state.lootTables[1].key).toBe('B_TABLE');
        expect(state.lootTablesByKey['A_TABLE']).toBeDefined();
        expect(state.lootTablesByKey['B_TABLE']).toBeDefined();
      });
    });

    describe('validateLootTables', () => {
      it('calls validate and stores errors', () => {
        const mockErrors = { TABLE_1: ['err'] };
        jest.mocked(validateMod.validateLootTables).mockReturnValue(mockErrors);
        const state = reducer(initialState, validateLootTables({ lootTables: [], itemsByKey: {} }));
        expect(state.errors).toEqual(mockErrors);
        expect(validateMod.validateLootTables).toHaveBeenCalledWith([], {});
      });
    });

    describe('loadLootTableData', () => {
      it('parses JSON and builds lookups sorted by key', () => {
        const rawB = { key: 'B_TABLE' };
        const rawA = { key: 'A_TABLE' };
        const json = JSON.stringify({ lootTables: [rawB, rawA] });
        const state = reducer(initialState, loadLootTableData(json));
        expect(state.rawData).toBe(json);
        expect(state.lootTables[0].key).toBe('A_TABLE');
        expect(state.lootTables[1].key).toBe('B_TABLE');
        expect(state.lootTablesByKey['A_TABLE']).toBeDefined();
      });

      it('returns same state on duplicate rawData', () => {
        const json = JSON.stringify({ lootTables: [] });
        const prev: LootTablesState = { ...initialState, rawData: json };
        const state = reducer(prev, loadLootTableData(json));
        expect(state).toBe(prev);
      });

      it('handles null lootTables array', () => {
        const json = JSON.stringify({});
        const state = reducer(initialState, loadLootTableData(json));
        expect(state.lootTables).toEqual([]);
      });
    });
  });

  describe('selectors', () => {
    it('selectRawLootTableData', () => {
      expect(selectRawLootTableData(mockRootState({ rawData: 'x' }) as RootState)).toBe('x');
    });

    it('selectLootTables', () => {
      const lt = makeLootTable('T', 0);
      expect(selectLootTables(mockRootState({ lootTables: [lt] }) as RootState)).toEqual([lt]);
    });

    it('selectLootTablesByKey', () => {
      const lt = makeLootTable('T', 0);
      expect(selectLootTablesByKey(mockRootState({ lootTablesByKey: { T: lt } }) as RootState)).toEqual({ T: lt });
    });

    it('selectLootTable with key returns entry', () => {
      const lt = makeLootTable('T', 0);
      const root = mockRootState({ lootTablesByKey: { T: lt } }) as RootState;
      expect(selectLootTable('T')(root)).toEqual(lt);
    });

    it('selectLootTable with undefined key returns undefined', () => {
      expect(selectLootTable(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    it('selectLootTable with missing key returns undefined', () => {
      expect(selectLootTable('MISSING')(mockRootState() as RootState)).toBeUndefined();
    });

    it('selectLootTableErrors', () => {
      const errors = { T: ['err'] };
      expect(selectLootTableErrors(mockRootState({ errors }) as RootState)).toEqual(errors);
    });
  });
});
