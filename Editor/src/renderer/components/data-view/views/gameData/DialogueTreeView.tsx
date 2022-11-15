import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  DAYS_IN_A_WEEK,
  DAYS_OF_THE_WEEK,
  DIALOGUE_DATA_FILE,
  TIME_COMPARATOR_AFTER,
  TIME_COMPARATOR_BEFORE,
  TIME_COMPARATOR_BETWEEN
} from '../../../../../../../SharedLibrary/src/constants';
import {
  validateDialogueTreeConditionsTab,
  validateDialogueTreeDialogueTab,
  validateDialogueTreeGeneralTab
} from '../../../../../../../SharedLibrary/src/dataValidation';
import { toTitleCaseFromKey } from '../../../../../../../SharedLibrary/src/util/string.util';
import { useAppDispatch, useAppSelector, useDebounce, useQuery } from '../../../../hooks';
import { selectCreatureTypesByKey } from '../../../../store/slices/creatures';
import {
  selectDialogueTree,
  selectDialogueTrees,
  selectDialogueTreesByKey,
  selectSelectedDialogueCreature,
  updateDialogueTrees
} from '../../../../store/slices/dialogue';
import { selectEventLogsByKey } from '../../../../store/slices/eventLogs';
import { getNewDialogue, getNewDialogueTree } from '../../../../util/section.util';
import { validateDialogueTree } from '../../../../util/validate.util';
import { useUpdateLocalization } from '../../../hooks/useUpdateLocalization.hook';
import Checkbox from '../../../widgets/form/Checkbox';
import CreatureSelect from '../../../widgets/form/creature/CreatureSelect';
import EventAutocomplete from '../../../widgets/form/event/EventAutocomplete';
import NumberTextField from '../../../widgets/form/NumberTextField';
import Select from '../../../widgets/form/Select';
import TextField from '../../../widgets/form/TextField';
import Card from '../../../widgets/layout/Card';
import FormBox from '../../../widgets/layout/FormBox';
import TabPanel from '../../../widgets/TabPanel';
import Tabs from '../../../widgets/tabs/Tabs';
import TimeInput from '../../../widgets/TimeInput';
import DataViewer from '../../DataViewer';
import DialogueCard from './dialogueTreeView/DialogueCard';

import type { DialogueTree } from '../../../../../../../SharedLibrary/src/interface';

