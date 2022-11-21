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
  validateObjectSubCategoryGeneralTab,
  validateObjectSubCategorySpriteRulesTab,
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
  selectObjectSubCategories,
  selectObjectSubCategoriesByKey,
  selectObjectSubCategory,
  selectObjectSubCategoryErrors,
  selectObjectTypesByCategoryAndSubCategory,
  selectObjectTypesByKey,
  selectObjectTypesSortedWithName,
  updateObjectSubCategories
} from '../../../../store/slices/objects';
import { getNewObjectSubCategory } from '../../../../util/section.util';
import { getObjectListSpriteIndex, getObjectsSpritesCountsWithSeason } from '../../../../util/sprite.util';
import {
  validateObjectSubCategory,
  validateObjectSubCategoryPlacementSpawningTab
} from '../../../../util/validate.util';
import Checkbox from '../../../widgets/form/Checkbox';
import MultiSelect from '../../../widgets/form/MultiSelect';
import NumberTextField from '../../../widgets/form/NumberTextField';
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
import { OverriddenObjectPropertyCard as OverriddenObjectProperty } from './widgets/OverriddenPropertyCard';

import type {
  LocalizedObjectType,
  ObjectSubCategory,
  SpawningCondition
} from '../../../../../../../SharedLibrary/src/interface';
import type { DataViewListItem } from '../../DataViewList';

