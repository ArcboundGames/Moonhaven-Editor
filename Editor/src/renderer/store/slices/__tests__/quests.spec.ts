import { toQuest, toProcessedRawQuest } from '../../../../../../SharedLibrary/src/util/converters.util';
import * as validateMod from '../../../util/validate.util';
import reducer, {
  loadQuestData,
  localizeQuests,
  selectQuestById,
  selectQuestByKey,
  selectQuestErrors,
  selectQuests,
  selectQuestsById,
  selectQuestsByKey,
  selectRawQuestData,
  setRawQuestData,
  updateQuests,
  validateQuests,
  type QuestsState
} from '../quests';

import type { Localization, Quest } from '../../../../../../SharedLibrary/src/interface';
import type { RootState } from '../..';

jest.mock('../../../util/validate.util', () => ({
  validateQuests: jest.fn(() => ({}))
}));

function makeQuest(key: string, id: number): Quest {
  return toQuest(
    toProcessedRawQuest({ key, id, tasks: [], prerequisiteEventKeys: [], experienceReward: 0, itemRewards: {} })
  );
}

const initialState: QuestsState = {
  rawData: '',
  quests: [],
  questsById: {},
  questsByKey: {},
  localizedQuests: [],
  localizedQuestsById: {},
  localizedQuestsByKey: {},
  errors: {}
};

function mockRootState(overrides: Partial<QuestsState> = {}): Pick<RootState, 'quests'> {
  return { quests: { ...initialState, ...overrides } } as Pick<RootState, 'quests'>;
}

function makeLocalization(values: Record<string, string>): Localization {
  return { key: 'en-US', name: 'English', values };
}

describe('quests slice', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('initial state', () => {
    it('returns the correct initial state', () => {
      const state = reducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    describe('setRawQuestData', () => {
      it('sets rawData', () => {
        const state = reducer(initialState, setRawQuestData('raw'));
        expect(state.rawData).toBe('raw');
      });
    });

    describe('updateQuests', () => {
      it('builds lookups by id and key', () => {
        const q1 = makeQuest('QUEST_A', 1);
        const q2 = makeQuest('QUEST_B', 2);
        const state = reducer(initialState, updateQuests([q1, q2]));
        expect(state.quests).toEqual([q1, q2]);
        expect(state.questsById[1]).toEqual(q1);
        expect(state.questsByKey['QUEST_B']).toEqual(q2);
      });
    });

    describe('validateQuests', () => {
      it('calls validate and stores errors', () => {
        const mockErrors = { QUEST_A: ['err'] };
        jest.mocked(validateMod.validateQuests).mockReturnValue(mockErrors);
        const state = reducer(
          initialState,
          validateQuests({
            quests: [],
            itemsByKey: {},
            craftingRecipesByKey: {},
            creaturesByKey: {},
            dialogueTreesByKey: {},
            eventLogsByKey: {},
            localization: null,
            localizationKeys: []
          })
        );
        expect(state.errors).toEqual(mockErrors);
      });
    });

    describe('loadQuestData', () => {
      it('parses JSON and builds lookups', () => {
        const json = JSON.stringify({ quests: [{ key: 'QUEST_A', id: 1 }] });
        const state = reducer(initialState, loadQuestData(json));
        expect(state.rawData).toBe(json);
        expect(state.quests).toHaveLength(1);
        expect(state.quests[0].key).toBe('QUEST_A');
        expect(state.questsById[1].key).toBe('QUEST_A');
        expect(state.questsByKey['QUEST_A'].id).toBe(1);
      });

      it('returns same state on duplicate rawData', () => {
        const json = JSON.stringify({ quests: [] });
        const prev: QuestsState = { ...initialState, rawData: json };
        const state = reducer(prev, loadQuestData(json));
        expect(state).toBe(prev);
      });

      it('handles missing quests array', () => {
        const json = JSON.stringify({});
        const state = reducer(initialState, loadQuestData(json));
        expect(state.quests).toEqual([]);
      });
    });

    describe('localizeQuests', () => {
      it('returns state when localization is null', () => {
        const state = reducer(initialState, localizeQuests({ localization: null, localizationKeys: [] }));
        expect(state.localizedQuests).toEqual([]);
      });

      it('localizes name and text, sorts alphabetically by name', () => {
        const q1 = makeQuest('QUEST_A', 1);
        const q2 = makeQuest('QUEST_B', 2);
        const prev: QuestsState = {
          ...initialState,
          quests: [q1, q2],
          questsById: { 1: q1, 2: q2 },
          questsByKey: { QUEST_A: q1, QUEST_B: q2 }
        };
        const keys = ['quest_quest_a_name', 'quest_quest_b_name', 'quest_quest_a_text', 'quest_quest_b_text'];
        const localization = makeLocalization({
          quest_quest_a_name: 'Zebra Quest',
          quest_quest_b_name: 'Alpha Quest',
          quest_quest_a_text: 'Description A',
          quest_quest_b_text: 'Description B'
        });
        const state = reducer(prev, localizeQuests({ localization, localizationKeys: keys }));
        expect(state.localizedQuests).toHaveLength(2);
        expect(state.localizedQuests[0].name).toBe('Alpha Quest');
        expect(state.localizedQuests[0].text).toBe('Description B');
        expect(state.localizedQuests[1].name).toBe('Zebra Quest');
        expect(state.localizedQuestsById[1].name).toBe('Zebra Quest');
        expect(state.localizedQuestsByKey['QUEST_B'].name).toBe('Alpha Quest');
      });

      it('falls back to key when no localization value found', () => {
        const q1 = makeQuest('QUEST_A', 1);
        const prev: QuestsState = {
          ...initialState,
          quests: [q1],
          questsById: { 1: q1 },
          questsByKey: { QUEST_A: q1 }
        };
        const localization = makeLocalization({});
        const state = reducer(prev, localizeQuests({ localization, localizationKeys: [] }));
        expect(state.localizedQuests[0].name).toBe('QUEST_A');
      });
    });
  });

  describe('selectors', () => {
    const q1 = makeQuest('QUEST_A', 1);

    it('selectRawQuestData', () => {
      expect(selectRawQuestData(mockRootState({ rawData: 'x' }) as RootState)).toBe('x');
    });

    it('selectQuests', () => {
      expect(selectQuests(mockRootState({ quests: [q1] }) as RootState)).toEqual([q1]);
    });

    it('selectQuestsById', () => {
      expect(selectQuestsById(mockRootState({ questsById: { 1: q1 } }) as RootState)).toEqual({ 1: q1 });
    });

    it('selectQuestsByKey', () => {
      expect(selectQuestsByKey(mockRootState({ questsByKey: { QUEST_A: q1 } }) as RootState)).toEqual({ QUEST_A: q1 });
    });

    it('selectQuestById with valid id', () => {
      expect(selectQuestById(1)(mockRootState({ questsById: { 1: q1 } }) as RootState)).toEqual(q1);
    });

    it('selectQuestById with undefined', () => {
      expect(selectQuestById(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    it('selectQuestByKey with valid key', () => {
      expect(selectQuestByKey('QUEST_A')(mockRootState({ questsByKey: { QUEST_A: q1 } }) as RootState)).toEqual(q1);
    });

    it('selectQuestByKey with undefined', () => {
      expect(selectQuestByKey(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    it('selectQuestErrors', () => {
      const errors = { QUEST_A: ['err'] };
      expect(selectQuestErrors(mockRootState({ errors }) as RootState)).toEqual(errors);
    });
  });
});
