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
import { useCallback, useState } from 'react';

import { createCampSpawn } from '../../../../../../../../../SharedLibrary/src/util/converters.util';
import NumberTextField from '../../../../../widgets/form/NumberTextField';
import Vector2Field from '../../../../../widgets/form/Vector2Field';
import Card from '../../../../../widgets/layout/Card';
import FormBox from '../../../../../widgets/layout/FormBox';

import type { CampSpawn } from '../../../../../../../../../SharedLibrary/src/interface';

export interface CampSpawnFieldsProps {
  campSpawn: CampSpawn;
  index: number;
  total: number;
  disabled: boolean;
  onChange: (value: Partial<CampSpawn>) => void;
  onDelete: () => void;
}

const CampSpawnFields = ({ campSpawn, index, total, disabled, onChange, onDelete }: CampSpawnFieldsProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleOnDelete = useCallback(() => setDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    onDelete();
  }, [onDelete]);
  const handleOnClose = useCallback(() => setDeleting(false), []);

  return (
    <>
      <Box sx={index + 1 < total ? { borderBottom: 1, borderColor: 'divider' } : {}}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            <Box>
              <Vector2Field
                value={campSpawn.position}
                helperText="Position"
                disabled={disabled}
                required
                onChange={(value) =>
                  onChange({
                    position: value
                  })
                }
              />
            </Box>
            <Box>
              <FormBox>
                <NumberTextField
                  label="Max Population"
                  value={campSpawn.maxPopulation}
                  min={1}
                  max={250}
                  onChange={(value) =>
                    onChange({
                      maxPopulation: value
                    })
                  }
                  required
                  disabled={disabled}
                  wholeNumber
                />
              </FormBox>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              aria-label="delete"
              color="error"
              size="small"
              disabled={disabled}
              sx={{ ml: 1 }}
              onClick={handleOnDelete}
              title="Delete camp spawn"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Dialog
        open={deleting}
        onClose={handleOnClose}
        aria-labelledby="deleting-camp-spawn-dialog-title"
        aria-describedby="deleting-camp-spawn-dialog-description"
      >
        <DialogTitle id="deleting-camp-spawn-dialog-title">Delete camp spawn &quot;{index + 1}&quot;</DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-camp-spawn-dialog-description">
            Are you sure you want to delete camp spawn &quot;{index + 1}&quot;?
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

export interface CampSpawnCardProps {
  campSpawns: CampSpawn[] | undefined;
  disabled?: boolean;
  onChange: (campSpawns: CampSpawn[]) => void;
}

const CampSpawnCard = ({ campSpawns, disabled = true, onChange }: CampSpawnCardProps) => {
  return (
    <Card
      header={
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Camp Spawns</div>
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            endIcon={<AddIcon fontSize="medium" />}
            disabled={disabled}
            onClick={() => {
              onChange([...(campSpawns || []), createCampSpawn()]);
            }}
          >
            Add camp spawn
          </Button>
        </Box>
      }
    >
      {campSpawns?.map((campSpawn, index) => (
        <CampSpawnFields
          key={`camp-spawn-${index}`}
          campSpawn={campSpawn}
          index={index}
          total={campSpawns.length}
          disabled={disabled}
          onChange={(value) => {
            const newCampSpawns = [...(campSpawns || [])];
            const i = newCampSpawns.indexOf(campSpawn);
            if (i > -1) {
              newCampSpawns[i] = {
                ...campSpawn,
                ...value
              };
              onChange(newCampSpawns);
            }
          }}
          onDelete={() => {
            const newCampSpawns = [...(campSpawns || [])];
            const i = newCampSpawns.indexOf(campSpawn);
            if (i > -1) {
              newCampSpawns.splice(i, 1);
              onChange(newCampSpawns);
            }
          }}
        />
      ))}
    </Card>
  );
};

export default CampSpawnCard;
