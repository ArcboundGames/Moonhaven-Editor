import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Box from '@mui/material/Box';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { SKILLS_DATA_FILE } from '../../../../../../../SharedLibrary/src/constants';
import { validateSkill } from '../../../../../../../SharedLibrary/src/dataValidation';
import { useAppDispatch, useAppSelector, useDebounce } from '../../../../hooks';
import { selectSkillByKey, selectSkills, updateSkills } from '../../../../store/slices/skills';
import { useUpdateLocalization } from '../../../hooks/useUpdateLocalization.hook';
import NumberTextField from '../../../widgets/form/NumberTextField';
import TextField from '../../../widgets/form/TextField';
import Card from '../../../widgets/layout/Card';
import FormBox from '../../../widgets/layout/FormBox';
import DataViewer from '../../DataViewer';
import SkillLevelCard from './skillView/SkillLevelsCard';

import type { Skill } from '../../../../../../../SharedLibrary/src/interface';

const SkillView = () => {
  const { dataKey = '' } = useParams();

  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<string[] | undefined>(undefined);

  const skill = useAppSelector(useMemo(() => selectSkillByKey(dataKey), [dataKey]));
  const skills = useAppSelector(selectSkills);

  const defaultValue: Skill = useMemo(
    () => ({
      id: Math.max(0, ...skills.map((otherSkill) => otherSkill.id)) + 1,
      key: 'NEW_SKILL',
      lootTableKey: '',
      levels: []
    }),
    [skills]
  );

  const [editData, setEditData] = useState<Skill | undefined>(dataKey === 'new' ? defaultValue : skill);
  const debouncedEditData = useDebounce(editData, 500);

  const dataKeys = useMemo(
    () => ({
      current: editData?.key ?? dataKey,
      route: dataKey
    }),
    [dataKey, editData?.key]
  );

  const localizationKeys = useMemo(() => {
    const keys = ['name'];

    skill?.levels.forEach((skillLevel) => {
      keys.push(`skill-level-${skillLevel.key.toLowerCase()}-name`);
      keys.push(`skill-level-${skillLevel.key.toLowerCase()}-description`);
    });

    return keys;
  }, [skill?.levels]);

  const {
    saveLocalizations,
    getLocalizedValue,
    tempData,
    updateLocalizedValue,
    deleteLocalizations,
    deleteLocalizedValues,
    moveLocalizations,
    getLocalizedName,
    isLocalizationDirty
  } = useUpdateLocalization({
    prefix: 'skill',
    keys: localizationKeys,
    fallbackName: 'Unknown Skill',
    dataKeys
  });

  const debouncedTempData = useDebounce(tempData, 300);

  useEffect(() => {
    if (!debouncedEditData || !debouncedTempData) {
      return;
    }

    setErrors(validateSkill(debouncedEditData, debouncedTempData.localization, debouncedTempData.localizationKeys, []));
  }, [debouncedEditData, debouncedTempData]);

  const validate = useCallback(
    (data: Skill) => {
      return validateSkill(data, debouncedTempData.localization, debouncedTempData.localizationKeys, []);
    },
    [debouncedTempData]
  );

  const onSave = useCallback(
    (dataSaved: Skill[], newSkill: Skill | undefined) => {
      dispatch(updateSkills(dataSaved));

      if (newSkill) {
        saveLocalizations();
      } else {
        deleteLocalizations();
      }
    },
    [deleteLocalizations, dispatch, saveLocalizations]
  );

  const getHeader = useCallback(
    () => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box>{getLocalizedName()}</Box>
        {errors && errors.length > 0 ? (
          <ReportProblemIcon color="error" sx={{ ml: 1 }} titleAccess={errors.join(', ')} />
        ) : null}
      </Box>
    ),
    [errors, getLocalizedName]
  );

  const onDataChange = useCallback((data: Skill | undefined) => setEditData(data), []);

  const getFileData = useCallback(
    () => ({
      skills
    }),
    [skills]
  );

  return (
    <DataViewer
      dataKey={dataKey}
      valueDataKey={editData?.key}
      section="skill"
      file={SKILLS_DATA_FILE}
      fileSection="skills"
      value={skill}
      defaultValue={defaultValue}
      getFileData={getFileData}
      getName={getLocalizedName}
      getHeader={getHeader}
      validate={validate}
      onSave={onSave}
      onDataChange={onDataChange}
      dirty={isLocalizationDirty}
    >
      {({ data, handleOnChange, disabled }) => (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 3fr' }}>
          <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <Card header="General">
              <FormBox>
                <NumberTextField
                  label="ID"
                  value={data.id}
                  onChange={(value) =>
                    handleOnChange({
                      id: value
                    })
                  }
                  required
                  error={data.id <= 0}
                  disabled={disabled}
                  wholeNumber
                />
              </FormBox>
              <FormBox>
                <TextField
                  label="Key"
                  value={data.key}
                  onChange={(value) => handleOnChange({ key: value })}
                  required
                  disabled={disabled}
                />
              </FormBox>
              <FormBox>
                <TextField
                  label="Name"
                  value={getLocalizedValue('name')}
                  onChange={(value) => updateLocalizedValue('name', value)}
                  required
                  disabled={disabled}
                />
              </FormBox>
            </Card>
          </Box>
          <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <SkillLevelCard
              skillLevels={data.levels}
              onChange={(levels) => handleOnChange({ levels })}
              disabled={disabled}
              updateLocalizedValue={updateLocalizedValue}
              getLocalizedValue={getLocalizedValue}
              deleteLocalizedValues={deleteLocalizedValues}
              moveLocalizations={moveLocalizations}
            />
          </Box>
        </Box>
      )}
    </DataViewer>
  );
};

export default SkillView;
