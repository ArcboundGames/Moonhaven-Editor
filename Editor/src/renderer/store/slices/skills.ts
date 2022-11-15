import { createSlice } from '@reduxjs/toolkit';

import { toProcessedRawSkill, toSkill } from '../../../../../SharedLibrary/src/util/converters.util';
import { getLocalizationKey, getLocalizedValue } from '../../../../../SharedLibrary/src/util/localization.util';
import { isNotEmpty } from '../../../../../SharedLibrary/src/util/string.util';
import { validateSkills as validateDataSkills } from '../../util/validate.util';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type { Localization, LocalizedSkill, Skill, SkillDataFile } from '../../../../../SharedLibrary/src/interface';

// Define a type for the slice state
export interface SkillsState {
  rawData: string;
  skills: Skill[];
  skillsById: Record<number, Skill>;
  skillsByKey: Record<string, Skill>;
  localizedSkills: LocalizedSkill[];
  localizedSkillsById: Record<number, LocalizedSkill>;
  localizedSkillsByKey: Record<string, LocalizedSkill>;
  errors: Record<string, string[]>;
}

// Define the initial state using that type
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

export const skillsSlice = createSlice({
  name: 'skills',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setRawSkillData: (state, action: PayloadAction<string>) => ({ ...state, rawData: action.payload }),
    updateSkills: (state, action: PayloadAction<Skill[]>) => {
      const skillsById: Record<number, Skill> = {};
      const skillsByKey: Record<string, Skill> = {};
      action.payload.forEach((skill) => {
        skillsById[skill.id] = skill;
        skillsByKey[skill.key] = skill;
      });

      return {
        ...state,
        skillsById,
        skillsByKey,
        skills: action.payload
      };
    },
    validateSkills: (
      state,
      action: PayloadAction<{
        skills: Skill[];
        localization: Localization | null | undefined;
        localizationKeys: string[];
      }>
    ) => {
      const { skills, localization, localizationKeys } = action.payload;

      return {
        ...state,
        errors: validateDataSkills(skills, localization, localizationKeys)
      };
    },
    loadSkillData: (state, action: PayloadAction<string>) => {
      if (action.payload === state.rawData) {
        return state;
      }

      const data = JSON.parse(action.payload) as SkillDataFile;

      const skills = data.skills?.map((rawSkill) => toSkill(toProcessedRawSkill(rawSkill))) ?? [];

      const skillsById: Record<number, Skill> = {};
      const skillsByKey: Record<string, Skill> = {};
      skills.forEach((skill) => {
        skillsById[skill.id] = skill;
        skillsByKey[skill.key] = skill;
      });

      return {
        ...state,
        skills,
        skillsById,
        skillsByKey,
        rawData: action.payload
      };
    },
    localizeSkills: (
      state,
      action: PayloadAction<{
        localization: Localization | null;
        localizationKeys: string[];
      }>
    ) => {
      const { localization, localizationKeys } = action.payload;
      if (!localization) {
        return state;
      }

      const skillNamesByKey = state.skills.reduce((namesByKey, skill) => {
        namesByKey[skill.key] = getLocalizedValue(
          localization,
          localizationKeys,
          getLocalizationKey('skill', 'name', skill.key)
        );
        return namesByKey;
      }, {} as Record<string, string>);

      const localizedSkills: LocalizedSkill[] = state.skills.map((skill) => ({
        ...skill,
        name: isNotEmpty(skillNamesByKey[skill.key]) ? skillNamesByKey[skill.key] : skill.key
      }));
      localizedSkills.sort((a, b) => a.name.localeCompare(b.name));

      const localizedSkillsById: Record<number, LocalizedSkill> = {};
      const localizedSkillsByKey: Record<string, LocalizedSkill> = {};
      localizedSkills.forEach((skill) => {
        localizedSkillsById[skill.id] = skill;
        localizedSkillsByKey[skill.key] = skill;
      });

      return {
        ...state,
        localizedSkills,
        localizedSkillsById,
        localizedSkillsByKey
      };
    }
  }
});

export const { setRawSkillData, loadSkillData, updateSkills, validateSkills, localizeSkills } = skillsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectRawSkillData = (state: RootState) => state.skills.rawData;

export const selectSkills = (state: RootState) => state.skills.skills;

export const selectSkillsById = (state: RootState) => state.skills.skillsById;

export const selectSkillsByKey = (state: RootState) => state.skills.skillsByKey;

export const selectSkillById = (id?: number) => (state: RootState) => id ? state.skills.skillsById?.[id] : undefined;
export const selectSkillByKey = (key?: string) => (state: RootState) =>
  key ? state.skills.skillsByKey?.[key] : undefined;

export const selectSkillsSortedWithName = (state: RootState) => state.skills.localizedSkills;

export const selectSkillsByIdWithName = (state: RootState) => state.skills.localizedSkillsById;

export const selectSkillsByKeyWithName = (state: RootState) => state.skills.localizedSkillsByKey;

export const selectSkillErrors = (state: RootState) => state.skills.errors;

export default skillsSlice.reducer;
