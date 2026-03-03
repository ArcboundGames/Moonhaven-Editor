import * as validateMod from '../../../util/validate.util';
import reducer, {
  loadLocalizationData,
  selectLocalization,
  selectLocalizationKeys,
  selectLocalizationKeysErrors,
  selectLocalizations,
  selectLocalizationsByKey,
  selectLocalizationsErrors,
  selectRawLocalizationData,
  setRawLocalizationData,
  updateAddLocalizationKeys,
  updateLocalizationKeys,
  updateLocalizations,
  updateLocalizationsAndKeys,
  validateLocalizationKeys,
  validateLocalizations,
  type LocalizationsState
} from '../localizations';

import type { Localization } from '../../../../../../SharedLibrary/src/interface';
import type { RootState } from '../..';

jest.mock('../../../util/validate.util', () => ({
  validateLocalizationKeys: jest.fn(() => ({})),
  validateLocalizations: jest.fn(() => ({}))
}));

function makeLocalization(key: string, values: Record<string, string> = {}): Localization {
  return { key, name: key, values };
}

const initialState: LocalizationsState = {
  rawData: '',
  keys: [],
  localizations: [],
  localizationsByKey: {},
  errors: { keys: {}, localizations: {} }
};

function mockRootState(overrides: Partial<LocalizationsState> = {}): Pick<RootState, 'localizations'> {
  return { localizations: { ...initialState, ...overrides } } as Pick<RootState, 'localizations'>;
}

