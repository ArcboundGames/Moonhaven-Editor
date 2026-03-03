import {
  toItemCategory,
  toItemType,
  toProcessedRawItemCategory,
  toProcessedRawItemType
} from '../../../../../../SharedLibrary/src/util/converters.util';
import * as validateMod from '../../../util/validate.util';
import reducer, {
  clearItemSelections,
  incrementItemsIconsVersion,
  loadItemData,
  localizeItems,
  selectIconsVersion,
  selectItemCategory,
  selectItemCategoryErrors,
  selectItemErrors,
  selectItemType,
  selectItemTypes,
  selectItemTypesById,
  selectItemTypesByCategory,
  selectItemTypesByKey,
  selectRawItemData,
  selectSelectedItemCategory,
  setRawItemData,
  setSelectedItemCategory,
  updateItemCategories,
  updateItems,
  validateItemCategories,
  type ItemsState
} from '../items';

import type { ItemCategory, ItemType, Localization } from '../../../../../../SharedLibrary/src/interface';
import type { RootState } from '../..';

jest.mock('../../../util/validate.util', () => ({
  validateItemCategories: jest.fn(() => ({})),
  validateItems: jest.fn(() => ({}))
}));

function makeItem(key: string, id: number, categoryKey?: string): ItemType {
  return toItemType(toProcessedRawItemType({ key, id, categoryKey }), id);
}

function makeCategory(key: string, index: number): ItemCategory {
  return toItemCategory(toProcessedRawItemCategory({ key }), index);
}

function makeLocalization(values: Record<string, string>): Localization {
  return { key: 'en-US', name: 'en-US', values };
}

const initialState: ItemsState = {
  rawData: '',
  selectedCategory: 'ALL',
  categories: [],
  items: [],
  categoriesByKey: {},
  itemsById: {},
  itemsByKey: {},
  localizedItems: [],
  localizedItemsById: {},
  localizedItemsByKey: {},
  errors: { items: {}, itemCategories: {} },
  iconsVersion: 0
};

function mockRootState(overrides: Partial<ItemsState> = {}): Pick<RootState, 'items'> {
  return { items: { ...initialState, ...overrides } } as Pick<RootState, 'items'>;
}

