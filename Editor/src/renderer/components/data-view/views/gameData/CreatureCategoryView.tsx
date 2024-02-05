import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Box from '@mui/material/Box';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import Select from 'renderer/components/widgets/form/Select';
import {
  CREATURES_DATA_FILE,
  MOVEMENT_TYPE_JUMP,
  MOVEMENT_TYPE_WALK
} from '../../../../../../../SharedLibrary/src/constants';
import { toMovementType } from '../../../../../../../SharedLibrary/src/util/converters.util';
import { toTitleCaseFromKey } from '../../../../../../../SharedLibrary/src/util/string.util';
import { useAppDispatch, useAppSelector, useDebounce } from '../../../../hooks';
import {
  selectCreatureCategories,
  selectCreatureCategoriesByKey,
  selectCreatureCategory,
  selectCreatureErrors,
  selectCreatureTypes,
  selectCreatureTypesByCategory,
  updateCreatureCategories
} from '../../../../store/slices/creatures';
import { getNewCreatureCategory } from '../../../../util/section.util';
import { validateCreatureCategory } from '../../../../util/validate.util';
import Checkbox from '../../../widgets/form/Checkbox';
import TextField from '../../../widgets/form/TextField';
import Card from '../../../widgets/layout/Card';
import FormBox from '../../../widgets/layout/FormBox';
import DataViewList from '../../DataViewList';
import DataViewer from '../../DataViewer';

import type { CreatureCategory } from '../../../../../../../SharedLibrary/src/interface';
import type { DataViewListItem } from '../../DataViewList';

const CreatureCategoryView = () => {
  const { dataKey = '' } = useParams();

  const dispatch = useAppDispatch();
  const category = useAppSelector(useMemo(() => selectCreatureCategory(dataKey), [dataKey]));
  const creatureCategoriesByKey = useAppSelector(selectCreatureCategoriesByKey);

  const defaultValue = useMemo(() => getNewCreatureCategory(creatureCategoriesByKey), [creatureCategoriesByKey]);

  const [editData, setEditData] = useState<CreatureCategory | undefined>(dataKey === 'new' ? defaultValue : category);
  const [errors, setErrors] = useState<string[] | undefined>(undefined);

  const categories = useAppSelector(selectCreatureCategories);
  const creatures = useAppSelector(selectCreatureTypes);

  const validate = useCallback((data: CreatureCategory) => validateCreatureCategory(data), []);

  const debouncedEditData = useDebounce(editData, 500);
  useEffect(() => {
    if (!debouncedEditData) {
      return;
    }

    setErrors(validate(debouncedEditData));
  }, [validate, debouncedEditData]);

  const creatureErrors = useAppSelector(selectCreatureErrors);
  const filteredCreatures = useAppSelector(useMemo(() => selectCreatureTypesByCategory(dataKey), [dataKey]));
  const creatureListCreatures: DataViewListItem[] = useMemo(
    () =>
      filteredCreatures.map((creature) => ({
        dataKey: creature.key,
        name: creature.name ?? creature.key,
        sprite: {
          width: creature.sprite?.width,
          height: creature.sprite?.height,
          default: 0
        },
        errors: creatureErrors[creature.key]
      })),
    [creatureErrors, filteredCreatures]
  );

  const onSave = useCallback(
    (dataSaved: CreatureCategory[]) => dispatch(updateCreatureCategories(dataSaved)),
    [dispatch]
  );

  const onDataChange = useCallback((data: CreatureCategory | undefined) => setEditData(data), []);

  const getName = useCallback((data: CreatureCategory) => toTitleCaseFromKey(data.key), []);

  const getHeader = useCallback(
    (data: CreatureCategory) => (
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
      categories,
      creatures
    }),
    [categories, creatures]
  );

  return (
    <DataViewer
      dataKey={dataKey}
      valueDataKey={editData?.key}
      section="creature-category"
      file={CREATURES_DATA_FILE}
      fileSection="categories"
      value={category}
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
            <Card header="Dialogue">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <FormBox>
                  <Checkbox
                    label="Has Dialogue"
                    checked={Boolean(data.settings?.hasDialogue)}
                    onChange={(newValue) =>
                      handleOnChange({
                        settings: {
                          ...data.settings,
                          hasDialogue: newValue
                        }
                      })
                    }
                    disabled={disabled}
                  />
                </FormBox>
              </Box>
            </Card>
            <Card header="Shopkeeper">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <FormBox>
                  <Checkbox
                    label="Is Shopkeeper"
                    checked={Boolean(data.settings?.isShopkeeper)}
                    onChange={(newValue) =>
                      handleOnChange({
                        settings: {
                          ...data.settings,
                          isShopkeeper: newValue
                        }
                      })
                    }
                    disabled={disabled}
                  />
                </FormBox>
              </Box>
            </Card>
          </Box>
          <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Card header="Combat">
                  <FormBox>
                    <Checkbox
                      label="Has Health"
                      checked={Boolean(data.settings?.hasHealth)}
                      onChange={(newValue) =>
                        handleOnChange({
                          settings: {
                            ...data.settings,
                            hasHealth: newValue
                          }
                        })
                      }
                      disabled={disabled}
                    />
                  </FormBox>
                </Card>
                <Card header="Movement">
                  <FormBox>
                    <Select
                      label="Movement Type"
                      disabled={disabled}
                      required
                      value={data.settings?.movementType}
                      onChange={(newValue) =>
                        handleOnChange({
                          settings: {
                            ...data.settings,
                            movementType: toMovementType(newValue)
                          }
                        })
                      }
                      options={[
                        {
                          label: 'Walk',
                          value: MOVEMENT_TYPE_WALK
                        },
                        {
                          label: 'Jump',
                          value: MOVEMENT_TYPE_JUMP
                        }
                      ]}
                      error={data.settings?.movementType === undefined}
                    />
                  </FormBox>
                </Card>
              </Box>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Card
                  header="Creatures"
                  footer={
                    <DataViewList
                      section="creature"
                      items={creatureListCreatures}
                      type="card"
                      search={`?creatureCategory=${dataKey}&tab=0`}
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

export default CreatureCategoryView;
