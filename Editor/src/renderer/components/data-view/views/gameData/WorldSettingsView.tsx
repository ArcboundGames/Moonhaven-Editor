import Box from '@mui/material/Box';
import { useCallback, useEffect, useState } from 'react';

import { WORLD_DATA_FILE } from '../../../../../../../SharedLibrary/src/constants';
import { useAppDispatch, useAppSelector, useDebounce, useQuery } from '../../../../hooks';
import { selectWorldSettings, updateWorldSettings } from '../../../../store/slices/world';
import { validateWorldSettings, validateWorldSettingsWeatherTab } from '../../../../util/validate.util';
import NumberTextField from '../../../widgets/form/NumberTextField';
import Card from '../../../widgets/layout/Card';
import FormBox from '../../../widgets/layout/FormBox';
import TabPanel from '../../../widgets/TabPanel';
import Tabs from '../../../widgets/tabs/Tabs';
import DataViewer from '../../DataViewer';

import type { WorldSettings } from '../../../../../../../SharedLibrary/src/interface';

const WorldSettingsView = () => {
  const dispatch = useAppDispatch();
  const query = useQuery();

  const queryTab = Number(query.get('tab') ?? 0);
  const [tab, setTab] = useState(queryTab);
  useEffect(() => {
    if (!Number.isNaN(queryTab) && queryTab !== tab) {
      setTab(queryTab);
    }
  }, [queryTab, tab]);

  const worldSettings = useAppSelector(selectWorldSettings);

  const [editData, setEditData] = useState<WorldSettings | undefined>(worldSettings);

  useEffect(() => {
    setEditData(worldSettings);
  }, [worldSettings]);

  const validate = useCallback((dataToValidate: WorldSettings) => {
    return validateWorldSettings(dataToValidate);
  }, []);

  const debouncedEditData = useDebounce(editData, 500);

  const getWeatherTabErrors = useCallback((data: WorldSettings) => validateWorldSettingsWeatherTab(data), []);

  const onSave = useCallback((dataSaved: WorldSettings) => dispatch(updateWorldSettings(dataSaved)), [dispatch]);

  const onDataChange = useCallback((newData: WorldSettings | undefined) => setEditData(newData), [setEditData]);

  const getName = useCallback(() => 'World Settings', []);

  return (
    <DataViewer
      dataKey={undefined}
      section="world-settings"
      file={WORLD_DATA_FILE}
      value={worldSettings}
      getName={getName}
      validate={validate}
      onSave={onSave}
      onDataChange={onDataChange}
    >
      {({ data, handleOnChange, disabled }) => (
        <>
          <Tabs
            data={debouncedEditData}
            section="world-settings"
            ariaLabel="world settings tabs"
            onChange={(newTab) => setTab(newTab)}
          >
            {{
              label: 'Weather',
              validate: getWeatherTabErrors
            }}
          </Tabs>
          <TabPanel value={tab} index={0}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <Card header="Rain">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <FormBox>
                      <NumberTextField
                        label="Rain Chance"
                        value={data.weather?.rainChance}
                        min={1}
                        max={100}
                        onChange={(value) =>
                          handleOnChange({
                            weather: {
                              ...data.weather,
                              rainChance: value ?? 0
                            }
                          })
                        }
                        disabled={disabled}
                        wholeNumber
                      />
                    </FormBox>
                  </Box>
                </Card>
                <Card header="Snow">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <FormBox>
                      <NumberTextField
                        label="Snow Chance"
                        value={data.weather?.snowChance}
                        min={1}
                        max={100}
                        onChange={(value) =>
                          handleOnChange({
                            weather: {
                              ...data.weather,
                              snowChance: value ?? 0
                            }
                          })
                        }
                        disabled={disabled}
                        wholeNumber
                      />
                    </FormBox>
                  </Box>
                </Card>
              </Box>
            </Box>
          </TabPanel>
        </>
      )}
    </DataViewer>
  );
};

export default WorldSettingsView;
