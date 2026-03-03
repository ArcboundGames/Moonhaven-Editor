import {
  toObjectCategory,
  toObjectSubCategory,
  toObjectType,
  toProcessedRawObjectCategory,
  toProcessedRawObjectSubCategory,
  toProcessedRawObjectType
} from '../../../../../../SharedLibrary/src/util/converters.util';
import * as validateMod from '../../../util/validate.util';
import reducer, {
  clearObjectSelections,
  incrementSpritesVersion,
  loadObjectData,
  localizeObjects,
  selectObjectCategory,
  selectObjectCategoryErrors,
  selectObjectDataFileLoaded,
  selectObjectErrors,
  selectObjectSubCategoriesByCategory,
  selectObjectSubCategory,
  selectObjectSubCategoryErrors,
  selectObjectType,
  selectObjectTypes,
  selectObjectTypesByCategoryAndSubCategory,
  selectObjectTypesByKey,
  selectRawObjectData,
  selectSelectedObjectCategory,
  selectSelectedObjectSubCategory,
  selectSpritesVersion,
  setRawObjectData,
  setSelectedObjectCategory,
  setSelectedObjectSubCategory,
  updateObjectCategories,
  updateObjectSubCategories,
  updateObjects,
  validateObjectCategories,
  validateObjectSubCategories,
  type ObjectsState
} from '../objects';

import type {
  Localization,
  LocalizedObjectType,
  ObjectCategory,
  ObjectSubCategory,
  ObjectType
} from '../../../../../../SharedLibrary/src/interface';
import type { RootState } from '../..';

jest.mock('../../../util/validate.util', () => ({
  validateObjectCategories: jest.fn(() => ({})),
  validateObjectSubCategories: jest.fn(() => ({})),
  validateObjects: jest.fn(() => ({}))
}));

function makeObject(key: string, id: number, categoryKey?: string, subCategoryKey?: string): ObjectType {
  return toObjectType(toProcessedRawObjectType({ key, categoryKey, subCategoryKey }), id);
}

function makeCategory(key: string, index: number): ObjectCategory {
  return toObjectCategory(toProcessedRawObjectCategory({ key }), index);
}

function makeSubCategory(key: string, index: number, categoryKey: string): ObjectSubCategory {
  return toObjectSubCategory(toProcessedRawObjectSubCategory({ key, categoryKey }), index);
}

function makeLocalization(values: Record<string, string>): Localization {
  return { key: 'en-US', name: 'en-US', values };
}

const initialState: ObjectsState = {
  rawData: '',
  loaded: false,
  selectedCategory: 'ALL',
  selectedSubCategory: 'ALL',
  categories: [],
  subCategories: [],
  objects: [],
  categoriesByKey: {},
  subCategoriesByKey: {},
  objectsByKey: {},
  localizedObjects: [],
  localizedObjectsByKey: {},
  errors: { objects: {}, objectCategories: {}, objectSubCategories: {} },
  spritesVersion: 0
};

function mockRootState(overrides: Partial<ObjectsState> = {}): Pick<RootState, 'objects'> {
  return { objects: { ...initialState, ...overrides } } as Pick<RootState, 'objects'>;
}

