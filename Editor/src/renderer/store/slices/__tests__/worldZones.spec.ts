import { toWorldZone, toProcessedRawWorldZone } from '../../../../../../SharedLibrary/src/util/converters.util';
import * as validateMod from '../../../util/validate.util';
import reducer, {
  loadWorldZoneData,
  selectRawWorldZoneData,
  selectWorldZoneById,
  selectWorldZoneByKey,
  selectWorldZoneErrors,
  selectWorldZones,
  selectWorldZonesById,
  selectWorldZonesByKey,
  setRawWorldZoneData,
  updateWorldZones,
  validateWorldZones,
  type WorldZonesState
} from '../worldZones';

import type { WorldZone } from '../../../../../../SharedLibrary/src/interface';
import type { RootState } from '../..';

jest.mock('../../../util/validate.util', () => ({
  validateWorldZones: jest.fn(() => ({}))
}));

function makeWorldZone(key: string, id: number): WorldZone {
  return toWorldZone(toProcessedRawWorldZone({ key, id, spawns: [] }));
}

const initialState: WorldZonesState = {
  rawData: '',
  worldZones: [],
  worldZonesById: {},
  worldZonesByKey: {},
  errors: {}
};

function mockRootState(overrides: Partial<WorldZonesState> = {}): Pick<RootState, 'worldZones'> {
  return { worldZones: { ...initialState, ...overrides } } as Pick<RootState, 'worldZones'>;
}

describe('worldZones slice', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('initial state', () => {
    it('returns the correct initial state', () => {
      const state = reducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    describe('setRawWorldZoneData', () => {
      it('sets rawData', () => {
        const state = reducer(initialState, setRawWorldZoneData('raw'));
        expect(state.rawData).toBe('raw');
      });
    });

    describe('updateWorldZones', () => {
      it('builds lookups by id and key', () => {
        const z1 = makeWorldZone('ZONE_A', 1);
        const z2 = makeWorldZone('ZONE_B', 2);
        const state = reducer(initialState, updateWorldZones([z1, z2]));
        expect(state.worldZones).toEqual([z1, z2]);
        expect(state.worldZonesById[1]).toEqual(z1);
        expect(state.worldZonesByKey['ZONE_B']).toEqual(z2);
      });
    });

    describe('validateWorldZones', () => {
      it('calls validate and stores errors', () => {
        const mockErrors = { ZONE_A: ['err'] };
        jest.mocked(validateMod.validateWorldZones).mockReturnValue(mockErrors);
        const state = reducer(initialState, validateWorldZones({ worldZones: [], creaturesByKey: {} }));
        expect(state.errors).toEqual(mockErrors);
        expect(validateMod.validateWorldZones).toHaveBeenCalledWith([], {});
      });
    });

    describe('loadWorldZoneData', () => {
      it('parses JSON from zones key and builds lookups', () => {
        const json = JSON.stringify({ zones: [{ key: 'ZONE_A', id: 1 }] });
        const state = reducer(initialState, loadWorldZoneData(json));
        expect(state.rawData).toBe(json);
        expect(state.worldZones).toHaveLength(1);
        expect(state.worldZones[0].key).toBe('ZONE_A');
        expect(state.worldZonesById[1].key).toBe('ZONE_A');
        expect(state.worldZonesByKey['ZONE_A'].id).toBe(1);
      });

      it('returns same state on duplicate rawData', () => {
        const json = JSON.stringify({ zones: [] });
        const prev: WorldZonesState = { ...initialState, rawData: json };
        const state = reducer(prev, loadWorldZoneData(json));
        expect(state).toBe(prev);
      });

      it('handles missing zones array', () => {
        const json = JSON.stringify({});
        const state = reducer(initialState, loadWorldZoneData(json));
        expect(state.worldZones).toEqual([]);
      });
    });
  });

  describe('selectors', () => {
    const z1 = makeWorldZone('ZONE_A', 1);

    it('selectRawWorldZoneData', () => {
      expect(selectRawWorldZoneData(mockRootState({ rawData: 'x' }) as RootState)).toBe('x');
    });

    it('selectWorldZones', () => {
      expect(selectWorldZones(mockRootState({ worldZones: [z1] }) as RootState)).toEqual([z1]);
    });

    it('selectWorldZonesById', () => {
      expect(selectWorldZonesById(mockRootState({ worldZonesById: { 1: z1 } }) as RootState)).toEqual({ 1: z1 });
    });

    it('selectWorldZonesByKey', () => {
      expect(selectWorldZonesByKey(mockRootState({ worldZonesByKey: { ZONE_A: z1 } }) as RootState)).toEqual({
        ZONE_A: z1
      });
    });

    it('selectWorldZoneById with valid id', () => {
      expect(selectWorldZoneById(1)(mockRootState({ worldZonesById: { 1: z1 } }) as RootState)).toEqual(z1);
    });

    it('selectWorldZoneById with undefined', () => {
      expect(selectWorldZoneById(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    it('selectWorldZoneByKey with valid key', () => {
      expect(selectWorldZoneByKey('ZONE_A')(mockRootState({ worldZonesByKey: { ZONE_A: z1 } }) as RootState)).toEqual(
        z1
      );
    });

    it('selectWorldZoneByKey with undefined', () => {
      expect(selectWorldZoneByKey(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    it('selectWorldZoneErrors', () => {
      const errors = { ZONE_A: ['err'] };
      expect(selectWorldZoneErrors(mockRootState({ errors }) as RootState)).toEqual(errors);
    });
  });
});
