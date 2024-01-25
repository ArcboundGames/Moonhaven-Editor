/* eslint-disable no-else-return */
import Box from '@mui/material/Box';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  CONDITIONS,
  INVENTORY_TYPE_LARGE,
  INVENTORY_TYPE_NONE,
  INVENTORY_TYPE_SMALL,
  LOOT_TYPE_DROP,
  LOOT_TYPE_NONE,
  LOOT_TYPE_STAGE_DROP,
  OBJECTS_DATA_FILE,
  PLACEMENT_LAYER_IN_AIR,
  PLACEMENT_LAYER_IN_GROUND,
  PLACEMENT_LAYER_ON_GROUND,
  PLACEMENT_POSITION_CENTER,
  PLACEMENT_POSITION_EDGE,
  STAGES_TYPE_BREAKABLE,
  STAGES_TYPE_GROWABLE,
  STAGES_TYPE_GROWABLE_WITH_HEALTH,
  STAGES_TYPE_NONE
} from '../../../../../../../SharedLibrary/src/constants';
import {
  validateObjectCategoryGeneralTab,
  validatePhysicsTab
} from '../../../../../../../SharedLibrary/src/dataValidation';
import {
  toInventoryType,
  toLootType,
  toPlacementLayer,
  toPlacementPosition,
  toStagesType
} from '../../../../../../../SharedLibrary/src/util/converters.util';
import { getObjectSetting } from '../../../../../../../SharedLibrary/src/util/objectType.util';
import { toTitleCaseFromKey } from '../../../../../../../SharedLibrary/src/util/string.util';
import { useAppDispatch, useAppSelector, useDebounce, useQuery } from '../../../../hooks';
import { selectPath } from '../../../../store/slices/data';
import {
  selectObjectCategories,
  selectObjectCategoriesByKey,
  selectObjectCategory,
  selectObjectErrors,
  selectObjectSubCategories,
  selectObjectSubCategoriesByCategory,
  selectObjectSubCategoriesByKey,
  selectObjectSubCategoryErrors,
  selectObjectTypesByCategory,
  selectObjectTypesByKey,
  selectObjectTypesSortedWithName,
  updateObjectCategories
} from '../../../../store/slices/objects';
import { getNewObjectCategory } from '../../../../util/section.util';
import { getObjectListSpriteIndex, getObjectsSpritesCountsWithSeason } from '../../../../util/sprite.util';
import { validateObjectCategory, validateObjectCategoryPlacementSpawningTab } from '../../../../util/validate.util';
import Checkbox from '../../../widgets/form/Checkbox';
import MultiSelect from '../../../widgets/form/MultiSelect';
import Select from '../../../widgets/form/Select';
import TextField from '../../../widgets/form/TextField';
import Card from '../../../widgets/layout/Card';
import FormBox from '../../../widgets/layout/FormBox';
import TabPanel from '../../../widgets/TabPanel';
import Tabs from '../../../widgets/tabs/Tabs';
import DataViewer from '../../DataViewer';
import DataViewList from '../../DataViewList';
import { useByAdjacentPlacementLayer, useByBelowPlacementLayer } from './hooks/useByPlacementLayer';
import CollidersCard from './widgets/CollidersCard';

import type { ObjectCategory } from '../../../../../../../SharedLibrary/src/interface';
import type { DataViewListItem } from '../../DataViewList';

