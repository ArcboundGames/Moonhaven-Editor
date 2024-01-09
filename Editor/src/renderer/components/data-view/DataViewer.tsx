/* eslint-disable react/destructuring-assignment */
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DATA_FILE_EXTENSION } from '../../../../../SharedLibrary/src/constants';
import { toDataObject } from '../../../../../SharedLibrary/src/util/converters.util';
import { cleanObject } from '../../../../../SharedLibrary/src/util/object.util';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectPath } from '../../store/slices/data';
import deepEqual from '../../util/deepEqual';
import saveJsonToFile from '../../util/save.util';

import type { Section } from '../../../../../SharedLibrary/src/interface';

export interface SingletonViewerProps<T extends object> extends BaseDataViewerProps<T> {
  dataKey?: undefined;
  fileSection?: undefined;
  section: 'player-data' | 'world-settings' | 'localization-key';
  onSave: (dataSaved: T) => void;
}

export interface GameDataNestedViewerProps<T extends object, F extends Record<string, unknown>>
  extends BaseDataViewerProps<T> {
  dataKey: string;
  defaultValue?: T;
  fileSection: string;
  section: Omit<Section, 'player-data' | 'world-settings' | 'localization-key'>;
  valueDataKey: string | undefined;
  getFileData: () => F;
  onSave: (dataSaved: T[], valueSaved: T | undefined) => void;
}

export interface BaseDataViewerProps<T extends object> {
  value: T | undefined;
  file: string;
  children: (input: { data: T; handleOnChange: (input: Partial<T>) => void; disabled: boolean }) => JSX.Element;
  getName: (data: T) => string;
  getHeader?: (data: T) => JSX.Element;
  onDataChange?: (data: T | undefined) => void;
  validate: (data: T) => string[] | Record<string, string[]> | Promise<string[]> | Promise<Record<string, string[]>>;
  onPreSave?: (valueToBeSaved: T) => T;
  onDisable?: (disabled: boolean) => void;
  onRevert?: () => void;
  dirty?: boolean;
}

export type DataViewerProps<T extends object, F extends Record<string, unknown>> =
  | GameDataNestedViewerProps<T, F>
  | SingletonViewerProps<T>;

function isSingletonViewerProps<T extends object, F extends Record<string, unknown>>(
  props: DataViewerProps<T, F>
): props is SingletonViewerProps<T> {
  return props.section === 'player-data' || props.section === 'world-settings' || props.section === 'localization-key';
}