describe('objects slice', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('initial state', () => {
    it('returns the correct initial state', () => {
      expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    describe('incrementSpritesVersion', () => {
      it('increments spritesVersion', () => {
        const state = reducer(initialState, incrementSpritesVersion());
        expect(state.spritesVersion).toBe(1);
      });
    });

    describe('setRawObjectData', () => {
      it('sets rawData', () => {
        const state = reducer(initialState, setRawObjectData('raw'));
        expect(state.rawData).toBe('raw');
      });
    });

    describe('setSelectedObjectCategory', () => {
      it('sets selected category and resets sub-category to ALL', () => {
        const prev = { ...initialState, selectedSubCategory: 'TREES' };
        const state = reducer(prev, setSelectedObjectCategory('NATURE'));
        expect(state.selectedCategory).toBe('NATURE');
        expect(state.selectedSubCategory).toBe('ALL');
      });

      it('returns same state when unchanged', () => {
        const state = reducer(initialState, setSelectedObjectCategory('ALL'));
        expect(state).toBe(initialState);
      });

      it('defaults to ALL when undefined', () => {
        const prev = { ...initialState, selectedCategory: 'NATURE' };
        const state = reducer(prev, setSelectedObjectCategory(undefined));
        expect(state.selectedCategory).toBe('ALL');
      });
    });

    describe('setSelectedObjectSubCategory', () => {
      it('returns same state when unchanged', () => {
        const state = reducer(initialState, setSelectedObjectSubCategory('ALL'));
        expect(state).toBe(initialState);
      });

      it('sets sub-category when it belongs to the selected category', () => {
        const sub = makeSubCategory('TREES', 0, 'NATURE');
        const prev: ObjectsState = {
          ...initialState,
          selectedCategory: 'NATURE',
          subCategoriesByKey: { TREES: sub }
        };
        const state = reducer(prev, setSelectedObjectSubCategory('TREES'));
        expect(state.selectedSubCategory).toBe('TREES');
      });

      it('resets to ALL when sub-category belongs to different category', () => {
        const sub = makeSubCategory('TREES', 0, 'NATURE');
        const prev: ObjectsState = {
          ...initialState,
          selectedCategory: 'BUILDING',
          subCategoriesByKey: { TREES: sub }
        };
        const state = reducer(prev, setSelectedObjectSubCategory('TREES'));
        expect(state.selectedSubCategory).toBe('ALL');
      });
    });

    describe('clearObjectSelections', () => {
      it('resets category and sub-category to ALL', () => {
        const prev = { ...initialState, selectedCategory: 'NATURE', selectedSubCategory: 'TREES' };
        const state = reducer(prev, clearObjectSelections());
        expect(state.selectedCategory).toBe('ALL');
        expect(state.selectedSubCategory).toBe('ALL');
      });
    });

    describe('loadObjectData', () => {
      it('parses JSON and sets loaded to true', () => {
        const json = JSON.stringify({
          categories: [{ key: 'NATURE' }],
          subCategories: [{ key: 'TREES', categoryKey: 'NATURE' }],
          objects: [{ key: 'OAK', categoryKey: 'NATURE', subCategoryKey: 'TREES' }]
        });
        const state = reducer(initialState, loadObjectData(json));
        expect(state.loaded).toBe(true);
        expect(state.rawData).toBe(json);
        expect(state.categories).toHaveLength(1);
        expect(state.subCategories).toHaveLength(1);
        expect(state.objects).toHaveLength(1);
        expect(state.categoriesByKey['NATURE']).toBeDefined();
        expect(state.subCategoriesByKey['TREES']).toBeDefined();
        expect(state.objectsByKey['OAK']).toBeDefined();
      });

      it('returns same state on duplicate rawData', () => {
        const json = JSON.stringify({ categories: [], subCategories: [], objects: [] });
        const prev: ObjectsState = { ...initialState, rawData: json };
        const state = reducer(prev, loadObjectData(json));
        expect(state).toBe(prev);
      });

      it('handles missing arrays', () => {
        const json = JSON.stringify({});
        const state = reducer(initialState, loadObjectData(json));
        expect(state.objects).toEqual([]);
        expect(state.categories).toEqual([]);
        expect(state.subCategories).toEqual([]);
      });
    });

    describe('updateObjects', () => {
      it('builds lookup by key', () => {
        const obj = makeObject('OAK', 1);
        const state = reducer(initialState, updateObjects([obj]));
        expect(state.objects).toEqual([obj]);
        expect(state.objectsByKey['OAK']).toEqual(obj);
      });
    });

    describe('updateObjectCategories', () => {
      it('builds lookup by key', () => {
        const c = makeCategory('NATURE', 0);
        const state = reducer(initialState, updateObjectCategories([c]));
        expect(state.categories).toEqual([c]);
        expect(state.categoriesByKey['NATURE']).toEqual(c);
      });
    });

    describe('updateObjectSubCategories', () => {
      it('builds lookup by key', () => {
        const sub = makeSubCategory('TREES', 0, 'NATURE');
        const state = reducer(initialState, updateObjectSubCategories([sub]));
        expect(state.subCategories).toEqual([sub]);
        expect(state.subCategoriesByKey['TREES']).toEqual(sub);
      });
    });

    describe('validateObjectCategories', () => {
      it('calls validate and stores errors', () => {
        const mockErrors = { NATURE: ['err'] };
        jest.mocked(validateMod.validateObjectCategories).mockReturnValue(mockErrors);
        const state = reducer(
          initialState,
          validateObjectCategories({
            objectCategories: [],
            objectCategoriesByKey: {},
            objectSubCategoriesByKey: {},
            objectsByKey: {}
          })
        );
        expect(state.errors.objectCategories).toEqual(mockErrors);
      });
    });

    describe('validateObjectSubCategories', () => {
      it('calls validate and stores errors', () => {
        const mockErrors = { TREES: ['err'] };
        jest.mocked(validateMod.validateObjectSubCategories).mockReturnValue(mockErrors);
        const state = reducer(
          initialState,
          validateObjectSubCategories({
            objectSubCategories: [],
            objectCategoriesByKey: {},
            objectSubCategoriesByKey: {},
            objectsByKey: {}
          })
        );
        expect(state.errors.objectSubCategories).toEqual(mockErrors);
      });
    });

    describe('localizeObjects', () => {
      it('returns state when localization is null', () => {
        const state = reducer(initialState, localizeObjects({ localization: null, localizationKeys: [] }));
        expect(state.localizedObjects).toEqual([]);
      });

      it('localizes and sorts objects alphabetically by name', () => {
        const o1 = makeObject('OAK', 1, 'NATURE', 'TREES');
        const o2 = makeObject('ANVIL', 2, 'BUILDING', 'TOOLS');
        const prev: ObjectsState = {
          ...initialState,
          objects: [o1, o2],
          objectsByKey: { OAK: o1, ANVIL: o2 }
        };
        const localization = makeLocalization({
          object_oak_name: 'Zork Oak',
          object_anvil_name: 'Alpha Anvil'
        });
        const state = reducer(
          prev,
          localizeObjects({
            localization,
            localizationKeys: ['object_oak_name', 'object_anvil_name']
          })
        );
        expect(state.localizedObjects).toHaveLength(2);
        expect(state.localizedObjects[0].name).toBe('Alpha Anvil');
        expect(state.localizedObjects[1].name).toBe('Zork Oak');
        expect(state.localizedObjectsByKey['OAK'].name).toBe('Zork Oak');
      });

      it('falls back to key when no localization value found', () => {
        const o1 = makeObject('OAK', 1);
        const prev: ObjectsState = {
          ...initialState,
          objects: [o1],
          objectsByKey: { OAK: o1 }
        };
        const localization = makeLocalization({});
        const state = reducer(prev, localizeObjects({ localization, localizationKeys: [] }));
        expect(state.localizedObjects[0].name).toBe('OAK');
      });
    });
  });

  describe('extraReducers', () => {
    it('handles validateObjects.fulfilled', () => {
      const mockErrors = { OAK: ['err'] };
      const state = reducer(initialState, {
        type: 'objects/validateObjectsStatus/fulfilled',
        payload: mockErrors
      });
      expect(state.errors.objects).toEqual(mockErrors);
    });
  });

  describe('selectors', () => {
    const o1 = makeObject('OAK', 1, 'NATURE', 'TREES');
    const o2 = makeObject('ANVIL', 2, 'BUILDING', 'TOOLS');
    const c1 = makeCategory('NATURE', 0);
    const sub1 = makeSubCategory('TREES', 0, 'NATURE');
    const sub2 = makeSubCategory('TOOLS', 1, 'BUILDING');
    const localO1: LocalizedObjectType = { ...o1, name: 'Oak' };
    const localO2: LocalizedObjectType = { ...o2, name: 'Anvil' };

    it('selectSpritesVersion', () => {
      expect(selectSpritesVersion(mockRootState({ spritesVersion: 3 }) as RootState)).toBe(3);
    });

    it('selectRawObjectData', () => {
      expect(selectRawObjectData(mockRootState({ rawData: 'x' }) as RootState)).toBe('x');
    });

    it('selectObjectDataFileLoaded', () => {
      expect(selectObjectDataFileLoaded(mockRootState({ loaded: true }) as RootState)).toBe(true);
    });

    it('selectObjectTypes', () => {
      expect(selectObjectTypes(mockRootState({ objects: [o1] }) as RootState)).toEqual([o1]);
    });

    it('selectObjectTypesByKey', () => {
      expect(selectObjectTypesByKey(mockRootState({ objectsByKey: { OAK: o1 } }) as RootState)).toEqual({ OAK: o1 });
    });

    it('selectObjectType with key', () => {
      expect(selectObjectType('OAK')(mockRootState({ objectsByKey: { OAK: o1 } }) as RootState)).toEqual(o1);
    });

    it('selectObjectType with undefined', () => {
      expect(selectObjectType(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    it('selectObjectCategory with key', () => {
      expect(selectObjectCategory('NATURE')(mockRootState({ categoriesByKey: { NATURE: c1 } }) as RootState)).toEqual(
        c1
      );
    });

    it('selectObjectCategory with undefined', () => {
      expect(selectObjectCategory(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    it('selectObjectSubCategory with key', () => {
      expect(
        selectObjectSubCategory('TREES')(mockRootState({ subCategoriesByKey: { TREES: sub1 } }) as RootState)
      ).toEqual(sub1);
    });

    it('selectObjectSubCategory with undefined', () => {
      expect(selectObjectSubCategory(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    describe('selectObjectTypesByCategoryAndSubCategory', () => {
      const root = mockRootState({ localizedObjects: [localO1, localO2] }) as RootState;

      it('returns empty for undefined categoryKey', () => {
        expect(selectObjectTypesByCategoryAndSubCategory(undefined, 'ALL')(root)).toEqual([]);
      });

      it('returns empty for undefined subCategoryKey', () => {
        expect(selectObjectTypesByCategoryAndSubCategory('ALL', undefined)(root)).toEqual([]);
      });

      it('returns all for ALL category', () => {
        expect(selectObjectTypesByCategoryAndSubCategory('ALL', 'ALL')(root)).toEqual([localO1, localO2]);
      });

      it('filters by category when subCategory is ALL', () => {
        expect(selectObjectTypesByCategoryAndSubCategory('NATURE', 'ALL')(root)).toEqual([localO1]);
      });

      it('filters by both category and subCategory', () => {
        expect(selectObjectTypesByCategoryAndSubCategory('NATURE', 'TREES')(root)).toEqual([localO1]);
      });
    });

    describe('selectObjectSubCategoriesByCategory', () => {
      const root = mockRootState({ subCategories: [sub1, sub2] }) as RootState;

      it('returns empty for undefined with default behavior', () => {
        expect(selectObjectSubCategoriesByCategory(undefined)(root)).toEqual([]);
      });

      it('returns empty for ALL with default behavior', () => {
        expect(selectObjectSubCategoriesByCategory('ALL')(root)).toEqual([]);
      });

      it('returns all when ALL and allBehavior is include', () => {
        expect(selectObjectSubCategoriesByCategory('ALL', { allBehavior: 'include' })(root)).toEqual([sub1, sub2]);
      });

      it('filters by categoryKey', () => {
        expect(selectObjectSubCategoriesByCategory('NATURE')(root)).toEqual([sub1]);
      });
    });

    it('selectSelectedObjectCategory', () => {
      expect(selectSelectedObjectCategory(mockRootState({ selectedCategory: 'NATURE' }) as RootState)).toBe('NATURE');
    });

    it('selectSelectedObjectSubCategory', () => {
      expect(selectSelectedObjectSubCategory(mockRootState({ selectedSubCategory: 'TREES' }) as RootState)).toBe(
        'TREES'
      );
    });

    it('selectObjectErrors', () => {
      const errors = { ...initialState.errors, objects: { OAK: ['err'] } };
      expect(selectObjectErrors(mockRootState({ errors }) as RootState)).toEqual({ OAK: ['err'] });
    });

    it('selectObjectCategoryErrors', () => {
      const errors = { ...initialState.errors, objectCategories: { NATURE: ['err'] } };
      expect(selectObjectCategoryErrors(mockRootState({ errors }) as RootState)).toEqual({ NATURE: ['err'] });
    });

    it('selectObjectSubCategoryErrors', () => {
      const errors = { ...initialState.errors, objectSubCategories: { TREES: ['err'] } };
      expect(selectObjectSubCategoryErrors(mockRootState({ errors }) as RootState)).toEqual({ TREES: ['err'] });
    });
  });
});
