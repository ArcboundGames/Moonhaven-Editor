import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Box from '@mui/material/Box';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CRAFTING_RECIPES_DATA_FILE, ITEM_SPRITE_TARGET_SIZE } from '../../../../../../../SharedLibrary/src/constants';
import { validateCraftingRecipe } from '../../../../../../../SharedLibrary/src/dataValidation';
import { isNotNullish, isNullish } from '../../../../../../../SharedLibrary/src/util/null.util';
import { getObjectSetting } from '../../../../../../../SharedLibrary/src/util/objectType.util';
import { toTitleCaseFromKey } from '../../../../../../../SharedLibrary/src/util/string.util';
import { useAppDispatch, useAppSelector, useDebounce, useQuery } from '../../../../hooks';
import {
  selectCraftingRecipe,
  selectCraftingRecipeCategories,
  selectCraftingRecipeCategoriesByKey,
  selectCraftingRecipes,
  selectCraftingRecipesByKey,
  selectSelectedCraftingRecipeCategory,
  updateCraftingRecipes
} from '../../../../store/slices/craftingRecipes';
import { selectItemTypesByKeyWithName, selectItemTypesSortedWithName } from '../../../../store/slices/items';
import {
  selectObjectCategoriesByKey,
  selectObjectSubCategoriesByKey,
  selectObjectTypesSortedWithName
} from '../../../../store/slices/objects';
import { selectSkillsByKey, selectSkillsSortedWithName } from '../../../../store/slices/skills';
import { getNewCraftingRecipe } from '../../../../util/section.util';
import useLocalization from '../../../hooks/useLocalization.hook';
import ItemMultiSelect from '../../../widgets/form/item/ItemMultiSelect';
import ItemSelect from '../../../widgets/form/item/ItemSelect';
import NumberTextField from '../../../widgets/form/NumberTextField';
import Select from '../../../widgets/form/Select';
import TextField from '../../../widgets/form/TextField';
import Card from '../../../widgets/layout/Card';
import FormBox from '../../../widgets/layout/FormBox';
import SpriteImage from '../../../widgets/SpriteImage';
import DataViewer from '../../DataViewer';
import ItemsListCard from './widgets/ItemsListCard';

import type { CraftingRecipe } from '../../../../../../../SharedLibrary/src/interface';

