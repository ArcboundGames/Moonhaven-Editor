import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Box from '@mui/material/Box';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { EVENTS_DATA_FILE } from '../../../../../../../SharedLibrary/src/constants';
import { validateEventLog } from '../../../../../../../SharedLibrary/src/dataValidation';
import { toTitleCaseFromKey } from '../../../../../../../SharedLibrary/src/util/string.util';
import { useAppDispatch, useAppSelector, useDebounce } from '../../../../hooks';
import { selectEventLogByKey, selectEventLogs, updateEventLogs } from '../../../../store/slices/eventLogs';
import { useUpdateLocalization } from '../../../hooks/useUpdateLocalization.hook';
import NumberTextField from '../../../widgets/form/NumberTextField';
import TextField from '../../../widgets/form/TextField';
import Card from '../../../widgets/layout/Card';
import FormBox from '../../../widgets/layout/FormBox';
import DataViewer from '../../DataViewer';

import type { EventLog } from '../../../../../../../SharedLibrary/src/interface';

const EventLogView = () => {
  const { dataKey = '' } = useParams();

  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<string[] | undefined>(undefined);

  const eventLog = useAppSelector(useMemo(() => selectEventLogByKey(dataKey), [dataKey]));
  const eventLogs = useAppSelector(selectEventLogs);

  const defaultValue: EventLog = useMemo(
    () => ({
      id: Math.max(0, ...eventLogs.map((otherLog) => otherLog.id)) + 1,
      key: 'NEW_EVENT_LOG'
    }),
    [eventLogs]
  );

  const [editData, setEditData] = useState<EventLog | undefined>(dataKey === 'new' ? defaultValue : eventLog);
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
    isLocalizationDirty
  } = useUpdateLocalization({
    prefix: 'event-log',
    keys: useMemo(() => ['flavor-text'], []),
    dataKeys
  });

  const debouncedTempData = useDebounce(tempData, 300);

  useEffect(() => {
    if (!debouncedEditData) {
      return;
    }

    setErrors(
      validateEventLog(debouncedEditData, debouncedTempData.localization, debouncedTempData.localizationKeys, [])
    );
  }, [debouncedEditData, debouncedTempData]);

  const validate = useCallback(
    (data: EventLog) => {
      return validateEventLog(data, debouncedTempData.localization, debouncedTempData.localizationKeys, []);
    },
    [debouncedTempData]
  );

  const onSave = useCallback(
    (dataSaved: EventLog[], newEventLog: EventLog | undefined) => {
      dispatch(updateEventLogs(dataSaved));

      if (newEventLog) {
        saveLocalizations();
      } else {
        deleteLocalizations();
      }
    },
    [deleteLocalizations, dispatch, saveLocalizations]
  );

  const getName = useCallback((data: EventLog) => toTitleCaseFromKey(data.key), []);

  const getHeader = useCallback(
    (data: EventLog) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box>{getName(data)}</Box>
        {errors && errors.length > 0 ? (
          <ReportProblemIcon color="error" sx={{ ml: 1 }} titleAccess={errors.join(', ')} />
        ) : null}
      </Box>
    ),
    [errors, getName]
  );

  const onDataChange = useCallback((data: EventLog | undefined) => setEditData(data), []);

  const getFileData = useCallback(
    () => ({
      eventLogs
    }),
    [eventLogs]
  );

  return (
    <DataViewer
      dataKey={dataKey}
      valueDataKey={editData?.key}
      section="event-log"
      file={EVENTS_DATA_FILE}
      fileSection="eventLogs"
      value={eventLog}
      defaultValue={defaultValue}
      getFileData={getFileData}
      getName={getName}
      getHeader={getHeader}
      validate={validate}
      onSave={onSave}
      onDataChange={onDataChange}
      dirty={isLocalizationDirty}
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
                    min={1}
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
            <Card header="Text">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' }}>
                <FormBox>
                  <TextField
                    label="Flavor Text"
                    value={getLocalizedValue('flavor-text')}
                    onChange={(value) => updateLocalizedValue('flavor-text', value)}
                    required
                    disabled={disabled}
                    multiline
                    rows={4}
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

export default EventLogView;
