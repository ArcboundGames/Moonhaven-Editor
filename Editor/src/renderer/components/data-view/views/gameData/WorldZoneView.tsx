import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Box from '@mui/material/Box';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { selectCreatureTypesByKey } from 'renderer/store/slices/creatures';
import { WORLD_ZONES_DATA_FILE } from '../../../../../../../SharedLibrary/src/constants';
import { validateWorldZone } from '../../../../../../../SharedLibrary/src/dataValidation';
import { toTitleCaseFromKey } from '../../../../../../../SharedLibrary/src/util/string.util';
import { useAppDispatch, useAppSelector, useDebounce } from '../../../../hooks';
import { selectWorldZoneByKey, selectWorldZones, updateWorldZones } from '../../../../store/slices/worldZones';
import NumberTextField from '../../../widgets/form/NumberTextField';
import TextField from '../../../widgets/form/TextField';
import Card from '../../../widgets/layout/Card';
import FormBox from '../../../widgets/layout/FormBox';
import DataViewer from '../../DataViewer';
import WorldZoneSpawnsListCard from './worldZoneView/WorldZoneSpawnsListCard';

import type { WorldZone } from '../../../../../../../SharedLibrary/src/interface';

const WorldZoneView = () => {
  const { dataKey = '' } = useParams();

  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<string[] | undefined>(undefined);

  const worldZone = useAppSelector(useMemo(() => selectWorldZoneByKey(dataKey), [dataKey]));
  const worldZones = useAppSelector(selectWorldZones);

  const creaturesByKey = useAppSelector(selectCreatureTypesByKey);

  const defaultValue: WorldZone = useMemo(
    () => ({
      id: Math.max(0, ...worldZones.map((otherLog) => otherLog.id)) + 1,
      key: 'NEW_WORLD_ZONE',
      spawns: []
    }),
    [worldZones]
  );

  const [editData, setEditData] = useState<WorldZone | undefined>(dataKey === 'new' ? defaultValue : worldZone);
  const debouncedEditData = useDebounce(editData, 500);
  useEffect(() => {
    if (!debouncedEditData) {
      return;
    }

    setErrors(validateWorldZone(debouncedEditData, creaturesByKey, []));
  }, [debouncedEditData, creaturesByKey]);

  const validate = useCallback((data: WorldZone) => validateWorldZone(data, creaturesByKey, []), [creaturesByKey]);

  const onSave = useCallback((dataSaved: WorldZone[]) => dispatch(updateWorldZones(dataSaved)), [dispatch]);

  const getName = useCallback((data: WorldZone) => toTitleCaseFromKey(data.key), []);

  const getHeader = useCallback(
    (data: WorldZone) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box>{getName(data)}</Box>
        {errors && errors.length > 0 ? (
          <ReportProblemIcon color="error" sx={{ ml: 1 }} titleAccess={errors.join(', ')} />
        ) : null}
      </Box>
    ),
    [errors, getName]
  );

  const onDataChange = useCallback((data: WorldZone | undefined) => setEditData(data), []);

  const getFileData = useCallback(
    () => ({
      zones: worldZones
    }),
    [worldZones]
  );

  return (
    <DataViewer
      dataKey={dataKey}
      valueDataKey={`${editData?.key}`}
      section="world-zone"
      file={WORLD_ZONES_DATA_FILE}
      fileSection="zones"
      value={worldZone}
      defaultValue={defaultValue}
      getFileData={getFileData}
      getName={getName}
      getHeader={getHeader}
      validate={validate}
      onSave={onSave}
      onDataChange={onDataChange}
    >
      {({ data, handleOnChange, disabled }) => (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}>
          <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <Card header="General">
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
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
              </Box>
            </Card>
          </Box>
          <WorldZoneSpawnsListCard
            data={data.spawns}
            label="Spawn"
            pluralLabel="Spawns"
            disabled={disabled}
            onChange={(spawns) => handleOnChange({ spawns })}
          />
        </Box>
      )}
    </DataViewer>
  );
};

export default WorldZoneView;
