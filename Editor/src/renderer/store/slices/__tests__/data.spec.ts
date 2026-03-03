import reducer, {
  setPath,
  loaded,
  setSection,
  search,
  selectLoaded,
  selectPath,
  selectSection,
  selectSearch
} from '../data';

import type { DataState } from '../data';
import type { RootState } from '../..';

const initialState: DataState = {
  loaded: false,
  section: 'object'
};

function mockRootState(overrides: Partial<DataState> = {}): Pick<RootState, 'data'> {
  return {
    data: { ...initialState, ...overrides }
  } as Pick<RootState, 'data'>;
}

describe('data slice', () => {
  describe('initial state', () => {
    it('returns the correct initial state', () => {
      const state = reducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    describe('setPath', () => {
      it('sets path', () => {
        const state = reducer(initialState, setPath('/some/path'));
        expect(state.path).toBe('/some/path');
      });

      it('overwrites existing path', () => {
        const prev: DataState = { ...initialState, path: '/old' };
        const state = reducer(prev, setPath('/new'));
        expect(state.path).toBe('/new');
      });
    });

    describe('loaded', () => {
      it('sets loaded to true', () => {
        const state = reducer(initialState, loaded());
        expect(state.loaded).toBe(true);
      });

      it('stays true if already loaded', () => {
        const prev: DataState = { ...initialState, loaded: true };
        const state = reducer(prev, loaded());
        expect(state.loaded).toBe(true);
      });
    });

    describe('setSection', () => {
      it('sets section', () => {
        const state = reducer(initialState, setSection('item'));
        expect(state.section).toBe('item');
      });

      it('changes section from existing value', () => {
        const prev: DataState = { ...initialState, section: 'creature' };
        const state = reducer(prev, setSection('skill'));
        expect(state.section).toBe('skill');
      });
    });

    describe('search', () => {
      it('sets search string', () => {
        const state = reducer(initialState, search('sword'));
        expect(state.search).toBe('sword');
      });

      it('clears search with empty string', () => {
        const prev: DataState = { ...initialState, search: 'hello' };
        const state = reducer(prev, search(''));
        expect(state.search).toBe('');
      });
    });
  });

  describe('selectors', () => {
    it('selectLoaded returns loaded', () => {
      expect(selectLoaded(mockRootState({ loaded: true }) as RootState)).toBe(true);
    });

    it('selectPath returns path', () => {
      expect(selectPath(mockRootState({ path: '/test' }) as RootState)).toBe('/test');
    });

    it('selectPath returns undefined when not set', () => {
      expect(selectPath(mockRootState() as RootState)).toBeUndefined();
    });

    it('selectSection returns section', () => {
      expect(selectSection(mockRootState({ section: 'item' }) as RootState)).toBe('item');
    });

    it('selectSearch returns search', () => {
      expect(selectSearch(mockRootState({ search: 'hello' }) as RootState)).toBe('hello');
    });

    it('selectSearch returns undefined when not set', () => {
      expect(selectSearch(mockRootState() as RootState)).toBeUndefined();
    });
  });
});
