import { toPlayerData, toProcessedRawPlayerData } from '../../../../../../SharedLibrary/src/util/converters.util';
import * as validateMod from '../../../util/validate.util';
import reducer, {
  loadPlayerData,
  selectPlayerData,
  selectPlayerDataErrors,
  selectRawPlayerData,
  setRawPlayerData,
  updatePlayerData,
  validatePlayerData,
  type PlayerState
} from '../player';

import type { PlayerData, RawPlayerData } from '../../../../../../SharedLibrary/src/interface';
import type { RootState } from '../..';

jest.mock('../../../util/validate.util', () => ({
  validatePlayerData: jest.fn(() => [])
}));

const defaultPlayerData: PlayerData = toPlayerData(toProcessedRawPlayerData({}));

const initialState: PlayerState = {
  rawData: '',
  data: defaultPlayerData,
  errors: []
};

function mockRootState(overrides: Partial<PlayerState> = {}): Pick<RootState, 'player'> {
  return {
    player: { ...initialState, ...overrides }
  } as Pick<RootState, 'player'>;
}

describe('player slice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('returns the correct initial state', () => {
      const state = reducer(undefined, { type: 'unknown' });
      expect(state.rawData).toBe('');
      expect(state.data).toEqual(defaultPlayerData);
      expect(state.errors).toEqual([]);
    });
  });

  describe('reducers', () => {
    describe('setRawPlayerData', () => {
      it('sets rawData without parsing', () => {
        const state = reducer(initialState, setRawPlayerData('raw-data'));
        expect(state.rawData).toBe('raw-data');
        expect(state.data).toEqual(defaultPlayerData);
      });
    });

    describe('updatePlayerData', () => {
      it('replaces data', () => {
        const newData: PlayerData = { ...defaultPlayerData, health: 999 };
        const state = reducer(initialState, updatePlayerData(newData));
        expect(state.data).toEqual(newData);
      });
    });

    describe('validatePlayerData', () => {
      it('calls validateDataPlayerData and stores errors', () => {
        const mockErrors = ['error1', 'error2'];
        jest.mocked(validateMod.validatePlayerData).mockReturnValue(mockErrors);

        const state = reducer(
          initialState,
          validatePlayerData({
            playerData: defaultPlayerData,
            itemsByKey: {}
          })
        );
        expect(state.errors).toEqual(mockErrors);
        expect(validateMod.validatePlayerData).toHaveBeenCalledWith(defaultPlayerData, {});
      });
    });

    describe('loadPlayerData', () => {
      it('parses JSON and converts to PlayerData', () => {
        const rawData: RawPlayerData = {};
        const json = JSON.stringify(rawData);
        const state = reducer(initialState, loadPlayerData(json));
        expect(state.rawData).toBe(json);
        expect(state.data).toEqual(toPlayerData(toProcessedRawPlayerData(rawData)));
      });

      it('returns same state when rawData matches (early return)', () => {
        const json = JSON.stringify({});
        const prev: PlayerState = { ...initialState, rawData: json };
        const state = reducer(prev, loadPlayerData(json));
        expect(state).toBe(prev);
      });

      it('replaces previous data on new payload', () => {
        const json1 = JSON.stringify({});
        const prev: PlayerState = { ...initialState, rawData: json1 };
        const json2 = JSON.stringify({ health: 50 });
        const state = reducer(prev, loadPlayerData(json2));
        expect(state.rawData).toBe(json2);
      });
    });
  });

  describe('selectors', () => {
    it('selectRawPlayerData returns rawData', () => {
      expect(selectRawPlayerData(mockRootState({ rawData: 'test' }) as RootState)).toBe('test');
    });

    it('selectPlayerData returns data', () => {
      expect(selectPlayerData(mockRootState() as RootState)).toEqual(defaultPlayerData);
    });

    it('selectPlayerDataErrors returns errors', () => {
      expect(selectPlayerDataErrors(mockRootState({ errors: ['err'] }) as RootState)).toEqual(['err']);
    });
  });
});