const CraftingRecipeView = () => {
  const { dataKey = '' } = useParams();

  const { getLocalizationKey, getLocalizedValue } = useLocalization();

  const dispatch = useAppDispatch();
  const query = useQuery();
  const queryCraftingRecipeCategory = query.get('craftingRecipeCategory');
  const selectedCraftingRecipeCategory = useAppSelector(selectSelectedCraftingRecipeCategory);

  const craftingRecipe = useAppSelector(useMemo(() => selectCraftingRecipe(dataKey), [dataKey]));
  const craftingRecipes = useAppSelector(selectCraftingRecipes);
  const craftingRecipesByKey = useAppSelector(selectCraftingRecipesByKey);
  const craftingRecipeCategories = useAppSelector(selectCraftingRecipeCategories);
  const craftingRecipeCategoriesByKey = useAppSelector(selectCraftingRecipeCategoriesByKey);

  const [errors, setErrors] = useState<string[] | undefined>(undefined);

  const items = useAppSelector(selectItemTypesSortedWithName);
  const itemKeys = useMemo(() => items.map((item) => item.key), [items]);
  const itemsByKey = useAppSelector(selectItemTypesByKeyWithName);

  const objects = useAppSelector(selectObjectTypesSortedWithName);
  const objectCategoriesByKey = useAppSelector(selectObjectCategoriesByKey);
  const objectSubCategoriesByKey = useAppSelector(selectObjectSubCategoriesByKey);

  const sortedSkills = useAppSelector(selectSkillsSortedWithName);
  const skillsByKey = useAppSelector(selectSkillsByKey);

  const defaultValue = useMemo(() => {
    const newRecipe = getNewCraftingRecipe(craftingRecipesByKey);

    const craftingRecipeCategory = queryCraftingRecipeCategory ?? selectedCraftingRecipeCategory;
    if (craftingRecipeCategory && craftingRecipeCategory !== 'ALL') {
      newRecipe.categoryKey = craftingRecipeCategory;
    }

    return newRecipe;
  }, [craftingRecipesByKey, queryCraftingRecipeCategory, selectedCraftingRecipeCategory]);

  const [editData, setEditData] = useState<CraftingRecipe | undefined>(
    dataKey === 'new' ? defaultValue : craftingRecipe
  );

  const workstations = useMemo(
    () =>
      objects.filter((type) => {
        const { value: isWorkstation } = getObjectSetting(
          'isWorkstation',
          type,
          objectCategoriesByKey,
          objectSubCategoriesByKey
        );
        return isWorkstation;
      }),
    [objects, objectCategoriesByKey, objectSubCategoriesByKey]
  );

  const workstationKeys = useMemo(() => workstations.map((workstation) => workstation.key), [workstations]);

  const debouncedEditData = useDebounce(editData, 500);

  useEffect(() => {
    if (!debouncedEditData) {
      return;
    }

    setErrors(
      validateCraftingRecipe(debouncedEditData, craftingRecipeCategoriesByKey, skillsByKey, itemsByKey, workstationKeys)
    );
  }, [craftingRecipeCategoriesByKey, debouncedEditData, itemsByKey, skillsByKey, workstationKeys]);

  const validate = useCallback(
    (data: CraftingRecipe) => {
      return validateCraftingRecipe(data, craftingRecipeCategoriesByKey, skillsByKey, itemsByKey, workstationKeys);
    },
    [craftingRecipeCategoriesByKey, itemsByKey, skillsByKey, workstationKeys]
  );

  const onSave = useCallback(
    (dataSaved: CraftingRecipe[]) => {
      dispatch(updateCraftingRecipes(dataSaved));
    },
    [dispatch]
  );

  const onDataChange = useCallback((data: CraftingRecipe | undefined) => setEditData(data), []);

  const getName = useCallback(
    (data: CraftingRecipe) => getLocalizedValue(getLocalizationKey('item', 'name', data.itemTypeKey)),
    [getLocalizationKey, getLocalizedValue]
  );

  const getHeader = useCallback(
    (data: CraftingRecipe) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box>{getName(data)}</Box>
        {errors && errors.length > 0 ? (
          <ReportProblemIcon color="error" sx={{ ml: 1 }} titleAccess={errors.join(', ')} />
        ) : null}
      </Box>
    ),
    [errors, getName]
  );

  const getFileData = useCallback(
    () => ({
      categories: craftingRecipeCategories,
      recipes: craftingRecipes
    }),
    [craftingRecipeCategories, craftingRecipes]
  );

  const skill = useMemo(
    () => (editData?.requiredSkillKey ? skillsByKey[editData.requiredSkillKey] : undefined),
    [editData, skillsByKey]
  );

  return (
    <DataViewer
      dataKey={dataKey}
      valueDataKey={editData?.key}
      section="crafting-recipe"
      file={CRAFTING_RECIPES_DATA_FILE}
      fileSection="recipes"
      value={craftingRecipe}
      defaultValue={defaultValue}
      getFileData={getFileData}
      getName={getName}
      getHeader={getHeader}
      validate={validate}
      onSave={onSave}
      onDataChange={onDataChange}
    >
      {({ data, handleOnChange, disabled }) => (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <Card header="General">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <FormBox>
                  <TextField
                    label="Key"
                    value={data.key}
                    onChange={(value) => handleOnChange({ key: value })}
                    required
                    disabled={disabled}
                  />
                </FormBox>
              </Box>
            </Card>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Card header="Workstation">
                  <FormBox>
                    <Select
                      label="Workstation"
                      disabled={disabled}
                      value={data.workstation}
                      onChange={(value) => handleOnChange({ workstation: value })}
                      options={workstations?.map((entry) => ({
                        label: entry.name,
                        value: entry.key
                      }))}
                    />
                  </FormBox>
                </Card>
              </Box>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Card header="Time">
                  <FormBox>
                    <NumberTextField
                      label="Crafting Time"
                      value={data.craftingTime}
                      onChange={(value) => handleOnChange({ craftingTime: value })}
                      min={1}
                      disabled={disabled}
                      wholeNumber
                    />
                  </FormBox>
                </Card>
              </Box>
            </Box>
            <Card header="Category and Search">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <FormBox>
                  <Select
                    label="Category"
                    required
                    disabled={disabled}
                    value={data.categoryKey}
                    onChange={(value) => handleOnChange({ categoryKey: value })}
                    options={craftingRecipeCategories?.map((entry) => ({
                      label: toTitleCaseFromKey(entry.key),
                      value: entry.key
                    }))}
                  />
                </FormBox>
              </Box>
            </Card>
            <Card header="Skill">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <FormBox>
                  <Select
                    label="Required Skill"
                    value={data.requiredSkillKey}
                    onChange={(value) => {
                      const partial: Partial<CraftingRecipe> = {
                        requiredSkillKey: value
                      };

                      if (isNullish(value) || value !== data.requiredSkillKey) {
                        partial.requiredSkillLevelKey = undefined;
                      }

                      handleOnChange(partial);
                    }}
                    disabled={disabled}
                    options={sortedSkills?.map((entry) => ({
                      label: entry.name,
                      value: entry.key
                    }))}
                  />
                </FormBox>
                {isNotNullish(data.requiredSkillKey) ? (
                  <FormBox>
                    <Select
                      label="Required Skill Level"
                      value={data.requiredSkillLevelKey}
                      onChange={(value) => handleOnChange({ requiredSkillLevelKey: value })}
                      disabled={disabled || !data.requiredSkillKey}
                      required
                      options={
                        skill
                          ? skill.levels.map((entry) => ({
                              label: getLocalizedValue(
                                getLocalizationKey('skill', `skill-level-${entry.key.toLowerCase()}-name`, skill.key)
                              ),
                              value: entry.key
                            }))
                          : []
                      }
                    />
                  </FormBox>
                ) : null}
              </Box>
            </Card>
          </Box>
          <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <Card header="Result">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <Box>
                  <FormBox>
                    <ItemSelect
                      label="Item"
                      required
                      disabled={disabled}
                      value={data.itemTypeKey}
                      valueGetter={(entry) => entry.key}
                      onChange={(value) => handleOnChange({ itemTypeKey: value })}
                    />
                  </FormBox>
                  <FormBox>
                    <NumberTextField
                      label="Amount"
                      value={data.amount}
                      onChange={(value) => handleOnChange({ amount: value })}
                      min={1}
                      disabled={disabled}
                      wholeNumber
                    />
                  </FormBox>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    flexDirection: 'column',
                    height: 'calc(100% - 32px)',
                    justifyContent: 'center'
                  }}
                >
                  <SpriteImage
                    dataKey={data.itemTypeKey}
                    width={16}
                    height={16}
                    sprite={0}
                    type="item"
                    targetSize={ITEM_SPRITE_TARGET_SIZE}
                    errorMessage="Icon not found"
                  />
                </Box>
              </Box>
              <Box sx={{ p: 1 }}>
                <ItemMultiSelect
                  label="Hidden Results"
                  values={data.hiddenResultsTypeKeys}
                  onChange={(values: string[]) =>
                    handleOnChange({
                      hiddenResultsTypeKeys: values.length === 0 ? undefined : values
                    })
                  }
                  disabled={disabled || itemKeys.length === 0}
                />
              </Box>
            </Card>
            <ItemsListCard
              data={data.ingredients}
              label="Ingredient"
              pluralLabel="Ingredients"
              disabled={disabled}
              onChange={(ingredients) => handleOnChange({ ingredients })}
            />
          </Box>
        </Box>
      )}
    </DataViewer>
  );
};

export default CraftingRecipeView;
