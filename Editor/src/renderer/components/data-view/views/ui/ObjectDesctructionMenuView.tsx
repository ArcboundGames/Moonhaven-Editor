import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Box from '@mui/material/Box';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { UI_DATA_FILE } from '../../../../../../../SharedLibrary/src/constants';
import { useAppDispatch, useAppSelector, useDebounce } from '../../../../hooks';
import {
  selectObjectCategories,
  selectObjectCategoriesByKey,
  selectObjectSubCategories,
  selectObjectSubCategoriesByKey,
  selectObjectTypesByKey,
  selectObjectTypesSortedWithName
} from '../../../../store/slices/objects';
import { selectUiSection, selectUiSections, updateObjectDestructionMenu } from '../../../../store/slices/ui';
import { validateObjectDestructionMenu } from '../../../../util/validate.util';
import { useUpdateLocalization } from '../../../hooks/useUpdateLocalization.hook';
import NumberTextField from '../../../widgets/form/NumberTextField';
import Card from '../../../widgets/layout/Card';
import FormBox from '../../../widgets/layout/FormBox';
import DataViewer from '../../DataViewer';
import DestructionMenuButtonCard from './widgets/DestructionMenuButtonCard';

import type { DestructionMenu } from '../../../../../../../SharedLibrary/src/interface';

const ObjectDesctructionMenuView = () => {
  const dispatch = useAppDispatch();

  const desctructionMenu = useAppSelector(useMemo(() => selectUiSection('objectDestructionMenu'), []));
  const uiSections = useAppSelector(selectUiSections);

  const objects = useAppSelector(selectObjectTypesSortedWithName);
  const objectTypesByKey = useAppSelector(selectObjectTypesByKey);
  const objectCategories = useAppSelector(selectObjectCategories);
  const objectCategoriesByKey = useAppSelector(selectObjectCategoriesByKey);
  const objectSubCategories = useAppSelector(selectObjectSubCategories);
  const objectSubCategoriesByKey = useAppSelector(selectObjectSubCategoriesByKey);

  const [editData, setEditData] = useState<DestructionMenu | undefined>(desctructionMenu);

  const localizationKeys = useMemo(() => {
    const keys: string[] = [];

    desctructionMenu?.buttons?.forEach((_, index) => {
      keys.push(`destruction-menu-button-${index + 1}-text`);
    });

    return keys;
  }, [desctructionMenu?.buttons]);

  const {
    saveLocalizations,
    getLocalizedValue,
    tempData,
    updateLocalizedValue,
    deleteLocalizedValues,
    isLocalizationDirty
  } = useUpdateLocalization({
    prefix: 'ui',
    keys: localizationKeys
  });

  const [errors, setErrors] = useState<string[] | undefined>(undefined);

  const debouncedEditData = useDebounce(editData, 500);
  useEffect(() => {
    if (!debouncedEditData) {
      return;
    }

    setErrors(
      validateObjectDestructionMenu(
        debouncedEditData,
        objectTypesByKey,
        objectCategoriesByKey,
        objectSubCategoriesByKey,
        tempData.localization,
        tempData.localizationKeys
      )
    );
  }, [
    debouncedEditData,
    objectCategoriesByKey,
    objectSubCategoriesByKey,
    objectTypesByKey,
    tempData.localization,
    tempData.localizationKeys
  ]);

  const validate = useCallback(
    (data: DestructionMenu) =>
      validateObjectDestructionMenu(
        data,
        objectTypesByKey,
        objectCategoriesByKey,
        objectSubCategoriesByKey,
        tempData.localization,
        tempData.localizationKeys
      ),
    [
      objectCategoriesByKey,
      objectSubCategoriesByKey,
      objectTypesByKey,
      tempData.localization,
      tempData.localizationKeys
    ]
  );

  const onSave = useCallback(
    (dataSaved: DestructionMenu) => {
      dispatch(updateObjectDestructionMenu(dataSaved));
      saveLocalizations();
    },
    [dispatch, saveLocalizations]
  );

  const onDataChange = useCallback((data: DestructionMenu | undefined) => setEditData(data), []);

  const getName = useCallback(() => 'Object Destruction Menu', []);

  const getHeader = useCallback(
    () => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box>{getName()}</Box>
        {errors && errors.length > 0 ? (
          <ReportProblemIcon color="error" sx={{ ml: 1 }} titleAccess={errors.join(', ')} />
        ) : null}
      </Box>
    ),
    [errors, getName]
  );

  const getFileData = useCallback(() => uiSections, [uiSections]);

  return (
    <DataViewer
      section="ui"
      file={UI_DATA_FILE}
      fileSection="objectDestructionMenu"
      value={desctructionMenu}
      getFileData={getFileData}
      getName={getName}
      getHeader={getHeader}
      validate={validate}
      onSave={onSave}
      onDataChange={onDataChange}
      dirty={isLocalizationDirty}
    >
      {({ data, handleOnChange, disabled }) => (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 4fr' }}>
          <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <Card header="Size">
              <FormBox>
                <NumberTextField
                  label="Diameter"
                  value={data.diameter}
                  onChange={(value) =>
                    handleOnChange({
                      diameter: value
                    })
                  }
                  disabled={disabled}
                  min={16}
                  wholeNumber
                  required
                />
              </FormBox>
            </Card>
          </Box>
          <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <DestructionMenuButtonCard
              buttons={data.buttons}
              objects={objects}
              objectCategories={objectCategories}
              objectCategoriesByKey={objectCategoriesByKey}
              objectSubCategories={objectSubCategories}
              objectSubCategoriesByKey={objectSubCategoriesByKey}
              disabled={disabled}
              onChange={(buttons) => handleOnChange({ buttons })}
              updateLocalizedValue={updateLocalizedValue}
              getLocalizedValue={getLocalizedValue}
              deleteLocalizedValues={deleteLocalizedValues}
            />
          </Box>
        </Box>
      )}
    </DataViewer>
  );
};

export default ObjectDesctructionMenuView;
