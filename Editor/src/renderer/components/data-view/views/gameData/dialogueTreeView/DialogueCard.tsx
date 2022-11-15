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
import NumberTextField from '../../../../widgets/form/NumberTextField';
import Select from '../../../../widgets/form/Select';
import TextField from '../../../../widgets/form/TextField';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';
import DialogueResponses from './DialogueResponses';

import type { Dialogue } from '../../../../../../../../SharedLibrary/src/interface';

export interface DialogueFieldsProps {
  dialogue: Dialogue;
  dialogues: Dialogue[];
  index: number;
  disabled: boolean;
  onChange: (value: Partial<Dialogue>) => void;
  onDelete: () => void;
  onSetStartingDialogue: () => void;
  startingDialogueId: number | undefined;
  getLocalizedValue: (key: string) => string;
  updateLocalizedValue: (key: string, value: string) => void;
  deleteLocalizedValues: (key: string[]) => void;
  moveLocalizations: (operations: { oldKey: string; newKey: string }[]) => void;
}

const DialogueFields = ({
  dialogue,
  dialogues,
  index,
  disabled,
  onChange,
  onDelete,
  onSetStartingDialogue,
  startingDialogueId,
  getLocalizedValue,
  updateLocalizedValue,
  deleteLocalizedValues,
  moveLocalizations
}: DialogueFieldsProps) => {
  const [deleting, setDeleting] = useState(false);

  const textKey = useMemo(() => `dialogue-${dialogue.key.toLowerCase()}-text`, [dialogue.key]);

  const handleOnDelete = useCallback(() => setDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);

    const localizationKeysToDelete = [textKey];

    dialogue.responses.forEach((response) => {
      localizationKeysToDelete.push(
        `dialogue-${dialogue.key.toLowerCase()}-response-${response.key.toLowerCase()}-text`
      );
    });

    deleteLocalizedValues(localizationKeysToDelete);
    onDelete();
  }, [deleteLocalizedValues, dialogue.key, dialogue.responses, onDelete, textKey]);
  const handleOnClose = useCallback(() => setDeleting(false), []);

  return (
    <>
      <Box>
        <Typography gutterBottom variant="h6" component="div">
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              {toTitleCaseFromKey(dialogue.key)}
              <IconButton
                aria-label="delete"
                color="error"
                size="small"
                disabled={disabled}
                sx={{ ml: 1 }}
                onClick={handleOnDelete}
                title="Delete dialogue"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
            {startingDialogueId !== dialogue.id ? (
              <Button
                variant="contained"
                color="primary"
                size="medium"
                disabled={disabled}
                onClick={() => onSetStartingDialogue()}
              >
                Set Starting Dialogue
              </Button>
            ) : null}
          </Box>
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', ml: 1 }}>
          <FormBox>
            <NumberTextField
              label="ID"
              value={dialogue.id}
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
              value={dialogue.key}
              onChange={(value) => {
                const operations: { oldKey: string; newKey: string }[] = [
                  {
                    oldKey: textKey,
                    newKey: `dialogue-${value.toLowerCase()}-text`
                  }
                ];

                dialogue.responses.forEach((response) => {
                  operations.push({
                    oldKey: `dialogue-${dialogue.key.toLowerCase()}-response-${response.key.toLowerCase()}-text`,
                    newKey: `dialogue-${value.toLowerCase()}-response-${response.key.toLowerCase()}-text`
                  });
                });

                moveLocalizations(operations);
                onChange({ key: value });
              }}
              required
              disabled={disabled}
            />
          </FormBox>
          <FormBox>
            <Select
              label="Next Dialogue"
              disabled={disabled}
              value={dialogue.nextDialogId}
              onChange={(value) => onChange({ nextDialogId: value })}
              options={dialogues?.map((entry) => ({
                label: toTitleCaseFromKey(entry.key),
                value: entry.id
              }))}
            />
          </FormBox>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', ml: 1 }}>
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
          <DialogueResponses
            responses={dialogue.responses}
            disabled={disabled}
            dialogue={dialogue}
            dialogues={dialogues}
            onChange={(responses) => onChange({ responses })}
            getLocalizedValue={getLocalizedValue}
            updateLocalizedValue={updateLocalizedValue}
            deleteLocalizedValues={deleteLocalizedValues}
            moveLocalizations={moveLocalizations}
          />
        </Box>
      </Box>
      <Dialog
        open={deleting}
        onClose={handleOnClose}
        aria-labelledby="deleting-dialogue-dialog-title"
        aria-describedby="deleting-dialogue-dialog-description"
      >
        <DialogTitle id="deleting-dialogue-dialog-title">Delete loot table dialogue {index + 1}</DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-dialogue-dialog-description">
            Are you sure you want to delete loot table dialogue {`'${dialogue.key}'`}?
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

export interface DialogueCardProps {
  dialogues: Dialogue[] | undefined;
  disabled?: boolean;
  onChange: (dialogue: Dialogue[]) => void;
  onSetStartingDialogue: (id: number) => void;
  startingDialogueId: number | undefined;
  getLocalizedValue: (key: string) => string;
  updateLocalizedValue: (key: string, value: string) => void;
  deleteLocalizedValues: (key: string[]) => void;
  moveLocalizations: (operations: { oldKey: string; newKey: string }[]) => void;
}

const DialogueCard = ({
  dialogues,
  disabled = true,
  onChange,
  onSetStartingDialogue,
  startingDialogueId,
  getLocalizedValue,
  updateLocalizedValue,
  deleteLocalizedValues,
  moveLocalizations
}: DialogueCardProps) => {
  return dialogues ? (
    <>
      {dialogues.map((dialogue, index) => (
        <Card key={`dialogue-${index}`} sx={index < dialogues.length - 1 ? { mb: 3 } : {}}>
          <DialogueFields
            dialogue={dialogue}
            dialogues={dialogues}
            index={index}
            disabled={disabled}
            onChange={(value) => {
              const newDialogues = [...(dialogues || [])];
              const i = newDialogues.indexOf(dialogue);
              if (i > -1) {
                newDialogues[i] = {
                  ...dialogue,
                  ...value
                };
                onChange(newDialogues);
              }
            }}
            onDelete={() => {
              const newDialogues = [...(dialogues || [])];
              const i = newDialogues.indexOf(dialogue);
              if (i > -1) {
                newDialogues.splice(i, 1);
                onChange(newDialogues);
              }
            }}
            onSetStartingDialogue={() => onSetStartingDialogue(dialogue.id)}
            startingDialogueId={startingDialogueId}
            getLocalizedValue={getLocalizedValue}
            updateLocalizedValue={updateLocalizedValue}
            deleteLocalizedValues={deleteLocalizedValues}
            moveLocalizations={moveLocalizations}
          />
        </Card>
      ))}
    </>
  ) : null;
};

export default DialogueCard;
