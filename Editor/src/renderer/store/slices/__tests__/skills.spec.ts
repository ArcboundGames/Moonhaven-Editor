import { toSkill, toProcessedRawSkill } from '../../../../../../SharedLibrary/src/util/converters.util';
import * as validateMod from '../../../util/validate.util';
import reducer, {
  loadSkillData,
  localizeSkills,
  selectSkillById,
  selectSkillByKey,
  selectSkillErrors,
  selectSkills,
  selectSkillsById,
  selectSkillsByKey,
  selectRawSkillData,
  setRawSkillData,
  updateSkills,
  validateSkills,
  type SkillsState
} from '../skills';

import type { Localization, Skill } from '../../../../../../SharedLibrary/src/interface';
import type { RootState } from '../..';

jest.mock('../../../util/validate.util', () => ({
  validateSkills: jest.fn(() => ({}))
}));

function makeSkill(key: string, id: number): Skill {
  return toSkill(toProcessedRawSkill({ key, id, levels: [] }));
}

const initialState: SkillsState = {
  rawData: '',
  skills: [],
  skillsById: {},
  skillsByKey: {},
  localizedSkills: [],
  localizedSkillsById: {},
  localizedSkillsByKey: {},
  errors: {}
};

function mockRootState(overrides: Partial<SkillsState> = {}): Pick<RootState, 'skills'> {
  return { skills: { ...initialState, ...overrides } } as Pick<RootState, 'skills'>;
}

function makeLocalization(values: Record<string, string>): Localization {
  return { key: 'en-US', name: 'English', values };
}

describe('skills slice', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('initial state', () => {
    it('returns the correct initial state', () => {
      const state = reducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    describe('setRawSkillData', () => {
      it('sets rawData', () => {
        const state = reducer(initialState, setRawSkillData('raw'));
        expect(state.rawData).toBe('raw');
      });
    });

    describe('updateSkills', () => {
      it('builds lookups by id and key', () => {
        const s1 = makeSkill('COMBAT', 1);
        const s2 = makeSkill('FARMING', 2);
        const state = reducer(initialState, updateSkills([s1, s2]));
        expect(state.skills).toEqual([s1, s2]);
        expect(state.skillsById[1]).toEqual(s1);
        expect(state.skillsByKey['FARMING']).toEqual(s2);
      });
    });

    describe('validateSkills', () => {
      it('calls validate and stores errors', () => {
        const mockErrors = { COMBAT: ['err'] };
        jest.mocked(validateMod.validateSkills).mockReturnValue(mockErrors);
        const state = reducer(initialState, validateSkills({ skills: [], localization: null, localizationKeys: [] }));
        expect(state.errors).toEqual(mockErrors);
        expect(validateMod.validateSkills).toHaveBeenCalledWith([], null, []);
      });
    });

    describe('loadSkillData', () => {
      it('parses JSON and builds lookups', () => {
        const json = JSON.stringify({ skills: [{ key: 'COMBAT', id: 1, levels: [] }] });
        const state = reducer(initialState, loadSkillData(json));
        expect(state.rawData).toBe(json);
        expect(state.skills).toHaveLength(1);
        expect(state.skills[0].key).toBe('COMBAT');
        expect(state.skillsById[1].key).toBe('COMBAT');
        expect(state.skillsByKey['COMBAT'].id).toBe(1);
      });

      it('returns same state on duplicate rawData', () => {
        const json = JSON.stringify({ skills: [] });
        const prev: SkillsState = { ...initialState, rawData: json };
        const state = reducer(prev, loadSkillData(json));
        expect(state).toBe(prev);
      });

      it('handles missing skills array', () => {
        const json = JSON.stringify({});
        const state = reducer(initialState, loadSkillData(json));
        expect(state.skills).toEqual([]);
      });
    });

    describe('localizeSkills', () => {
      it('returns state when localization is null', () => {
        const state = reducer(initialState, localizeSkills({ localization: null, localizationKeys: [] }));
        expect(state.localizedSkills).toEqual([]);
      });

      it('localizes and sorts skills alphabetically by name', () => {
        const s1 = makeSkill('COMBAT', 1);
        const s2 = makeSkill('FARMING', 2);
        const prev: SkillsState = {
          ...initialState,
          skills: [s1, s2],
          skillsById: { 1: s1, 2: s2 },
          skillsByKey: { COMBAT: s1, FARMING: s2 }
        };
        const localization = makeLocalization({
          skill_combat_name: 'Zork Combat',
          skill_farming_name: 'Alpha Farming'
        });
        const state = reducer(
          prev,
          localizeSkills({ localization, localizationKeys: ['skill_combat_name', 'skill_farming_name'] })
        );
        expect(state.localizedSkills).toHaveLength(2);
        expect(state.localizedSkills[0].name).toBe('Alpha Farming');
        expect(state.localizedSkills[1].name).toBe('Zork Combat');
        expect(state.localizedSkillsById[2].name).toBe('Alpha Farming');
        expect(state.localizedSkillsByKey['COMBAT'].name).toBe('Zork Combat');
      });

      it('falls back to key when no localization value found', () => {
        const s1 = makeSkill('COMBAT', 1);
        const prev: SkillsState = {
          ...initialState,
          skills: [s1],
          skillsById: { 1: s1 },
          skillsByKey: { COMBAT: s1 }
        };
        const localization = makeLocalization({});
        const state = reducer(prev, localizeSkills({ localization, localizationKeys: [] }));
        expect(state.localizedSkills[0].name).toBe('COMBAT');
      });
    });
  });

  describe('selectors', () => {
    const s1 = makeSkill('COMBAT', 1);

    it('selectRawSkillData', () => {
      expect(selectRawSkillData(mockRootState({ rawData: 'x' }) as RootState)).toBe('x');
    });

    it('selectSkills', () => {
      expect(selectSkills(mockRootState({ skills: [s1] }) as RootState)).toEqual([s1]);
    });

    it('selectSkillsById', () => {
      expect(selectSkillsById(mockRootState({ skillsById: { 1: s1 } }) as RootState)).toEqual({ 1: s1 });
    });

    it('selectSkillsByKey', () => {
      expect(selectSkillsByKey(mockRootState({ skillsByKey: { COMBAT: s1 } }) as RootState)).toEqual({ COMBAT: s1 });
    });

    it('selectSkillById with valid id', () => {
      expect(selectSkillById(1)(mockRootState({ skillsById: { 1: s1 } }) as RootState)).toEqual(s1);
    });

    it('selectSkillById with undefined', () => {
      expect(selectSkillById(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    it('selectSkillByKey with valid key', () => {
      expect(selectSkillByKey('COMBAT')(mockRootState({ skillsByKey: { COMBAT: s1 } }) as RootState)).toEqual(s1);
    });

    it('selectSkillByKey with undefined', () => {
      expect(selectSkillByKey(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    it('selectSkillErrors', () => {
      const errors = { COMBAT: ['err'] };
      expect(selectSkillErrors(mockRootState({ errors }) as RootState)).toEqual(errors);
    });
  });
});
