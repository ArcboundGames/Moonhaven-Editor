import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Box from '@mui/material/Box';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CRAFTING_RECIPES_DATA_FILE } from '../../../../../../../SharedLibrary/src/constants';
import { validateCraftingRecipeCategory } from '../../../../../../../SharedLibrary/src/dataValidation';
import { toTitleCaseFromKey } from '../../../../../../../SharedLibrary/src/util/string.util';
import { useAppDispatch, useAppSelector, useDebounce } from '../../../../hooks';
import {
  selectCraftingRecipeCategories,
  selectCraftingRecipeCategoriesByKey,
  selectCraftingRecipeCategory,
  selectCraftingRecipeErrors,
  selectCraftingRecipes,
  selectCraftingRecipesByCategory,
  updateCraftingRecipeCategories
} from '../../../../store/slices/craftingRecipes';
import { selectItemTypesByKeyWithName } from '../../../../store/slices/items';
import { getNewCraftingRecipeCategory } from '../../../../util/section.util';
import TextField from '../../../widgets/form/TextField';
import Card from '../../../widgets/layout/Card';
import FormBox from '../../../widgets/layout/FormBox';
import DataViewer from '../../DataViewer';
import DataViewList from '../../DataViewList';

import type { CraftingRecipeCategory } from '../../../../../../../SharedLibrary/src/interface';
import type { DataViewListItem } from '../../DataViewList';

const CraftingRecipeCategoryView = () => {
  const { dataKey = '' } = useParams();

  const dispatch = useAppDispatch();

  const craftingRecipeCategory = useAppSelector(useMemo(() => selectCraftingRecipeCategory(dataKey), [dataKey]));
  const craftingRecipes = useAppSelector(selectCraftingRecipes);
  const craftingRecipeCategories = useAppSelector(selectCraftingRecipeCategories);
  const craftingRecipeCategoriesByKey = useAppSelector(selectCraftingRecipeCategoriesByKey);

  const itemsByKey = useAppSelector(selectItemTypesByKeyWithName);

  const defaultValue = useMemo(
    () => getNewCraftingRecipeCategory(craftingRecipeCategoriesByKey),
    [craftingRecipeCategoriesByKey]
  );

  const [editData, setEditData] = useState<CraftingRecipeCategory | undefined>(
    dataKey === 'new' ? defaultValue : craftingRecipeCategory
  );
  const [errors, setErrors] = useState<string[] | undefined>(undefined);

  const debouncedEditData = useDebounce(editData, 500);
  useEffect(() => {
    if (!debouncedEditData) {
      return;
    }

    setErrors(validateCraftingRecipeCategory(debouncedEditData));
  }, [debouncedEditData]);

  const craftingRecipeErrors = useAppSelector(selectCraftingRecipeErrors);
  const filteredCraftingRecipes = useAppSelector(useMemo(() => selectCraftingRecipesByCategory(dataKey), [dataKey]));
  const listItems: DataViewListItem[] = useMemo(
    () =>
      filteredCraftingRecipes.map((recipe) => {
        let name = 'Unknown Crafting Recipe';
        if (recipe.itemTypeKey) {
          name = itemsByKey[recipe.itemTypeKey]?.name ?? recipe.itemTypeKey;
        }

        return {
          dataKey: recipe.key,
          name,
          errors: craftingRecipeErrors[recipe.key],
          sprite: {
            key: recipe.itemTypeKey,
            section: 'item',
            width: 16,
            height: 16,
            default: 0
          }
        };
      }),
    [craftingRecipeErrors, filteredCraftingRecipes, itemsByKey]
  );

  const validate = useCallback((data: CraftingRecipeCategory) => validateCraftingRecipeCategory(data), []);

  const onSave = useCallback(
    (dataSaved: CraftingRecipeCategory[]) => dispatch(updateCraftingRecipeCategories(dataSaved)),
    [dispatch]
  );

  const onDataChange = useCallback((data: CraftingRecipeCategory | undefined) => setEditData(data), []);

  const getName = useCallback((data: CraftingRecipeCategory) => toTitleCaseFromKey(data.key), []);

  const getHeader = useCallback(
    (data: CraftingRecipeCategory) => (
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

  return (
    <DataViewer
      dataKey={dataKey}
      valueDataKey={editData?.key}
      section="crafting-recipe-category"
      file={CRAFTING_RECIPES_DATA_FILE}
      fileSection="categories"
      value={craftingRecipeCategory}
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
          </Box>
          <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <Box display="flex" flexDirection="column" />
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Card
                  header="Crafting Recipes"
                  footer={
                    <DataViewList
                      section="crafting-recipe"
                      items={listItems}
                      type="card"
                      search={`?craftingRecipeCategory=${dataKey}&tab=0`}
                    />
                  }
                />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </DataViewer>
  );
};

export default CraftingRecipeCategoryView;
