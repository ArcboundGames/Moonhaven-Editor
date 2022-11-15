import Box from '@mui/material/Box';
import { useCallback, useEffect, useState } from 'react';

import { PLAYER_DATA_FILE } from '../../../../../../../SharedLibrary/src/constants';
import { useAppDispatch, useAppSelector, useDebounce, useQuery } from '../../../../hooks';
import { selectItemTypesByKey } from '../../../../store/slices/items';
import { selectPlayerData, updatePlayerData } from '../../../../store/slices/player';
import {
  validatePlayerData,
  validatePlayerDataGeneralTab,
  validatePlayerDataLevelsTab
} from '../../../../util/validate.util';
import NumberTextField from '../../../widgets/form/NumberTextField';
import Card from '../../../widgets/layout/Card';
import FormBox from '../../../widgets/layout/FormBox';
import TabPanel from '../../../widgets/TabPanel';
import Tabs from '../../../widgets/tabs/Tabs';
import DataViewer from '../../DataViewer';
import NextLevelExpCard from './playerDataView/NextExpLevel';
import ItemsListCard from './widgets/ItemsListCard';

import type { PlayerData } from '../../../../../../../SharedLibrary/src/interface';

const PlayerDataView = () => {
  const dispatch = useAppDispatch();
  const query = useQuery();

  const queryTab = Number(query.get('tab') ?? 0);
  const [tab, setTab] = useState(queryTab);
  useEffect(() => {
    if (!Number.isNaN(queryTab) && queryTab !== tab) {
      setTab(queryTab);
    }
  }, [queryTab, tab]);

  const playerData = useAppSelector(selectPlayerData);

  const itemsByKey = useAppSelector(selectItemTypesByKey);

  const [editData, setEditData] = useState<PlayerData | undefined>(playerData);

  useEffect(() => {
    setEditData(playerData);
  }, [playerData]);

  const validate = useCallback(
    (dataToValidate: PlayerData) => {
      return validatePlayerData(dataToValidate, itemsByKey);
    },
    [itemsByKey]
  );

  const debouncedEditData = useDebounce(editData, 500);

  const getGeneralTabErrors = useCallback(
    (data: PlayerData) => validatePlayerDataGeneralTab(data, itemsByKey),
    [itemsByKey]
  );
  const getLevelsTabErrors = useCallback((data: PlayerData) => validatePlayerDataLevelsTab(data), []);

  const onSave = useCallback((dataSaved: PlayerData) => dispatch(updatePlayerData(dataSaved)), [dispatch]);

  const onDataChange = useCallback((newData: PlayerData | undefined) => setEditData(newData), [setEditData]);

  const getName = useCallback(() => 'Player Start Settings', []);

  return (
    <DataViewer
      dataKey={undefined}
      section="player-data"
      file={PLAYER_DATA_FILE}
      value={playerData}
      getName={getName}
      validate={validate}
      onSave={onSave}
      onDataChange={onDataChange}
    >
      {({ data, handleOnChange, disabled }) => (
        <>
          <Tabs
            data={debouncedEditData}
            section="player-data"
            ariaLabel="player data tabs"
            onChange={(newTab) => setTab(newTab)}
          >
            {{
              label: 'General',
              validate: getGeneralTabErrors
            }}
            {{
              label: 'Levels',
              validate: getLevelsTabErrors
            }}
          </Tabs>
          <TabPanel value={tab} index={0}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Card header="Health">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <FormBox>
                      <NumberTextField
                        label="Starting Health"
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
                    <FormBox>
                      <NumberTextField
                        label="Max Health"
                        value={data.healthMax}
                        min={1}
                        onChange={(value) =>
                          handleOnChange({
                            healthMax: value
                          })
                        }
                        disabled={disabled}
                        wholeNumber
                      />
                    </FormBox>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <FormBox>
                      <NumberTextField
                        label="Health Depletion Time"
                        value={data.healthDepletionTime}
                        min={0}
                        onChange={(value) =>
                          handleOnChange({
                            healthDepletionTime: value
                          })
                        }
                        disabled={disabled}
                        error={data.health <= 0}
                        helperText="Seconds"
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Health Refill Time"
                        value={data.healthRefillTime}
                        min={0}
                        onChange={(value) =>
                          handleOnChange({
                            healthRefillTime: value
                          })
                        }
                        disabled={disabled}
                        error={data.healthRefillTime <= 0}
                        helperText="Seconds"
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Health Refill Hunger Depletion Rate"
                        value={data.healthRefillHungerDepletionRate}
                        min={0}
                        onChange={(value) =>
                          handleOnChange({
                            healthRefillHungerDepletionRate: value
                          })
                        }
                        disabled={disabled}
                        error={data.healthRefillHungerDepletionRate <= 0}
                        helperText="Hunger per second"
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Health Refill Thirst Depletion Rate"
                        value={data.healthRefillThirstDepletionRate}
                        min={0}
                        onChange={(value) =>
                          handleOnChange({
                            healthRefillThirstDepletionRate: value
                          })
                        }
                        disabled={disabled}
                        error={data.healthRefillThirstDepletionRate <= 0}
                        helperText="Thirst per second"
                      />
                    </FormBox>
                  </Box>
                </Card>
                <Card header="Energy">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <FormBox>
                      <NumberTextField
                        label="Starting Energy"
                        value={data.energy}
                        min={1}
                        onChange={(value) =>
                          handleOnChange({
                            energy: value
                          })
                        }
                        disabled={disabled}
                        wholeNumber
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Max Energy"
                        value={data.energyMax}
                        min={1}
                        onChange={(value) =>
                          handleOnChange({
                            energyMax: value
                          })
                        }
                        disabled={disabled}
                        wholeNumber
                      />
                    </FormBox>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <FormBox>
                      <NumberTextField
                        label="Base Energy Use"
                        value={data.energyBaseUsageRate}
                        min={0}
                        onChange={(value) =>
                          handleOnChange({
                            energyBaseUsageRate: value
                          })
                        }
                        disabled={disabled}
                        error={data.energyBaseUsageRate <= 0}
                        helperText="Energy per use"
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Energy Refill Rate"
                        value={data.energyRefillRate}
                        min={0}
                        onChange={(value) =>
                          handleOnChange({
                            energyRefillRate: value
                          })
                        }
                        disabled={disabled}
                        error={data.energyRefillRate <= 0}
                        helperText="Energy per second"
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Energy Refill Hunger Depletion Rate"
                        value={data.energyRefillHungerDepletionRate}
                        min={0}
                        onChange={(value) =>
                          handleOnChange({
                            energyRefillHungerDepletionRate: value
                          })
                        }
                        disabled={disabled}
                        error={data.energyRefillHungerDepletionRate <= 0}
                        helperText="Hunger per second"
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Energy Refill Thirst Depletion Rate"
                        value={data.energyRefillThirstDepletionRate}
                        min={0}
                        onChange={(value) =>
                          handleOnChange({
                            energyRefillThirstDepletionRate: value
                          })
                        }
                        disabled={disabled}
                        error={data.energyRefillThirstDepletionRate <= 0}
                        helperText="Thirst per second"
                      />
                    </FormBox>
                  </Box>
                </Card>
                <Card header="Hunger">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <FormBox>
                      <NumberTextField
                        label="Starting Hunger"
                        value={data.hunger}
                        min={1}
                        onChange={(value) =>
                          handleOnChange({
                            hunger: value
                          })
                        }
                        disabled={disabled}
                        wholeNumber
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Max Hunger"
                        value={data.hungerMax}
                        min={1}
                        onChange={(value) =>
                          handleOnChange({
                            hungerMax: value
                          })
                        }
                        disabled={disabled}
                        wholeNumber
                      />
                    </FormBox>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <FormBox>
                      <NumberTextField
                        label="Initial Hunger Drain Delay"
                        value={data.hungerInitialDelay}
                        min={1}
                        onChange={(value) =>
                          handleOnChange({
                            hungerInitialDelay: value
                          })
                        }
                        disabled={disabled}
                        helperText="Seconds"
                        wholeNumber
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Max Out Hunger Drain Delay"
                        value={data.hungerMaxedOutDelay}
                        min={1}
                        onChange={(value) =>
                          handleOnChange({
                            hungerMaxedOutDelay: value
                          })
                        }
                        disabled={disabled}
                        helperText="Seconds"
                        wholeNumber
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Hunger Depletion Rate"
                        value={data.hungerDepletionRate}
                        min={0}
                        onChange={(value) =>
                          handleOnChange({
                            hungerDepletionRate: value
                          })
                        }
                        disabled={disabled}
                        error={data.hungerDepletionRate <= 0}
                        helperText="Hunger per second"
                      />
                    </FormBox>
                  </Box>
                </Card>
                <Card header="Thirst">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <FormBox>
                      <NumberTextField
                        label="Starting Thirst"
                        value={data.thirst}
                        min={1}
                        onChange={(value) =>
                          handleOnChange({
                            thirst: value
                          })
                        }
                        disabled={disabled}
                        wholeNumber
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Max Thirst"
                        value={data.thirstMax}
                        min={1}
                        onChange={(value) =>
                          handleOnChange({
                            thirstMax: value
                          })
                        }
                        disabled={disabled}
                        wholeNumber
                      />
                    </FormBox>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <FormBox>
                      <NumberTextField
                        label="Initial Thirst Drain Delay"
                        value={data.thirstInitialDelay}
                        min={1}
                        onChange={(value) =>
                          handleOnChange({
                            thirstInitialDelay: value
                          })
                        }
                        disabled={disabled}
                        helperText="Seconds"
                        wholeNumber
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Maxed Out Thirst Drain Delay"
                        value={data.thirstMaxedOutDelay}
                        min={1}
                        onChange={(value) =>
                          handleOnChange({
                            thirstMaxedOutDelay: value
                          })
                        }
                        disabled={disabled}
                        helperText="Seconds"
                        wholeNumber
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Thirst Depletion Rate"
                        value={data.thirstDepletionRate}
                        min={0}
                        onChange={(value) =>
                          handleOnChange({
                            thirstDepletionRate: value
                          })
                        }
                        disabled={disabled}
                        error={data.thirstDepletionRate <= 0}
                        helperText="Thirst per second"
                      />
                    </FormBox>
                  </Box>
                </Card>
                <Card header="Economy">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <FormBox>
                      <NumberTextField
                        label="Money"
                        value={data.money}
                        min={1}
                        onChange={(value) =>
                          handleOnChange({
                            money: value
                          })
                        }
                        disabled={disabled}
                        wholeNumber
                      />
                    </FormBox>
                  </Box>
                </Card>
              </Box>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <ItemsListCard
                  data={data.startingItems}
                  label="Starting Item"
                  pluralLabel="Starting Items"
                  disabled={disabled}
                  onChange={(startingItems) => handleOnChange({ startingItems })}
                />
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <NextLevelExpCard
                  nextLevelExps={data.nextLevelExp}
                  disabled={disabled}
                  onChange={(nextLevelExp) =>
                    handleOnChange({
                      nextLevelExp
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

export default PlayerDataView;
