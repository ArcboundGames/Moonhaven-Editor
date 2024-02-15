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

import { useAppSelector } from '../../../../../hooks';
import {
  selectCreatureTypesByKeyWithName,
  selectCreatureTypesSortedWithName
} from '../../../../../store/slices/creatures';
import CreatureSelect from '../../../../widgets/form/creature/CreatureSelect';
import NumberTextField from '../../../../widgets/form/NumberTextField';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';
import SpriteImage from '../../../../widgets/SpriteImage';

import type { LocalizedCreatureType, WorldZoneSpawn } from '../../../../../../../../SharedLibrary/src/interface';

export interface WorldZoneSpawnsListCardFieldsProps {
  data: WorldZoneSpawn;
  index: number;
  total: number;
  disabled: boolean;
  creaturesByKey: Record<string, LocalizedCreatureType>;
  labelLowerCase: string;
  onChange: (value: WorldZoneSpawn) => void;
  onDelete: () => void;
}

const WorldZoneSpawnsListCardFields = ({
  data,
  disabled,
  creaturesByKey,
  labelLowerCase,
  onChange,
  onDelete
}: WorldZoneSpawnsListCardFieldsProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleOnDelete = useCallback(() => setDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    onDelete();
  }, [onDelete]);
  const handleOnClose = useCallback(() => setDeleting(false), []);

  const creatureType = useMemo(
    () => (data.creatureKey ? creaturesByKey[data.creatureKey] : null),
    [data, creaturesByKey]
  );

  const handleChange = useCallback(
    (partial: Partial<WorldZoneSpawn>) => {
      onChange({
        ...data,
        ...partial
      });
    },
    [data, onChange]
  );

  const name = useMemo(
    () => creatureType?.name ?? data.creatureKey ?? 'Unknown creature',
    [creatureType?.name, data.creatureKey]
  );

  return (
    <>
      <Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', alignItems: 'center' }}>
          <Typography gutterBottom variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <SpriteImage
              dataKey={data.creatureKey}
              width={creatureType?.sprite.width}
              height={creatureType?.sprite.height}
              sprite={0}
              type="creature"
              errorStyle="inline"
              targetSize={64}
            />
            <Box sx={{ ml: 1.5 }}>{name}</Box>
          </Typography>
          <FormBox>
            <NumberTextField
              label="Probability"
              value={data.probability}
              min={0}
              max={100}
              onChange={(value) => handleChange({ probability: value ?? 1 })}
              disabled={disabled}
              required
              helperText="Percent"
            />
          </FormBox>
          <FormBox>
            <NumberTextField
              label="Limit"
              value={data.limit}
              min={1}
              max={250}
              onChange={(value) => handleChange({ limit: value ?? 1 })}
              disabled={disabled}
              required
              wholeNumber
              helperText="In zone"
            />
          </FormBox>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              aria-label="delete"
              color="error"
              size="small"
              disabled={disabled}
              sx={{ ml: 1 }}
              onClick={handleOnDelete}
              title={`Delete ${labelLowerCase} ${name}`}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Dialog
        open={deleting}
        onClose={handleOnClose}
        aria-labelledby="deleting-loot-table-component-dialog-title"
        aria-describedby="deleting-loot-table-component-dialog-description"
      >
        <DialogTitle id="deleting-loot-table-component-dialog-title">
          Delete {labelLowerCase} {name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-loot-table-component-dialog-description">
            Are you sure you want to delete {labelLowerCase} {name}?
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

export interface WorldZoneSpawnsListCardProps {
  data: WorldZoneSpawn[] | undefined;
  disabled?: boolean;
  label: string;
  pluralLabel?: string;
  hideCard?: boolean;
  onChange: (data: WorldZoneSpawn[]) => void;
}

const WorldZoneSpawnsListCard = ({
  data,
  disabled = true,
  label,
  pluralLabel,
  hideCard,
  onChange
}: WorldZoneSpawnsListCardProps) => {
  const [adding, setAdding] = useState(false);
  const [creatureTypeToAdd, setCreatureTypeToAdd] = useState<string | undefined>(undefined);

  const creaturesByKey = useAppSelector(selectCreatureTypesByKeyWithName);
  const creatures = useAppSelector(selectCreatureTypesSortedWithName);

  const filteredCreatures = useMemo(
    () => creatures.filter((creature) => !data || !(creature.key in data)),
    [data, creatures]
  );

  const handleOnAdd = useCallback(() => {
    setCreatureTypeToAdd(undefined);
    setAdding(true);
  }, []);
  const handleOnAddClose = useCallback(() => {
    setCreatureTypeToAdd(undefined);
    setAdding(false);
  }, []);
  const handleOnAddConfirm = useCallback(() => {
    if (!creatureTypeToAdd) {
      return;
    }
    const newData = [...(data ?? [])];
    newData.push({
      creatureKey: creatureTypeToAdd,
      limit: 10,
      probability: 1
    });
    onChange(newData);
    setCreatureTypeToAdd(undefined);
    setAdding(false);
  }, [data, creatureTypeToAdd, onChange]);

  const labelLowerCase = useMemo(() => label.toLowerCase(), [label]);

  const renderedCreatures = useMemo(() => {
    if (!data) {
      return null;
    }

    return data.map((spawn, index) => (
      <WorldZoneSpawnsListCardFields
        key={`creature-${index}`}
        data={spawn}
        index={index}
        total={data.length}
        disabled={disabled}
        creaturesByKey={creaturesByKey}
        labelLowerCase={labelLowerCase}
        onChange={(value) => {
          const newData = [...(data ?? [])];
          newData[index] = value;
          onChange(newData);
        }}
        onDelete={() => {
          const newData = [...(data ?? [])];
          newData.splice(index, 1);
          onChange(newData);
        }}
      />
    ));
  }, [data, disabled, creaturesByKey, labelLowerCase, onChange]);

  return (
    <>
      {hideCard ? (
        <Box sx={{ width: '100%' }}>
          <Typography gutterBottom variant="h6" component="div">
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{pluralLabel ?? label}</div>
              <Button
                variant="contained"
                color="secondary"
                size="medium"
                endIcon={<AddIcon fontSize="medium" />}
                disabled={disabled}
                onClick={handleOnAdd}
              >
                Add {label}
              </Button>
            </Box>
          </Typography>
          {renderedCreatures}
        </Box>
      ) : (
        <Card
          header={
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{pluralLabel ?? label}</div>
              <Button
                variant="contained"
                color="secondary"
                size="medium"
                endIcon={<AddIcon fontSize="medium" />}
                disabled={disabled}
                onClick={handleOnAdd}
              >
                Add {label}
              </Button>
            </Box>
          }
        >
          {renderedCreatures}
        </Card>
      )}
      <Dialog
        open={adding}
        onClose={handleOnAddClose}
        aria-labelledby="add-creature-dialog-title"
        aria-describedby="add-creature-dialog-description"
      >
        <DialogTitle id="add-creature-dialog-title">Add {label}</DialogTitle>
        <DialogContent sx={{ width: 300 }}>
          <Box sx={{ mt: 3, mb: 3, ml: 2, mr: 2 }}>
            <FormBox>
              <CreatureSelect
                label="Creature"
                required
                disabled={disabled}
                value={creatureTypeToAdd}
                onChange={(value) => setCreatureTypeToAdd(value)}
                creatures={filteredCreatures}
              />
            </FormBox>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOnAddClose} color="primary" autoFocus disabled={disabled}>
            Cancel
          </Button>
          <Button
            onClick={handleOnAddConfirm}
            variant="contained"
            color="primary"
            disabled={disabled || creatureTypeToAdd === undefined}
          >
            Add {labelLowerCase}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WorldZoneSpawnsListCard;
