import { toFishingZone, toProcessedRawFishingZone } from '../../../../../../SharedLibrary/src/util/converters.util';
import * as validateMod from '../../../util/validate.util';
import reducer, {
  loadFishingData,
  selectFishingZoneById,
  selectFishingZoneByKey,
  selectFishingZoneErrors,
  selectFishingZones,
  selectFishingZonesById,
  selectRawFishingData,
  setRawFishingData,
  updateFishingZones,
  validateFishingZones,
  type FishingState
} from '../fishing';

import type { FishingZone } from '../../../../../../SharedLibrary/src/interface';
import type { RootState } from '../..';

jest.mock('../../../util/validate.util', () => ({
  validateFishingZones: jest.fn(() => ({}))
}));

function makeFishingZone(key: string, id: number): FishingZone {
  return toFishingZone(toProcessedRawFishingZone({ key, id }));
}

const initialState: FishingState = {
  rawData: '',
  fishingZones: [],
  fishingZonesById: {},
  fishingZonesByKey: {},
  errors: { fishingZones: {} }
};

function mockRootState(overrides: Partial<FishingState> = {}): Pick<RootState, 'fishing'> {
  return { fishing: { ...initialState, ...overrides } } as Pick<RootState, 'fishing'>;
}

describe('fishing slice', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('initial state', () => {
    it('returns the correct initial state', () => {
      const state = reducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    describe('setRawFishingData', () => {
      it('sets rawData', () => {
        const state = reducer(initialState, setRawFishingData('raw'));
        expect(state.rawData).toBe('raw');
      });
    });

    describe('updateFishingZones', () => {
      it('builds lookups by id and key', () => {
        const z1 = makeFishingZone('ZONE_A', 1);
        const z2 = makeFishingZone('ZONE_B', 2);
        const state = reducer(initialState, updateFishingZones([z1, z2]));
        expect(state.fishingZones).toEqual([z1, z2]);
        expect(state.fishingZonesById[1]).toEqual(z1);
        expect(state.fishingZonesByKey['ZONE_B']).toEqual(z2);
      });
    });

    describe('validateFishingZones', () => {
      it('calls validate and stores nested errors', () => {
        const mockErrors = { ZONE_A: ['err'] };
        jest.mocked(validateMod.validateFishingZones).mockReturnValue(mockErrors);
        const state = reducer(initialState, validateFishingZones({ fishingZones: [], lootTablesByKey: {} }));
        expect(state.errors.fishingZones).toEqual(mockErrors);
        expect(validateMod.validateFishingZones).toHaveBeenCalledWith([], {});
      });
    });

    describe('loadFishingData', () => {
      it('parses JSON from zones key and builds lookups', () => {
        const json = JSON.stringify({ zones: [{ key: 'ZONE_A', id: 1 }] });
        const state = reducer(initialState, loadFishingData(json));
        expect(state.rawData).toBe(json);
        expect(state.fishingZones).toHaveLength(1);
        expect(state.fishingZones[0].key).toBe('ZONE_A');
        expect(state.fishingZonesById[1].key).toBe('ZONE_A');
        expect(state.fishingZonesByKey['ZONE_A'].id).toBe(1);
      });

      it('returns same state on duplicate rawData', () => {
        const json = JSON.stringify({ zones: [] });
        const prev: FishingState = { ...initialState, rawData: json };
        const state = reducer(prev, loadFishingData(json));
        expect(state).toBe(prev);
      });

      it('handles missing zones array', () => {
        const json = JSON.stringify({});
        const state = reducer(initialState, loadFishingData(json));
        expect(state.fishingZones).toEqual([]);
      });
    });
  });

  describe('selectors', () => {
    const z1 = makeFishingZone('ZONE_A', 1);

    it('selectRawFishingData', () => {
      expect(selectRawFishingData(mockRootState({ rawData: 'x' }) as RootState)).toBe('x');
    });

    it('selectFishingZones', () => {
      expect(selectFishingZones(mockRootState({ fishingZones: [z1] }) as RootState)).toEqual([z1]);
    });

    it('selectFishingZonesById', () => {
      expect(selectFishingZonesById(mockRootState({ fishingZonesById: { 1: z1 } }) as RootState)).toEqual({ 1: z1 });
    });

    it('selectFishingZoneById with valid id', () => {
      expect(selectFishingZoneById(1)(mockRootState({ fishingZonesById: { 1: z1 } }) as RootState)).toEqual(z1);
    });

    it('selectFishingZoneById with undefined', () => {
      expect(selectFishingZoneById(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    it('selectFishingZoneByKey with valid key', () => {
      expect(
        selectFishingZoneByKey('ZONE_A')(mockRootState({ fishingZonesByKey: { ZONE_A: z1 } }) as RootState)
      ).toEqual(z1);
    });

    it('selectFishingZoneByKey with undefined', () => {
      expect(selectFishingZoneByKey(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    it('selectFishingZoneErrors', () => {
      const errors = { ZONE_A: ['err'] };
      expect(selectFishingZoneErrors(mockRootState({ errors: { fishingZones: errors } }) as RootState)).toEqual(errors);
    });
  });
});
