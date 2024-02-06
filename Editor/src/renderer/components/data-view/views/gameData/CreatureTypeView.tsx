import RepeatIcon from '@mui/icons-material/Repeat';
import Box from '@mui/material/Box';
import MuiCard from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { CREATURES_DATA_FILE, DAYS_IN_A_WEEK } from '../../../../../../../SharedLibrary/src/constants';
import {
  checkCreatureConnections,
  validateCreatureShopTab,
  validateCreatureSpawningTab,
  validatePhysicsTab
} from '../../../../../../../SharedLibrary/src/dataValidation';
import { createCreatureSprites } from '../../../../../../../SharedLibrary/src/util/converters.util';
import { getCreatureSetting } from '../../../../../../../SharedLibrary/src/util/creatureType.util';
import { getEnglishLocalization } from '../../../../../../../SharedLibrary/src/util/localization.util';
import { isNotNullish } from '../../../../../../../SharedLibrary/src/util/null.util';
import { toTitleCaseFromKey } from '../../../../../../../SharedLibrary/src/util/string.util';
import { useAppDispatch, useAppSelector, useDebounce, useQuery } from '../../../../hooks';
import {
  selectCreatureCategories,
  selectCreatureCategoriesByKey,
  selectCreatureType,
  selectCreatureTypes,
  selectCreatureTypesByKey,
  selectSelectedCreatureCategory,
  updateCreatures
} from '../../../../store/slices/creatures';
import { selectPath } from '../../../../store/slices/data';
import { selectDialogueTreesByCreature } from '../../../../store/slices/dialogue';
import { selectEventLogsByKey } from '../../../../store/slices/eventLogs';
import { selectItemTypesByKeyWithName } from '../../../../store/slices/items';
import { selectLocalizationKeys, selectLocalizations } from '../../../../store/slices/localizations';
import { selectLootTables, selectLootTablesByKey } from '../../../../store/slices/lootTables';
import { getNewCreature } from '../../../../util/section.util';
import {
  validateCreature,
  validateCreatureBehaviorTab,
  validateCreatureGeneralTab,
  validateCreatureSpriteStageTab
} from '../../../../util/validate.util';
import useLocalization from '../../../hooks/useLocalization.hook';
import { useUpdateLocalization } from '../../../hooks/useUpdateLocalization.hook';
import DayBox from '../../../widgets/DayBox';
import Portrait from '../../../widgets/Portrait';
import TabPanel from '../../../widgets/TabPanel';
import TimesBox from '../../../widgets/TimesBox';
import NumberTextField from '../../../widgets/form/NumberTextField';
import Select from '../../../widgets/form/Select';
import TextField from '../../../widgets/form/TextField';
import Card from '../../../widgets/layout/Card';
import FormBox from '../../../widgets/layout/FormBox';
import Tabs from '../../../widgets/tabs/Tabs';
import DataViewer from '../../DataViewer';
import CreatureTypeBehaviorTab from './creatureTypeView/CreatureTypeBehaviorTab';
import CreatureTypeSpawningTab from './creatureTypeView/CreatureTypeSpawningTab';
import CreatureTypeSpriteTab from './creatureTypeView/CreatureTypeSpriteTab';
import CreatureTypeViewShopTab from './creatureTypeView/CreatureTypeViewShopTab';
import CollidersCard from './widgets/CollidersCard';
import { OverriddenCreaturePropertyCard } from './widgets/OverriddenPropertyCard';

import type { CreatureType } from '../../../../../../../SharedLibrary/src/interface';

