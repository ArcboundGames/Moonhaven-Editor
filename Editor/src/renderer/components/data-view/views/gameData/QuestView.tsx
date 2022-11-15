import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { QUESTS_DATA_FILE } from '../../../../../../../SharedLibrary/src/constants';
import {
  validateQuest,
  validateQuestGeneralTab,
  validateQuestRewardsTab,
  validateQuestTasksTab
} from '../../../../../../../SharedLibrary/src/dataValidation';
import { useAppDispatch, useAppSelector, useDebounce } from '../../../../hooks';
import { selectCraftingRecipesByKey } from '../../../../store/slices/craftingRecipes';
import { selectCreaturesByKeyWithName } from '../../../../store/slices/creatures';
import { selectDialogueTreesByKey } from '../../../../store/slices/dialogue';
import { selectEventLogsByKey } from '../../../../store/slices/eventLogs';
import { selectItemTypesByKeyWithName } from '../../../../store/slices/items';
import { selectQuestByKey, selectQuests, updateQuests } from '../../../../store/slices/quests';
import { useUpdateLocalization } from '../../../hooks/useUpdateLocalization.hook';
import TabPanel from '../../../widgets/TabPanel';
import Tabs from '../../../widgets/tabs/Tabs';
import DataViewer from '../../DataViewer';
import QuestGeneralTab from './quest/QuestGeneralTab';
import QuestRewardsTab from './quest/QuestRewardsTab';
import QuestTasksTab from './quest/QuestTasksTab';

import type { Quest } from '../../../../../../../SharedLibrary/src/interface';

const QuestView = () => {
  const { dataKey = '' } = useParams();

  const dispatch = useAppDispatch();

  const [tab, setTab] = useState(0);

  const quest = useAppSelector(useMemo(() => selectQuestByKey(dataKey), [dataKey]));
  const quests = useAppSelector(selectQuests);

  const itemsByKey = useAppSelector(selectItemTypesByKeyWithName);
  const creaturesByKey = useAppSelector(selectCreaturesByKeyWithName);
  const dialogueTreesByKey = useAppSelector(selectDialogueTreesByKey);
  const craftingRecipesByKey = useAppSelector(selectCraftingRecipesByKey);
  const eventLogsByKey = useAppSelector(selectEventLogsByKey);

  const defaultValue: Quest = useMemo(
    () => ({
      id: Math.max(0, ...quests.map((otherQuest) => otherQuest.id)) + 1,
      key: 'NEW_QUEST',
      tasks: [],
      experienceReward: 0,
      itemRewards: {},
      prerequisiteEventKeys: []
    }),
    [quests]
  );

  const [editData, setEditData] = useState<Quest | undefined>(dataKey === 'new' ? defaultValue : quest);
  const debouncedEditData = useDebounce(editData, 500);

  const dataKeys = useMemo(
    () => ({
      current: editData?.key ?? dataKey,
      route: dataKey
    }),
    [dataKey, editData?.key]
  );

  const localizationKeys = useMemo(() => ['name', 'text'], []);

  const {
    saveLocalizations,
    getLocalizedValue,
    tempData,
    updateLocalizedValue,
    deleteLocalizations,
    getLocalizedName,
    isLocalizationDirty
  } = useUpdateLocalization({
    prefix: 'quest',
    keys: localizationKeys,
    fallbackName: 'Unknown Quest',
    dataKeys
  });

  const debouncedTempData = useDebounce(tempData, 300);

  const getGeneralTabErrors = useCallback(
    (data: Quest) =>
      validateQuestGeneralTab(
        data,
        creaturesByKey,
        dialogueTreesByKey,
        eventLogsByKey,
        debouncedTempData.localization,
        debouncedTempData.localizationKeys,
        []
      ),
    [
      creaturesByKey,
      debouncedTempData.localization,
      debouncedTempData.localizationKeys,
      dialogueTreesByKey,
      eventLogsByKey
    ]
  );

  const getTasksTabErrors = useCallback(
    (data: Quest) => validateQuestTasksTab(data, itemsByKey, craftingRecipesByKey, creaturesByKey, dialogueTreesByKey),
    [craftingRecipesByKey, creaturesByKey, dialogueTreesByKey, itemsByKey]
  );

  const getRewardsTabErrors = useCallback((data: Quest) => validateQuestRewardsTab(data, itemsByKey), [itemsByKey]);

  const validate = useCallback(
    (data: Quest) => {
      return validateQuest(
        data,
        itemsByKey,
        craftingRecipesByKey,
        creaturesByKey,
        dialogueTreesByKey,
        eventLogsByKey,
        debouncedTempData.localization,
        debouncedTempData.localizationKeys,
        []
      );
    },
    [
      craftingRecipesByKey,
      creaturesByKey,
      debouncedTempData.localization,
      debouncedTempData.localizationKeys,
      dialogueTreesByKey,
      eventLogsByKey,
      itemsByKey
    ]
  );

  const onSave = useCallback(
    (dataSaved: Quest[], newQuest: Quest | undefined) => {
      dispatch(updateQuests(dataSaved));

      if (newQuest) {
        saveLocalizations();
      } else {
        deleteLocalizations();
      }
    },
    [deleteLocalizations, dispatch, saveLocalizations]
  );

  const onDataChange = useCallback((data: Quest | undefined) => setEditData(data), []);

  const getFileData = useCallback(
    () => ({
      quests
    }),
    [quests]
  );

  return (
    <DataViewer
      dataKey={dataKey}
      valueDataKey={editData?.key}
      section="quest"
      file={QUESTS_DATA_FILE}
      fileSection="quests"
      value={quest}
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
            section="quest"
            ariaLabel="quest tabs"
            onChange={(newTab) => setTab(newTab)}
          >
            {{
              label: 'General',
              validate: getGeneralTabErrors
            }}
            {{
              label: 'Tasks',
              validate: getTasksTabErrors
            }}
            {{
              label: 'Rewards',
              validate: getRewardsTabErrors
            }}
          </Tabs>
          <TabPanel value={tab} index={0}>
            <QuestGeneralTab
              data={data}
              disabled={disabled}
              handleOnChange={handleOnChange}
              getLocalizedValue={getLocalizedValue}
              updateLocalizedValue={updateLocalizedValue}
            />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <QuestTasksTab data={data} disabled={disabled} handleOnChange={handleOnChange} />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <QuestRewardsTab data={data} disabled={disabled} handleOnChange={handleOnChange} />
          </TabPanel>
        </>
      )}
    </DataViewer>
  );
};

export default QuestView;
