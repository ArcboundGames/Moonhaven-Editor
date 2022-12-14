import Box from '@mui/material/Box';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  FILLED_FROM_TYPE_NONE,
  FILLED_FROM_TYPE_SAND,
  FILLED_FROM_TYPE_WATER,
  ICON_HEIGHT,
  ICON_WIDTH,
  ITEMS_DATA_FILE,
  ITEM_SPRITE_TARGET_SIZE,
  WEAPON_TYPE_NONE
} from '../../../../../../../SharedLibrary/src/constants';
import { getDamagableData, getProjectileData } from '../../../../../../../SharedLibrary/src/util/combat.util';
import { toFilledFromType } from '../../../../../../../SharedLibrary/src/util/converters.util';
import { getItemSetting } from '../../../../../../../SharedLibrary/src/util/itemType.util';
import { isNotNullish } from '../../../../../../../SharedLibrary/src/util/null.util';
import { toTitleCaseFromKey } from '../../../../../../../SharedLibrary/src/util/string.util';
import { useAppDispatch, useAppSelector, useDebounce, useQuery } from '../../../../hooks';
import {
  selectCreatureCategories,
  selectCreatureCategoriesByKey,
  selectCreatureTypes
} from '../../../../store/slices/creatures';
import { selectPath } from '../../../../store/slices/data';
import {
  selectItemCategories,
  selectItemCategoriesByKey,
  selectItemCategory,
  selectItemType,
  selectItemTypes,
  selectItemTypesByKey,
  selectSelectedItemCategory,
  updateItems
} from '../../../../store/slices/items';
import {
  selectObjectCategories,
  selectObjectCategoriesByKey,
  selectObjectSubCategories,
  selectObjectSubCategoriesByKey,
  selectObjectTypesByKey,
  selectObjectTypesSortedWithName
} from '../../../../store/slices/objects';
import { selectSkillsByKey } from '../../../../store/slices/skills';
import { getNewItem } from '../../../../util/section.util';
import {
  validateItem,
  validateItemCombatTab,
  validateItemFishingTab,
  validateItemGeneralTab
} from '../../../../util/validate.util';
import { useUpdateLocalization } from '../../../hooks/useUpdateLocalization.hook';
import Checkbox from '../../../widgets/form/Checkbox';
import ItemSelect from '../../../widgets/form/item/ItemSelect';
import NumberTextField from '../../../widgets/form/NumberTextField';
import Select from '../../../widgets/form/Select';
import TextField from '../../../widgets/form/TextField';
import Vector2Field from '../../../widgets/form/Vector2Field';
import Card from '../../../widgets/layout/Card';
import FormBox from '../../../widgets/layout/FormBox';
import SpriteImage from '../../../widgets/SpriteImage';
import TabPanel from '../../../widgets/TabPanel';
import Tabs from '../../../widgets/tabs/Tabs';
import DataViewer from '../../DataViewer';
import ItemViewCombatTab from './itemView/ItemViewCombatTab';
import ItemViewFishingTab from './itemView/ItemViewFishingTab';
import { OverriddenItemPropertyCard } from './widgets/OverriddenPropertyCard';

import type { ItemType } from '../../../../../../../SharedLibrary/src/interface';