const CreatureTypeView = () => {
  const { dataKey = '' } = useParams();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { getLocalizationKey, getLocalizedValue: getGlobalLocalizedValue } = useLocalization();

  const creatureType = useAppSelector(useMemo(() => selectCreatureType(dataKey), [dataKey]));

  const query = useQuery();

  const queryTab = Number(query.get('tab') ?? 0);
  const [tab, setTab] = useState(queryTab);
  useEffect(() => {
    if (!Number.isNaN(queryTab) && queryTab !== tab) {
      setTab(queryTab);
    }
  }, [queryTab, tab]);

  const [dataKeyChanged, setDataKeyChanged] = useState<boolean>(true);
  const categories = useAppSelector(selectCreatureCategories);
  const path = useAppSelector(selectPath);

  const allCreatures = useAppSelector(selectCreatureTypes);
  const creaturesByKey = useAppSelector(selectCreatureTypesByKey);
  const creatureCategoriesByKey = useAppSelector(selectCreatureCategoriesByKey);

  const itemsByKey = useAppSelector(selectItemTypesByKeyWithName);

  const lootTables = useAppSelector(selectLootTables);
  const lootTablesByKey = useAppSelector(selectLootTablesByKey);

  const selectedCreatureCategory = useAppSelector(selectSelectedCreatureCategory);

  const categoriesByKey = useAppSelector(selectCreatureCategoriesByKey);

  const eventLogsByKey = useAppSelector(selectEventLogsByKey);

  const localizationKeys = useAppSelector(selectLocalizationKeys);
  const localizations = useAppSelector(selectLocalizations);
  const { englishLocalization: localization } = useMemo(() => getEnglishLocalization(localizations), [localizations]);

  const queryCreatureCategory = query.get('creatureCategory');

  const defaultCreature = useMemo(() => {
    const newCreature = getNewCreature(creaturesByKey);

    newCreature.id = Math.max(...allCreatures.map((otherCreature) => otherCreature.id)) + 1;

    const creatureCategory = queryCreatureCategory ?? selectedCreatureCategory;
    if (creatureCategory && creatureCategory !== 'ALL') {
      newCreature.categoryKey = creatureCategory;
    }

    newCreature.sprite = {
      width: 32,
      height: 32,
      pivotOffset: {
        x: 0,
        y: 0
      }
    };

    return newCreature;
  }, [creaturesByKey, allCreatures, queryCreatureCategory, selectedCreatureCategory]);

  const [editData, setEditData] = useState<CreatureType | undefined>(
    dataKey === 'new' ? defaultCreature : creatureType
  );

  const dialogueTrees = useAppSelector(useMemo(() => selectDialogueTreesByCreature(editData?.key), [editData?.key]));
  const dialogueTreesSorted = useMemo(() => dialogueTrees.sort((a, b) => b.priority - a.priority), [dialogueTrees]);

  useEffect(() => {
    setDataKeyChanged(true);
  }, [dataKey]);

  useEffect(() => {
    setEditData(creatureType);
  }, [creatureType]);

  useEffect(() => {
    if (dataKey === editData?.key || dataKey === 'new') {
      setDataKeyChanged(false);
    }
  }, [dataKey, editData]);

  const debouncedEditData = useDebounce(editData, 500);

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
    prefix: 'creature',
    keys: useMemo(() => ['name'], []),
    fallbackName: 'Unknown Creature',
    dataKeys
  });

  const debouncedTempData = useDebounce(tempData, 300);

  const isShopkeeper = useMemo(
    () => getCreatureSetting('isShopkeeper', editData, categoriesByKey).value,
    [categoriesByKey, editData]
  );

  const hasDialogue = useMemo(
    () => getCreatureSetting('hasDialogue', editData, categoriesByKey).value,
    [categoriesByKey, editData]
  );

  const hasHealth = useMemo(
    () => getCreatureSetting('hasHealth', editData, categoriesByKey).value,
    [categoriesByKey, editData]
  );

  const movementType = useMemo(
    () => getCreatureSetting('movementType', editData, categoriesByKey).value,
    [categoriesByKey, editData]
  );

  const getGeneralTabErrors = useCallback(
    (data: CreatureType) => {
      return validateCreatureGeneralTab(
        data,
        categoriesByKey,
        lootTablesByKey,
        debouncedTempData.localization,
        debouncedTempData.localizationKeys,
        path
      );
    },
    [categoriesByKey, debouncedTempData, lootTablesByKey, path]
  );

  const getPhysicsTabErrors = useCallback((data: CreatureType) => validatePhysicsTab(data), []);

  const getSpriteStageTabErrors = useCallback(
    (data: CreatureType) => validateCreatureSpriteStageTab(data, path),
    [path]
  );

  const getShopTabErrors = useCallback(
    (data: CreatureType) =>
      validateCreatureShopTab(data, categoriesByKey, itemsByKey, eventLogsByKey, localization, localizationKeys),
    [categoriesByKey, itemsByKey, eventLogsByKey, localization, localizationKeys]
  );

  const getBehaviorTabErrorrs = useCallback(
    async (data: CreatureType) => {
      const errors = await validateCreatureBehaviorTab(data, creatureCategoriesByKey, path);
      errors.push(...checkCreatureConnections(data, creaturesByKey, creatureCategoriesByKey));
      return errors;
    },
    [creatureCategoriesByKey, path, creaturesByKey]
  );

  const getSpawningTabErrors = useCallback((data: CreatureType) => validateCreatureSpawningTab(data), []);

  const validate = useCallback(
    async (data: CreatureType) => {
      if (!path) {
        return ['File path not found'];
      }
      return validateCreature(
        data,
        creaturesByKey,
        categoriesByKey,
        itemsByKey,
        lootTablesByKey,
        eventLogsByKey,
        debouncedTempData.localization,
        debouncedTempData.localizationKeys,
        path
      );
    },
    [path, debouncedTempData, creaturesByKey, categoriesByKey, itemsByKey, lootTablesByKey, eventLogsByKey]
  );

  const onSave = useCallback(
    (dataSaved: CreatureType[], newCreature: CreatureType | undefined) => {
      dispatch(updateCreatures(dataSaved));

      if (newCreature) {
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
      creatures: allCreatures
    };
  }, [categories, allCreatures]);

  const onDataChange = useCallback((data: CreatureType | undefined) => setEditData(data), []);

  return (
    <DataViewer
      dataKey={dataKey}
      valueDataKey={editData?.key}
      section="creature"
      file={CREATURES_DATA_FILE}
      fileSection="creatures"
      value={creatureType}
      defaultValue={defaultCreature}
      getFileData={getFileData}
      getName={getLocalizedName}
      onDataChange={onDataChange}
      validate={validate}
      onSave={onSave}
      dirty={isLocalizationDirty}
    >
      {({ data, handleOnChange, disabled }) => (
        <>
          <Box
            sx={{
              position: 'sticky',
              top: -16,
              background: 'rgb(38, 38, 38)',
              zIndex: 100,
              ml: -1,
              mr: -1,
              pl: 1,
              pr: 1
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                data={debouncedEditData}
                dataKey={dataKey}
                section="creature"
                ariaLabel="creature type tabs"
                onChange={(newTab) => setTab(newTab)}
              >
                {{
                  label: 'General',
                  validate: getGeneralTabErrors
                }}
                {{
                  label: 'Sprites',
                  validate: getSpriteStageTabErrors
                }}
                {{
                  label: 'Physics',
                  validate: getPhysicsTabErrors
                }}
                {{
                  label: 'Dialogue',
                  disabled: hasDialogue !== true
                }}
                {{
                  label: 'Shop',
                  disabled: isShopkeeper !== true,
                  validate: getShopTabErrors
                }}
                {{
                  label: 'Behavior',
                  validate: getBehaviorTabErrorrs
                }}
                {{
                  label: 'Spawning',
                  validate: getSpawningTabErrors
                }}
              </Tabs>
            </Box>
          </Box>
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
                <OverriddenCreaturePropertyCard
                  title="Dialogue"
                  label="Has Dialogue"
                  type={data}
                  setting="hasDialogue"
                  onChange={handleOnChange}
                  disabled={disabled}
                  defaultValue={false}
                  variant="boolean"
                >
                  {{
                    other: (value) => (value ? <Portrait dataKey={data.key ?? dataKey} errorStyle="inline" /> : null)
                  }}
                </OverriddenCreaturePropertyCard>
                <OverriddenCreaturePropertyCard
                  title="Health"
                  label="Has Health"
                  type={data}
                  setting="hasHealth"
                  onChange={handleOnChange}
                  disabled={disabled}
                  defaultValue={false}
                  variant="boolean"
                >
                  {{
                    other: (hasHealthValue) =>
                      hasHealthValue ? (
                        <FormBox>
                          <NumberTextField
                            label="Health"
                            value={data.health}
                            min={1}
                            onChange={(value) =>
                              handleOnChange({
                                health: value
                              })
                            }
                            disabled={disabled}
                            wholeNumber
                          />
                        </FormBox>
                      ) : null
                  }}
                </OverriddenCreaturePropertyCard>
                <OverriddenCreaturePropertyCard
                  title="Combat"
                  label="Neutral"
                  type={data}
                  setting="neutral"
                  onChange={handleOnChange}
                  disabled={disabled}
                  defaultValue={false}
                  variant="boolean"
                />
              </Box>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                  <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                    <OverriddenCreaturePropertyCard
                      title="Shopkeeper"
                      label="Is Shopkeeper"
                      type={data}
                      setting="isShopkeeper"
                      onChange={handleOnChange}
                      disabled={disabled}
                      defaultValue={false}
                      variant="boolean"
                    />
                    <Card header="Loot">
                      <FormBox>
                        <Select
                          label="Loot Table"
                          disabled={disabled}
                          value={data.lootTableKey}
                          onChange={(value) => handleOnChange({ lootTableKey: value })}
                          options={lootTables?.map((entry) => ({
                            label: toTitleCaseFromKey(entry.key),
                            value: entry.key
                          }))}
                        />
                      </FormBox>
                    </Card>
                  </Box>
                  <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                    <Card header="Category">
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
                    </Card>
                    {hasHealth && isNotNullish(data.lootTableKey) ? (
                      <Card key="experience" header="Experience">
                        <FormBox>
                          <NumberTextField
                            label="Experience"
                            value={data.experience}
                            min={1}
                            onChange={(value) =>
                              handleOnChange({
                                experience: value
                              })
                            }
                            required
                            disabled={disabled}
                            wholeNumber
                          />
                        </FormBox>
                      </Card>
                    ) : null}
                  </Box>
                </Box>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <CreatureTypeSpriteTab
              dataKeyChanged={dataKeyChanged}
              data={data}
              disabled={disabled}
              handleOnChange={handleOnChange}
            />
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
                  onChange={(sprites) => {
                    handleOnChange({
                      sprite: {
                        ...(data.sprite ?? createCreatureSprites()),
                        sprites
                      }
                    });
                  }}
                />
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={3}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr' }}>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                {dialogueTreesSorted.map((dialogueTree) => {
                  const startingDialogueKey =
                    dialogueTree.dialogues.find((dialogue) => dialogue.id === dialogueTree.startingDialogueId)?.key ??
                    '';
                  return (
                    <MuiCard key={`dialogue-tree-${dialogueTree.id}`} sx={{ m: 1 }}>
                      <CardActionArea
                        onClick={() => {
                          if (location.pathname === `/dialogue-tree/${dialogueTree.key}`) {
                            return;
                          }
                          navigate(`/dialogue-tree/${dialogueTree.key}?dialogueCreature=${data.key}`);
                        }}
                      >
                        <CardContent
                          sx={{
                            display: 'grid',
                            gridTemplateColumns:
                              'minmax(0, 5fr) minmax(0, 7fr) minmax(0, 6fr) auto minmax(0, 2fr) auto',
                            alignItems: 'center'
                          }}
                        >
                          <Typography gutterBottom variant="h6" component="div" sx={{ m: 0, mr: 2 }}>
                            {toTitleCaseFromKey(dialogueTree.key)}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden'
                            }}
                          >
                            {getGlobalLocalizedValue(
                              getLocalizationKey(
                                'dialogue-tree',
                                `dialogue-${startingDialogueKey.toLowerCase()}-text`,
                                dialogueTree.key
                              )
                            )}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 2, mr: 2 }}>
                            <TimesBox
                              times={dialogueTree.conditions?.times}
                              timesComparator={dialogueTree.conditions?.timesComparator}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {[...Array(DAYS_IN_A_WEEK)].map((_, day) => (
                              <DayBox
                                key={`day-${day}`}
                                day={day}
                                active={dialogueTree.conditions?.days?.includes(day) === true}
                              />
                            ))}
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>{dialogueTree.priority}</Box>
                          <Box>
                            <RepeatIcon
                              titleAccess={dialogueTree.runOnlyOnce ? 'Runs only once' : 'Repeatable'}
                              sx={{ color: dialogueTree.runOnlyOnce ? '#343434' : 'white' }}
                            />
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </MuiCard>
                  );
                })}
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={4}>
            <CreatureTypeViewShopTab
              data={data}
              itemsByKey={itemsByKey}
              handleOnChange={handleOnChange}
              disabled={disabled}
            />
          </TabPanel>
          <TabPanel value={tab} index={5}>
            <CreatureTypeBehaviorTab
              data={data}
              movementType={movementType}
              handleOnChange={handleOnChange}
              disabled={disabled}
            />
          </TabPanel>
          <TabPanel value={tab} index={6}>
            <CreatureTypeSpawningTab data={data} handleOnChange={handleOnChange} disabled={disabled} />
          </TabPanel>
        </>
      )}
    </DataViewer>
  );
};

export default CreatureTypeView;