describe('localizations slice', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('initial state', () => {
    it('returns the correct initial state', () => {
      expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    describe('setRawLocalizationData', () => {
      it('sets rawData', () => {
        const state = reducer(initialState, setRawLocalizationData('raw'));
        expect(state.rawData).toBe('raw');
      });
    });

    describe('updateLocalizationKeys', () => {
      it('sorts keys alphabetically', () => {
        const state = reducer(initialState, updateLocalizationKeys(['z_key', 'a_key', 'm_key']));
        expect(state.keys).toEqual(['a_key', 'm_key', 'z_key']);
      });
    });

    describe('updateLocalizations', () => {
      it('builds lookup by key', () => {
        const en = makeLocalization('en-US', { hello: 'Hello' });
        const es = makeLocalization('es', { hello: 'Hola' });
        const state = reducer(initialState, updateLocalizations([en, es]));
        expect(state.localizations).toEqual([en, es]);
        expect(state.localizationsByKey['en-US']).toEqual(en);
        expect(state.localizationsByKey['es']).toEqual(es);
      });
    });

    describe('updateLocalizationsAndKeys', () => {
      it('sorts keys and applies sortLocalization to each localization', () => {
        const loc = makeLocalization('en-US', { z_val: 'Z', a_val: 'A' });
        const state = reducer(
          initialState,
          updateLocalizationsAndKeys({ keys: ['z_key', 'a_key'], localizations: [loc] })
        );
        expect(state.keys).toEqual(['a_key', 'z_key']);
        // sortLocalization sorts values by key alphabetically
        const sortedValues = state.localizations[0].values;
        expect(Object.keys(sortedValues)).toEqual(['a_val', 'z_val']);
      });
    });

    describe('validateLocalizationKeys', () => {
      it('calls validate and stores errors', () => {
        const mockErrors = { dup_key: ['duplicate'] };
        jest.mocked(validateMod.validateLocalizationKeys).mockReturnValue(mockErrors);
        const state = reducer(initialState, validateLocalizationKeys({ localizationKeys: [] }));
        expect(state.errors.keys).toEqual(mockErrors);
      });
    });

    describe('validateLocalizations', () => {
      it('calls validate and stores errors', () => {
        const mockErrors = { 'en-US': ['err'] };
        jest.mocked(validateMod.validateLocalizations).mockReturnValue(mockErrors);
        const state = reducer(initialState, validateLocalizations({ localizations: [], localizationKeys: [] }));
        expect(state.errors.localizations).toEqual(mockErrors);
      });
    });

    describe('loadLocalizationData', () => {
      it('parses JSON, sorts keys, and builds lookups', () => {
        const json = JSON.stringify({
          keys: ['z_key', 'a_key'],
          localizations: [{ key: 'en-US', values: { z_key: 'Z', a_key: 'A' } }]
        });
        const state = reducer(initialState, loadLocalizationData(json));
        expect(state.rawData).toBe(json);
        expect(state.keys).toEqual(['a_key', 'z_key']);
        expect(state.localizations).toHaveLength(1);
        expect(state.localizationsByKey['en-US']).toBeDefined();
      });

      it('returns same state on duplicate rawData', () => {
        const json = JSON.stringify({ keys: [], localizations: [] });
        const prev: LocalizationsState = { ...initialState, rawData: json };
        const state = reducer(prev, loadLocalizationData(json));
        expect(state).toBe(prev);
      });
    });

    describe('updateAddLocalizationKeys', () => {
      it('merges new keys into English localization values', () => {
        const en = makeLocalization('en-US', { existing: 'Existing' });
        const prev: LocalizationsState = {
          ...initialState,
          keys: ['existing'],
          localizations: [en],
          localizationsByKey: { 'en-US': en }
        };
        const state = reducer(prev, updateAddLocalizationKeys({ new_key: 'New Value' }));
        expect(state.keys).toEqual(['existing', 'new_key']);
        expect(state.localizations[0].values['new_key']).toBe('New Value');
        expect(state.localizations[0].values['existing']).toBe('Existing');
        expect(state.localizationsByKey['en-US'].values['new_key']).toBe('New Value');
      });

      it('deduplicates keys', () => {
        const en = makeLocalization('en-US', { a_key: 'A' });
        const prev: LocalizationsState = {
          ...initialState,
          keys: ['a_key'],
          localizations: [en],
          localizationsByKey: { 'en-US': en }
        };
        const state = reducer(prev, updateAddLocalizationKeys({ a_key: 'Updated' }));
        expect(state.keys).toEqual(['a_key']);
        expect(state.localizations[0].values['a_key']).toBe('Updated');
      });

      it('sorts merged keys', () => {
        const en = makeLocalization('en-US', { m_key: 'M' });
        const prev: LocalizationsState = {
          ...initialState,
          keys: ['m_key'],
          localizations: [en],
          localizationsByKey: { 'en-US': en }
        };
        const state = reducer(prev, updateAddLocalizationKeys({ a_key: 'A', z_key: 'Z' }));
        expect(state.keys).toEqual(['a_key', 'm_key', 'z_key']);
      });

      it('finds English localization case-insensitively', () => {
        const en = makeLocalization('EN-us', { existing: 'E' });
        const prev: LocalizationsState = {
          ...initialState,
          keys: ['existing'],
          localizations: [en],
          localizationsByKey: { 'EN-us': en }
        };
        const state = reducer(prev, updateAddLocalizationKeys({ added: 'Added' }));
        expect(state.localizations[0].values['added']).toBe('Added');
      });

      it('returns unchanged state when English localization not found', () => {
        const fr = makeLocalization('fr', { hello: 'Bonjour' });
        const prev: LocalizationsState = {
          ...initialState,
          keys: ['hello'],
          localizations: [fr],
          localizationsByKey: { fr }
        };
        const state = reducer(prev, updateAddLocalizationKeys({ new_key: 'Value' }));
        expect(state).toBe(prev);
      });
    });
  });

  describe('selectors', () => {
    const en = makeLocalization('en-US', { hello: 'Hello' });

    it('selectRawLocalizationData', () => {
      expect(selectRawLocalizationData(mockRootState({ rawData: 'x' }) as RootState)).toBe('x');
    });

    it('selectLocalizationKeys', () => {
      expect(selectLocalizationKeys(mockRootState({ keys: ['a'] }) as RootState)).toEqual(['a']);
    });

    it('selectLocalizations', () => {
      expect(selectLocalizations(mockRootState({ localizations: [en] }) as RootState)).toEqual([en]);
    });

    it('selectLocalizationsByKey', () => {
      expect(selectLocalizationsByKey(mockRootState({ localizationsByKey: { 'en-US': en } }) as RootState)).toEqual({
        'en-US': en
      });
    });

    it('selectLocalization with key', () => {
      expect(selectLocalization('en-US')(mockRootState({ localizationsByKey: { 'en-US': en } }) as RootState)).toEqual(
        en
      );
    });

    it('selectLocalization with undefined', () => {
      expect(selectLocalization(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    it('selectLocalizationKeysErrors', () => {
      const errors = { ...initialState.errors, keys: { dup: ['err'] } };
      expect(selectLocalizationKeysErrors(mockRootState({ errors }) as RootState)).toEqual({ dup: ['err'] });
    });

    it('selectLocalizationsErrors', () => {
      const errors = { ...initialState.errors, localizations: { 'en-US': ['err'] } };
      expect(selectLocalizationsErrors(mockRootState({ errors }) as RootState)).toEqual({ 'en-US': ['err'] });
    });
  });
});
