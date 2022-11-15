import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { LOCALIZATION_DATA_FILE } from '../../../../../../../SharedLibrary/src/constants';
import {
  getEnglishLocalization,
  sortLocalization
} from '../../../../../../../SharedLibrary/src/util/localization.util';
import { useAppDispatch, useAppSelector, useDebounce } from '../../../../hooks';
import { selectSearch } from '../../../../store/slices/data';
import {
  selectLocalizationKeys,
  selectLocalizations,
  updateLocalizationKeys,
  updateLocalizations
} from '../../../../store/slices/localizations';
import { validateLocalizationKeys } from '../../../../util/validate.util';
import TextField from '../../../widgets/form/TextField';
import Card from '../../../widgets/layout/Card';
import FormBox from '../../../widgets/layout/FormBox';
import DataViewer from '../../DataViewer';

import type { LocalizationFile } from '../../../../../../../SharedLibrary/src/interface';

const LocalizationKeysView = () => {
  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const keys = useAppSelector(selectLocalizationKeys);
  const localizations = useAppSelector(selectLocalizations);

  const searchTerm = useAppSelector(selectSearch);
  const debouncedSearchTerm = useDebounce(searchTerm?.toLowerCase().replace(/_/g, ' '), 250);

  const fileData: LocalizationFile = useMemo(
    () => ({
      keys,
      localizations
    }),
    [keys, localizations]
  );

  const [editData, setEditData] = useState<LocalizationFile | undefined>(fileData);
  const debouncedEditData = useDebounce(editData, 500);
  useEffect(() => {
    if (!debouncedEditData) {
      return;
    }

    setErrors(validateLocalizationKeys(debouncedEditData.keys));
  }, [debouncedEditData]);

  const validate = useCallback((data: LocalizationFile) => validateLocalizationKeys(data.keys), []);

  const onSave = useCallback(
    (dataSaved: LocalizationFile) => {
      dispatch(updateLocalizationKeys(dataSaved.keys));
      dispatch(updateLocalizations(dataSaved.localizations));
    },
    [dispatch]
  );

  const getName = useCallback(() => 'Localization Keys', []);

  const titleErrors = useMemo(() => {
    return Object.keys(errors).reduce((allErrors, errorKey) => {
      allErrors.push(...errors[errorKey]);
      return allErrors;
    }, [] as string[]);
  }, [errors]);

  const getHeader = useCallback(
    () => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box>{getName()}</Box>
        {titleErrors.length > 0 ? (
          <ReportProblemIcon color="error" sx={{ ml: 1 }} titleAccess={titleErrors.join(', ')} />
        ) : null}
      </Box>
    ),
    [titleErrors, getName]
  );

  const onDataChange = useCallback((data: LocalizationFile | undefined) => {
    setEditData(data);
  }, []);

  const [keyToDelete, setKeyToDelete] = useState<string | undefined>(undefined);
  const handleOnClose = useCallback(() => setKeyToDelete(undefined), []);

  const [adding, setAdding] = useState(false);
  const [keyToAdd, setKeyToAdd] = useState<string | undefined>(undefined);
  const [englishLocalizationValue, setEnglishLocalizationValue] = useState<string | undefined>(undefined);

  const handleOnAdd = useCallback(() => {
    setKeyToAdd(undefined);
    setEnglishLocalizationValue(undefined);
    setAdding(true);
  }, []);
  const handleOnAddClose = useCallback(() => {
    setKeyToAdd(undefined);
    setEnglishLocalizationValue(undefined);
    setAdding(false);
  }, []);

  const renderedKeys = useMemo(() => {
    if (!editData) {
      return null;
    }
    return editData.keys
      .filter((key) => !debouncedSearchTerm || key.replace(/_/g, ' ').toLowerCase().includes(debouncedSearchTerm))
      .map((key) => (
        // eslint-disable-next-line react/no-array-index-key
        <Box key={`localization-keys-${key}`} sx={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
          <Box sx={{ mt: 1, mb: 1, p: 1 }}>
            <Typography variant="body1">{key}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              aria-label="delete"
              color="error"
              size="small"
              sx={{ ml: 1 }}
              onClick={() => setKeyToDelete(key)}
              title={`Delete localization key '${key}'`}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ));
  }, [debouncedSearchTerm, editData]);

  const addKey = useCallback(
    (data: LocalizationFile, handleOnChange: (input: Partial<LocalizationFile>) => void) => {
      if (keyToAdd) {
        const newKeys = [...data.keys];
        newKeys.push(keyToAdd);
        newKeys.sort((a, b) => a.localeCompare(b));

        const { englishIndex, englishLocalization } = getEnglishLocalization(data.localizations);

        const newLocalizations = [...data.localizations];
        if (englishLocalization && englishLocalizationValue) {
          const newEnglishLocalization = sortLocalization({
            ...englishLocalization,
            values: {
              ...englishLocalization.values,
              [keyToAdd]: englishLocalizationValue
            }
          });
          newLocalizations[englishIndex] = newEnglishLocalization;
        }

        handleOnChange({
          keys: newKeys,
          localizations: newLocalizations
        });
      }
      handleOnAddClose();
    },
    [englishLocalizationValue, handleOnAddClose, keyToAdd]
  );

  const deleteKey = useCallback(
    (data: LocalizationFile, handleOnChange: (input: Partial<LocalizationFile>) => void) => {
      if (keyToDelete) {
        const newKeys = [...data.keys];
        const deletingIndex = newKeys.indexOf(keyToDelete);
        newKeys.splice(deletingIndex, 1);

        const newLocalizatiosn = data.localizations.map((localization) => {
          const newLocalization = { ...localization };
          delete newLocalization.values[keyToDelete];
          return newLocalization;
        });

        handleOnChange({
          keys: newKeys,
          localizations: newLocalizatiosn
        });
      }
      setKeyToDelete(undefined);
    },
    [keyToDelete]
  );

  return (
    <DataViewer
      section="localization-key"
      file={LOCALIZATION_DATA_FILE}
      value={fileData}
      getName={getName}
      getHeader={getHeader}
      validate={validate}
      onSave={onSave}
      onDataChange={onDataChange}
    >
      {({ data, handleOnChange, disabled }) => (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr' }}>
            <Card
              header={
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>Localization Keys</div>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="medium"
                    endIcon={<AddIcon fontSize="medium" />}
                    disabled={disabled}
                    onClick={handleOnAdd}
                  >
                    Add localization key
                  </Button>
                </Box>
              }
            >
              {renderedKeys}
              <FormBox>
                <Button
                  variant="contained"
                  color="secondary"
                  size="medium"
                  endIcon={<AddIcon fontSize="medium" />}
                  disabled={disabled}
                  onClick={handleOnAdd}
                >
                  Add localization key
                </Button>
              </FormBox>
            </Card>
          </Box>
          {adding ? (
            <Dialog
              open
              onClose={handleOnAddClose}
              aria-labelledby="add-collider-dialog-title"
              aria-describedby="add-collider-dialog-description"
            >
              <DialogTitle id="add-collider-dialog-title">Add localization key</DialogTitle>
              <DialogContent sx={{ width: 300 }}>
                <Box sx={{ mt: 3, mb: 3, ml: 2, mr: 2 }}>
                  <FormBox>
                    <TextField
                      label="Key"
                      value={keyToAdd}
                      onChange={(value) => setKeyToAdd(value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          addKey(data, handleOnChange);
                        }
                      }}
                      required
                    />
                  </FormBox>
                  <FormBox>
                    <TextField
                      label="English Value"
                      value={englishLocalizationValue}
                      onChange={(value) => setEnglishLocalizationValue(value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          addKey(data, handleOnChange);
                        }
                      }}
                      required
                    />
                  </FormBox>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleOnAddClose} color="primary" autoFocus disabled={disabled}>
                  Cancel
                </Button>
                <Button
                  onClick={() => addKey(data, handleOnChange)}
                  variant="contained"
                  color="primary"
                  disabled={disabled || keyToAdd === undefined}
                >
                  Add
                </Button>
              </DialogActions>
            </Dialog>
          ) : null}
          {keyToDelete !== undefined && editData ? (
            <Dialog
              open
              onClose={handleOnClose}
              aria-labelledby="deleting-localization-key-dialog-title"
              aria-describedby="deleting-localization-key-dialog-description"
            >
              <DialogTitle id="deleting-localization-key-dialog-title">
                Delete localization key &quot;{keyToDelete}&quot;
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="deleting-localization-key-dialog-description">
                  Are you sure you want to delete localization key &quot;{keyToDelete}&quot;?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleOnClose} color="primary" autoFocus disabled={disabled}>
                  Cancel
                </Button>
                <Button onClick={() => deleteKey(data, handleOnChange)} color="error" disabled={disabled}>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          ) : null}
        </>
      )}
    </DataViewer>
  );
};

export default LocalizationKeysView;
