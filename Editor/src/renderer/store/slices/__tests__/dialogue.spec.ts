import { toDialogueTree, toProcessedRawDialogueTree } from '../../../../../../SharedLibrary/src/util/converters.util';
import * as validateMod from '../../../util/validate.util';
import reducer, {
  loadDialogueData,
  selectDialogueTree,
  selectDialogueTreeErrors,
  selectDialogueTrees,
  selectDialogueTreesByCreature,
  selectDialogueTreesByKey,
  selectRawDialogueData,
  selectSelectedDialogueCreature,
  setRawDialogueData,
  setSelectedDialogueCreature,
  updateDialogueTrees,
  validateDialogueTrees,
  type DialogueTreesState
} from '../dialogue';

import type { DialogueTree } from '../../../../../../SharedLibrary/src/interface';
import type { RootState } from '../..';

jest.mock('../../../util/validate.util', () => ({
  validateDialogueTrees: jest.fn(() => ({}))
}));

function makeTree(key: string, creatureKey?: string): DialogueTree {
  return toDialogueTree(
    toProcessedRawDialogueTree({
      key,
      creatureKey,
      dialogues: [],
      startingDialogueId: 0,
      priority: 0
    })
  );
}

const initialState: DialogueTreesState = {
  rawData: '',
  dialogueTrees: [],
  dialogueTreesByKey: {},
  selectedCreature: 'ALL',
  errors: { dialogueTrees: {} }
};

function mockRootState(overrides: Partial<DialogueTreesState> = {}): Pick<RootState, 'dialogue'> {
  return { dialogue: { ...initialState, ...overrides } } as Pick<RootState, 'dialogue'>;
}

describe('dialogue slice', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('initial state', () => {
    it('returns the correct initial state', () => {
      expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    describe('setRawDialogueData', () => {
      it('sets rawData', () => {
        const state = reducer(initialState, setRawDialogueData('raw'));
        expect(state.rawData).toBe('raw');
      });
    });

    describe('setSelectedDialogueCreature', () => {
      it('sets selected creature', () => {
        const state = reducer(initialState, setSelectedDialogueCreature('GOBLIN'));
        expect(state.selectedCreature).toBe('GOBLIN');
      });

      it('returns same state when unchanged', () => {
        const state = reducer(initialState, setSelectedDialogueCreature('ALL'));
        expect(state).toBe(initialState);
      });

      it('defaults to ALL when undefined', () => {
        const prev = { ...initialState, selectedCreature: 'GOBLIN' };
        const state = reducer(prev, setSelectedDialogueCreature(undefined));
        expect(state.selectedCreature).toBe('ALL');
      });
    });

    describe('updateDialogueTrees', () => {
      it('sorts trees by key and builds lookup', () => {
        const b = makeTree('B_TREE');
        const a = makeTree('A_TREE');
        const state = reducer(initialState, updateDialogueTrees([b, a]));
        expect(state.dialogueTrees[0].key).toBe('A_TREE');
        expect(state.dialogueTrees[1].key).toBe('B_TREE');
        expect(state.dialogueTreesByKey['A_TREE']).toBeDefined();
        expect(state.dialogueTreesByKey['B_TREE']).toBeDefined();
      });
    });

    describe('validateDialogueTrees', () => {
      it('calls validate and stores errors', () => {
        const mockErrors = { TREE_1: ['err'] };
        jest.mocked(validateMod.validateDialogueTrees).mockReturnValue(mockErrors);
        const state = reducer(
          initialState,
          validateDialogueTrees({
            dialogueTrees: [],
            creaturesByKey: {},
            eventLogsByKey: {},
            localization: null,
            localizationKeys: []
          })
        );
        expect(state.errors.dialogueTrees).toEqual(mockErrors);
      });
    });

    describe('loadDialogueData', () => {
      it('parses JSON and sorts trees by key', () => {
        const json = JSON.stringify({
          dialogueTrees: [
            { key: 'Z_TREE', dialogues: [], startingDialogueId: 0, priority: 0 },
            { key: 'A_TREE', dialogues: [], startingDialogueId: 0, priority: 0 }
          ]
        });
        const state = reducer(initialState, loadDialogueData(json));
        expect(state.rawData).toBe(json);
        expect(state.dialogueTrees).toHaveLength(2);
        expect(state.dialogueTrees[0].key).toBe('A_TREE');
        expect(state.dialogueTrees[1].key).toBe('Z_TREE');
        expect(state.dialogueTreesByKey['A_TREE']).toBeDefined();
      });

      it('returns same state on duplicate rawData', () => {
        const json = JSON.stringify({ dialogueTrees: [] });
        const prev: DialogueTreesState = { ...initialState, rawData: json };
        const state = reducer(prev, loadDialogueData(json));
        expect(state).toBe(prev);
      });

      it('handles missing dialogueTrees array', () => {
        const json = JSON.stringify({});
        const state = reducer(initialState, loadDialogueData(json));
        expect(state.dialogueTrees).toEqual([]);
      });
    });
  });

  describe('selectors', () => {
    const t1 = makeTree('TREE_A', 'GOBLIN');
    const t2 = makeTree('TREE_B', 'ORC');

    it('selectRawDialogueData', () => {
      expect(selectRawDialogueData(mockRootState({ rawData: 'x' }) as RootState)).toBe('x');
    });

    it('selectDialogueTrees', () => {
      expect(selectDialogueTrees(mockRootState({ dialogueTrees: [t1] }) as RootState)).toEqual([t1]);
    });

    it('selectDialogueTreesByKey', () => {
      expect(selectDialogueTreesByKey(mockRootState({ dialogueTreesByKey: { TREE_A: t1 } }) as RootState)).toEqual({
        TREE_A: t1
      });
    });

    it('selectDialogueTree with key', () => {
      expect(selectDialogueTree('TREE_A')(mockRootState({ dialogueTreesByKey: { TREE_A: t1 } }) as RootState)).toEqual(
        t1
      );
    });

    it('selectDialogueTree with undefined', () => {
      expect(selectDialogueTree(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    describe('selectDialogueTreesByCreature', () => {
      const root = mockRootState({ dialogueTrees: [t1, t2] }) as RootState;

      it('returns empty for undefined', () => {
        expect(selectDialogueTreesByCreature(undefined)(root)).toEqual([]);
      });

      it('returns all for ALL', () => {
        expect(selectDialogueTreesByCreature('ALL')(root)).toEqual([t1, t2]);
      });

      it('filters by creatureKey', () => {
        expect(selectDialogueTreesByCreature('GOBLIN')(root)).toEqual([t1]);
      });
    });

    it('selectDialogueTreeErrors', () => {
      const errors = { dialogueTrees: { T: ['err'] } };
      expect(selectDialogueTreeErrors(mockRootState({ errors }) as RootState)).toEqual({ T: ['err'] });
    });

    it('selectSelectedDialogueCreature', () => {
      expect(selectSelectedDialogueCreature(mockRootState({ selectedCreature: 'GOBLIN' }) as RootState)).toBe('GOBLIN');
    });
  });
});
