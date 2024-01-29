import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  ALL_SEASONS,
  CONDITIONS,
  IMAGE_FILE_EXTENSION,
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
  SEASONS,
  STAGES_TYPE_BREAKABLE,
  STAGES_TYPE_GROWABLE,
  STAGES_TYPE_GROWABLE_WITH_HEALTH,
  STAGES_TYPE_NONE
} from '../../../../../../../SharedLibrary/src/constants';
import { validateObjectGeneralTab, validatePhysicsTab } from '../../../../../../../SharedLibrary/src/dataValidation';
import { createObjectSprites, toSeason } from '../../../../../../../SharedLibrary/src/util/converters.util';
import { isNotNullish, isNullish } from '../../../../../../../SharedLibrary/src/util/null.util';
import { getObjectSetting } from '../../../../../../../SharedLibrary/src/util/objectType.util';
import { toTitleCaseFromKey } from '../../../../../../../SharedLibrary/src/util/string.util';
import { useAppDispatch, useAppSelector, useDebounce, useQuery } from '../../../../hooks';
import { selectPath } from '../../../../store/slices/data';
import { selectLootTables, selectLootTablesByKey } from '../../../../store/slices/lootTables';
import {
  selectObjectCategories,
  selectObjectCategoriesByKey,
  selectObjectSubCategories,
  selectObjectSubCategoriesByKey,
  selectObjectSubCategory,
  selectObjectType,
  selectObjectTypes,
  selectObjectTypesByKey,
  selectObjectTypesSortedWithName,
  selectSelectedObjectCategory,
  selectSelectedObjectSubCategory,
  updateObjects
} from '../../../../store/slices/objects';
import { selectSkillsSortedWithName } from '../../../../store/slices/skills';
import { getNewObject } from '../../../../util/section.util';
import { getSectionPath, getSpriteCountFromImagePath } from '../../../../util/sprite.util';
import {
  validateObject,
  validateObjectPlacementSpawningTab,
  validateObjectSpriteStageTab
} from '../../../../util/validate.util';
import { useUpdateLocalization } from '../../../hooks/useUpdateLocalization.hook';
import Checkbox from '../../../widgets/form/Checkbox';
import MultiSelect from '../../../widgets/form/MultiSelect';
import NumberTextField from '../../../widgets/form/NumberTextField';
import ObjectMultiSelect from '../../../widgets/form/object/ObjectMultiSelect';
import Select from '../../../widgets/form/Select';
import TextField from '../../../widgets/form/TextField';
import Vector2Field from '../../../widgets/form/Vector2Field';
import Card from '../../../widgets/layout/Card';
import FormBox from '../../../widgets/layout/FormBox';
import TabPanel from '../../../widgets/TabPanel';
import Tabs from '../../../widgets/tabs/Tabs';
import DataViewer from '../../DataViewer';
import { useByAdjacentPlacementLayer, useByBelowPlacementLayer } from './hooks/useByPlacementLayer';
import usePath from './hooks/usePath';
import StagesCard from './objectTypeView/StagesCard';
import CollidersCard from './widgets/CollidersCard';
import { OverriddenObjectPropertyCard as OverriddenObjectProperty } from './widgets/OverriddenPropertyCard';
import SpritesCard from './widgets/SpritesCard';

import type { ObjectSubCategory, ObjectType } from '../../../../../../../SharedLibrary/src/interface';