const ObjectSubCategoryView = () => {
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

  const subCategory = useAppSelector(useMemo(() => selectObjectSubCategory(dataKey), [dataKey]));

  const path = useAppSelector(selectPath);
  const categories = useAppSelector(selectObjectCategories);
  const subCategories = useAppSelector(selectObjectSubCategories);
  const objects = useAppSelector(selectObjectTypesSortedWithName);
  const objectsByKey = useAppSelector(selectObjectTypesByKey);

  const objectCategoriesByKey = useAppSelector(selectObjectCategoriesByKey);
  const objectSubCategoriesByKey = useAppSelector(selectObjectSubCategoriesByKey);

  const defaultValue = useMemo(() => getNewObjectSubCategory(objectSubCategoriesByKey), [objectSubCategoriesByKey]);

  const [editData, setEditData] = useState<ObjectSubCategory | undefined>(
    dataKey === 'new' ? defaultValue : subCategory
  );

  const errors = useAppSelector(selectObjectSubCategoryErrors);
  const filteredObjects = useAppSelector(
    useMemo(
      () => selectObjectTypesByCategoryAndSubCategory(editData?.categoryKey, editData?.key),
      [editData?.categoryKey, editData?.key]
    )
  );

  const [spriteCounts, setSpriteCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    let alive = true;
    async function getCounts() {
      const { allSpriteCounts: newSpriteCounts } = await getObjectsSpritesCountsWithSeason(
        filteredObjects,
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
  }, [filteredObjects, objectCategoriesByKey, objectSubCategoriesByKey, path]);

  const objectListItems: DataViewListItem[] = useMemo(
    () =>
      filteredObjects.map((object: LocalizedObjectType) => {
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
          errors: errors[object.key]
        };
      }),
    [errors, filteredObjects, objectCategoriesByKey, objectSubCategoriesByKey, spriteCounts]
  );

  const debouncedEditData = useDebounce(editData, 500);

  const getGeneralTabErrors = useCallback(
    (data: ObjectSubCategory) => validateObjectSubCategoryGeneralTab(data, objectCategoriesByKey),
    [objectCategoriesByKey]
  );

  const getPlacementAndSpawningErrors = useCallback(
    (data: ObjectSubCategory) =>
      validateObjectSubCategoryPlacementSpawningTab(
        data,
        objectCategoriesByKey,
        objectSubCategoriesByKey,
        objectsByKey
      ),
    [objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey]
  );

  const getSpriteRulesTabErrors = useCallback(
    (data: ObjectSubCategory) => validateObjectSubCategorySpriteRulesTab(data, objectCategoriesByKey),
    [objectCategoriesByKey]
  );

  const getPhysicsTabErrors = useCallback((data: ObjectSubCategory) => validatePhysicsTab(data), []);

  const placementLayer = useMemo(
    () => getObjectSetting('placementLayer', subCategory, objectCategoriesByKey, {}).value,
    [objectCategoriesByKey, subCategory]
  );

  const { belowCategories, belowSubCategories, belowObjects } = useByBelowPlacementLayer(
    placementLayer,
    categories,
    subCategories,
    objects,
    objectCategoriesByKey,
    objectSubCategoriesByKey
  );

  const { adjacentCategories, adjacentSubCategories, adjacentObjects } = useByAdjacentPlacementLayer(
    editData?.settings?.placementLayer,
    categories,
    subCategories,
    objects,
    objectCategoriesByKey,
    objectSubCategoriesByKey
  );

  const validate = useCallback(
    (data: ObjectSubCategory) =>
      validateObjectSubCategory(data, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey),
    [objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey]
  );

  const onSave = useCallback(
    (dataSaved: ObjectSubCategory[]) => dispatch(updateObjectSubCategories(dataSaved)),
    [dispatch]
  );

  const getName = useCallback(
    (data: ObjectSubCategory) => (data.key?.length > 0 ? toTitleCaseFromKey(data.key) : 'Unknown Sub Category'),
    []
  );

  const onDataChange = useCallback((data: ObjectSubCategory | undefined) => setEditData(data), []);

  const getFileData = useCallback(
    () => ({
      categories,
      subCategories,
      objects
    }),
    [categories, objects, subCategories]
  );

  return (
    <DataViewer
      dataKey={dataKey}
      valueDataKey={editData?.key}
      section="object-sub-category"
      file={OBJECTS_DATA_FILE}
      fileSection="subCategories"
      value={subCategory}
      defaultValue={defaultValue}
      getFileData={getFileData}
      getName={getName}
      onDataChange={onDataChange}
      validate={validate}
      onSave={onSave}
    >
      {({ data, handleOnChange, disabled }) => (
        <>
          <Tabs
            data={debouncedEditData}
            dataKey={dataKey}
            section="object-sub-category"
            ariaLabel="object sub category tabs"
            onChange={(newTab) => setTab(newTab)}
          >
            {{
              label: 'General',
              validate: getGeneralTabErrors
            }}
            {{
              label: 'Placement & Spawning',
              validate: getPlacementAndSpawningErrors
            }}
            {{
              label: 'Sprite Rules',
              validate: getSpriteRulesTabErrors
            }}
            {{
              label: 'Physics',
              validate: getPhysicsTabErrors
            }}
          </Tabs>
          <TabPanel value={tab} index={0}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 1fr' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                <Card header="General">
                  <FormBox>
                    <TextField
                      label="Key"
                      value={data.key}
                      onChange={(key) => handleOnChange({ key })}
                      required
                      disabled={disabled}
                    />
                  </FormBox>
                </Card>
                <Card header="Category">
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                    <FormBox>
                      <Select
                        label="Category"
                        required
                        disabled={disabled}
                        value={data.categoryKey}
                        onChange={(newValue) =>
                          handleOnChange({
                            categoryKey: newValue
                          })
                        }
                        options={categories.map((entry) => ({
                          value: entry.key,
                          label: toTitleCaseFromKey(entry.key)
                        }))}
                      />
                    </FormBox>
                  </Box>
                </Card>
                <OverriddenObjectProperty
                  title="Loot"
                  type={data}
                  setting="lootType"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        lootType: overridden ? LOOT_TYPE_DROP : undefined
                      }
                    })
                  }
                  disabled={disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <Select
                        label="Loot Type"
                        disabled={disabled || controlled}
                        value={value}
                        onChange={
                          controlled
                            ? undefined
                            : (newValue) =>
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
                        helperText={helperText}
                      />
                    )
                  }}
                </OverriddenObjectProperty>
                <OverriddenObjectProperty
                  title="Water"
                  type={data}
                  setting="requiresWater"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        requiresWater: overridden ? false : undefined
                      }
                    })
                  }
                  disabled={disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <Checkbox
                        label="Requires Water"
                        checked={value}
                        onChange={
                          controlled
                            ? undefined
                            : (newValue) =>
                                handleOnChange({
                                  settings: {
                                    ...data.settings,
                                    requiresWater: newValue
                                  }
                                })
                        }
                        disabled={disabled || controlled}
                        helperText={helperText}
                      />
                    )
                  }}
                </OverriddenObjectProperty>
                <OverriddenObjectProperty
                  title="Health"
                  type={data}
                  setting="hasHealth"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        hasHealth: overridden ? false : undefined
                      }
                    })
                  }
                  disabled={disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <Checkbox
                        label="Has Health"
                        checked={value}
                        onChange={
                          controlled
                            ? undefined
                            : (newValue) =>
                                handleOnChange({
                                  settings: {
                                    ...data.settings,
                                    hasHealth: newValue
                                  }
                                })
                        }
                        disabled={disabled || controlled}
                        helperText={helperText}
                      />
                    )
                  }}
                </OverriddenObjectProperty>
                <OverriddenObjectProperty
                  title="Stages"
                  type={data}
                  setting="stagesType"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        stagesType: overridden ? STAGES_TYPE_GROWABLE : undefined
                      }
                    })
                  }
                  disabled={disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <Select
                        label="Stages Type"
                        disabled={disabled || controlled}
                        required
                        value={value}
                        onChange={
                          controlled
                            ? undefined
                            : (newValue) =>
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
                        helperText={helperText}
                        error={
                          (value === undefined || value === STAGES_TYPE_NONE) &&
                          getObjectSetting('lootType', data, objectCategoriesByKey, undefined).value ===
                            LOOT_TYPE_STAGE_DROP
                        }
                      />
                    )
                  }}
                </OverriddenObjectProperty>
                <OverriddenObjectProperty
                  title="Workstation"
                  type={data}
                  setting="isWorkstation"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        isWorkstation: overridden ? false : undefined
                      }
                    })
                  }
                  disabled={disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <Checkbox
                        label="Is Workstation"
                        checked={value}
                        onChange={
                          controlled
                            ? undefined
                            : (newValue) =>
                                handleOnChange({
                                  settings: {
                                    ...data.settings,
                                    isWorkstation: newValue
                                  }
                                })
                        }
                        disabled={disabled || controlled}
                        helperText={helperText}
                      />
                    )
                  }}
                </OverriddenObjectProperty>
                <OverriddenObjectProperty
                  title="Destroy"
                  type={data}
                  setting="destroyOnHarvest"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        destroyOnHarvest: overridden ? false : undefined
                      }
                    })
                  }
                  disabled={disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <Checkbox
                        label="Destroy on Harvest"
                        checked={value}
                        onChange={
                          controlled
                            ? undefined
                            : (newValue) =>
                                handleOnChange({
                                  settings: {
                                    ...data.settings,
                                    destroyOnHarvest: newValue
                                  }
                                })
                        }
                        disabled={disabled || controlled}
                        helperText={helperText}
                      />
                    )
                  }}
                </OverriddenObjectProperty>
                <OverriddenObjectProperty
                  title="Harvest"
                  type={data}
                  setting="canHarvestWithHand"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        canHarvestWithHand: overridden ? false : undefined
                      }
                    })
                  }
                  disabled={disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <Checkbox
                        label="Destroy on Harvest"
                        checked={value}
                        onChange={
                          controlled
                            ? undefined
                            : (newValue) =>
                                handleOnChange({
                                  settings: {
                                    ...data.settings,
                                    canHarvestWithHand: newValue
                                  }
                                })
                        }
                        disabled={disabled || controlled}
                        helperText={helperText}
                      />
                    )
                  }}
                </OverriddenObjectProperty>
                <OverriddenObjectProperty
                  title="Breakable"
                  type={data}
                  setting="breakable"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        breakable: overridden ? false : undefined
                      }
                    })
                  }
                  disabled={disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <Checkbox
                        label="Breakable"
                        checked={value}
                        onChange={
                          controlled
                            ? undefined
                            : (newValue) =>
                                handleOnChange({
                                  settings: {
                                    ...data.settings,
                                    breakable: newValue
                                  }
                                })
                        }
                        disabled={disabled || controlled}
                        helperText={helperText}
                      />
                    )
                  }}
                </OverriddenObjectProperty>
                <OverriddenObjectProperty
                  title="Inventory"
                  type={data}
                  setting="inventoryType"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        inventoryType: overridden ? INVENTORY_TYPE_NONE : undefined
                      }
                    })
                  }
                  disabled={disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <Select
                        label="Inventory Type"
                        disabled={disabled || controlled}
                        required
                        value={value}
                        onChange={
                          controlled
                            ? undefined
                            : (newValue) =>
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
                        helperText={helperText}
                        error={
                          data.settings?.isWorkstation &&
                          getObjectSetting('inventoryType', data, objectCategoriesByKey, undefined).value !==
                            INVENTORY_TYPE_SMALL
                        }
                      />
                    )
                  }}
                </OverriddenObjectProperty>
                <OverriddenObjectProperty
                  title="Open / Close"
                  type={data}
                  setting="canOpen"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        canOpen: overridden ? false : undefined
                      }
                    })
                  }
                  disabled={disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <Checkbox
                        label="Can Open"
                        checked={value}
                        onChange={
                          controlled
                            ? undefined
                            : (newValue) =>
                                handleOnChange({
                                  settings: {
                                    ...data.settings,
                                    canOpen: newValue
                                  }
                                })
                        }
                        disabled={disabled || controlled}
                        helperText={helperText}
                      />
                    )
                  }}
                </OverriddenObjectProperty>
                <OverriddenObjectProperty
                  title="Seasons"
                  type={data}
                  setting="changesSpritesWithSeason"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        changesSpritesWithSeason: overridden ? false : undefined
                      }
                    })
                  }
                  disabled={disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <Checkbox
                        label="Changes Sprites with Season"
                        checked={value}
                        onChange={
                          controlled
                            ? undefined
                            : (newValue) =>
                                handleOnChange({
                                  settings: {
                                    ...data.settings,
                                    changesSpritesWithSeason: newValue
                                  }
                                })
                        }
                        disabled={disabled || controlled}
                        helperText={helperText}
                      />
                    )
                  }}
                </OverriddenObjectProperty>
                <OverriddenObjectProperty
                  title="Light Level"
                  type={data}
                  setting="lightLevel"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        lightLevel: overridden ? 0 : undefined
                      }
                    })
                  }
                  disabled={disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <NumberTextField
                        label="Light Level"
                        value={value}
                        onChange={
                          controlled
                            ? undefined
                            : (newValue) => {
                                console.log(newValue);
                                handleOnChange({
                                  settings: {
                                    ...data.settings,
                                    lightLevel: newValue
                                  }
                                });
                              }
                        }
                        disabled={disabled || controlled}
                        helperText={helperText}
                      />
                    )
                  }}
                </OverriddenObjectProperty>
              </Box>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Card
                  header="Objects"
                  footer={
                    <DataViewList
                      section="object"
                      items={objectListItems}
                      type="card"
                      search={`?objectCategory=${data.categoryKey}&objectSubCategory=${dataKey}&tab=0`}
                    />
                  }
                />
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <OverriddenObjectProperty
                  title="Position"
                  type={data}
                  setting="placementPosition"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        placementPosition: overridden ? PLACEMENT_POSITION_CENTER : undefined
                      }
                    })
                  }
                  disabled={disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <Select
                        label="Placement Position"
                        disabled={disabled || controlled}
                        required
                        value={value}
                        onChange={
                          controlled
                            ? undefined
                            : (newValue) =>
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
                        helperText={helperText}
                        error={
                          data.settings?.isWorkstation &&
                          getObjectSetting('inventoryType', data, objectCategoriesByKey, undefined).value !==
                            INVENTORY_TYPE_SMALL
                        }
                      />
                    )
                  }}
                </OverriddenObjectProperty>
                <OverriddenObjectProperty
                  title="Layer"
                  type={data}
                  setting="placementLayer"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        placementLayer: overridden ? PLACEMENT_LAYER_ON_GROUND : undefined
                      }
                    })
                  }
                  disabled={disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <Select
                        label="Placement Layer"
                        disabled={disabled || controlled}
                        required
                        value={value}
                        onChange={
                          controlled
                            ? undefined
                            : (newValue) =>
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
                        helperText={helperText}
                        error={
                          data.settings?.isWorkstation &&
                          getObjectSetting('inventoryType', data, objectCategoriesByKey, undefined).value !==
                            INVENTORY_TYPE_SMALL
                        }
                      />
                    )
                  }}
                </OverriddenObjectProperty>
                <OverriddenObjectProperty
                  title="Spawning Conditions"
                  type={data}
                  setting="spawningConditions"
                  controlStyle="multiple"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        spawningConditions: overridden ? [] : undefined
                      }
                    })
                  }
                  sx={{ gridColumn: '1 / span 2' }}
                  disabled={disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                          {(CONDITIONS as SpawningCondition[]).map((condition) => (
                            <FormBox key={`condition-${condition}`}>
                              <Checkbox
                                label={toTitleCaseFromKey(condition)}
                                checked={Boolean(value?.includes(condition))}
                                onChange={
                                  controlled
                                    ? undefined
                                    : (newValue) => {
                                        const spawningConditions = [...(value || [])];
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
                                      }
                                }
                                disabled={disabled || controlled}
                                helperText={helperText}
                              />
                            </FormBox>
                          ))}
                        </Box>
                        {helperText}
                      </Box>
                    )
                  }}
                </OverriddenObjectProperty>
              </Box>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Card header="Required Below">
                  <OverriddenObjectProperty
                    layout="inline"
                    type={data}
                    setting="requiredBelowObjectCategoryKeys"
                    onOverrideChange={(overridden) =>
                      handleOnChange({
                        settings: {
                          ...data.settings,
                          requiredBelowObjectCategoryKeys: overridden ? [] : undefined
                        }
                      })
                    }
                    disabled={disabled}
                  >
                    {{
                      control: (controlled, value, helperText) => (
                        <MultiSelect
                          label="Object Category"
                          values={value}
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
                          disabled={disabled || controlled || belowCategories.length === 0}
                          helperText={helperText}
                        />
                      )
                    }}
                  </OverriddenObjectProperty>
                  <OverriddenObjectProperty
                    layout="inline"
                    type={data}
                    setting="requiredBelowObjectSubCategoryKeys"
                    onOverrideChange={(overridden) =>
                      handleOnChange({
                        settings: {
                          ...data.settings,
                          requiredBelowObjectSubCategoryKeys: overridden ? [] : undefined
                        }
                      })
                    }
                    disabled={disabled}
                  >
                    {{
                      control: (controlled, value, helperText) => (
                        <MultiSelect
                          label="Object Sub Category"
                          values={value}
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
                          disabled={disabled || controlled || belowSubCategories.length === 0}
                          helperText={helperText}
                        />
                      )
                    }}
                  </OverriddenObjectProperty>
                  <OverriddenObjectProperty
                    layout="inline"
                    type={data}
                    setting="requiredBelowObjectKeys"
                    onOverrideChange={(overridden) =>
                      handleOnChange({
                        settings: {
                          ...data.settings,
                          requiredBelowObjectKeys: overridden ? [] : undefined
                        }
                      })
                    }
                    disabled={disabled}
                  >
                    {{
                      control: (controlled, value, helperText) => (
                        <MultiSelect
                          label="Object"
                          values={value}
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
                          disabled={disabled || controlled || belowObjects.length === 0}
                          helperText={helperText}
                        />
                      )
                    }}
                  </OverriddenObjectProperty>
                </Card>
              </Box>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Card header="Required Adjacent">
                  <OverriddenObjectProperty
                    layout="inline"
                    type={data}
                    setting="requiredAdjacentObjectCategoryKeys"
                    onOverrideChange={(overridden) =>
                      handleOnChange({
                        settings: {
                          ...data.settings,
                          requiredAdjacentObjectCategoryKeys: overridden ? [] : undefined
                        }
                      })
                    }
                    disabled={disabled}
                  >
                    {{
                      control: (controlled, value, helperText) => (
                        <MultiSelect
                          label="Object Category"
                          values={value}
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
                          disabled={disabled || controlled || adjacentCategories.length === 0}
                          helperText={helperText}
                        />
                      )
                    }}
                  </OverriddenObjectProperty>
                  <OverriddenObjectProperty
                    layout="inline"
                    type={data}
                    setting="requiredAdjacentObjectSubCategoryKeys"
                    onOverrideChange={(overridden) =>
                      handleOnChange({
                        settings: {
                          ...data.settings,
                          requiredAdjacentObjectSubCategoryKeys: overridden ? [] : undefined
                        }
                      })
                    }
                    disabled={disabled}
                  >
                    {{
                      control: (controlled, value, helperText) => (
                        <MultiSelect
                          label="Object Sub Category"
                          values={value}
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
                          disabled={disabled || controlled || adjacentSubCategories.length === 0}
                          helperText={helperText}
                        />
                      )
                    }}
                  </OverriddenObjectProperty>
                  <OverriddenObjectProperty
                    layout="inline"
                    type={data}
                    setting="requiredAdjacentObjectKeys"
                    onOverrideChange={(overridden) =>
                      handleOnChange({
                        settings: {
                          ...data.settings,
                          requiredAdjacentObjectKeys: overridden ? [] : undefined
                        }
                      })
                    }
                    disabled={disabled}
                  >
                    {{
                      control: (controlled, value, helperText) => (
                        <MultiSelect
                          label="Object"
                          values={value}
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
                          disabled={disabled || controlled || adjacentObjects.length === 0}
                          helperText={helperText}
                        />
                      )
                    }}
                  </OverriddenObjectProperty>
                </Card>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <Box display="flex" flexDirection="column" />
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={3}>
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

export default ObjectSubCategoryView;
