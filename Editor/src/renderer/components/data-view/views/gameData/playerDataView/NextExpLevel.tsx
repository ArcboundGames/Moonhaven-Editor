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
import { useCallback, useState } from 'react';

import NumberTextField from '../../../../widgets/form/NumberTextField';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';

export interface NextLevelExpFieldsProps {
  nextLevelExp: number;
  index: number;
  total: number;
  disabled: boolean;
  onChange: (value: number) => void;
  onDelete: () => void;
}

const NextLevelExpFields = ({ nextLevelExp, index, total, disabled, onChange, onDelete }: NextLevelExpFieldsProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleOnDelete = useCallback(() => setDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    onDelete();
  }, [onDelete]);
  const handleOnClose = useCallback(() => setDeleting(false), []);

  return (
    <>
      <Box sx={index < total - 1 ? { borderBottom: 1, borderColor: 'divider', pb: 2 } : {}}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', alignItems: 'center' }}>
          <Typography gutterBottom variant="subtitle2" component="div" sx={{ marginTop: 2 }}>
            {`Level ${index + 2}`}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' }}>
            <FormBox>
              <NumberTextField
                label="Exp"
                value={nextLevelExp}
                min={1}
                onChange={(value) => onChange(value ?? 1)}
                disabled={disabled}
                required
                wholeNumber
              />
            </FormBox>
          </Box>
          <IconButton
            aria-label="delete"
            color="error"
            size="small"
            disabled={disabled}
            sx={{ ml: 1 }}
            onClick={handleOnDelete}
            title="Delete level"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Dialog
        open={deleting}
        onClose={handleOnClose}
        aria-labelledby="deleting-next-level-exp-dialog-title"
        aria-describedby="deleting-next-level-exp-dialog-description"
      >
        <DialogTitle id="deleting-next-level-exp-dialog-title">Delete level {index + 2}</DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-next-level-exp-dialog-description">
            Are you sure you want to delete level {index + 2}? Other levels will shift up.
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

export interface NextLevelExpCardProps {
  nextLevelExps: number[];
  disabled?: boolean;
  onChange: (nextLevelExp: number[]) => void;
}

const NextLevelExpCard = ({ nextLevelExps, disabled = true, onChange }: NextLevelExpCardProps) => {
  return (
    <Card
      header={
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Next Level Exp</div>
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            endIcon={<AddIcon fontSize="medium" />}
            disabled={disabled}
            onClick={() => {
              onChange([...(nextLevelExps || []), 1]);
            }}
          >
            Add level
          </Button>
        </Box>
      }
    >
      {nextLevelExps?.map((nextLevelExp, index) => (
        <NextLevelExpFields
          key={`nextLevelExp-${index}`}
          nextLevelExp={nextLevelExp}
          index={index}
          total={nextLevelExps.length ?? 0}
          disabled={disabled}
          onChange={(value) => {
            const newNextLevelExps = [...(nextLevelExps || [])];
            newNextLevelExps[index] = value;
            onChange(newNextLevelExps);
          }}
          onDelete={() => {
            const newNextLevelExps = [...(nextLevelExps || [])];
            newNextLevelExps.splice(index, 1);
            onChange(newNextLevelExps);
          }}
        />
      ))}
    </Card>
  );
};

export default NextLevelExpCard;
