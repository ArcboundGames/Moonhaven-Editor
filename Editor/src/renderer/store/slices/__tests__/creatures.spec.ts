import {
  toCreatureCategory,
  toCreatureType,
  toProcessedRawCreatureCategory,
  toProcessedRawCreatureType
} from '../../../../../../SharedLibrary/src/util/converters.util';
import * as validateMod from '../../../util/validate.util';
import reducer, {
  clearCreatureSelections,
  incrementCreatureSpritesVersion,
  loadCreatureData,
  localizeCreatures,
  selectCreatureCategoryErrors,
  selectCreatureCategory,
  selectCreatureErrors,
  selectCreatureSpritesVersion,
  selectCreatureType,
  selectCreatureTypes,
  selectCreatureTypesByCategory,
  selectCreatureTypesByKey,
  selectRawCreatureData,
  selectSelectedCreatureCategory,
  setRawCreatureData,
  setSelectedCreatureCategory,
  updateCreatureCategories,
  updateCreatures,
  validateCreatureCategories,
  type CreaturesState
} from '../creatures';

import type { CreatureCategory, CreatureType, Localization } from '../../../../../../SharedLibrary/src/interface';
import type { RootState } from '../..';

jest.mock('../../../util/validate.util', () => ({
  validateCreatureCategories: jest.fn(() => ({})),
  validateCreatures: jest.fn(() => ({}))
}));

function makeCreature(key: string, id: number, categoryKey?: string): CreatureType {
  return toCreatureType(toProcessedRawCreatureType({ key, categoryKey }), id);
}

function makeCategory(key: string, index: number): CreatureCategory {
  return toCreatureCategory(toProcessedRawCreatureCategory({ key }), index);
}

function makeLocalization(values: Record<string, string>): Localization {
  return { key: 'en-US', name: 'en-US', values };
}

const initialState: CreaturesState = {
  rawData: '',
  selectedCategory: 'ALL',
  categories: [],
  creatures: [],
  creatureNamesByKey: {},
  categoriesByKey: {},
  creaturesByKey: {},
  localizedCreatures: [],
  localizedCreaturesByKey: {},
  errors: { creatures: {}, creatureCategories: {} },
  spritesVersion: 0
};

function mockRootState(overrides: Partial<CreaturesState> = {}): Pick<RootState, 'creatures'> {
  return { creatures: { ...initialState, ...overrides } } as Pick<RootState, 'creatures'>;
}

