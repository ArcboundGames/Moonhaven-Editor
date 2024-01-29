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

import type { LocalizedObjectType, ObjectSubCategory } from '../../../../../../../SharedLibrary/src/interface';
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
                  onChange={handleOnChange}
                  defaultValue={LOOT_TYPE_DROP}
                  disabled={disabled}
                >
                  {{
                    control: ({ controlled, value, helperText, onChange }) => (
                      <Select
                        label="Loot Type"
                        disabled={disabled || controlled}
                        value={value}
                        onChange={onChange}
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
                  label="Requires Water"
                  type={data}
                  setting="requiresWater"
                  onChange={handleOnChange}
                  defaultValue={false}
                  disabled={disabled}
                  variant="boolean"
                />
                <OverriddenObjectProperty
                  title="Health"
                  label="Has Health"
                  type={data}
                  setting="hasHealth"
                  onChange={handleOnChange}
                  defaultValue={false}
                  disabled={disabled}
                  variant="boolean"
                />
                <OverriddenObjectProperty
                  title="Stages"
                  type={data}
                  setting="stagesType"
                  onChange={handleOnChange}
                  defaultValue={STAGES_TYPE_GROWABLE}
                  disabled={disabled}
                >
                  {{
                    control: ({ controlled, value, helperText, onChange }) => (
                      <Select
                        label="Stages Type"
                        disabled={disabled || controlled}
                        required
                        value={value}
                        onChange={onChange}
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
                  label="Is Workstation"
                  type={data}
                  setting="isWorkstation"
                  onChange={handleOnChange}
                  defaultValue={false}
                  disabled={disabled}
                  variant="boolean"
                />
                <OverriddenObjectProperty
                  title="Destroy"
                  label="Destroy on Harvest"
                  type={data}
                  setting="destroyOnHarvest"
                  onChange={handleOnChange}
                  defaultValue={false}
                  disabled={disabled}
                  variant="boolean"
                />
                <OverriddenObjectProperty
                  title="Harvest"
                  label="Can Harvest with Hand"
                  type={data}
                  setting="canHarvestWithHand"
                  onChange={handleOnChange}
                  defaultValue={false}
                  disabled={disabled}
                  variant="boolean"
                />
                <OverriddenObjectProperty
                  title="Breakable"
                  label="Breakable"
                  type={data}
                  setting="breakable"
                  onChange={handleOnChange}
                  defaultValue={false}
                  disabled={disabled}
                  variant="boolean"
                />
                <OverriddenObjectProperty
                  title="Player Destructible"
                  label="Player Destructible"
                  type={data}
                  setting="isPlayerDestructible"
                  onChange={handleOnChange}
                  defaultValue={false}
                  disabled={disabled}
                  variant="boolean"
                />
                <OverriddenObjectProperty
                  title="Inventory"
                  type={data}
                  setting="inventoryType"
                  onChange={handleOnChange}
                  defaultValue={INVENTORY_TYPE_NONE}
                  disabled={disabled}
                >
                  {{
                    control: ({ controlled, value, helperText, onChange }) => (
                      <Select
                        label="Inventory Type"
                        disabled={disabled || controlled}
                        required
                        value={value}
                        onChange={onChange}
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
                  label="Can Open"
                  type={data}
                  setting="canOpen"
                  onChange={handleOnChange}
                  defaultValue={false}
                  disabled={disabled}
                  variant="boolean"
                />
                <OverriddenObjectProperty
                  title="Activate"
                  label="Can Activate"
                  type={data}
                  setting="canActivate"
                  onChange={handleOnChange}
                  defaultValue={false}
                  disabled={disabled}
                  variant="boolean"
                />
                <OverriddenObjectProperty
                  title="Seasons"
                  label="Changes Sprites with Season"
                  type={data}
                  setting="changesSpritesWithSeason"
                  onChange={handleOnChange}
                  defaultValue={false}
                  disabled={disabled}
                  variant="boolean"
                />
                <OverriddenObjectProperty
                  title="Light"
                  label="Has Light"
                  type={data}
                  setting="hasLight"
                  onChange={handleOnChange}
                  defaultValue={false}
                  disabled={disabled}
                  variant="boolean"
                />
                <OverriddenObjectProperty
                  title="Clear Sight"
                  label="Fades When Player is Behind"
                  type={data}
                  setting="fadesWhenPlayerBehind"
                  onChange={handleOnChange}
                  defaultValue={false}
                  disabled={disabled}
                  variant="boolean"
                />
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
                  onChange={handleOnChange}
                  defaultValue={PLACEMENT_POSITION_CENTER}
                  disabled={disabled}
                >
                  {{
                    control: ({ controlled, value, helperText, onChange }) => (
                      <Select
                        label="Placement Position"
                        disabled={disabled || controlled}
                        required
                        value={value}
                        onChange={onChange}
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
                <Card header="Layer">
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                    <OverriddenObjectProperty
                      type={data}
                      setting="placementLayer"
                      onChange={handleOnChange}
                      defaultValue={PLACEMENT_LAYER_ON_GROUND}
                      disabled={disabled}
                      layout="inline"
                    >
                      {{
                        control: ({ controlled, value, helperText, onChange }) => (
                          <Select
                            label="Placement Layer"
                            disabled={disabled || controlled}
                            required
                            value={value}
                            onChange={onChange}
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
                    {getObjectSetting('placementLayer', data, objectCategoriesByKey, undefined).value === PLACEMENT_LAYER_IN_GROUND ? (
                      <OverriddenObjectProperty
                        type={data}
                        setting="blocksPlacement"
                        onChange={handleOnChange}
                        defaultValue={false}
                        disabled={disabled}
                        layout="inline"
                      >
                        {{
                          control: ({ controlled, value, helperText, onChange }) => (
                            <Checkbox
                              label="Blocks On Ground Placement"
                              checked={value}
                              disabled={disabled || controlled}
                              onChange={onChange}
                              helperText={helperText}
                            />
                          )
                        }}
                      </OverriddenObjectProperty>
                    ) : null}
                  </Box>
                </Card>
                <OverriddenObjectProperty
                  title="Spawning Conditions"
                  type={data}
                  setting="spawningConditions"
                  controlStyle="multiple"
                  onChange={handleOnChange}
                  defaultValue={[]}
                  sx={{ gridColumn: '1 / span 2' }}
                  disabled={disabled}
                >
                  {{
                    control: ({ controlled, value, helperText }) => (
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                          {CONDITIONS.map((condition) => (
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
                    onChange={handleOnChange}
                    defaultValue={[]}
                    disabled={disabled}
                  >
                    {{
                      control: ({ controlled, value, helperText, onChange }) => (
                        <MultiSelect
                          label="Object Category"
                          values={value}
                          onChange={onChange}
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
                    onChange={handleOnChange}
                    defaultValue={[]}
                    disabled={disabled}
                  >
                    {{
                      control: ({ controlled, value, helperText, onChange }) => (
                        <MultiSelect
                          label="Object Sub Category"
                          values={value}
                          onChange={onChange}
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
                    onChange={handleOnChange}
                    defaultValue={[]}
                    disabled={disabled}
                  >
                    {{
                      control: ({ controlled, value, helperText, onChange }) => (
                        <MultiSelect
                          label="Object"
                          values={value}
                          onChange={onChange}
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
                    onChange={handleOnChange}
                    defaultValue={[]}
                    disabled={disabled}
                  >
                    {{
                      control: ({ controlled, value, helperText, onChange }) => (
                        <MultiSelect
                          label="Object Category"
                          values={value}
                          onChange={onChange}
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
                    onChange={handleOnChange}
                    defaultValue={[]}
                    disabled={disabled}
                  >
                    {{
                      control: ({ controlled, value, helperText, onChange }) => (
                        <MultiSelect
                          label="Object Sub Category"
                          values={value}
                          onChange={onChange}
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
                    onChange={handleOnChange}
                    defaultValue={[]}
                    disabled={disabled}
                  >
                    {{
                      control: ({ controlled, value, helperText, onChange }) => (
                        <MultiSelect
                          label="Object"
                          values={value}
                          onChange={onChange}
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
