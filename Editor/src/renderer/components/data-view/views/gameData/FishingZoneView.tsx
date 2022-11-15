import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Box from '@mui/material/Box';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FISHING_DATA_FILE } from '../../../../../../../SharedLibrary/src/constants';
import { validateFishingZone } from '../../../../../../../SharedLibrary/src/dataValidation';
import { toTitleCaseFromKey } from '../../../../../../../SharedLibrary/src/util/string.util';
import { useAppDispatch, useAppSelector, useDebounce } from '../../../../hooks';
import { selectFishingZoneByKey, selectFishingZones, updateFishingZones } from '../../../../store/slices/fishing';
import { selectLootTables, selectLootTablesByKey } from '../../../../store/slices/lootTables';
import NumberTextField from '../../../widgets/form/NumberTextField';
import Select from '../../../widgets/form/Select';
import TextField from '../../../widgets/form/TextField';
import Card from '../../../widgets/layout/Card';
import FormBox from '../../../widgets/layout/FormBox';
import DataViewer from '../../DataViewer';

import type { FishingZone } from '../../../../../../../SharedLibrary/src/interface';

const FishingZoneView = () => {
  const { dataKey = '' } = useParams();

  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<string[] | undefined>(undefined);

  const fishingZone = useAppSelector(useMemo(() => selectFishingZoneByKey(dataKey), [dataKey]));
  const fishingZones = useAppSelector(selectFishingZones);

  const lootTables = useAppSelector(selectLootTables);
  const lootTablesByKey = useAppSelector(selectLootTablesByKey);

  const defaultValue: FishingZone = useMemo(
    () => ({
      id: Math.max(0, ...fishingZones.map((otherLog) => otherLog.id)) + 1,
      key: 'NEW_FISHING_ZONE',
      lootTableKey: ''
    }),
    [fishingZones]
  );

  const [editData, setEditData] = useState<FishingZone | undefined>(dataKey === 'new' ? defaultValue : fishingZone);
  const debouncedEditData = useDebounce(editData, 500);
  useEffect(() => {
    if (!debouncedEditData) {
      return;
    }

    setErrors(validateFishingZone(debouncedEditData, lootTablesByKey, []));
  }, [debouncedEditData, lootTablesByKey]);

  const validate = useCallback(
    (data: FishingZone) => validateFishingZone(data, lootTablesByKey, []),
    [lootTablesByKey]
  );

  const onSave = useCallback((dataSaved: FishingZone[]) => dispatch(updateFishingZones(dataSaved)), [dispatch]);

  const getName = useCallback((data: FishingZone) => toTitleCaseFromKey(data.key), []);

  const getHeader = useCallback(
    (data: FishingZone) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box>{getName(data)}</Box>
        {errors && errors.length > 0 ? (
          <ReportProblemIcon color="error" sx={{ ml: 1 }} titleAccess={errors.join(', ')} />
        ) : null}
      </Box>
    ),
    [errors, getName]
  );

  const onDataChange = useCallback((data: FishingZone | undefined) => setEditData(data), []);

  const getFileData = useCallback(
    () => ({
      zones: fishingZones
    }),
    [fishingZones]
  );

  return (
    <DataViewer
      dataKey={dataKey}
      valueDataKey={`${editData?.id}`}
      section="fishing-zone"
      file={FISHING_DATA_FILE}
      fileSection="zones"
      value={fishingZone}
      defaultValue={defaultValue}
      getFileData={getFileData}
      getName={getName}
      getHeader={getHeader}
      validate={validate}
      onSave={onSave}
      onDataChange={onDataChange}
    >
      {({ data, handleOnChange, disabled }) => (
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
              </Box>
            </Card>
          </Box>
          <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <Card header="Loot">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' }}>
                <FormBox key="lootTableKey">
                  <Select
                    label="Loot Table"
                    disabled={disabled}
                    value={data.lootTableKey}
                    onChange={(value) =>
                      handleOnChange({
                        lootTableKey: value
                      })
                    }
                    options={lootTables.map((entry) => ({
                      label: toTitleCaseFromKey(entry.key),
                      value: entry.key
                    }))}
                  />
                </FormBox>
              </Box>
            </Card>
          </Box>
        </Box>
      )}
    </DataViewer>
  );
};

export default FishingZoneView;
