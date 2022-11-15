import Box from '@mui/material/Box';
import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  FILLED_FROM_TYPE_NONE,
  FILLED_FROM_TYPE_SAND,
  FILLED_FROM_TYPE_WATER,
  FISHING_ITEM_TYPE_FISH,
  FISHING_ITEM_TYPE_LURE,
  FISHING_ITEM_TYPE_NONE,
  FISHING_ITEM_TYPE_POLE,
  ITEMS_DATA_FILE,
  WEAPON_TYPE_NONE
} from '../../../../../../../SharedLibrary/src/constants';
import { getDamagableData, getProjectileData } from '../../../../../../../SharedLibrary/src/util/combat.util';
import { toFilledFromType, toFishingItemType } from '../../../../../../../SharedLibrary/src/util/converters.util';
import { toTitleCaseFromKey } from '../../../../../../../SharedLibrary/src/util/string.util';
import { useAppDispatch, useAppSelector, useDebounce } from '../../../../hooks';
import {
  selectCreatureCategories,
  selectCreatureCategoriesByKey,
  selectCreatureTypes
} from '../../../../store/slices/creatures';
import {
  selectItemCategories,
  selectItemCategoriesByKey,
  selectItemCategory,
  selectItemErrors,
  selectItemTypesByCategory,
  selectItemTypesSortedWithName,
  updateItemCategories
} from '../../../../store/slices/items';
import {
  selectObjectCategories,
  selectObjectCategoriesByKey,
  selectObjectSubCategories,
  selectObjectSubCategoriesByKey,
  selectObjectTypes
} from '../../../../store/slices/objects';
import { selectSkillsByKey } from '../../../../store/slices/skills';
import { getNewItemCategory } from '../../../../util/section.util';
import {
  validateItemCategory,
  validateItemCategoryCombatTab,
  validateItemCategoryGeneralTab
} from '../../../../util/validate.util';
import Checkbox from '../../../widgets/form/Checkbox';
import Select from '../../../widgets/form/Select';
import TextField from '../../../widgets/form/TextField';
import Card from '../../../widgets/layout/Card';
import FormBox from '../../../widgets/layout/FormBox';
import TabPanel from '../../../widgets/TabPanel';
import Tabs from '../../../widgets/tabs/Tabs';
import DataViewer from '../../DataViewer';
import DataViewList from '../../DataViewList';
import ItemCategoryViewCombatTab from './itemCategoryView/ItemCategoryViewCombatTab';

import type { ItemCategory } from '../../../../../../../SharedLibrary/src/interface';
import type { DataViewListItem } from '../../DataViewList';