const ItemView = () => {
  const { dataKey = '' } = useParams();

  const dispatch = useAppDispatch();
  const query = useQuery();

  const [tab, setTab] = useState(0);

  const item = useAppSelector(useMemo(() => selectItemType(dataKey), [dataKey]));
  const itemCategory = useAppSelector(useMemo(() => selectItemCategory(item?.categoryKey), [item?.categoryKey]));

  const path = useAppSelector(selectPath);

  const categories = useAppSelector(selectItemCategories);

  const items = useAppSelector(selectItemTypes);

  const itemsByKey = useAppSelector(selectItemTypesByKey);
  const itemCategoriesByKey = useAppSelector(selectItemCategoriesByKey);
  const objectsByKey = useAppSelector(selectObjectTypesByKey);

  const selectedItemCategory = useAppSelector(selectSelectedItemCategory);

  const objectCategories = useAppSelector(selectObjectCategories);
  const objectCategoriesByKey = useAppSelector(selectObjectCategoriesByKey);
  const objectSubCategories = useAppSelector(selectObjectSubCategories);
  const objectSubCategoriesByKey = useAppSelector(selectObjectSubCategoriesByKey);
  const objects = useAppSelector(selectObjectTypesSortedWithName);

  const creatureCategories = useAppSelector(selectCreatureCategories);
  const creatureCategoriesByKey = useAppSelector(selectCreatureCategoriesByKey);
  const creatures = useAppSelector(selectCreatureTypes);

  const skillsByKey = useAppSelector(selectSkillsByKey);

  const { filteredObjects } = useMemo(() => {
    if (!itemCategory?.settings?.requiredObjectCategoryKey) {
      return {
        filteredObjects: objects,
        filteredObjectsKeys: objects.map((type) => type.key)
      };
    }

    const filtered = objects.filter((type) => type.categoryKey === itemCategory.settings?.requiredObjectCategoryKey);

    return {
      filteredObjects: filtered,
      filteredObjectsKeys: filtered.map((type) => type.key)
    };
  }, [itemCategory?.settings?.requiredObjectCategoryKey, objects]);

  const { projectileItemCategoryKeys, projectileItemKeys } = useMemo(
    () => getProjectileData(categories, itemCategoriesByKey, items),
    [categories, itemCategoriesByKey, items]
  );

  const {
    damagableObjectCategoryKeys,
    damagableObjectSubCategoryKeys,
    damagableObjectKeys,
    damagableCreatureCategoryKeys,
    damagableCreatureKeys
  } = useMemo(
    () =>
      getDamagableData(
        objectCategories,
        objectCategoriesByKey,
        objectSubCategories,
        objectSubCategoriesByKey,
        objects,
        creatureCategories,
        creatureCategoriesByKey,
        creatures
      ),
    [
      creatureCategories,
      creatureCategoriesByKey,
      creatures,
      objectCategories,
      objectCategoriesByKey,
      objectSubCategories,
      objectSubCategoriesByKey,
      objects
    ]
  );

  const defaultValue = useMemo(() => {
    const newItem = getNewItem(itemsByKey);

    newItem.id = Math.max(...items.map((otherItem) => otherItem.id)) + 1;

    const defaultItemCategoryKey = query.get('itemCategory') ?? selectedItemCategory;
    if (defaultItemCategoryKey && defaultItemCategoryKey !== 'ALL') {
      newItem.categoryKey = defaultItemCategoryKey;
    }

    newItem.maxStackSize = 100;

    return newItem;
  }, [itemsByKey, items, query, selectedItemCategory]);

  const [editData, setEditData] = useState<ItemType | undefined>(dataKey === 'new' ? defaultValue : item);

  useEffect(() => {
    setEditData(item);
  }, [item]);

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
    prefix: 'item',
    keys: useMemo(() => ['name'], []),
    fallbackName: 'Unknown Item',
    dataKeys
  });

  const debouncedTempData = useDebounce(tempData, 300);

  const validate = useCallback(
    (data: ItemType) => {
      if (!path) {
        return Promise.resolve(['File path not found']);
      }

      return validateItem(
        data,
        itemsByKey,
        itemCategoriesByKey,
        objectsByKey,
        skillsByKey,
        debouncedTempData.localization,
        debouncedTempData.localizationKeys,
        damagableObjectKeys,
        damagableObjectCategoryKeys,
        damagableObjectSubCategoryKeys,
        damagableCreatureKeys,
        damagableCreatureCategoryKeys,
        projectileItemKeys,
        projectileItemCategoryKeys,
        path
      );
    },
    [
      damagableCreatureCategoryKeys,
      damagableCreatureKeys,
      damagableObjectCategoryKeys,
      damagableObjectKeys,
      damagableObjectSubCategoryKeys,
      itemCategoriesByKey,
      itemsByKey,
      debouncedTempData,
      objectsByKey,
      path,
      projectileItemCategoryKeys,
      projectileItemKeys,
      skillsByKey
    ]
  );

  const weaponType = useMemo(
    () => getItemSetting('weaponType', editData, itemCategoriesByKey),
    [editData, itemCategoriesByKey]
  ).value;
  const watersGround = useMemo(
    () => getItemSetting('watersGround', editData, itemCategoriesByKey),
    [editData, itemCategoriesByKey]
  ).value;
  const createsFarmland = useMemo(
    () => getItemSetting('createsFarmland', editData, itemCategoriesByKey),
    [editData, itemCategoriesByKey]
  ).value;

  const debouncedEditData = useDebounce(editData, 500);

  const getGeneralTabErrors = useCallback(
    (data: ItemType) =>
      validateItemGeneralTab(
        data,
        itemsByKey,
        itemCategoriesByKey,
        objectsByKey,
        debouncedTempData.localization,
        debouncedTempData.localizationKeys,
        path
      ),
    [itemCategoriesByKey, itemsByKey, debouncedTempData, objectsByKey, path]
  );

  const getFishingTabErrors = useCallback(
    (data: ItemType) => validateItemFishingTab(data, itemCategoriesByKey),
    [itemCategoriesByKey]
  );

  const getCombatTabErrors = useCallback(
    (data: ItemType) =>
      validateItemCombatTab(
        data,
        itemCategoriesByKey,
        skillsByKey,
        damagableObjectKeys,
        damagableObjectCategoryKeys,
        damagableObjectSubCategoryKeys,
        damagableCreatureKeys,
        damagableCreatureCategoryKeys,
        projectileItemKeys,
        projectileItemCategoryKeys
      ),
    [
      damagableCreatureCategoryKeys,
      damagableCreatureKeys,
      damagableObjectCategoryKeys,
      damagableObjectKeys,
      damagableObjectSubCategoryKeys,
      itemCategoriesByKey,
      projectileItemCategoryKeys,
      projectileItemKeys,
      skillsByKey
    ]
  );

  const onSave = useCallback(
    (dataSaved: ItemType[], newItem: ItemType | undefined) => {
      dispatch(updateItems(dataSaved));

      if (newItem) {
        saveLocalizations();
      } else {
        deleteLocalizations();
      }
    },
    [deleteLocalizations, dispatch, saveLocalizations]
  );

  const onDataChange = useCallback(
    (data: ItemType | undefined) => {
      setEditData(data);
    },
    [setEditData]
  );

  const getFileData = useCallback(
    () => ({
      categories,
      items
    }),
    [categories, items]
  );

  return (
    <DataViewer
      dataKey={dataKey}
      valueDataKey={editData?.key}
      section="item"
      file={ITEMS_DATA_FILE}
      fileSection="items"
      value={item}
      defaultValue={defaultValue}
      getFileData={getFileData}
      getName={getLocalizedName}
      validate={validate}
      onSave={onSave}
      onDataChange={onDataChange}
      dirty={isLocalizationDirty}
    >
      {({ data, handleOnChange, disabled }) => (
        <>
          <Tabs
            data={debouncedEditData}
            dataKey={dataKey}
            section="item"
            ariaLabel="item type tabs"
            onChange={(newTab) => setTab(newTab)}
          >
            {{
              label: 'General',
              validate: getGeneralTabErrors
            }}
            {{
              label: 'Damage / Combat',
              validate: getCombatTabErrors
            }}
            {{
              label: 'Fishing',
              validate: getFishingTabErrors
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
                        onChange={(value) => handleOnChange({ id: value })}
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
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', marginTop: 2 }}>
                    <FormBox>
                      <NumberTextField
                        label="Max Stack Size"
                        value={data.maxStackSize}
                        onChange={(value) => handleOnChange({ maxStackSize: value })}
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
                  </Box>
                </Card>
                <OverriddenItemPropertyCard
                  title="Placement"
                  type={data}
                  setting="placeable"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        placeable: overridden ? false : undefined
                      }
                    })
                  }
                  disabled={disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <Checkbox
                        label="Placeable"
                        checked={value}
                        helperText={helperText}
                        onChange={
                          controlled
                            ? undefined
                            : (newValue) =>
                                handleOnChange({
                                  settings: {
                                    ...data.settings,
                                    placeable: newValue
                                  }
                                })
                        }
                        disabled={disabled || controlled}
                      />
                    ),
                    other: (placeable) =>
                      placeable ? (
                        <FormBox key="lootTableKey">
                          <Select
                            label="Object to place"
                            required
                            disabled={disabled}
                            value={data.objectTypeKey}
                            onChange={(value) => handleOnChange({ objectTypeKey: value })}
                            options={filteredObjects?.map((entry) => ({
                              label: entry.name,
                              value: entry.key
                            }))}
                          />
                        </FormBox>
                      ) : null
                  }}
                </OverriddenItemPropertyCard>
                <OverriddenItemPropertyCard
                  title="Durability"
                  type={data}
                  setting="hasDurability"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        hasDurability: overridden ? false : undefined
                      }
                    })
                  }
                  disabled={disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <Checkbox
                        label="Has Durability"
                        checked={value}
                        helperText={helperText}
                        onChange={
                          controlled
                            ? undefined
                            : (newValue) =>
                                handleOnChange({
                                  settings: {
                                    ...data.settings,
                                    hasDurability: newValue
                                  }
                                })
                        }
                        disabled={disabled || controlled}
                      />
                    ),
                    other: (placeable) =>
                      placeable ? (
                        <FormBox key="durability">
                          <NumberTextField
                            label="Durability"
                            value={data.durability}
                            min={1}
                            onChange={(value) => handleOnChange({ durability: value })}
                            required
                            disabled={disabled}
                            wholeNumber
                          />
                        </FormBox>
                      ) : null
                  }}
                </OverriddenItemPropertyCard>

                <OverriddenItemPropertyCard
                  title="Light"
                  type={data}
                  setting="hasLight"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        hasLight: overridden ? false : undefined
                      }
                    })
                  }
                  disabled={disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <Checkbox
                        sx={{ width: '100%' }}
                        label="Has Light"
                        checked={value}
                        helperText={helperText}
                        onChange={
                          controlled
                            ? undefined
                            : (newValue) =>
                                handleOnChange({
                                  settings: {
                                    ...data.settings,
                                    hasLight: newValue
                                  }
                                })
                        }
                        disabled={disabled || controlled}
                      />
                    ),
                    other: (settingValue) =>
                      settingValue ? (
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
                              max={{
                                x: ICON_WIDTH,
                                y: ICON_HEIGHT
                              }}
                              onChange={(value) => handleOnChange({ lightPosition: value })}
                            />
                          </Box>
                        </Box>
                      ) : null
                  }}
                </OverriddenItemPropertyCard>
              </Box>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                  <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                    <Card header="Category">
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)' }}>
                        <FormBox>
                          <Select
                            label="Category"
                            required
                            disabled={disabled}
                            value={data.categoryKey}
                            onChange={(value) => handleOnChange({ categoryKey: value })}
                            options={categories?.map((entry) => ({
                              label: toTitleCaseFromKey(entry.key),
                              value: entry.key
                            }))}
                          />
                        </FormBox>
                      </Box>
                    </Card>
                    <Card header="Economy">
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)' }}>
                        <FormBox>
                          <NumberTextField
                            label="Sell Price"
                            helperText="Gold"
                            value={data.sellPrice ?? ''}
                            onChange={(value) => handleOnChange({ sellPrice: value })}
                            required
                            error={data.sellPrice <= 0}
                            disabled={disabled}
                            wholeNumber
                          />
                        </FormBox>
                      </Box>
                    </Card>
                    <Card header="Farming">
                      <OverriddenItemPropertyCard
                        type={data}
                        setting="createsFarmland"
                        layout="inline"
                        onOverrideChange={(overridden) =>
                          handleOnChange({
                            settings: {
                              ...data.settings,
                              createsFarmland: overridden ? false : undefined
                            }
                          })
                        }
                        disabled={disabled}
                      >
                        {{
                          control: (controlled, value, helperText) => (
                            <Checkbox
                              sx={{ width: '100%' }}
                              label="Creates Farmland"
                              checked={value}
                              helperText={helperText}
                              onChange={
                                controlled
                                  ? undefined
                                  : (newValue) =>
                                      handleOnChange({
                                        settings: {
                                          ...data.settings,
                                          createsFarmland: newValue
                                        }
                                      })
                              }
                              disabled={disabled || controlled}
                            />
                          )
                        }}
                      </OverriddenItemPropertyCard>
                      <OverriddenItemPropertyCard
                        type={data}
                        setting="destroysFarmland"
                        layout="inline"
                        onOverrideChange={(overridden) =>
                          handleOnChange({
                            settings: {
                              ...data.settings,
                              destroysFarmland: overridden ? false : undefined
                            }
                          })
                        }
                        disabled={disabled}
                      >
                        {{
                          control: (controlled, value, helperText) => (
                            <Checkbox
                              sx={{ width: '100%' }}
                              label="Destroys Farmland"
                              checked={value}
                              helperText={helperText}
                              onChange={
                                controlled
                                  ? undefined
                                  : (newValue) =>
                                      handleOnChange({
                                        settings: {
                                          ...data.settings,
                                          destroysFarmland: newValue
                                        }
                                      })
                              }
                              disabled={disabled || controlled}
                            />
                          )
                        }}
                      </OverriddenItemPropertyCard>
                      <OverriddenItemPropertyCard
                        type={data}
                        setting="watersGround"
                        layout="inline"
                        onOverrideChange={(overridden) =>
                          handleOnChange({
                            settings: {
                              ...data.settings,
                              watersGround: overridden ? false : undefined
                            }
                          })
                        }
                        disabled={disabled}
                      >
                        {{
                          control: (controlled, value, helperText) => (
                            <Checkbox
                              sx={{ width: '100%' }}
                              label="Waters Ground"
                              checked={value}
                              helperText={helperText}
                              onChange={
                                controlled
                                  ? undefined
                                  : (newValue) =>
                                      handleOnChange({
                                        settings: {
                                          ...data.settings,
                                          watersGround: newValue
                                        }
                                      })
                              }
                              disabled={disabled || controlled}
                            />
                          )
                        }}
                      </OverriddenItemPropertyCard>
                    </Card>
                  </Box>
                  <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                    <Card header="Icon">
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
                          dataKey={data.key}
                          width={16}
                          height={16}
                          sprite={0}
                          type="item"
                          targetSize={ITEM_SPRITE_TARGET_SIZE}
                          errorMessage="Icon not found"
                        />
                      </Box>
                    </Card>
                    {(isNotNullish(weaponType) && weaponType !== WEAPON_TYPE_NONE) ||
                    watersGround ||
                    createsFarmland ? (
                      <Card header="Animation">
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)' }}>
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
                        </Box>
                      </Card>
                    ) : null}
                    <OverriddenItemPropertyCard
                      title="Food"
                      type={data}
                      setting="isEdible"
                      onOverrideChange={(overridden) =>
                        handleOnChange({
                          settings: {
                            ...data.settings,
                            isEdible: overridden ? false : undefined
                          }
                        })
                      }
                      disabled={disabled}
                      wrapperSx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%'
                      }}
                    >
                      {{
                        control: (controlled, value, helperText) => (
                          <Checkbox
                            label="Is Edible"
                            checked={value}
                            helperText={helperText}
                            onChange={
                              controlled
                                ? undefined
                                : (newValue) =>
                                    handleOnChange({
                                      settings: {
                                        ...data.settings,
                                        isEdible: newValue
                                      }
                                    })
                            }
                            disabled={disabled || controlled}
                          />
                        ),
                        other: (isEdible) =>
                          isEdible ? (
                            <>
                              <FormBox key="hungerIncrease">
                                <NumberTextField
                                  label="Hunger Increase"
                                  value={data.hungerIncrease}
                                  min={1}
                                  onChange={(value) => handleOnChange({ hungerIncrease: value })}
                                  required
                                  disabled={disabled}
                                  wholeNumber
                                />
                              </FormBox>
                              <FormBox key="thirstIncrease">
                                <NumberTextField
                                  label="Thirst Increase"
                                  value={data.thirstIncrease}
                                  min={1}
                                  onChange={(value) => handleOnChange({ thirstIncrease: value })}
                                  required
                                  disabled={disabled}
                                  wholeNumber
                                />
                              </FormBox>
                              <FormBox key="energyIncrease">
                                <NumberTextField
                                  label="Energy Increase"
                                  value={data.energyIncrease}
                                  min={1}
                                  onChange={(value) => handleOnChange({ energyIncrease: value })}
                                  required
                                  disabled={disabled}
                                  wholeNumber
                                />
                              </FormBox>
                              <FormBox key="edibleLeftoverItem">
                                <ItemSelect
                                  label="Edible leftover item"
                                  disabled={disabled}
                                  value={data.edibleLeftoverItemTypeKey}
                                  valueGetter={(entry) => entry.key}
                                  onChange={(value) => handleOnChange({ edibleLeftoverItemTypeKey: value })}
                                />
                              </FormBox>
                            </>
                          ) : null
                      }}
                    </OverriddenItemPropertyCard>
                    <OverriddenItemPropertyCard
                      title="Water"
                      type={data}
                      setting="filledFromType"
                      onOverrideChange={(overridden) =>
                        handleOnChange({
                          settings: {
                            ...data.settings,
                            filledFromType: overridden ? FILLED_FROM_TYPE_NONE : undefined
                          }
                        })
                      }
                      disabled={disabled}
                      wrapperSx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%'
                      }}
                    >
                      {{
                        control: (controlled, value, helperText) => (
                          <Select
                            label="Filled From Type"
                            required
                            disabled={disabled}
                            value={value}
                            onChange={
                              controlled
                                ? undefined
                                : (newValue) =>
                                    handleOnChange({
                                      settings: {
                                        ...data.settings,
                                        filledFromType: toFilledFromType(newValue)
                                      }
                                    })
                            }
                            options={[
                              {
                                label: 'None',
                                value: FILLED_FROM_TYPE_NONE,
                                emphasize: true
                              },
                              {
                                label: 'Water',
                                value: FILLED_FROM_TYPE_WATER
                              },
                              {
                                label: 'Sand',
                                value: FILLED_FROM_TYPE_SAND
                              }
                            ]}
                            helperText={helperText}
                          />
                        ),
                        other: (filledFromType) => {
                          if (filledFromType === FILLED_FROM_TYPE_WATER) {
                            return (
                              <>
                                <FormBox key="hungerIncrease">
                                  <NumberTextField
                                    label="Water Amount"
                                    value={data.filledLevel}
                                    min={1}
                                    onChange={(value) => handleOnChange({ filledLevel: value })}
                                    required
                                    disabled={disabled}
                                    wholeNumber
                                    error={!data.filledItemTypeKey && data.filledLevel === 0}
                                  />
                                </FormBox>
                                <FormBox key="filledWaterItemTypeKey">
                                  <ItemSelect
                                    label="Filled water item"
                                    required
                                    disabled={disabled}
                                    value={data.filledItemTypeKey}
                                    valueGetter={(entry) => entry.key}
                                    onChange={(value) => handleOnChange({ filledItemTypeKey: value })}
                                  />
                                </FormBox>
                              </>
                            );
                          }

                          if (filledFromType === FILLED_FROM_TYPE_SAND) {
                            return (
                              <FormBox key="filledSandItemTypeKey">
                                <ItemSelect
                                  label="Filled sand item"
                                  required
                                  disabled={disabled}
                                  value={data.filledItemTypeKey}
                                  valueGetter={(entry) => entry.key}
                                  onChange={(value) => handleOnChange({ filledItemTypeKey: value })}
                                />
                              </FormBox>
                            );
                          }

                          return null;
                        }
                      }}
                    </OverriddenItemPropertyCard>
                  </Box>
                </Box>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <ItemViewCombatTab data={data} disabled={disabled} handleOnChange={handleOnChange} />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <ItemViewFishingTab data={data} disabled={disabled} handleOnChange={handleOnChange} />
          </TabPanel>
        </>
      )}
    </DataViewer>
  );
};

export default ItemView;
