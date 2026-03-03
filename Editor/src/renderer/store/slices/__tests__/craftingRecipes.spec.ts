import {
  toCraftingRecipe,
  toCraftingRecipeCategory,
  toProcessedRawCraftingRecipe,
  toProcessedRawCraftingRecipeCategory
} from '../../../../../../SharedLibrary/src/util/converters.util';
import * as validateMod from '../../../util/validate.util';
import reducer, {
  clearCraftingRecipeSelections,
  loadCraftingRecipeData,
  selectCraftingRecipe,
  selectCraftingRecipeCategories,
  selectCraftingRecipeCategory,
  selectCraftingRecipeCategoryErrors,
  selectCraftingRecipeErrors,
  selectCraftingRecipes,
  selectCraftingRecipesByCategory,
  selectCraftingRecipesByKey,
  selectRawCraftingRecipeData,
  selectSelectedCraftingRecipeCategory,
  setRawCraftingRecipeData,
  setSelectedCraftingRecipeCategory,
  updateCraftingRecipeCategories,
  updateCraftingRecipes,
  validateCraftingRecipeCategories,
  validateCraftingRecipes,
  type CraftingRecipesState
} from '../craftingRecipes';

import type { CraftingRecipe, CraftingRecipeCategory } from '../../../../../../SharedLibrary/src/interface';
import type { RootState } from '../..';

jest.mock('../../../util/validate.util', () => ({
  validateCraftingRecipeCategories: jest.fn(() => ({})),
  validateCraftingRecipes: jest.fn(() => ({}))
}));

function makeRecipe(key: string, index: number, categoryKey?: string): CraftingRecipe {
  return toCraftingRecipe(toProcessedRawCraftingRecipe({ key, categoryKey }), index);
}

function makeCategory(key: string, index: number): CraftingRecipeCategory {
  return toCraftingRecipeCategory(toProcessedRawCraftingRecipeCategory({ key }), index);
}

const initialState: CraftingRecipesState = {
  rawData: '',
  craftingRecipes: [],
  craftingRecipesByKey: {},
  craftingRecipeCategories: [],
  craftingRecipeCategoriesByKey: {},
  errors: { recipes: {}, recipeCategories: {} },
  selectedCategory: 'ALL'
};

function mockRootState(overrides: Partial<CraftingRecipesState> = {}): Pick<RootState, 'craftingRecipes'> {
  return { craftingRecipes: { ...initialState, ...overrides } } as Pick<RootState, 'craftingRecipes'>;
}