const DialogueTreeView = () => {
  const { dataKey = '' } = useParams();

  const dispatch = useAppDispatch();

  const dialogueTree = useAppSelector(useMemo(() => selectDialogueTree(dataKey), [dataKey]));

  const query = useQuery();

  const queryTab = Number(query.get('tab') ?? 0);
  const [tab, setTab] = useState(queryTab);
  useEffect(() => {
    if (!Number.isNaN(queryTab) && queryTab !== tab) {
      setTab(queryTab);
    }
  }, [queryTab, tab]);

  const creaturesByKey = useAppSelector(selectCreatureTypesByKey);

  const dialogueTrees = useAppSelector(selectDialogueTrees);
  const dialogueTreesByKey = useAppSelector(selectDialogueTreesByKey);

  const selectedDialogueCreature = useAppSelector(selectSelectedDialogueCreature);

  const eventLogsByKey = useAppSelector(selectEventLogsByKey);

  const queryDialogueCreature = query.get('dialogueCreature');

  const defaultDialogueTree = useMemo(() => {
    const newDialogueTree = getNewDialogueTree(dialogueTreesByKey);

    newDialogueTree.id = Math.max(...dialogueTrees.map((otherItem) => otherItem.id)) + 1;

    const creature = queryDialogueCreature ?? selectedDialogueCreature;
    if (creature && creature !== 'ALL') {
      newDialogueTree.creatureKey = creature;
    }

    return newDialogueTree;
  }, [dialogueTrees, dialogueTreesByKey, queryDialogueCreature, selectedDialogueCreature]);

  const [editData, setEditData] = useState<DialogueTree | undefined>(
    dataKey === 'new' ? defaultDialogueTree : dialogueTree
  );

  useEffect(() => {
    setEditData(dialogueTree);
  }, [dialogueTree]);

  const dataKeys = useMemo(
    () => ({
      current: editData?.key ?? dataKey,
      route: dataKey
    }),
    [dataKey, editData?.key]
  );

  const localizationKeys = useMemo(() => {
    const keys: string[] = [];

    dialogueTree?.dialogues.forEach((dialogue) => {
      keys.push(`dialogue-${dialogue.key.toLowerCase()}-text`);

      dialogue.responses.forEach((response) => {
        keys.push(`dialogue-${dialogue.key.toLowerCase()}-response-${response.key.toLowerCase()}-text`);
      });
    });

    return keys;
  }, [dialogueTree?.dialogues]);

  const {
    saveLocalizations,
    getLocalizedValue,
    tempData,
    updateLocalizedValue,
    deleteLocalizedValues,
    moveLocalizations,
    deleteLocalizations,
    isLocalizationDirty
  } = useUpdateLocalization({
    prefix: 'dialogue-tree',
    keys: localizationKeys,
    dataKeys
  });

  const debouncedTempData = useDebounce(tempData, 300);

  const debouncedEditData = useDebounce(editData, 500);

  const getGeneralTabErrors = useCallback(
    (data: DialogueTree) => validateDialogueTreeGeneralTab(data, creaturesByKey, eventLogsByKey, []),
    [creaturesByKey, eventLogsByKey]
  );

  const getConditionsTabErrors = useCallback((data: DialogueTree) => validateDialogueTreeConditionsTab(data), []);

  const getDialogueTabErrors = useCallback(
    (data: DialogueTree) =>
      validateDialogueTreeDialogueTab(data, debouncedTempData.localization, debouncedTempData.localizationKeys),
    [debouncedTempData.localization, debouncedTempData.localizationKeys]
  );

  const validate = useCallback(
    (data: DialogueTree) =>
      validateDialogueTree(
        data,
        creaturesByKey,
        eventLogsByKey,
        debouncedTempData.localization,
        debouncedTempData.localizationKeys
      ),
    [creaturesByKey, debouncedTempData.localization, debouncedTempData.localizationKeys, eventLogsByKey]
  );

  const onSave = useCallback(
    (dataSaved: DialogueTree[], newDialogueTree: DialogueTree | undefined) => {
      dispatch(updateDialogueTrees(dataSaved));

      if (newDialogueTree) {
        saveLocalizations();
      } else {
        deleteLocalizations();
      }
    },
    [deleteLocalizations, dispatch, saveLocalizations]
  );

  const getFileData = useCallback(() => {
    return {
      dialogueTrees
    };
  }, [dialogueTrees]);

  const getName = useCallback(
    (data: DialogueTree) => (data.key?.length > 0 ? toTitleCaseFromKey(data.key) : 'Unknown Dialogue Tree'),
    []
  );
  const onDataChange = useCallback((data: DialogueTree | undefined) => setEditData(data), []);

  return (
    <DataViewer
      dataKey={dataKey}
      valueDataKey={editData?.key}
      section="dialogue-tree"
      file={DIALOGUE_DATA_FILE}
      fileSection="dialogueTrees"
      value={dialogueTree}
      defaultValue={defaultDialogueTree}
      getFileData={getFileData}
      getName={getName}
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
            section="dialogue-tree"
            ariaLabel="dialogue tree tabs"
            onChange={(newTab) => setTab(newTab)}
            endAdornment={
              tab === 2 ? (
                <Button
                  variant="contained"
                  color="secondary"
                  size="medium"
                  endIcon={<AddIcon fontSize="medium" />}
                  disabled={disabled}
                  onClick={() =>
                    handleOnChange({ dialogues: [...(data.dialogues || []), getNewDialogue(data.dialogues)] })
                  }
                >
                  Add Dialogue
                </Button>
              ) : null
            }
          >
            {{
              label: 'General',
              validate: getGeneralTabErrors
            }}
            {{
              label: 'Conditions',
              validate: getConditionsTabErrors
            }}
            {{
              label: 'Dialogue',
              validate: getDialogueTabErrors
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
                        disabled={disabled}
                        min={1}
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
                </Card>
                <Card header="Settings">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <FormBox>
                      <Checkbox
                        label="Run only once"
                        checked={data.runOnlyOnce}
                        onChange={(newValue) =>
                          handleOnChange({
                            runOnlyOnce: newValue
                          })
                        }
                        disabled={disabled}
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Priority"
                        value={data.priority}
                        min={0}
                        onChange={(value) =>
                          handleOnChange({
                            priority: value
                          })
                        }
                        required
                        disabled={disabled}
                        wholeNumber
                      />
                    </FormBox>
                  </Box>
                </Card>
              </Box>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Card header="Creature">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <FormBox>
                      <CreatureSelect
                        label="Creature"
                        disabled={disabled}
                        value={data.creatureKey}
                        onChange={(value) => handleOnChange({ creatureKey: value })}
                      />
                    </FormBox>
                  </Box>
                </Card>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                  <Card header="Completion Event" sx={{ overflow: 'visible' }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' }}>
                      <FormBox sx={{ position: 'relative' }}>
                        <EventAutocomplete
                          value={data?.completionEvent}
                          onChange={(completionEvent) =>
                            handleOnChange({
                              completionEvent
                            })
                          }
                        />
                      </FormBox>
                    </Box>
                  </Card>
                </Box>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 3fr' }}>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Card header="Days">
                  <Box display="flex" sx={{ width: '100%', justifyContent: 'center' }}>
                    {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
                    {[...Array(DAYS_IN_A_WEEK)].map((_, day) => {
                      return (
                        <FormBox key={`day-${day}`} sx={{ width: 'unset' }}>
                          <Checkbox
                            label={DAYS_OF_THE_WEEK[day].abbreviation}
                            checked={data.conditions?.days?.includes(day)}
                            onChange={(newValue) => {
                              let newDays = [...(data.conditions?.days || [])];
                              if (newValue) {
                                if (!newDays.includes(day)) {
                                  newDays.push(day);
                                }
                              } else {
                                const index = newDays.indexOf(day);
                                if (index > -1) {
                                  newDays.splice(index, 1);
                                }
                              }

                              newDays.sort();
                              newDays = newDays.filter((value, index, self) => self.indexOf(value) === index);

                              handleOnChange({
                                conditions: {
                                  ...data.conditions,
                                  days: newDays.length > 0 ? newDays : undefined
                                }
                              });
                            }}
                            disabled={disabled}
                            sx={{ m: 0 }}
                          />
                        </FormBox>
                      );
                    })}
                  </Box>
                </Card>
              </Box>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Card header="Times">
                  <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr' }}>
                    <FormBox>
                      <Select
                        label="Category"
                        disabled={disabled}
                        value={data.conditions?.timesComparator ?? ''}
                        onChange={(newValue) => {
                          if (!newValue) {
                            handleOnChange({
                              conditions: {
                                ...data.conditions,
                                times: undefined,
                                timesComparator: undefined
                              }
                            });
                            return;
                          }

                          let newTimes = [...(data.conditions?.times || [])];
                          if (newValue === TIME_COMPARATOR_BEFORE || newValue === TIME_COMPARATOR_AFTER) {
                            if (newTimes.length === 0) {
                              newTimes[0] = -1;
                            } else if (newTimes.length > 1) {
                              newTimes = [newTimes[0]];
                            }
                          }

                          if (newValue === TIME_COMPARATOR_BETWEEN) {
                            if (newTimes.length === 0) {
                              newTimes = [-1, -1];
                            } else if (newTimes.length === 1) {
                              newTimes = [newTimes[0], -1];
                            } else if (newTimes.length > 2) {
                              newTimes = [newTimes[0], newTimes[1]];
                            }
                          }

                          handleOnChange({
                            conditions: {
                              ...data.conditions,
                              times: newTimes,
                              timesComparator: newValue
                            }
                          });
                        }}
                        options={[
                          {
                            label: 'Before',
                            value: TIME_COMPARATOR_BEFORE
                          },
                          {
                            label: 'After',
                            value: TIME_COMPARATOR_AFTER
                          },
                          {
                            label: 'Between',
                            value: TIME_COMPARATOR_BETWEEN
                          }
                        ]}
                      />
                    </FormBox>
                    {data.conditions?.timesComparator ? (
                      <>
                        <Box key="times-time0">
                          <TimeInput
                            required
                            value={data.conditions?.times?.[0] ?? -1}
                            onChange={(time0) => {
                              const newTimes = [...(data.conditions?.times || [])];
                              newTimes[0] = time0;
                              handleOnChange({
                                conditions: {
                                  ...data.conditions,
                                  times: newTimes
                                }
                              });
                            }}
                          />
                        </Box>
                        {data.conditions?.timesComparator === TIME_COMPARATOR_BETWEEN ? (
                          <Box key="times-time1">
                            <TimeInput
                              required
                              value={data.conditions?.times?.[1] ?? -1}
                              onChange={(time1) => {
                                const newTimes = [...(data.conditions?.times || [])];
                                newTimes[1] = time1;
                                handleOnChange({
                                  conditions: {
                                    ...data.conditions,
                                    times: newTimes
                                  }
                                });
                              }}
                            />
                          </Box>
                        ) : null}
                      </>
                    ) : null}
                  </Box>
                </Card>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <DialogueCard
              dialogues={data.dialogues}
              disabled={disabled}
              onChange={(dialogues) => handleOnChange({ dialogues })}
              onSetStartingDialogue={(startingDialogueId) => handleOnChange({ startingDialogueId })}
              startingDialogueId={data.startingDialogueId}
              getLocalizedValue={getLocalizedValue}
              updateLocalizedValue={updateLocalizedValue}
              deleteLocalizedValues={deleteLocalizedValues}
              moveLocalizations={moveLocalizations}
            />
          </TabPanel>
        </>
      )}
    </DataViewer>
  );
};

export default DialogueTreeView;