describe('items slice', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('initial state', () => {
    it('returns the correct initial state', () => {
      expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    describe('incrementItemsIconsVersion', () => {
      it('increments iconsVersion', () => {
        const state = reducer(initialState, incrementItemsIconsVersion());
        expect(state.iconsVersion).toBe(1);
        const state2 = reducer(state, incrementItemsIconsVersion());
        expect(state2.iconsVersion).toBe(2);
      });
    });

    describe('setRawItemData', () => {
      it('sets rawData', () => {
        const state = reducer(initialState, setRawItemData('raw'));
        expect(state.rawData).toBe('raw');
      });
    });

    describe('setSelectedItemCategory', () => {
      it('sets selected category', () => {
        const state = reducer(initialState, setSelectedItemCategory('FOOD'));
        expect(state.selectedCategory).toBe('FOOD');
      });

      it('returns same state when unchanged', () => {
        const state = reducer(initialState, setSelectedItemCategory('ALL'));
        expect(state).toBe(initialState);
      });

      it('defaults to ALL when undefined', () => {
        const prev = { ...initialState, selectedCategory: 'FOOD' };
        const state = reducer(prev, setSelectedItemCategory(undefined));
        expect(state.selectedCategory).toBe('ALL');
      });
    });

    describe('clearItemSelections', () => {
      it('resets to ALL', () => {
        const prev = { ...initialState, selectedCategory: 'FOOD' };
        const state = reducer(prev, clearItemSelections());
        expect(state.selectedCategory).toBe('ALL');
      });
    });

    describe('updateItemCategories', () => {
      it('builds lookup by key', () => {
        const c = makeCategory('FOOD', 0);
        const state = reducer(initialState, updateItemCategories([c]));
        expect(state.categories).toEqual([c]);
        expect(state.categoriesByKey['FOOD']).toEqual(c);
      });
    });

    describe('updateItems', () => {
      it('builds lookups by id and key', () => {
        const item = makeItem('SWORD', 1);
        const state = reducer(initialState, updateItems([item]));
        expect(state.items).toEqual([item]);
        expect(state.itemsById[1]).toEqual(item);
        expect(state.itemsByKey['SWORD']).toEqual(item);
      });
    });

    describe('validateItemCategories', () => {
      it('calls validate and stores errors', () => {
        const mockErrors = { FOOD: ['err'] };
        jest.mocked(validateMod.validateItemCategories).mockReturnValue(mockErrors);
        const state = reducer(
          initialState,
          validateItemCategories({
            itemCategories: [],
            skillsByKey: {},
            damagableObjectKeys: [],
            damagableObjectCategoryKeys: [],
            damagableObjectSubCategoryKeys: [],
            damagableCreatureKeys: [],
            damagableCreatureCategoryKeys: [],
            projectileItemKeys: [],
            projectileItemCategoryKeys: []
          })
        );
        expect(state.errors.itemCategories).toEqual(mockErrors);
      });
    });

    describe('loadItemData', () => {
      it('parses JSON with categories and items', () => {
        const json = JSON.stringify({
          categories: [{ key: 'FOOD' }],
          items: [{ key: 'BREAD', categoryKey: 'FOOD' }]
        });
        const state = reducer(initialState, loadItemData(json));
        expect(state.rawData).toBe(json);
        expect(state.categories).toHaveLength(1);
        expect(state.categoriesByKey['FOOD']).toBeDefined();
        expect(state.items).toHaveLength(1);
        expect(state.itemsById).toBeDefined();
        expect(state.itemsByKey['BREAD']).toBeDefined();
      });

      it('returns same state on duplicate rawData', () => {
        const json = JSON.stringify({ categories: [], items: [] });
        const prev: ItemsState = { ...initialState, rawData: json };
        const state = reducer(prev, loadItemData(json));
        expect(state).toBe(prev);
      });

      it('handles missing arrays', () => {
        const json = JSON.stringify({});
        const state = reducer(initialState, loadItemData(json));
        expect(state.items).toEqual([]);
        expect(state.categories).toEqual([]);
      });
    });

    describe('localizeItems', () => {
      it('returns state when localization is null', () => {
        const state = reducer(initialState, localizeItems({ localization: null, localizationKeys: [] }));
        expect(state.localizedItems).toEqual([]);
      });

      it('localizes and sorts items alphabetically by name', () => {
        const i1 = makeItem('SWORD', 1, 'WEAPONS');
        const i2 = makeItem('APPLE', 2, 'FOOD');
        const prev: ItemsState = {
          ...initialState,
          items: [i1, i2],
          itemsById: { 1: i1, 2: i2 },
          itemsByKey: { SWORD: i1, APPLE: i2 }
        };
        const localization = makeLocalization({
          item_sword_name: 'Zork Sword',
          item_apple_name: 'Alpha Apple'
        });
        const state = reducer(
          prev,
          localizeItems({ localization, localizationKeys: ['item_sword_name', 'item_apple_name'] })
        );
        expect(state.localizedItems).toHaveLength(2);
        expect(state.localizedItems[0].name).toBe('Alpha Apple');
        expect(state.localizedItems[1].name).toBe('Zork Sword');
        expect(state.localizedItemsByKey['SWORD'].name).toBe('Zork Sword');
        expect(state.localizedItemsById[2].name).toBe('Alpha Apple');
      });

      it('falls back to key when no localization value found', () => {
        const i1 = makeItem('SWORD', 1);
        const prev: ItemsState = {
          ...initialState,
          items: [i1],
          itemsById: { 1: i1 },
          itemsByKey: { SWORD: i1 }
        };
        const localization = makeLocalization({});
        const state = reducer(prev, localizeItems({ localization, localizationKeys: [] }));
        expect(state.localizedItems[0].name).toBe('SWORD');
      });
    });
  });

  describe('extraReducers', () => {
    it('handles validateItems.fulfilled', () => {
      const mockErrors = { SWORD: ['err'] };
      const state = reducer(initialState, {
        type: 'items/validateItemsStatus/fulfilled',
        payload: mockErrors
      });
      expect(state.errors.items).toEqual(mockErrors);
    });
  });

  describe('selectors', () => {
    const i1 = makeItem('SWORD', 1, 'WEAPONS');
    const i2 = makeItem('APPLE', 2, 'FOOD');
    const c1 = makeCategory('WEAPONS', 0);

    it('selectIconsVersion', () => {
      expect(selectIconsVersion(mockRootState({ iconsVersion: 3 }) as RootState)).toBe(3);
    });

    it('selectRawItemData', () => {
      expect(selectRawItemData(mockRootState({ rawData: 'x' }) as RootState)).toBe('x');
    });

    it('selectItemTypes', () => {
      expect(selectItemTypes(mockRootState({ items: [i1] }) as RootState)).toEqual([i1]);
    });

    it('selectItemTypesById', () => {
      expect(selectItemTypesById(mockRootState({ itemsById: { 1: i1 } }) as RootState)).toEqual({ 1: i1 });
    });

    it('selectItemTypesByKey', () => {
      expect(selectItemTypesByKey(mockRootState({ itemsByKey: { SWORD: i1 } }) as RootState)).toEqual({ SWORD: i1 });
    });

    it('selectItemType with key', () => {
      expect(selectItemType('SWORD')(mockRootState({ itemsByKey: { SWORD: i1 } }) as RootState)).toEqual(i1);
    });

    it('selectItemType with undefined', () => {
      expect(selectItemType(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    it('selectItemCategory with key', () => {
      expect(selectItemCategory('WEAPONS')(mockRootState({ categoriesByKey: { WEAPONS: c1 } }) as RootState)).toEqual(
        c1
      );
    });

    it('selectItemCategory with undefined', () => {
      expect(selectItemCategory(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    describe('selectItemTypesByCategory', () => {
      const localI1 = { ...i1, name: 'Sword', description: '' };
      const localI2 = { ...i2, name: 'Apple', description: '' };
      const root = mockRootState({ localizedItems: [localI1, localI2] }) as RootState;

      it('returns empty for undefined', () => {
        expect(selectItemTypesByCategory(undefined)(root)).toEqual([]);
      });

      it('returns all localized items for ALL', () => {
        expect(selectItemTypesByCategory('ALL')(root)).toEqual([localI1, localI2]);
      });

      it('filters by categoryKey', () => {
        expect(selectItemTypesByCategory('WEAPONS')(root)).toEqual([localI1]);
      });
    });

    it('selectSelectedItemCategory', () => {
      expect(selectSelectedItemCategory(mockRootState({ selectedCategory: 'FOOD' }) as RootState)).toBe('FOOD');
    });

    it('selectItemErrors', () => {
      const errors = { ...initialState.errors, items: { SWORD: ['err'] } };
      expect(selectItemErrors(mockRootState({ errors }) as RootState)).toEqual({ SWORD: ['err'] });
    });

    it('selectItemCategoryErrors', () => {
      const errors = { ...initialState.errors, itemCategories: { FOOD: ['err'] } };
      expect(selectItemCategoryErrors(mockRootState({ errors }) as RootState)).toEqual({ FOOD: ['err'] });
    });
  });
});
