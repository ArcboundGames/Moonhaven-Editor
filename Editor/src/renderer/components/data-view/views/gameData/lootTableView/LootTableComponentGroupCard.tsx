import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { useCallback, useState } from 'react';

import NumberTextField from '../../../../widgets/form/NumberTextField';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';
import LootTableComponentView from './LootTableComponentView';

import type { LootTableComponentGroup } from '../../../../../../../../SharedLibrary/src/interface';

interface LootTableComponentGroupCardProps {
  index: number;
  group: LootTableComponentGroup;
  disabled: boolean;
  onChange: (value: LootTableComponentGroup) => void;
  onDelete?: () => void;
  header?: JSX.Element | null;
}

const LootTableComponentGroupCard = ({
  index,
  group,
  disabled,
  onChange,
  onDelete,
  header
}: LootTableComponentGroupCardProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleOnDelete = useCallback(() => setDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    if (onDelete) {
      onDelete();
    }
  }, [onDelete]);
  const handleOnClose = useCallback(() => setDeleting(false), []);

  return (
    <>
      <Card
        header={
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              {index === -1 ? 'Default Group' : `Group ${index + 1}`}
              {onDelete ? (
                <IconButton
                  key={`group-${index}-delete-button`}
                  aria-label="delete"
                  color="error"
                  size="small"
                  disabled={disabled}
                  sx={{ ml: 1 }}
                  onClick={handleOnDelete}
                  title="Delete component"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              ) : null}
            </Box>
            {header}
          </Box>
        }
      >
        {index !== -1 ? (
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <FormBox>
                  <NumberTextField
                    label="Probability"
                    required
                    value={group.probability}
                    min={0}
                    max={100}
                    endAdornment="%"
                    onChange={(value) =>
                      onChange({
                        ...group,
                        probability: value
                      })
                    }
                    disabled={disabled}
                    error={group.probability < 0 || group.probability > 100}
                    wholeNumber
                  />
                </FormBox>
              </Box>
            </Box>
          </Box>
        ) : null}
        <LootTableComponentView
          components={group.components}
          disabled={disabled}
          onChange={(components) =>
            onChange({
              ...group,
              components
            })
          }
        />
      </Card>
      {onDelete ? (
        <Dialog
          key={`group-${index}-delete-dialog`}
          open={deleting}
          onClose={handleOnClose}
          aria-labelledby="deleting-loot-table-component-group-dialog-title"
          aria-describedby="deleting-loot-table-component-group-dialog-description"
        >
          <DialogTitle id="deleting-loot-table-component-group-dialog-title">
            Delete loot table component group {index + 1}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="deleting-loot-table-component-group-dialog-description">
              Are you sure you want to delete loot table component group {index + 1}?
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
      ) : null}
    </>
  );
};

export default LootTableComponentGroupCard;
