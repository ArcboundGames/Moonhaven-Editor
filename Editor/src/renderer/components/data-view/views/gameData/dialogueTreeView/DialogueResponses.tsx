/* eslint-disable react/no-array-index-key */
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useCallback, useMemo, useState } from 'react';

import { toTitleCaseFromKey } from '../../../../../../../../SharedLibrary/src/util/string.util';
import { getNewDialogueResponse } from '../../../../../util/section.util';
import NumberTextField from '../../../../widgets/form/NumberTextField';
import Select from '../../../../widgets/form/Select';
import TextField from '../../../../widgets/form/TextField';
import FormBox from '../../../../widgets/layout/FormBox';

import type { Dialogue, DialogueResponse } from '../../../../../../../../SharedLibrary/src/interface';

export interface DialogueResponseFieldsProps {
  response: DialogueResponse;
  dialogue: Dialogue;
  dialogues: Dialogue[];
  index: number;
  total: number;
  disabled: boolean;
  onChange: (value: Partial<DialogueResponse>) => void;
  onDelete: () => void;
  getLocalizedValue: (key: string) => string;
  updateLocalizedValue: (key: string, value: string) => void;
  deleteLocalizedValues: (key: string[]) => void;
  moveLocalizations: (operations: { oldKey: string; newKey: string }[]) => void;
}

const DialogueResponseFields = ({
  response,
  dialogue,
  dialogues,
  index,
  total,
  disabled,
  onChange,
  onDelete,
  getLocalizedValue,
  updateLocalizedValue,
  deleteLocalizedValues,
  moveLocalizations
}: DialogueResponseFieldsProps) => {
  const [deleting, setDeleting] = useState(false);

  const textKey = useMemo(
    () => `dialogue-${dialogue.key.toLowerCase()}-response-${response.key.toLowerCase()}-text`,
    [dialogue.key, response.key]
  );

  const handleOnDelete = useCallback(() => setDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    deleteLocalizedValues([textKey]);
    onDelete();
  }, [deleteLocalizedValues, onDelete, textKey]);
  const handleOnClose = useCallback(() => setDeleting(false), []);

  return (
    <>
      <Box sx={index < total - 1 ? { borderBottom: 1, borderColor: 'divider', pb: 2 } : {}}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 4fr 4fr 10fr 1fr', alignItems: 'flex-start' }}>
          <FormBox>
            <NumberTextField
              label="ID"
              value={response.id}
              onChange={(value) =>
                onChange({
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
              value={response.key}
              onChange={(value) => {
                moveLocalizations([
                  {
                    oldKey: textKey,
                    newKey: `dialogue-${dialogue.key.toLowerCase()}-response-${value.toLowerCase()}-text`
                  }
                ]);
                onChange({ key: value });
              }}
              required
              disabled={disabled}
            />
          </FormBox>
          <FormBox>
            <Select
              label="Next Dialogue"
              required
              disabled={disabled}
              value={response.nextDialogId}
              onChange={(value) => onChange({ nextDialogId: value })}
              options={dialogues?.map((entry) => ({
                label: toTitleCaseFromKey(entry.key),
                value: entry.id
              }))}
            />
          </FormBox>
          <FormBox>
            <TextField
              label="Text"
              value={getLocalizedValue(textKey)}
              onChange={(value) => updateLocalizedValue(textKey, value)}
              required
              disabled={disabled}
              multiline
              rows={4}
            />
          </FormBox>
          <FormBox>
            <IconButton
              aria-label="delete"
              color="error"
              size="small"
              disabled={disabled}
              sx={{ ml: 1 }}
              onClick={handleOnDelete}
              title="Delete response"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </FormBox>
        </Box>
      </Box>
      <Dialog
        open={deleting}
        onClose={handleOnClose}
        aria-labelledby="deleting-dialogue-response-dialog-title"
        aria-describedby="deleting-dialogue-response-dialog-description"
      >
        <DialogTitle id="deleting-dialogue-response-dialog-title">Delete dialogue response {index + 1}</DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-dialogue-response-dialog-description">
            Are you sure you want to delete dialogue response {`'${response.key}'`}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOnClose} color="primary" autoFocus disabled={disabled}>
            Cancel
          </Button>
          <Button onClick={handleOnDeleteConfirm} color="error" disabled={disabled}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export interface DialogueResponseCardProps {
  responses: DialogueResponse[] | undefined;
  dialogue: Dialogue;
  dialogues: Dialogue[];
  disabled?: boolean;
  onChange: (response: DialogueResponse[]) => void;
  getLocalizedValue: (key: string) => string;
  updateLocalizedValue: (key: string, value: string) => void;
  deleteLocalizedValues: (key: string[]) => void;
  moveLocalizations: (operations: { oldKey: string; newKey: string }[]) => void;
}

const DialogueResponses = ({
  responses,
  dialogue,
  dialogues,
  disabled = true,
  onChange,
  getLocalizedValue,
  updateLocalizedValue,
  deleteLocalizedValues,
  moveLocalizations
}: DialogueResponseCardProps) => {
  return (
    <>
      <Typography gutterBottom variant="h6" component="div" sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', ml: -1 }}>
          <div>Responses</div>
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            endIcon={<AddIcon fontSize="medium" />}
            disabled={disabled}
            onClick={() => {
              const newDialogueResponses = [...(responses || []), getNewDialogueResponse(responses)];
              onChange(newDialogueResponses);
            }}
          >
            Add Response
          </Button>
        </Box>
      </Typography>
      {responses?.map((response, index) => (
        <DialogueResponseFields
          key={`response-${index}`}
          response={response}
          dialogue={dialogue}
          dialogues={dialogues}
          index={index}
          total={responses.length ?? 0}
          disabled={disabled}
          onChange={(value) => {
            const newDialogueResponses = [...(responses || [])];
            const i = newDialogueResponses.indexOf(response);
            if (i > -1) {
              newDialogueResponses[i] = {
                ...response,
                ...value
              };
              onChange(newDialogueResponses);
            }
          }}
          onDelete={() => {
            const newDialogueResponses = [...(responses || [])];
            const i = newDialogueResponses.indexOf(response);
            if (i > -1) {
              newDialogueResponses.splice(i, 1);
              onChange(newDialogueResponses);
            }
          }}
          getLocalizedValue={getLocalizedValue}
          updateLocalizedValue={updateLocalizedValue}
          deleteLocalizedValues={deleteLocalizedValues}
          moveLocalizations={moveLocalizations}
        />
      ))}
    </>
  );
};

export default DialogueResponses;