const DataViewer = <T extends object, F extends Record<string, unknown>>(props: DataViewerProps<T, F>) => {
  const {
    dataKey,
    section,
    value,
    file,
    fileSection,
    children,
    getName,
    getHeader,
    onDataChange,
    validate,
    onDisable,
    onPreSave,
    onRevert,
    dirty
  } = props;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [data, setData] = useState<T>();
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [reverting, setReverting] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(false);

  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[] | Record<string, string[]> | undefined>(undefined);

  const [dataKeyChanged, setDataKeyChanged] = useState<boolean>(false);
  useEffect(() => {
    if (isSingletonViewerProps(props)) {
      return;
    }
    if (props.dataKey === props.valueDataKey || props.dataKey === 'new') {
      setDataKeyChanged(false);
    }
  }, [props]);

  useEffect(() => {
    if (onDisable) {
      onDisable(saving || deleting || reverting);
    }
  }, [deleting, onDisable, reverting, saving]);

  const path = useAppSelector(selectPath);
  const name = useMemo(() => {
    if (!data) {
      return '';
    }
    return getName(data);
  }, [getName, data]);

  const header = useMemo(() => {
    if (!data) {
      return '';
    }
    return getHeader !== undefined ? getHeader(data) : getName(data);
  }, [getHeader, getName, data]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setData(undefined);
    if (onDataChange) {
      onDataChange(undefined);
    }
    setSaving(false);
    setDeleting(false);
  }, [dataKey, onDataChange]);

  useEffect(() => {
    if (dataKey === 'new') {
      return;
    }
    setData(value);
    if (onDataChange) {
      onDataChange(value);
    }
  }, [value, dataKey, onDataChange]);

  useEffect(() => {
    if (isSingletonViewerProps(props)) {
      return;
    }

    if (dataKey === 'new') {
      if (data === undefined) {
        const newValue = props.defaultValue;
        setData(newValue);
        if (onDataChange) {
          onDataChange(newValue);
        }
      }
    }
  }, [data, dataKey, onDataChange, props]);

  const handleOnRevertConfirm = useCallback(() => {
    setData(value);
    if (onDataChange) {
      onDataChange(value);
    }
    if (onRevert) {
      onRevert();
    }
    setReverting(false);
  }, [onDataChange, onRevert, value]);

  const handleOnRevert = useCallback(() => {
    setReverting(true);
  }, []);

  const handleCloseReverting = useCallback(() => {
    setReverting(false);
  }, []);

  const handleOnDeleteConfirm = useCallback(async () => {
    if (isSingletonViewerProps(props) || !path || !value) {
      return;
    }

    setSaving(true);

    const dataFile = props.getFileData();

    const currentData = dataFile[props.fileSection] as T[];
    const dataToSave = [...currentData];
    const index = dataToSave.indexOf(value);
    if (index > -1) {
      dataToSave.splice(index, 1);
    }

    saveJsonToFile(
      await window.api.join(path, `${file}${DATA_FILE_EXTENSION}`),
      {
        ...dataFile,
        [props.fileSection]: dataToSave
      },
      section as Section,
      dispatch
    );

    props.onSave(dataToSave, undefined);

    setDeleting(false);
    setSaving(false);
  }, [dispatch, file, path, props, section, value]);

  const handleOnDelete = useCallback(() => {
    setDeleting(true);
  }, []);

  const handleCloseDeleting = useCallback(() => {
    setDeleting(false);
  }, []);

  const handleCloseErrors = useCallback(() => {
    setShowErrors(false);
  }, []);

  const handleOnSave = useCallback(
    async (saveOverride: boolean) => {
      if (!path || !data) {
        return;
      }

      setSaving(true);

      let individualDataToSave = data;
      if (onPreSave) {
        individualDataToSave = onPreSave(data);
      }

      if (!saveOverride) {
        const sectionErrors = await validate(individualDataToSave);
        if (Array.isArray(sectionErrors) ? sectionErrors.length > 0 : Object.keys(sectionErrors).length > 0) {
          setErrors(sectionErrors);
          setShowErrors(true);
          setSaving(false);
          return;
        }
      }

      if (isSingletonViewerProps(props)) {
        saveJsonToFile(
          await window.api.join(path, `${file}${DATA_FILE_EXTENSION}`),
          individualDataToSave,
          section as Section,
          dispatch
        );

        props.onSave(individualDataToSave);
      } else {
        const dataFile = props.getFileData();
        const currentData = dataFile[props.fileSection] as T[];
        const dataToSave: T[] = [...currentData];
        if (value) {
          const index = dataToSave.indexOf(value);
          if (index > -1) {
            dataToSave[index] = individualDataToSave;
          }
        } else {
          dataToSave.push(individualDataToSave);
        }

        saveJsonToFile(
          await window.api.join(path, `${file}${DATA_FILE_EXTENSION}`),
          {
            ...dataFile,
            [props.fileSection]: dataToSave
          },
          section as Section,
          dispatch
        );
        props.onSave(dataToSave, individualDataToSave);

        if (dataKey === 'new' || props.valueDataKey !== dataKey) {
          navigate(`/${section}/${props.valueDataKey}`);
        }
      }

      setSaving(false);
    },
    [data, dataKey, dispatch, file, navigate, onPreSave, path, props, section, validate, value]
  );

  const handleSaveOverride = useCallback(() => {
    setShowErrors(false);
    handleOnSave(true);
  }, [handleOnSave]);

  const handleOnChange = useCallback(
    (input: Partial<T>) => {
      if (Array.isArray(input)) {
        setData(input as T);
        return;
      }

      const newData = cleanObject<T>(
        toDataObject<T>(section as Section, fileSection, {
          ...data,
          ...input
        })
      );

      setData(newData);

      if (onDataChange) {
        onDataChange(newData);
      }
    },
    [data, fileSection, onDataChange, section]
  );

  useEffect(() => {
    if (!data) {
      setValid(false);
      return;
    }
    setValid(Boolean(isSingletonViewerProps(props) || props.valueDataKey));
  }, [data, props]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
        handleOnSave(false);
      }
    },
    [handleOnSave]
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  const isDeepEqual = useMemo(() => deepEqual(data, value), [data, value]);

  const errorsText = useMemo(() => {
    if (!errors) {
      return null;
    }

    let allErrors: string[];
    if (Array.isArray(errors)) {
      allErrors = errors;
    } else {
      allErrors = Object.keys(errors).reduce((combinedErrors, errorKey) => {
        combinedErrors.push(...errors[errorKey]);
        return combinedErrors;
      }, [] as string[]);
    }

    return (
      <List dense>
        {allErrors.map((error, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <ListItem key={`${section}-error-${index}`}>
            <ListItemText primary={error} />
          </ListItem>
        ))}
      </List>
    );
  }, [errors, section]);

  if (!data) {
    return (
      <Box
        key="select-one"
        sx={{
          display: 'flex',
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          marginTop: '80px',
          alignItems: 'flex-start'
        }}
      >
        <Alert severity="info">Select {section.replace(/-/g, ' ')} to get started!</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <AppBar position="relative" enableColorOnDark color="default" sx={{ height: '68px', zIndex: 101 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: '100%', padding: '16px' }}>
          <Typography variant="h5" component="h5">
            {header}
          </Typography>
          <Box sx={{ display: 'flex' }}>
            {!isSingletonViewerProps(props) && dataKey !== 'new' ? (
              <Box key="delete" sx={{ m: 1 }}>
                <Button color="error" onClick={handleOnDelete} disabled={saving || deleting || showErrors}>
                  Delete
                </Button>
                <Dialog
                  open={deleting}
                  onClose={handleCloseDeleting}
                  aria-labelledby="deleting-dialog-title"
                  aria-describedby="deleting-dialog-description"
                >
                  <DialogTitle id="deleting-dialog-title">Delete {name}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="deleting-dialog-description">
                      Are you sure you want to delete {name}?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseDeleting} color="primary" autoFocus>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        handleOnDeleteConfirm();
                      }}
                      color="error"
                    >
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            ) : null}
            {dirty || (!dataKeyChanged && !isDeepEqual) ? (
              <>
                {dataKey !== 'new' ? (
                  <Box key="revert" sx={{ m: 1 }}>
                    <Button color="secondary" onClick={handleOnRevert} disabled={saving || deleting || showErrors}>
                      Revert
                    </Button>
                    <Dialog
                      open={reverting}
                      onClose={handleCloseReverting}
                      aria-labelledby="reverting-dialog-title"
                      aria-describedby="reverting-dialog-description"
                    >
                      <DialogTitle id="reverting-dialog-title">Revert {name}</DialogTitle>
                      <DialogContent>
                        <DialogContentText id="reverting-dialog-description">
                          Are you sure you want to revert {name}? All changes will be lost.
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseReverting} color="primary" autoFocus>
                          Cancel
                        </Button>
                        <Button onClick={handleOnRevertConfirm} color="secondary">
                          Revert
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Box>
                ) : null}
                <Box key="save" sx={{ m: 1 }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      handleOnSave(false);
                    }}
                    disabled={saving || deleting || showErrors || !valid}
                  >
                    Save
                  </Button>
                </Box>
              </>
            ) : null}
          </Box>
        </Box>
      </AppBar>
      <Box
        id="data-viewer-content"
        sx={{
          padding: '16px 8px',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {children({ data, handleOnChange, disabled: saving || deleting || showErrors })}
      </Box>
      <Dialog
        open={showErrors}
        onClose={handleCloseErrors}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Errors found while saving</DialogTitle>
        <DialogContent>{errorsText}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrors} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveOverride} color="error">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataViewer;