describe('craftingRecipes slice', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('initial state', () => {
    it('returns the correct initial state', () => {
      const state = reducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    describe('setRawCraftingRecipeData', () => {
      it('sets rawData', () => {
        const state = reducer(initialState, setRawCraftingRecipeData('raw'));
        expect(state.rawData).toBe('raw');
      });
    });

    describe('setSelectedCraftingRecipeCategory', () => {
      it('sets selected category', () => {
        const state = reducer(initialState, setSelectedCraftingRecipeCategory('FOOD'));
        expect(state.selectedCategory).toBe('FOOD');
      });

      it('returns same state when value unchanged', () => {
        const state = reducer(initialState, setSelectedCraftingRecipeCategory('ALL'));
        expect(state).toBe(initialState);
      });

      it('defaults to ALL when undefined', () => {
        const prev = { ...initialState, selectedCategory: 'FOOD' };
        const state = reducer(prev, setSelectedCraftingRecipeCategory(undefined));
        expect(state.selectedCategory).toBe('ALL');
      });
    });

    describe('clearCraftingRecipeSelections', () => {
      it('resets to ALL', () => {
        const prev = { ...initialState, selectedCategory: 'FOOD' };
        const state = reducer(prev, clearCraftingRecipeSelections());
        expect(state.selectedCategory).toBe('ALL');
      });
    });

    describe('updateCraftingRecipeCategories', () => {
      it('builds lookup by key', () => {
        const c = makeCategory('FOOD', 0);
        const state = reducer(initialState, updateCraftingRecipeCategories([c]));
        expect(state.craftingRecipeCategories).toEqual([c]);
        expect(state.craftingRecipeCategoriesByKey['FOOD']).toEqual(c);
      });
    });

    describe('updateCraftingRecipes', () => {
      it('builds lookup by key', () => {
        const r = makeRecipe('BREAD', 0);
        const state = reducer(initialState, updateCraftingRecipes([r]));
        expect(state.craftingRecipes).toEqual([r]);
        expect(state.craftingRecipesByKey['BREAD']).toEqual(r);
      });
    });

    describe('validateCraftingRecipeCategories', () => {
      it('calls validate and stores errors', () => {
        const mockErrors = { FOOD: ['err'] };
        jest.mocked(validateMod.validateCraftingRecipeCategories).mockReturnValue(mockErrors);
        const state = reducer(initialState, validateCraftingRecipeCategories({ craftingRecipeCategories: [] }));
        expect(state.errors.recipeCategories).toEqual(mockErrors);
      });
    });

    describe('validateCraftingRecipes', () => {
      it('calls validate and stores errors', () => {
        const mockErrors = { BREAD: ['err'] };
        jest.mocked(validateMod.validateCraftingRecipes).mockReturnValue(mockErrors);
        const state = reducer(
          initialState,
          validateCraftingRecipes({
            craftingRecipes: [],
            craftingRecipeCategoriesByKey: {},
            skillsByKey: {},
            itemsByKey: {},
            workstationKeys: []
          })
        );
        expect(state.errors.recipes).toEqual(mockErrors);
      });
    });

    describe('loadCraftingRecipeData', () => {
      it('parses JSON with categories and recipes', () => {
        const json = JSON.stringify({
          categories: [{ key: 'FOOD' }],
          recipes: [{ key: 'BREAD', categoryKey: 'FOOD' }]
        });
        const state = reducer(initialState, loadCraftingRecipeData(json));
        expect(state.rawData).toBe(json);
        expect(state.craftingRecipeCategories).toHaveLength(1);
        expect(state.craftingRecipes).toHaveLength(1);
        expect(state.craftingRecipeCategoriesByKey['FOOD']).toBeDefined();
        expect(state.craftingRecipesByKey['BREAD']).toBeDefined();
      });

      it('returns same state on duplicate rawData', () => {
        const json = JSON.stringify({ categories: [], recipes: [] });
        const prev: CraftingRecipesState = { ...initialState, rawData: json };
        const state = reducer(prev, loadCraftingRecipeData(json));
        expect(state).toBe(prev);
      });

      it('handles missing arrays', () => {
        const json = JSON.stringify({});
        const state = reducer(initialState, loadCraftingRecipeData(json));
        expect(state.craftingRecipes).toEqual([]);
        expect(state.craftingRecipeCategories).toEqual([]);
      });
    });
  });

  describe('selectors', () => {
    const r1 = makeRecipe('BREAD', 0, 'FOOD');
    const r2 = makeRecipe('SWORD', 1, 'WEAPONS');
    const c1 = makeCategory('FOOD', 0);

    it('selectRawCraftingRecipeData', () => {
      expect(selectRawCraftingRecipeData(mockRootState({ rawData: 'x' }) as RootState)).toBe('x');
    });

    it('selectCraftingRecipes', () => {
      expect(selectCraftingRecipes(mockRootState({ craftingRecipes: [r1] }) as RootState)).toEqual([r1]);
    });

    it('selectCraftingRecipesByKey', () => {
      expect(selectCraftingRecipesByKey(mockRootState({ craftingRecipesByKey: { BREAD: r1 } }) as RootState)).toEqual({
        BREAD: r1
      });
    });

    it('selectCraftingRecipe with key', () => {
      expect(
        selectCraftingRecipe('BREAD')(mockRootState({ craftingRecipesByKey: { BREAD: r1 } }) as RootState)
      ).toEqual(r1);
    });

    it('selectCraftingRecipe with undefined', () => {
      expect(selectCraftingRecipe(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    describe('selectCraftingRecipesByCategory', () => {
      const rootWithRecipes = mockRootState({ craftingRecipes: [r1, r2] }) as RootState;

      it('returns empty for undefined', () => {
        expect(selectCraftingRecipesByCategory(undefined)(rootWithRecipes)).toEqual([]);
      });

      it('returns all for ALL', () => {
        expect(selectCraftingRecipesByCategory('ALL')(rootWithRecipes)).toEqual([r1, r2]);
      });

      it('filters by categoryKey', () => {
        expect(selectCraftingRecipesByCategory('FOOD')(rootWithRecipes)).toEqual([r1]);
      });
    });

    it('selectCraftingRecipeCategories', () => {
      expect(selectCraftingRecipeCategories(mockRootState({ craftingRecipeCategories: [c1] }) as RootState)).toEqual([
        c1
      ]);
    });

    it('selectCraftingRecipeCategory with key', () => {
      expect(
        selectCraftingRecipeCategory('FOOD')(
          mockRootState({ craftingRecipeCategoriesByKey: { FOOD: c1 } }) as RootState
        )
      ).toEqual(c1);
    });

    it('selectCraftingRecipeCategory with undefined', () => {
      expect(selectCraftingRecipeCategory(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    it('selectCraftingRecipeErrors', () => {
      const errors = { ...initialState.errors, recipes: { BREAD: ['err'] } };
      expect(selectCraftingRecipeErrors(mockRootState({ errors }) as RootState)).toEqual({ BREAD: ['err'] });
    });

    it('selectCraftingRecipeCategoryErrors', () => {
      const errors = { ...initialState.errors, recipeCategories: { FOOD: ['err'] } };
      expect(selectCraftingRecipeCategoryErrors(mockRootState({ errors }) as RootState)).toEqual({ FOOD: ['err'] });
    });

    it('selectSelectedCraftingRecipeCategory', () => {
      expect(selectSelectedCraftingRecipeCategory(mockRootState({ selectedCategory: 'FOOD' }) as RootState)).toBe(
        'FOOD'
      );
    });
  });
});
