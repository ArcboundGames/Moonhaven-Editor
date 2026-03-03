import { toWorldSettings, toProcessedRawWorldSettings } from '../../../../../../SharedLibrary/src/util/converters.util';
import * as validateMod from '../../../util/validate.util';
import reducer, {
  loadWorldSettingsData,
  selectRawWorldSettings,
  selectWorldSettings,
  selectWorldSettingsErrors,
  setRawWorldSettingsData,
  updateWorldSettings,
  validateWorldSettings,
  type WorldState
} from '../world';

import type { WorldSettings, RawWorldSettings } from '../../../../../../SharedLibrary/src/interface';
import type { RootState } from '../..';

jest.mock('../../../util/validate.util', () => ({
  validateWorldSettings: jest.fn(() => [])
}));

const defaultWorldSettings: WorldSettings = toWorldSettings(toProcessedRawWorldSettings({}));

const initialState: WorldState = {
  rawData: '',
  data: defaultWorldSettings,
  errors: []
};

function mockRootState(overrides: Partial<WorldState> = {}): Pick<RootState, 'world'> {
  return {
    world: { ...initialState, ...overrides }
  } as Pick<RootState, 'world'>;
}

describe('world slice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('returns the correct initial state', () => {
      const state = reducer(undefined, { type: 'unknown' });
      expect(state.rawData).toBe('');
      expect(state.data).toEqual(defaultWorldSettings);
      expect(state.errors).toEqual([]);
    });
  });

  describe('reducers', () => {
    describe('setRawWorldSettingsData', () => {
      it('sets rawData without parsing', () => {
        const state = reducer(initialState, setRawWorldSettingsData('raw'));
        expect(state.rawData).toBe('raw');
        expect(state.data).toEqual(defaultWorldSettings);
      });
    });

    describe('updateWorldSettings', () => {
      it('replaces data', () => {
        const newData: WorldSettings = {
          ...defaultWorldSettings,
          weather: { rainChance: 50, snowChance: 25 }
        };
        const state = reducer(initialState, updateWorldSettings(newData));
        expect(state.data).toEqual(newData);
      });
    });

    describe('validateWorldSettings', () => {
      it('calls validateDataWorldSettings and stores errors', () => {
        const mockErrors = ['weather error'];
        jest.mocked(validateMod.validateWorldSettings).mockReturnValue(mockErrors);

        const state = reducer(initialState, validateWorldSettings({ worldSettings: defaultWorldSettings }));
        expect(state.errors).toEqual(mockErrors);
        expect(validateMod.validateWorldSettings).toHaveBeenCalledWith(defaultWorldSettings);
      });
    });

    describe('loadWorldSettingsData', () => {
      it('parses JSON and converts to WorldSettings', () => {
        const rawData: RawWorldSettings = {};
        const json = JSON.stringify(rawData);
        const state = reducer(initialState, loadWorldSettingsData(json));
        expect(state.rawData).toBe(json);
        expect(state.data).toEqual(toWorldSettings(toProcessedRawWorldSettings(rawData)));
      });

      it('returns same state when rawData matches (early return)', () => {
        const json = JSON.stringify({});
        const prev: WorldState = { ...initialState, rawData: json };
        const state = reducer(prev, loadWorldSettingsData(json));
        expect(state).toBe(prev);
      });

      it('replaces previous data on new payload', () => {
        const json1 = JSON.stringify({});
        const prev: WorldState = { ...initialState, rawData: json1 };
        const json2 = JSON.stringify({ weather: { rainChance: 10, snowChance: 5 } });
        const state = reducer(prev, loadWorldSettingsData(json2));
        expect(state.rawData).toBe(json2);
      });
    });
  });

  describe('selectors', () => {
    it('selectRawWorldSettings returns rawData', () => {
      expect(selectRawWorldSettings(mockRootState({ rawData: 'raw' }) as RootState)).toBe('raw');
    });

    it('selectWorldSettings returns data', () => {
      expect(selectWorldSettings(mockRootState() as RootState)).toEqual(defaultWorldSettings);
    });

    it('selectWorldSettingsErrors returns errors', () => {
      expect(selectWorldSettingsErrors(mockRootState({ errors: ['err'] }) as RootState)).toEqual(['err']);
    });
  });
});
