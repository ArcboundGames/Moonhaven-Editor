/* eslint-disable react/no-array-index-key */
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { LOCALIZATION_DATA_FILE } from '../../../../../../../SharedLibrary/src/constants';
import { validateLocalization } from '../../../../../../../SharedLibrary/src/dataValidation';
import { isNotEmpty } from '../../../../../../../SharedLibrary/src/util/string.util';
import { useAppDispatch, useAppSelector, useDebounce } from '../../../../hooks';
import { selectSearch } from '../../../../store/slices/data';
import {
  selectLocalization,
  selectLocalizationKeys,
  selectLocalizations,
  updateLocalizations
} from '../../../../store/slices/localizations';
import TextField from '../../../widgets/form/TextField';
import Card from '../../../widgets/layout/Card';
import FormBox from '../../../widgets/layout/FormBox';
import DataViewer from '../../DataViewer';
import LocalizationPair from './localization/LocalizationPair';

import type { Localization } from '../../../../../../../SharedLibrary/src/interface';

const LocalizationView = () => {
  const { dataKey = '' } = useParams();

  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<string[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);
  const [showOnlyMissing, setShowOnlyMissing] = useState<boolean>(false);

  const localization = useAppSelector(useMemo(() => selectLocalization(dataKey), [dataKey]));
  const keys = useAppSelector(selectLocalizationKeys);
  const localizations = useAppSelector(selectLocalizations);

  const searchTerm = useAppSelector(selectSearch);
  const debouncedSearchTerm = useDebounce(searchTerm?.toLowerCase().replace(/_/g, ' '), 250);

  const [editData, setEditData] = useState<Localization | undefined>(localization);
  const debouncedEditData = useDebounce(editData, 500);
  useEffect(() => {
    if (!debouncedEditData) {
      return;
    }

    setErrors(validateLocalization(debouncedEditData, keys));
  }, [debouncedEditData, keys]);

  const validate = useCallback((data: Localization) => validateLocalization(data, keys), [keys]);

  const onSave = useCallback(
    (dataSaved: Localization[]) => {
      dispatch(updateLocalizations(dataSaved));
      setDirty(false);
    },
    [dispatch]
  );

  const getName = useCallback((data: Localization) => data.name, []);

  const getHeader = useCallback(
    (data: Localization) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box>{getName(data)}</Box>
        {errors && errors.length > 0 ? (
          <ReportProblemIcon color="error" sx={{ ml: 1 }} titleAccess={errors.join(', ')} />
        ) : null}
      </Box>
    ),
    [errors, getName]
  );

  const onDataChange = useCallback((data: Localization | undefined) => setEditData(data), []);

  const onDisable = useCallback((newDisabled: boolean) => setDisabled(newDisabled), []);

  const getFileData = useCallback(
    () => ({
      keys,
      localizations
    }),
    [keys, localizations]
  );

  const onLocalizationPairChange = useCallback(() => setDirty(true), []);

  const { localizationPairs, refs } = useMemo(() => {
    const tempRefs: Record<string, React.RefObject<HTMLInputElement>> = {};
    const tempPairs = keys
      .filter((key) => {
        if (showOnlyMissing) {
          if (isNotEmpty(localization?.values[key])) {
            return false;
          }
        }

        return !debouncedSearchTerm || key.replace(/_/g, ' ').toLowerCase().includes(debouncedSearchTerm);
      })
      .map((key) => {
        const ref = React.createRef<HTMLInputElement>();
        tempRefs[key] = ref;
        return (
          <LocalizationPair
            key={`localization-${key}`}
            localizationKey={key}
            defaultValue={editData?.values[key] ?? ''}
            disabled={disabled}
            onChange={onLocalizationPairChange}
            inputRef={ref}
          />
        );
      });

    return {
      refs: tempRefs,
      localizationPairs: tempPairs
    };
  }, [
    debouncedSearchTerm,
    disabled,
    editData?.values,
    keys,
    localization?.values,
    onLocalizationPairChange,
    showOnlyMissing
  ]);

  const onPreSave = useCallback(
    (localizationToSave: Localization) => ({
      ...localizationToSave,
      values: Object.keys(refs).reduce((values, key) => {
        const ref = refs[key];
        values[key] = ref.current?.value ?? '';
        return values;
      }, {} as Record<string, string>)
    }),
    [refs]
  );

  return (
    <DataViewer
      dataKey={dataKey}
      valueDataKey={editData?.key}
      section="localization"
      file={LOCALIZATION_DATA_FILE}
      fileSection="localizations"
      value={localization}
      getFileData={getFileData}
      getName={getName}
      getHeader={getHeader}
      validate={validate}
      onSave={onSave}
      onDataChange={onDataChange}
      onDisable={onDisable}
      onPreSave={onPreSave}
      dirty={dirty}
    >
      {({ data, handleOnChange }) => (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 3fr' }}>
          <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <Card header="General">
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
                  value={data.name}
                  onChange={(value) => handleOnChange({ name: value })}
                  required
                  disabled={disabled}
                />
              </FormBox>
            </Card>
          </Box>
          <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <Card
              header={
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>Localizations</div>
                  <FormControlLabel
                    value={showOnlyMissing}
                    control={<Switch onChange={(event) => setShowOnlyMissing(event.target.checked)} />}
                    label="Only Missing"
                  />
                </Box>
              }
            >
              {localizationPairs}
            </Card>
          </Box>
        </Box>
      )}
    </DataViewer>
  );
};

export default LocalizationView;