const ObjectCategoryView = () => {
  const { dataKey = '' } = useParams();

  const dispatch = useAppDispatch();
  const query = useQuery();

  const queryTab = Number(query.get('tab') ?? 0);
  const [tab, setTab] = useState(queryTab);
  useEffect(() => {
    if (!Number.isNaN(queryTab) && queryTab !== tab) {
      setTab(queryTab);
    }
  }, [queryTab, tab]);

  const path = useAppSelector(selectPath);

  const category = useAppSelector(useMemo(() => selectObjectCategory(dataKey), [dataKey]));

  const subCategories = useAppSelector(useMemo(() => selectObjectSubCategoriesByCategory(dataKey), [dataKey]));
  const objects = useAppSelector(useMemo(() => selectObjectTypesByCategory(dataKey), [dataKey]));
  const objectCategoriesByKey = useAppSelector(selectObjectCategoriesByKey);
  const objectSubCategoriesByKey = useAppSelector(selectObjectSubCategoriesByKey);

  const [spriteCounts, setSpriteCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    if (objects.length === 0) {
      setSpriteCounts({});
      return;
    }

    let alive = true;
    async function getCounts() {
      const { allSpriteCounts: newSpriteCounts } = await getObjectsSpritesCountsWithSeason(
        objects,
        path,
        objectCategoriesByKey,
        objectSubCategoriesByKey
      );

      if (alive) {
        setSpriteCounts(newSpriteCounts);
      }
    }

    getCounts();

    return () => {
      alive = false;
    };
  }, [objectCategoriesByKey, objectSubCategoriesByKey, objects, path]);

  const allCategories = useAppSelector(selectObjectCategories);
  const allSubCategories = useAppSelector(selectObjectSubCategories);
  const allObjects = useAppSelector(selectObjectTypesSortedWithName);

  const objectsByKey = useAppSelector(selectObjectTypesByKey);

  const subCategoryErrors = useAppSelector(selectObjectSubCategoryErrors);
  const objectErrors = useAppSelector(selectObjectErrors);

  const objectListItems: DataViewListItem[] = useMemo(
    () =>
      objects.map((object) => {
        const objectSubCategory = object.subCategoryKey ? objectSubCategoriesByKey[object.subCategoryKey] : undefined;
        const { value: stagesType } = getObjectSetting(
          'stagesType',
          object,
          objectCategoriesByKey,
          objectSubCategoriesByKey
        );

        let { key } = object;
        if (!(key in spriteCounts)) {
          key += '-SPRING';
        }

        return {
          dataKey: object.key,
          name: object.name,
          sprite: object.sprite
            ? {
                width: object.sprite.width,
                height: object.sprite.height,
                default: getObjectListSpriteIndex(object, stagesType, objectSubCategory, spriteCounts[key] ?? 0)
              }
            : {
                default: objectSubCategory?.rulesets?.[0]?.defaultSprite
              },
          errors: objectErrors[object.key]
        };
      }),
    [objectCategoriesByKey, objectErrors, objectSubCategoriesByKey, objects, spriteCounts]
  );

  const subCategorylistItems: DataViewListItem[] = useMemo(
    () =>
      subCategories.map((subCategory) => {
        return {
          dataKey: subCategory.key,
          name: toTitleCaseFromKey(subCategory.key),
          errors: subCategoryErrors[subCategory.key]
        };
      }),
    [subCategories, subCategoryErrors]
  );

  const defaultValue = useMemo(() => {
    const defaultCategory = getNewObjectCategory(objectCategoriesByKey);

    defaultCategory.settings = {
      placementPosition: PLACEMENT_POSITION_CENTER,
      placementLayer: PLACEMENT_LAYER_ON_GROUND
    };

    return defaultCategory;
  }, [objectCategoriesByKey]);

  const [editData, setEditData] = useState<ObjectCategory | undefined>(dataKey === 'new' ? defaultValue : category);
  const debouncedEditData = useDebounce(editData, 500);

  const getGeneralTabErrors = useCallback((data: ObjectCategory) => validateObjectCategoryGeneralTab(data), []);

  const getPlacementAndSpawningErrors = useCallback(
    (data: ObjectCategory) =>
      validateObjectCategoryPlacementSpawningTab(data, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey),
    [objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey]
  );

  const getPhysicsTabErrors = useCallback((data: ObjectCategory) => validatePhysicsTab(data), []);

  const { belowCategories, belowSubCategories, belowObjects } = useByBelowPlacementLayer(
    editData?.settings?.placementLayer,
    allCategories,
    allSubCategories,
    allObjects,
    objectCategoriesByKey,
    objectSubCategoriesByKey
  );

  const { adjacentCategories, adjacentSubCategories, adjacentObjects } = useByAdjacentPlacementLayer(
    editData?.settings?.placementLayer,
    allCategories,
    allSubCategories,
    allObjects,
    objectCategoriesByKey,
    objectSubCategoriesByKey
  );

  const validate = useCallback(
    (data: ObjectCategory) =>
      validateObjectCategory(data, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey),
    [objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey]
  );

  const onSave = useCallback((dataSaved: ObjectCategory[]) => dispatch(updateObjectCategories(dataSaved)), [dispatch]);

  const getName = useCallback(
    (data: ObjectCategory) => (data.key?.length > 0 ? toTitleCaseFromKey(data.key) : 'Unknown Category'),
    []
  );

  const onDataChange = useCallback((data: ObjectCategory | undefined) => setEditData(data), []);

  const getFileData = useCallback(
    () => ({
      categories: allCategories,
      subCategories: allSubCategories,
      objects: allObjects
    }),
    [allCategories, allObjects, allSubCategories]
  );

  return (
    <DataViewer
      dataKey={dataKey}
      valueDataKey={editData?.key}
      section="object-category"
      file={OBJECTS_DATA_FILE}
      fileSection="categories"
      value={category}
      defaultValue={defaultValue}
      getFileData={getFileData}
      getName={getName}
      validate={validate}
      onSave={onSave}
      onDataChange={onDataChange}
    >
      {({ data, handleOnChange, disabled }) => (
        <>
          <Tabs
            data={debouncedEditData}
            dataKey={dataKey}
            section="object-category"
            ariaLabel="object category tabs"
            onChange={(newTab) => setTab(newTab)}
          >
            {{
              label: 'General',
              validate: getGeneralTabErrors
            }}
            {{
              label: 'Placement / Spawning',
              validate: getPlacementAndSpawningErrors
            }}
            {{
              label: 'Physics',
              validate: getPhysicsTabErrors
            }}
          </Tabs>
          <TabPanel value={tab} index={0}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: subCategorylistItems.length
                  ? 'repeat(2, minmax(0, 1fr))'
                  : 'repeat(3, minmax(0, 1fr))'
              }}
            >
              <Box
                display="flex"
                flexDirection="column"
                sx={
                  !subCategorylistItems.length
                    ? {
                        gridColumn: '1 / span 2'
                      }
                    : {}
                }
              >
                <Card header="General">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <FormBox>
                      <TextField
                        label="Key"
                        value={data.key}
                        onChange={(key) => handleOnChange({ key })}
                        required
                        disabled={disabled}
                      />
                    </FormBox>
                  </Box>
                </Card>
                <Card header="Settings">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <Box display="flex" flexDirection="column" sx={{ pl: 3 }}>
                      <FormBox>
                        <Checkbox
                          label="Has Health"
                          checked={data.settings?.hasHealth}
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
                      <FormBox>
                        <Checkbox
                          label="Requires Water"
                          checked={data.settings?.requiresWater}
                          onChange={(newValue) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                requiresWater: newValue
                              }
                            })
                          }
                          disabled={disabled}
                        />
                      </FormBox>
                      <FormBox>
                        <Checkbox
                          label="Is Workstation"
                          checked={data.settings?.isWorkstation}
                          onChange={(newValue) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                isWorkstation: newValue
                              }
                            })
                          }
                          disabled={disabled}
                        />
                      </FormBox>
                      <FormBox>
                        <Checkbox
                          label="Destroy on Harvest"
                          checked={data.settings?.destroyOnHarvest}
                          onChange={(newValue) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                destroyOnHarvest: newValue
                              }
                            })
                          }
                          disabled={disabled}
                        />
                      </FormBox>
                      <FormBox>
                        <Checkbox
                          label="Can Harvest with Hand"
                          checked={data.settings?.canHarvestWithHand}
                          onChange={(newValue) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                canHarvestWithHand: newValue
                              }
                            })
                          }
                          disabled={disabled}
                        />
                      </FormBox>
                      <FormBox>
                        <Checkbox
                          label="Breakable"
                          checked={data.settings?.breakable}
                          onChange={(newValue) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                breakable: newValue
                              }
                            })
                          }
                          disabled={disabled}
                        />
                      </FormBox>
                      <FormBox>
                        <Checkbox
                          label="Player Destructible"
                          checked={data.settings?.isPlayerDestructible}
                          onChange={(newValue) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                isPlayerDestructible: newValue
                              }
                            })
                          }
                          disabled={disabled}
                        />
                      </FormBox>
                      <FormBox>
                        <Checkbox
                          label="Can Open"
                          checked={data.settings?.canOpen}
                          onChange={(newValue) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                canOpen: newValue
                              }
                            })
                          }
                          disabled={disabled}
                        />
                      </FormBox>
                      <FormBox>
                        <Checkbox
                          label="Can Activate"
                          checked={data.settings?.canActivate}
                          onChange={(newValue) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                canActivate: newValue
                              }
                            })
                          }
                          disabled={disabled}
                        />
                      </FormBox>
                      <FormBox>
                        <Checkbox
                          label="Changes Sprites with Season"
                          checked={data.settings?.changesSpritesWithSeason}
                          onChange={(newValue) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                changesSpritesWithSeason: newValue
                              }
                            })
                          }
                          disabled={disabled}
                        />
                      </FormBox>
                      <FormBox>
                        <Checkbox
                          label="Has Light"
                          checked={data.settings?.hasLight}
                          onChange={(newValue) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                hasLight: newValue
                              }
                            })
                          }
                          disabled={disabled}
                        />
                      </FormBox>
                    </Box>
                    <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                      <FormBox>
                        <Select
                          label="Loot Type"
                          disabled={disabled}
                          required
                          value={data.settings?.lootType}
                          onChange={(newValue) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                lootType: toLootType(newValue)
                              }
                            })
                          }
                          options={[
                            {
                              label: 'None',
                              value: LOOT_TYPE_NONE,
                              emphasize: true
                            },
                            {
                              label: 'Drops',
                              value: LOOT_TYPE_DROP
                            },
                            {
                              label: 'Drops from stages',
                              value: LOOT_TYPE_STAGE_DROP
                            }
                          ]}
                        />
                      </FormBox>
                      <FormBox>
                        <Select
                          label="Stages Type"
                          disabled={disabled}
                          required
                          value={data.settings?.stagesType}
                          onChange={(newValue) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                stagesType: toStagesType(newValue)
                              }
                            })
                          }
                          options={[
                            {
                              label: 'None',
                              value: STAGES_TYPE_NONE,
                              emphasize: true
                            },
                            {
                              label: 'Growable',
                              value: STAGES_TYPE_GROWABLE
                            },
                            {
                              label: 'Growable with health',
                              value: STAGES_TYPE_GROWABLE_WITH_HEALTH
                            },
                            {
                              label: 'Breakable',
                              value: STAGES_TYPE_BREAKABLE
                            }
                          ]}
                          error={
                            (data.settings?.stagesType === undefined ||
                              data.settings?.stagesType === STAGES_TYPE_NONE) &&
                            data.settings?.lootType === LOOT_TYPE_STAGE_DROP
                          }
                        />
                      </FormBox>
                      <FormBox>
                        <Select
                          label="Inventory Type"
                          disabled={disabled}
                          required
                          value={data.settings?.inventoryType}
                          onChange={(newValue) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                inventoryType: toInventoryType(newValue)
                              }
                            })
                          }
                          options={[
                            {
                              label: 'None',
                              value: INVENTORY_TYPE_NONE,
                              emphasize: true
                            },
                            {
                              label: 'Small',
                              value: INVENTORY_TYPE_SMALL
                            },
                            {
                              label: 'Large',
                              value: INVENTORY_TYPE_LARGE
                            }
                          ]}
                          error={data.settings?.isWorkstation && data.settings?.inventoryType !== INVENTORY_TYPE_SMALL}
                        />
                      </FormBox>
                    </Box>
                  </Box>
                </Card>
              </Box>
              <Box key="lists" display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: subCategorylistItems.length ? 'repeat(2, minmax(0, 1fr))' : '1fr	'
                  }}
                >
                  <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                    {subCategorylistItems.length ? (
                      <Card
                        key="subCategoryItems"
                        header="Sub Categories"
                        footer={
                          <DataViewList
                            section="object-sub-category"
                            items={subCategorylistItems}
                            type="card"
                            search={`?objectCategory=${dataKey}&tab=0`}
                          />
                        }
                      />
                    ) : null}
                  </Box>
                  <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                    {dataKey !== 'new' ? (
                      <Card
                        key="objectItems"
                        header="Objects"
                        footer={
                          <DataViewList
                            section="object"
                            items={objectListItems}
                            type="card"
                            search={`?objectCategory=${dataKey}&tab=0`}
                          />
                        }
                      />
                    ) : null}
                  </Box>
                </Box>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Card header="Position">
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                    <FormBox>
                      <Select
                        label="Placement Position"
                        disabled={disabled}
                        required
                        value={data.settings?.placementPosition}
                        onChange={(newValue) =>
                          handleOnChange({
                            settings: {
                              ...data.settings,
                              placementPosition: toPlacementPosition(newValue)
                            }
                          })
                        }
                        options={[
                          {
                            label: 'Center',
                            value: PLACEMENT_POSITION_CENTER
                          },
                          {
                            label: 'Edge',
                            value: PLACEMENT_POSITION_EDGE
                          }
                        ]}
                        error={data.settings?.isWorkstation && data.settings?.inventoryType !== INVENTORY_TYPE_SMALL}
                      />
                    </FormBox>
                  </Box>
                </Card>
                <Card header="Layer">
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                    <FormBox>
                      <Select
                        label="Placement Layer"
                        disabled={disabled}
                        required
                        value={data.settings?.placementLayer}
                        onChange={(newValue) =>
                          handleOnChange({
                            settings: {
                              ...data.settings,
                              placementLayer: toPlacementLayer(newValue)
                            }
                          })
                        }
                        options={[
                          {
                            label: 'In Ground',
                            value: PLACEMENT_LAYER_IN_GROUND
                          },
                          {
                            label: 'On Ground',
                            value: PLACEMENT_LAYER_ON_GROUND
                          },
                          {
                            label: 'In Air',
                            value: PLACEMENT_LAYER_IN_AIR
                          }
                        ]}
                        error={data.settings?.isWorkstation && data.settings?.inventoryType !== INVENTORY_TYPE_SMALL}
                      />
                    </FormBox>
                    {data.settings?.placementLayer === PLACEMENT_LAYER_IN_GROUND ? (
                      <FormBox sx={{ m: 0 }}>
                        <Checkbox
                          label="Blocks On Ground Placement"
                          checked={data.settings?.blocksPlacement}
                          onChange={(newValue) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                blocksPlacement: newValue
                              }
                            })
                          }
                          disabled={disabled}
                        />
                      </FormBox>
                    ) : null}
                  </Box>
                </Card>
                <Card header="Spawning Conditions">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    {CONDITIONS.map((condition) => (
                      <FormBox key={`condition-${condition}`}>
                        <Checkbox
                          label={toTitleCaseFromKey(condition)}
                          checked={Boolean(data.settings?.spawningConditions?.includes(condition))}
                          onChange={(newValue) => {
                            const spawningConditions = [...(data.settings?.spawningConditions || [])];
                            if (newValue) {
                              spawningConditions.push(condition);
                            } else {
                              const index = spawningConditions.indexOf(condition);
                              if (index > -1) {
                                spawningConditions.splice(index, 1);
                              }
                            }
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                spawningConditions
                              }
                            });
                          }}
                          disabled={disabled}
                        />
                      </FormBox>
                    ))}
                  </Box>
                </Card>
              </Box>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Card header="Requires Below">
                  <Box>
                    <FormBox key="requires-below-object-category" sx={{ height: 'auto', mt: 2 }}>
                      <MultiSelect
                        label="Object Category"
                        values={data.settings?.requiredBelowObjectCategoryKeys}
                        onChange={(values: string[]) =>
                          handleOnChange({
                            settings: {
                              ...data.settings,
                              requiredBelowObjectCategoryKeys: values.length === 0 ? undefined : values
                            }
                          })
                        }
                        options={belowCategories.map((option) => ({
                          label: toTitleCaseFromKey(option.key),
                          value: option.key
                        }))}
                        disabled={disabled || belowCategories.length === 0}
                      />
                    </FormBox>
                    <FormBox key="requires-below-object-sub-category" sx={{ height: 'auto', mt: 1.5 }}>
                      <MultiSelect
                        label="Object Sub Category"
                        values={data.settings?.requiredBelowObjectSubCategoryKeys}
                        onChange={(values: string[]) =>
                          handleOnChange({
                            settings: {
                              ...data.settings,
                              requiredBelowObjectSubCategoryKeys: values.length === 0 ? undefined : values
                            }
                          })
                        }
                        options={belowSubCategories.map((option) => ({
                          label: toTitleCaseFromKey(option.key),
                          value: option.key
                        }))}
                        disabled={disabled || belowSubCategories.length === 0}
                      />
                    </FormBox>
                    <FormBox key="requires-below-object" sx={{ height: 'auto', mb: 0, pb: 0, mt: 1.5 }}>
                      <MultiSelect
                        label="Object"
                        values={data.settings?.requiredBelowObjectKeys}
                        onChange={(values: string[]) =>
                          handleOnChange({
                            settings: {
                              ...data.settings,
                              requiredBelowObjectKeys: values.length === 0 ? undefined : values
                            }
                          })
                        }
                        options={belowObjects.map((option) => ({
                          label: option.name,
                          value: option.key
                        }))}
                        disabled={disabled || belowObjects.length === 0}
                      />
                    </FormBox>
                  </Box>
                </Card>
              </Box>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Card header="Requires Adjacent">
                  <Box>
                    <FormBox key="requires-adjacent-object-category" sx={{ height: 'auto', mt: 2 }}>
                      <MultiSelect
                        label="Object Category"
                        values={data.settings?.requiredAdjacentObjectCategoryKeys}
                        onChange={(values: string[]) =>
                          handleOnChange({
                            settings: {
                              ...data.settings,
                              requiredAdjacentObjectCategoryKeys: values.length === 0 ? undefined : values
                            }
                          })
                        }
                        options={adjacentCategories.map((option) => ({
                          label: toTitleCaseFromKey(option.key),
                          value: option.key
                        }))}
                        disabled={disabled || adjacentCategories.length === 0}
                      />
                    </FormBox>
                    <FormBox key="requires-adjacent-object-sub-category" sx={{ height: 'auto', mt: 1.5 }}>
                      <MultiSelect
                        label="Object Sub Category"
                        values={data.settings?.requiredAdjacentObjectSubCategoryKeys}
                        onChange={(values: string[]) =>
                          handleOnChange({
                            settings: {
                              ...data.settings,
                              requiredAdjacentObjectSubCategoryKeys: values.length === 0 ? undefined : values
                            }
                          })
                        }
                        options={adjacentSubCategories.map((option) => ({
                          label: toTitleCaseFromKey(option.key),
                          value: option.key
                        }))}
                        disabled={disabled || adjacentSubCategories.length === 0}
                      />
                    </FormBox>
                    <FormBox key="requires-adjacent-object" sx={{ height: 'auto', mb: 0, pb: 0, mt: 1.5 }}>
                      <MultiSelect
                        label="Object"
                        values={data.settings?.requiredAdjacentObjectKeys}
                        onChange={(values: string[]) =>
                          handleOnChange({
                            settings: {
                              ...data.settings,
                              requiredAdjacentObjectKeys: values.length === 0 ? undefined : values
                            }
                          })
                        }
                        options={adjacentObjects.map((option) => ({
                          label: option.name,
                          value: option.key
                        }))}
                        disabled={disabled || adjacentObjects.length === 0}
                      />
                    </FormBox>
                  </Box>
                </Card>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <CollidersCard
                  collidersType="colliders"
                  colliders={data.colliders}
                  disabled={disabled}
                  onChange={(colliders) => handleOnChange({ colliders })}
                />
              </Box>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <CollidersCard
                  collidersType="sprite-colliders"
                  colliders={data.sprite?.sprites}
                  disabled={disabled}
                  onChange={(sprites) =>
                    handleOnChange({
                      sprite: {
                        ...data.sprite,
                        sprites
                      }
                    })
                  }
                />
              </Box>
            </Box>
          </TabPanel>
        </>
      )}
    </DataViewer>
  );
};

export default ObjectCategoryView;