const ItemCategoryView = () => {
  const { dataKey = '' } = useParams();

  const dispatch = useAppDispatch();

  const [tab, setTab] = useState(0);

  const category = useAppSelector(useMemo(() => selectItemCategory(dataKey), [dataKey]));
  const itemCategoriesByKey = useAppSelector(selectItemCategoriesByKey);

  const defaultValue = useMemo(() => {
    const newItemCategory = getNewItemCategory(itemCategoriesByKey);

    newItemCategory.settings = {
      filledFromType: FILLED_FROM_TYPE_NONE,
      weaponType: WEAPON_TYPE_NONE,
      fishingItemType: FISHING_ITEM_TYPE_NONE
    };

    return newItemCategory;
  }, [itemCategoriesByKey]);

  const [editData, setEditData] = useState<ItemCategory | undefined>(dataKey === 'new' ? defaultValue : category);

  const objectCategoriesByKey = useAppSelector(selectObjectCategoriesByKey);
  const objectSubCategoriesByKey = useAppSelector(selectObjectSubCategoriesByKey);

  const categories = useAppSelector(selectItemCategories);
  const items = useAppSelector(selectItemTypesSortedWithName);

  const objectCategories = useAppSelector(selectObjectCategories);
  const objectSubCategories = useAppSelector(selectObjectSubCategories);
  const objects = useAppSelector(selectObjectTypes);

  const creatureCategories = useAppSelector(selectCreatureCategories);
  const creatureCategoriesByKey = useAppSelector(selectCreatureCategoriesByKey);
  const creatures = useAppSelector(selectCreatureTypes);

  const skillsByKey = useAppSelector(selectSkillsByKey);

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

  const validate = useCallback(
    (data: ItemCategory) =>
      validateItemCategory(
        data,
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
      projectileItemCategoryKeys,
      projectileItemKeys,
      skillsByKey
    ]
  );

  const debouncedEditData = useDebounce(editData, 500);

  const getGeneralTabErrors = useCallback((data: ItemCategory) => validateItemCategoryGeneralTab(data), []);

  const getCombatTabErrors = useCallback(
    (data: ItemCategory) =>
      validateItemCategoryCombatTab(
        data,
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
      projectileItemCategoryKeys,
      projectileItemKeys,
      skillsByKey
    ]
  );

  const itemErrors = useAppSelector(selectItemErrors);
  const filteredItems = useAppSelector(useMemo(() => selectItemTypesByCategory(dataKey), [dataKey]));
  const itemListItems: DataViewListItem[] = useMemo(
    () =>
      filteredItems.map((item) => {
        return {
          dataKey: item.key,
          name: item.name ?? item.key,
          sprite: {
            width: 16,
            height: 16,
            default: 0
          },
          errors: itemErrors[item.key]
        };
      }),
    [filteredItems, itemErrors]
  );

  const onSave = useCallback((dataSaved: ItemCategory[]) => dispatch(updateItemCategories(dataSaved)), [dispatch]);

  const onDataChange = useCallback((data: ItemCategory | undefined) => setEditData(data), []);

  const getName = useCallback((data: ItemCategory) => toTitleCaseFromKey(data.key), []);

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
      section="item-category"
      file={ITEMS_DATA_FILE}
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
            section="item-category"
            ariaLabel="item category tabs"
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
          </Tabs>
          <TabPanel value={tab} index={0}>
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
                        error={!data.key}
                        disabled={disabled}
                      />
                    </FormBox>
                  </Box>
                </Card>
                <Card header="Placement">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <FormBox>
                      <Checkbox
                        label="Is Placeable"
                        checked={Boolean(data.settings?.placeable)}
                        onChange={(value) =>
                          handleOnChange({
                            settings: {
                              ...data.settings,
                              placeable: value
                            }
                          })
                        }
                        disabled={disabled}
                      />
                    </FormBox>
                    {data.settings?.placeable ? (
                      <FormBox key="required-object-category">
                        <Select
                          label="Required Object Category"
                          disabled={disabled}
                          value={data.settings?.requiredObjectCategoryKey}
                          onChange={(value) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                requiredObjectCategoryKey: value
                              }
                            })
                          }
                          options={objectCategories?.map((entry) => ({
                            label: toTitleCaseFromKey(entry.key),
                            value: entry.key
                          }))}
                        />
                      </FormBox>
                    ) : null}
                  </Box>
                </Card>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                  <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                    <Card header="Farming">
                      <FormBox sx={{ pb: 0, mb: 0 }}>
                        <Checkbox
                          label="Creates Farmland"
                          checked={Boolean(data.settings?.createsFarmland)}
                          onChange={(value) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                createsFarmland: value
                              }
                            })
                          }
                          disabled={disabled}
                        />
                      </FormBox>
                      <FormBox sx={{ pb: 0, mb: 0 }}>
                        <Checkbox
                          label="Destroys Farmland"
                          checked={Boolean(data.settings?.destroysFarmland)}
                          onChange={(value) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                destroysFarmland: value
                              }
                            })
                          }
                          disabled={disabled}
                        />
                      </FormBox>
                      <FormBox sx={{ pb: 0, mb: 0 }}>
                        <Checkbox
                          label="Waters Ground"
                          checked={Boolean(data.settings?.watersGround)}
                          onChange={(value) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                watersGround: value
                              }
                            })
                          }
                          disabled={disabled}
                        />
                      </FormBox>
                    </Card>
                  </Box>
                  <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                    <Card header="Durability">
                      <FormBox sx={{ pb: 0, mb: 0 }}>
                        <Checkbox
                          label="Has Durability"
                          checked={Boolean(data.settings?.hasDurability)}
                          onChange={(value) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                hasDurability: value
                              }
                            })
                          }
                          disabled={disabled}
                        />
                      </FormBox>
                    </Card>
                    <Card header="Edible">
                      <FormBox sx={{ pb: 0, mb: 0 }}>
                        <Checkbox
                          label="Is Edible"
                          checked={Boolean(data.settings?.isEdible)}
                          onChange={(value) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                isEdible: value
                              }
                            })
                          }
                          disabled={disabled}
                        />
                      </FormBox>
                    </Card>
                  </Box>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                  <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                    <Card header="Fillable">
                      <FormBox sx={{ pb: 0, mb: 0 }}>
                        <Select
                          label="Filled From Type"
                          required
                          disabled={disabled}
                          value={data.settings?.filledFromType}
                          onChange={(value) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                filledFromType: toFilledFromType(value)
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
                        />
                      </FormBox>
                    </Card>
                    <Card header="Light">
                      <FormBox sx={{ pb: 0, mb: 0 }}>
                        <Checkbox
                          label="Has Light"
                          checked={Boolean(data.settings?.hasLight)}
                          onChange={(value) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                hasLight: value
                              }
                            })
                          }
                          disabled={disabled}
                        />
                      </FormBox>
                    </Card>
                    <Card header="Fishing">
                      <FormBox sx={{ pb: 0, mb: 0 }}>
                        <Select
                          label="Fishing Item Type"
                          required
                          disabled={disabled}
                          value={data.settings?.fishingItemType}
                          onChange={(value) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                fishingItemType: toFishingItemType(value)
                              }
                            })
                          }
                          options={[
                            {
                              label: 'None',
                              value: FISHING_ITEM_TYPE_NONE,
                              emphasize: true
                            },
                            {
                              label: 'Pole',
                              value: FISHING_ITEM_TYPE_POLE
                            },
                            {
                              label: 'Lure',
                              value: FISHING_ITEM_TYPE_LURE
                            },
                            {
                              label: 'Fish',
                              value: FISHING_ITEM_TYPE_FISH
                            }
                          ]}
                        />
                      </FormBox>
                    </Card>
                  </Box>
                  <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                    <Card
                      header="Items"
                      footer={
                        <DataViewList
                          section="item"
                          items={itemListItems}
                          type="card"
                          search={`?itemCategory=${dataKey}&tab=0`}
                        />
                      }
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <ItemCategoryViewCombatTab data={data} disabled={disabled} handleOnChange={handleOnChange} />
          </TabPanel>
        </>
      )}
    </DataViewer>
  );
};

export default ItemCategoryView;