describe('creatures slice', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('initial state', () => {
    it('returns the correct initial state', () => {
      expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    describe('incrementCreatureSpritesVersion', () => {
      it('increments spritesVersion', () => {
        const state = reducer(initialState, incrementCreatureSpritesVersion());
        expect(state.spritesVersion).toBe(1);
        const state2 = reducer(state, incrementCreatureSpritesVersion());
        expect(state2.spritesVersion).toBe(2);
      });
    });

    describe('setRawCreatureData', () => {
      it('sets rawData', () => {
        const state = reducer(initialState, setRawCreatureData('raw'));
        expect(state.rawData).toBe('raw');
      });
    });

    describe('setSelectedCreatureCategory', () => {
      it('sets selected category', () => {
        const state = reducer(initialState, setSelectedCreatureCategory('HOSTILE'));
        expect(state.selectedCategory).toBe('HOSTILE');
      });

      it('returns same state when unchanged', () => {
        const state = reducer(initialState, setSelectedCreatureCategory('ALL'));
        expect(state).toBe(initialState);
      });

      it('defaults to ALL when undefined', () => {
        const prev = { ...initialState, selectedCategory: 'HOSTILE' };
        const state = reducer(prev, setSelectedCreatureCategory(undefined));
        expect(state.selectedCategory).toBe('ALL');
      });
    });

    describe('clearCreatureSelections', () => {
      it('resets to ALL', () => {
        const prev = { ...initialState, selectedCategory: 'HOSTILE' };
        const state = reducer(prev, clearCreatureSelections());
        expect(state.selectedCategory).toBe('ALL');
      });
    });

    describe('updateCreatureCategories', () => {
      it('builds lookup by key', () => {
        const c = makeCategory('HOSTILE', 0);
        const state = reducer(initialState, updateCreatureCategories([c]));
        expect(state.categories).toEqual([c]);
        expect(state.categoriesByKey['HOSTILE']).toEqual(c);
      });
    });

    describe('updateCreatures', () => {
      it('builds lookup by key', () => {
        const cr = makeCreature('GOBLIN', 1);
        const state = reducer(initialState, updateCreatures([cr]));
        expect(state.creatures).toEqual([cr]);
        expect(state.creaturesByKey['GOBLIN']).toEqual(cr);
      });
    });

    describe('validateCreatureCategories', () => {
      it('calls validate and stores errors', () => {
        const mockErrors = { HOSTILE: ['err'] };
        jest.mocked(validateMod.validateCreatureCategories).mockReturnValue(mockErrors);
        const state = reducer(initialState, validateCreatureCategories({ creatureCategories: [] }));
        expect(state.errors.creatureCategories).toEqual(mockErrors);
      });
    });

    describe('loadCreatureData', () => {
      it('parses JSON with categories and creatures', () => {
        const json = JSON.stringify({
          categories: [{ key: 'HOSTILE' }],
          creatures: [{ key: 'GOBLIN', categoryKey: 'HOSTILE' }]
        });
        const state = reducer(initialState, loadCreatureData(json));
        expect(state.rawData).toBe(json);
        expect(state.categories).toHaveLength(1);
        expect(state.categoriesByKey['HOSTILE']).toBeDefined();
        expect(state.creatures).toHaveLength(1);
        expect(state.creaturesByKey['GOBLIN']).toBeDefined();
      });

      it('returns same state on duplicate rawData', () => {
        const json = JSON.stringify({ categories: [], creatures: [] });
        const prev: CreaturesState = { ...initialState, rawData: json };
        const state = reducer(prev, loadCreatureData(json));
        expect(state).toBe(prev);
      });

      it('handles missing arrays', () => {
        const json = JSON.stringify({});
        const state = reducer(initialState, loadCreatureData(json));
        expect(state.creatures).toEqual([]);
        expect(state.categories).toEqual([]);
      });
    });

    describe('localizeCreatures', () => {
      it('returns state when localization is null', () => {
        const state = reducer(initialState, localizeCreatures({ localization: null, localizationKeys: [] }));
        expect(state.localizedCreatures).toEqual([]);
      });

      it('localizes creatures (does not sort)', () => {
        const c1 = makeCreature('GOBLIN', 1, 'HOSTILE');
        const c2 = makeCreature('ANGEL', 2, 'FRIENDLY');
        const prev: CreaturesState = {
          ...initialState,
          creatures: [c1, c2],
          creaturesByKey: { GOBLIN: c1, ANGEL: c2 }
        };
        const localization = makeLocalization({
          creature_goblin_name: 'Zork Goblin',
          creature_angel_name: 'Alpha Angel'
        });
        const state = reducer(
          prev,
          localizeCreatures({
            localization,
            localizationKeys: ['creature_goblin_name', 'creature_angel_name']
          })
        );
        expect(state.localizedCreatures).toHaveLength(2);
        // creatures are NOT sorted (unlike items/objects)
        expect(state.localizedCreatures[0].name).toBe('Zork Goblin');
        expect(state.localizedCreatures[1].name).toBe('Alpha Angel');
        expect(state.localizedCreaturesByKey['GOBLIN'].name).toBe('Zork Goblin');
      });

      it('falls back to key when no localization value found', () => {
        const c1 = makeCreature('GOBLIN', 1);
        const prev: CreaturesState = {
          ...initialState,
          creatures: [c1],
          creaturesByKey: { GOBLIN: c1 }
        };
        const localization = makeLocalization({});
        const state = reducer(prev, localizeCreatures({ localization, localizationKeys: [] }));
        expect(state.localizedCreatures[0].name).toBe('GOBLIN');
      });
    });
  });

  describe('extraReducers', () => {
    it('handles validateCreatures.fulfilled', () => {
      const mockErrors = { GOBLIN: ['err'] };
      const state = reducer(initialState, {
        type: 'creatures/validateCreaturesStatus/fulfilled',
        payload: mockErrors
      });
      expect(state.errors.creatures).toEqual(mockErrors);
    });
  });

  describe('selectors', () => {
    const cr1 = makeCreature('GOBLIN', 1, 'HOSTILE');
    const cr2 = makeCreature('ANGEL', 2, 'FRIENDLY');
    const c1 = makeCategory('HOSTILE', 0);

    it('selectCreatureSpritesVersion', () => {
      expect(selectCreatureSpritesVersion(mockRootState({ spritesVersion: 5 }) as RootState)).toBe(5);
    });

    it('selectRawCreatureData', () => {
      expect(selectRawCreatureData(mockRootState({ rawData: 'x' }) as RootState)).toBe('x');
    });

    it('selectCreatureTypes', () => {
      expect(selectCreatureTypes(mockRootState({ creatures: [cr1] }) as RootState)).toEqual([cr1]);
    });

    it('selectCreatureTypesByKey', () => {
      expect(selectCreatureTypesByKey(mockRootState({ creaturesByKey: { GOBLIN: cr1 } }) as RootState)).toEqual({
        GOBLIN: cr1
      });
    });

    it('selectCreatureType with key', () => {
      expect(selectCreatureType('GOBLIN')(mockRootState({ creaturesByKey: { GOBLIN: cr1 } }) as RootState)).toEqual(
        cr1
      );
    });

    it('selectCreatureType with undefined', () => {
      expect(selectCreatureType(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    it('selectCreatureCategory with key', () => {
      expect(
        selectCreatureCategory('HOSTILE')(mockRootState({ categoriesByKey: { HOSTILE: c1 } }) as RootState)
      ).toEqual(c1);
    });

    it('selectCreatureCategory with undefined', () => {
      expect(selectCreatureCategory(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    describe('selectCreatureTypesByCategory', () => {
      const localCr1 = { ...cr1, name: 'Goblin' };
      const localCr2 = { ...cr2, name: 'Angel' };
      const root = mockRootState({ localizedCreatures: [localCr1, localCr2] }) as RootState;

      it('returns empty for undefined', () => {
        expect(selectCreatureTypesByCategory(undefined)(root)).toEqual([]);
      });

      it('returns all for ALL', () => {
        expect(selectCreatureTypesByCategory('ALL')(root)).toEqual([localCr1, localCr2]);
      });

      it('filters by categoryKey', () => {
        expect(selectCreatureTypesByCategory('HOSTILE')(root)).toEqual([localCr1]);
      });
    });

    it('selectSelectedCreatureCategory', () => {
      expect(selectSelectedCreatureCategory(mockRootState({ selectedCategory: 'HOSTILE' }) as RootState)).toBe(
        'HOSTILE'
      );
    });

    it('selectCreatureErrors', () => {
      const errors = { ...initialState.errors, creatures: { GOBLIN: ['err'] } };
      expect(selectCreatureErrors(mockRootState({ errors }) as RootState)).toEqual({ GOBLIN: ['err'] });
    });

    it('selectCreatureCategoryErrors', () => {
      const errors = { ...initialState.errors, creatureCategories: { HOSTILE: ['err'] } };
      expect(selectCreatureCategoryErrors(mockRootState({ errors }) as RootState)).toEqual({ HOSTILE: ['err'] });
    });
  });
});