const ObjectTypeView = () => {
  const { dataKey = '' } = useParams();

  const dispatch = useAppDispatch();

  const objectType = useAppSelector(useMemo(() => selectObjectType(dataKey), [dataKey]));
  const objectTypeSubCategory = useAppSelector(
    useMemo(() => selectObjectSubCategory(objectType?.subCategoryKey), [objectType?.subCategoryKey])
  );

  const query = useQuery();

  const queryTab = Number(query.get('tab') ?? 0);
  const [tab, setTab] = useState(queryTab);
  useEffect(() => {
    if (!Number.isNaN(queryTab) && queryTab !== tab) {
      setTab(queryTab);
    }
  }, [queryTab, tab]);

  const [spriteCount, setSpriteCount] = useState<number>(0);

  const [dataKeyChanged, setDataKeyChanged] = useState<boolean>(true);
  const categories = useAppSelector(selectObjectCategories);
  const subCategories = useAppSelector(selectObjectSubCategories);
  const path = useAppSelector(selectPath);

  const allObjects = useAppSelector(selectObjectTypes);
  const allObjectsLocalized = useAppSelector(selectObjectTypesSortedWithName);
  const objectsByKey = useAppSelector(selectObjectTypesByKey);

  const selectedObjectCategory = useAppSelector(selectSelectedObjectCategory);
  const selectedObjectSubCategory = useAppSelector(selectSelectedObjectSubCategory);

  const categoriesByKey = useAppSelector(selectObjectCategoriesByKey);
  const subCategoriesByKey = useAppSelector(selectObjectSubCategoriesByKey);
  const lootTables = useAppSelector(selectLootTables);
  const lootTablesByKey = useAppSelector(selectLootTablesByKey);

  const sortedSkills = useAppSelector(selectSkillsSortedWithName);

  const queryObjectCategory = query.get('objectCategory');
  const queryObjectSubCategory = query.get('objectSubCategory');

  const defaultObject = useMemo(() => {
    const newObject = getNewObject(objectsByKey);

    newObject.id = Math.max(...allObjectsLocalized.map((otherObject) => otherObject.id)) + 1;

    const objectCategory = queryObjectCategory ?? selectedObjectCategory;
    if (objectCategory && objectCategory !== 'ALL') {
      newObject.categoryKey = objectCategory;
    }

    const objectSubCategory = queryObjectSubCategory ?? selectedObjectSubCategory;
    if (objectSubCategory && objectSubCategory !== 'ALL') {
      newObject.subCategoryKey = objectSubCategory;
    }

    newObject.worldSize = {
      x: 1,
      y: 1
    };

    newObject.sprite = {
      defaultSprite: 0,
      width: 16,
      height: 16,
      pivotOffset: {
        x: 0,
        y: 0
      }
    };

    return newObject;
  }, [
    objectsByKey,
    allObjectsLocalized,
    queryObjectCategory,
    selectedObjectCategory,
    queryObjectSubCategory,
    selectedObjectSubCategory
  ]);

  const [editData, setEditData] = useState<ObjectType | undefined>(dataKey === 'new' ? defaultObject : objectType);

  const dataKeys = useMemo(
    () => ({
      current: editData?.key ?? dataKey,
      route: dataKey
    }),
    [dataKey, editData?.key]
  );

  const {
    saveLocalizations,
    getLocalizedValue,
    tempData,
    updateLocalizedValue,
    deleteLocalizations,
    getLocalizedName,
    isLocalizationDirty
  } = useUpdateLocalization({
    prefix: 'object',
    keys: useMemo(() => ['name'], []),
    fallbackName: 'Unknown Object',
    dataKeys
  });

  const debouncedTempData = useDebounce(tempData, 300);

  useEffect(() => {
    setDataKeyChanged(true);
  }, [dataKey]);

  useEffect(() => {
    setEditData(objectType);
  }, [objectType]);

  useEffect(() => {
    if (dataKey === editData?.key || dataKey === 'new') {
      setDataKeyChanged(false);
    }
  }, [dataKey, editData?.key]);

  const debouncedEditData = useDebounce(editData, dataKeyChanged ? 0 : 500);

  const imagePath = usePath(path, '..', getSectionPath('object'), `${dataKey?.toLowerCase()}${IMAGE_FILE_EXTENSION}`);

  const spriteWidth = debouncedEditData?.sprite?.width;
  const spriteHeight = debouncedEditData?.sprite?.height;

  useEffect(() => {
    let alive = true;

    async function spriteCountGetter() {
      if (!imagePath || !spriteWidth || !spriteHeight) {
        return;
      }

      const newSpriteCount = await getSpriteCountFromImagePath(imagePath, spriteWidth, spriteHeight);
      if (alive) {
        setSpriteCount(newSpriteCount);
      }
    }

    spriteCountGetter();
    return () => {
      alive = false;
    };
  }, [imagePath, spriteHeight, spriteWidth]);

  const getGeneralTabErrors = useCallback(
    (data: ObjectType) =>
      validateObjectGeneralTab(
        data,
        categoriesByKey,
        subCategories,
        subCategoriesByKey,
        lootTablesByKey,
        debouncedTempData.localization,
        debouncedTempData.localizationKeys,
        []
      ),
    [
      categoriesByKey,
      debouncedTempData.localization,
      debouncedTempData.localizationKeys,
      lootTablesByKey,
      subCategories,
      subCategoriesByKey
    ]
  );

  const getPlacementAndSpawningErrors = useCallback(
    (data: ObjectType) => validateObjectPlacementSpawningTab(data, categoriesByKey, subCategoriesByKey, objectsByKey),
    [categoriesByKey, objectsByKey, subCategoriesByKey]
  );

  const getPhysicsTabErrors = useCallback((data: ObjectType) => validatePhysicsTab(data), []);

  const getSpriteStageTabErrors = useCallback(
    (data: ObjectType) =>
      validateObjectSpriteStageTab(data, categoriesByKey, subCategoriesByKey, lootTablesByKey, path),
    [categoriesByKey, lootTablesByKey, path, subCategoriesByKey]
  );

  const filteredSubCategories = useMemo(() => {
    let { categoryKey } = defaultObject;
    if (!dataKeyChanged) {
      categoryKey = debouncedEditData?.categoryKey;
    } else if (objectType?.categoryKey) {
      categoryKey = objectType?.categoryKey;
    }

    if (!categoryKey) {
      return [];
    }

    return subCategories?.filter((subCategory: ObjectSubCategory) => subCategory.categoryKey === categoryKey);
  }, [defaultObject, dataKeyChanged, objectType?.categoryKey, subCategories, debouncedEditData?.categoryKey]);

  const placementLayer = useMemo(
    () => getObjectSetting('placementLayer', editData, categoriesByKey, subCategoriesByKey).value,
    [categoriesByKey, editData, subCategoriesByKey]
  );

  const changesSpritesWithSeason = useMemo(
    () => getObjectSetting('changesSpritesWithSeason', editData, categoriesByKey, subCategoriesByKey).value,
    [categoriesByKey, editData, subCategoriesByKey]
  );

  const stagesType = useMemo(
    () => getObjectSetting('stagesType', editData, categoriesByKey, subCategoriesByKey).value,
    [categoriesByKey, editData, subCategoriesByKey]
  );

  const lootType = useMemo(
    () => getObjectSetting('lootType', editData, categoriesByKey, subCategoriesByKey).value,
    [categoriesByKey, editData, subCategoriesByKey]
  );

  const { belowCategories, belowSubCategories, belowObjects } = useByBelowPlacementLayer(
    placementLayer,
    categories,
    subCategories,
    allObjectsLocalized,
    categoriesByKey,
    subCategoriesByKey
  );

  const { adjacentCategories, adjacentSubCategories, adjacentObjects } = useByAdjacentPlacementLayer(
    placementLayer,
    categories,
    subCategories,
    allObjectsLocalized,
    categoriesByKey,
    subCategoriesByKey
  );

  const validate = useCallback(
    async (data: ObjectType) => {
      if (!path) {
        return ['File path not found'];
      }
      return validateObject(
        data,
        categoriesByKey,
        subCategories,
        subCategoriesByKey,
        lootTablesByKey,
        objectsByKey,
        debouncedTempData.localization,
        debouncedTempData.localizationKeys,
        path
      );
    },
    [
      path,
      categoriesByKey,
      subCategories,
      subCategoriesByKey,
      lootTablesByKey,
      objectsByKey,
      debouncedTempData.localization,
      debouncedTempData.localizationKeys
    ]
  );
  const onSave = useCallback(
    (dataSaved: ObjectType[], newObject: ObjectType | undefined) => {
      dispatch(updateObjects(dataSaved));

      if (newObject) {
        saveLocalizations();
      } else {
        deleteLocalizations();
      }
    },
    [deleteLocalizations, dispatch, saveLocalizations]
  );
  const getFileData = useCallback(() => {
    return {
      categories,
      subCategories,
      objects: allObjects
    };
  }, [categories, subCategories, allObjects]);

  const onDataChange = useCallback((data: ObjectType | undefined) => setEditData(data), []);

  return (
    <DataViewer
      dataKey={dataKey}
      valueDataKey={editData?.key}
      section="object"
      file={OBJECTS_DATA_FILE}
      fileSection="objects"
      value={objectType}
      defaultValue={defaultObject}
      getFileData={getFileData}
      getName={getLocalizedName}
      onDataChange={onDataChange}
      validate={validate}
      onSave={onSave}
      dirty={isLocalizationDirty}
    >
      {({ data, handleOnChange, disabled }) => (
        <>
          <Tabs
            data={debouncedEditData}
            dataKey={dataKey}
            section="object"
            ariaLabel="object tabs"
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
              label: 'Sprites & Stages',
              validate: getSpriteStageTabErrors
            }}
            {{
              label: 'Physics',
              validate: getPhysicsTabErrors
            }}
          </Tabs>
          <TabPanel value={tab} index={0}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Card header="General">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
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
                        min={1}
                        disabled={disabled}
                        wholeNumber
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
                    ),
                    other: (controlledLootType) =>
                      controlledLootType === LOOT_TYPE_DROP ? (
                        <FormBox>
                          <Select
                            label="Loot Table"
                            required
                            disabled={disabled}
                            value={data.lootTableKey}
                            onChange={(newValue) =>
                              handleOnChange({
                                lootTableKey: newValue
                              })
                            }
                            options={lootTables.map((lootTable) => ({
                              value: lootTable.key,
                              label: toTitleCaseFromKey(lootTable.key)
                            }))}
                          />
                        </FormBox>
                      ) : null
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
                >
                  {{
                    other: (requiresWater) =>
                      requiresWater ? (
                        <FormBox key="expireChanceBox">
                          <NumberTextField
                            label="Expire Chance"
                            value={data.expireChance}
                            onChange={(value) =>
                              handleOnChange({
                                expireChance: value
                              })
                            }
                            required
                            min={0}
                            max={100}
                            endAdornment="%"
                            disabled={disabled}
                            wholeNumber
                          />
                        </FormBox>
                      ) : null
                  }}
                </OverriddenObjectProperty>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
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
                            getObjectSetting('inventoryType', data, categoriesByKey, subCategoriesByKey).value !==
                              INVENTORY_TYPE_SMALL
                          }
                        />
                      )
                    }}
                  </OverriddenObjectProperty>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Card header="Category">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
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
                    <FormBox>
                      {filteredSubCategories?.length ? (
                        <Select
                          key="sub-category"
                          label="Sub Category"
                          required
                          disabled={disabled}
                          value={data.subCategoryKey}
                          onChange={(newValue) =>
                            handleOnChange({
                              subCategoryKey: newValue
                            })
                          }
                          options={filteredSubCategories.map((entry) => ({
                            value: entry.key,
                            label: toTitleCaseFromKey(entry.key)
                          }))}
                        />
                      ) : null}
                    </FormBox>
                  </Box>
                </Card>
                <OverriddenObjectProperty
                  title="Health"
                  label="Has Health"
                  type={data}
                  setting="hasHealth"
                  onChange={handleOnChange}
                  defaultValue={false}
                  disabled={disabled}
                  variant="boolean"
                >
                  {{
                    other: (hasHealth) =>
                      hasHealth ? (
                        <FormBox>
                          <NumberTextField
                            label="Health"
                            value={data.health}
                            onChange={(value) =>
                              handleOnChange({
                                health: value
                              })
                            }
                            required
                            min={1}
                            disabled={disabled}
                            wholeNumber
                          />
                        </FormBox>
                      ) : null
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
                >
                  {{
                    other: (isWorkstation) =>
                      isWorkstation ? (
                        <FormBox>
                          <Select
                            label="Skill"
                            value={data.craftingSpeedIncreaseSkillKey}
                            onChange={(newValue) =>
                              handleOnChange({
                                craftingSpeedIncreaseSkillKey: newValue
                              })
                            }
                            disabled={disabled}
                            options={sortedSkills?.map((entry) => ({
                              label: entry.name,
                              value: entry.key
                            }))}
                          />
                        </FormBox>
                      ) : null
                  }}
                </OverriddenObjectProperty>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
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
                  >
                    {{
                      other: (canActivate) =>
                        canActivate ? (
                          <FormBox>
                            <NumberTextField
                              label="Animation Sample Rate"
                              value={data.animationSampleRate}
                              onChange={(value) => handleOnChange({ animationSampleRate: value })}
                              required
                              error={!data.animationSampleRate || data.animationSampleRate <= 0}
                              disabled={disabled}
                              wholeNumber
                            />
                          </FormBox>
                        ) : null
                    }}
                  </OverriddenObjectProperty>
                  <OverriddenObjectProperty
                    title="Light"
                    label="Has Light"
                    type={data}
                    setting="hasLight"
                    onChange={handleOnChange}
                    defaultValue={false}
                    disabled={disabled}
                    variant="boolean"
                  >
                    {{
                      other: (settingValue) =>
                        settingValue ? (
                          <>
                            <FormBox>
                              <NumberTextField
                                key="light-level"
                                label="Light Level"
                                value={data.lightLevel}
                                onChange={(newValue) => handleOnChange({ lightLevel: newValue })}
                                disabled={disabled}
                              />
                            </FormBox>
                            <Box key="light-position">
                              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                                <Vector2Field
                                  value={data.lightPosition}
                                  helperText="Pixels"
                                  disabled={disabled}
                                  min={{
                                    x: 0,
                                    y: 0
                                  }}
                                  onChange={(value) => handleOnChange({ lightPosition: value })}
                                />
                              </Box>
                            </Box>
                          </>
                        ) : null
                    }}
                  </OverriddenObjectProperty>
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
                  {stagesType && stagesType !== STAGES_TYPE_NONE && lootType && lootType !== LOOT_TYPE_NONE ? (
                    <Card header="Experience">
                      <FormBox>
                        <NumberTextField
                          label="Experience"
                          value={data.experience}
                          onChange={(value) =>
                            handleOnChange({
                              experience: value
                            })
                          }
                          required
                          min={1}
                          disabled={disabled}
                          wholeNumber
                        />
                      </FormBox>
                    </Card>
                  ) : null}
                </Box>
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
                          getObjectSetting('inventoryType', data, categoriesByKey, subCategoriesByKey).value !==
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
                              getObjectSetting('inventoryType', data, categoriesByKey, subCategoriesByKey).value !==
                                INVENTORY_TYPE_SMALL
                            }
                          />
                        )
                      }}
                    </OverriddenObjectProperty>
                    {getObjectSetting('placementLayer', data, categoriesByKey, subCategoriesByKey).value ===
                    PLACEMENT_LAYER_IN_GROUND ? (
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
                {stagesType === STAGES_TYPE_GROWABLE || stagesType === STAGES_TYPE_GROWABLE_WITH_HEALTH ? (
                  <Card key="season" header="Season">
                    <FormBox>
                      <Select
                        label="Season"
                        required
                        disabled={disabled}
                        value={data.season}
                        onChange={(value) => handleOnChange({ season: toSeason(value) })}
                        options={[ALL_SEASONS, ...SEASONS]?.map((entry) => ({
                          label: toTitleCaseFromKey(entry),
                          value: entry
                        }))}
                      />
                    </FormBox>
                  </Card>
                ) : null}
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
                        <ObjectMultiSelect
                          label="Object"
                          values={value}
                          onChange={onChange}
                          objects={belowObjects}
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
            <>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                  <Card header="Sprite">
                    <Typography gutterBottom variant="subtitle2" component="div">
                      Size
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                      <FormBox>
                        <NumberTextField
                          label="Width"
                          value={data.sprite?.width}
                          onChange={(value) =>
                            handleOnChange({
                              sprite: {
                                ...(data.sprite ?? createObjectSprites()),
                                width: value ?? 1
                              }
                            })
                          }
                          required
                          min={16}
                          disabled={disabled}
                          wholeNumber
                          helperText="Pixels"
                        />
                      </FormBox>
                      <FormBox>
                        <NumberTextField
                          label="Height"
                          value={data.sprite?.height}
                          onChange={(value) =>
                            handleOnChange({
                              sprite: {
                                ...(data.sprite ?? createObjectSprites()),
                                height: value ?? 1
                              }
                            })
                          }
                          required
                          min={16}
                          disabled={disabled}
                          wholeNumber
                          helperText="Pixels"
                        />
                      </FormBox>
                    </Box>
                    <Typography gutterBottom variant="subtitle2" component="div" sx={{ marginTop: 2 }}>
                      Pivot Offset
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                      <Vector2Field
                        value={data.sprite?.pivotOffset}
                        helperText="Pixels"
                        disabled={disabled}
                        onChange={(pivotOffset) =>
                          handleOnChange({
                            sprite: {
                              ...(data.sprite ?? createObjectSprites()),
                              pivotOffset
                            }
                          })
                        }
                      />
                    </Box>
                  </Card>
                  {isNullish(stagesType) || stagesType === STAGES_TYPE_NONE ? (
                    <SpritesCard
                      section="object"
                      spriteCount={spriteCount}
                      dataKey={data.key}
                      dataKeyChanged={dataKeyChanged}
                      spriteWidth={spriteWidth}
                      spriteHeight={spriteHeight}
                      showDefaultSprite
                      defaultSprite={objectTypeSubCategory?.rulesets?.[0]?.defaultSprite ?? data.sprite?.defaultSprite}
                      canChangeDefaultSprite={!objectTypeSubCategory?.rulesets?.[0]?.defaultSprite}
                      onDefaultSpriteChange={(defaultSprite) =>
                        handleOnChange({
                          sprite: {
                            ...(data.sprite ?? createObjectSprites()),
                            defaultSprite
                          }
                        })
                      }
                      disabled={disabled}
                      sprites={data.sprite?.sprites}
                      onChange={(index, objectSprite) => {
                        const sprites = { ...(data.sprite?.sprites ?? {}) };
                        if (objectSprite === undefined) {
                          delete sprites[index];
                        } else {
                          sprites[index] = objectSprite;
                        }
                        handleOnChange({
                          sprite: {
                            ...(data.sprite ?? createObjectSprites()),
                            sprites
                          }
                        });
                      }}
                    />
                  ) : null}
                </Box>
                <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <OverriddenObjectProperty
                      title="Stages Type"
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
                              getObjectSetting('lootType', data, categoriesByKey, subCategoriesByKey).value ===
                                LOOT_TYPE_STAGE_DROP
                            }
                          />
                        )
                      }}
                    </OverriddenObjectProperty>
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
                  </Box>
                  <Card header="World Size">
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                      <FormBox>
                        <NumberTextField
                          label="Width"
                          value={data.worldSize?.x}
                          onChange={(value) =>
                            handleOnChange({
                              worldSize: {
                                x: value ?? 1,
                                y: data.worldSize?.y ?? 1
                              }
                            })
                          }
                          required
                          min={1}
                          disabled={disabled}
                          wholeNumber
                          helperText="World tiles"
                        />
                      </FormBox>
                      <FormBox>
                        <NumberTextField
                          label="Height"
                          value={data.worldSize?.y}
                          onChange={(value) =>
                            handleOnChange({
                              worldSize: {
                                y: value ?? 1,
                                x: data.worldSize?.x ?? 1
                              }
                            })
                          }
                          required
                          min={1}
                          disabled={disabled}
                          wholeNumber
                          helperText="World tiles"
                        />
                      </FormBox>
                    </Box>
                  </Card>
                </Box>
              </Box>
              {isNotNullish(stagesType) && stagesType !== STAGES_TYPE_NONE ? (
                <StagesCard
                  stages={data.stages}
                  lootType={lootType}
                  stagesType={stagesType}
                  disabled={disabled}
                  lootTables={lootTables}
                  dataKey={data.key}
                  dataKeyChanged={dataKeyChanged}
                  spriteWidth={spriteWidth}
                  spriteHeight={spriteHeight}
                  defaultSprite={data.sprite?.defaultSprite}
                  expectedStageCount={spriteCount}
                  onDefaultSpriteChange={(defaultSprite) =>
                    handleOnChange({
                      sprite: {
                        ...(data.sprite ?? createObjectSprites()),
                        defaultSprite
                      }
                    })
                  }
                  onChange={(stages) => handleOnChange({ stages })}
                  showDefaultSprite
                  canChangeDefaultSprite={!objectTypeSubCategory?.rulesets?.[0]?.defaultSprite}
                  sprites={data.sprite?.sprites}
                  onSpriteChange={(index, objectSprite) => {
                    const sprites = { ...(data.sprite?.sprites ?? {}) };
                    if (objectSprite === undefined) {
                      delete sprites[index];
                    } else {
                      sprites[index] = objectSprite;
                    }
                    handleOnChange({
                      sprite: {
                        ...(data.sprite ?? createObjectSprites()),
                        sprites
                      }
                    });
                  }}
                  changesSpritesWithSeason={changesSpritesWithSeason}
                />
              ) : null}
            </>
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
                  onChange={(sprites) => {
                    handleOnChange({
                      sprite: {
                        ...(data.sprite ?? createObjectSprites()),
                        sprites
                      }
                    });
                  }}
                />
              </Box>
            </Box>
          </TabPanel>
        </>
      )}
    </DataViewer>
  );
};

export default ObjectTypeView;
