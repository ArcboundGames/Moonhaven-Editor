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

import ItemSelect from '../../../../widgets/form/item/ItemSelect';
import NumberTextField from '../../../../widgets/form/NumberTextField';
import FormBox from '../../../../widgets/layout/FormBox';

import type { LootTableComponent } from '../../../../../../../../SharedLibrary/src/interface';

export interface LootTableComponentFieldsProps {
  component: LootTableComponent;
  index: number;
  total: number;
  disabled: boolean;
  onChange: (value: Partial<LootTableComponent>) => void;
  onDelete: () => void;
}

const LootTableComponentFields = ({
  component,
  index,
  total,
  disabled,
  onChange,
  onDelete
}: LootTableComponentFieldsProps) => {
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
        <Typography gutterBottom variant="subtitle2" component="div" sx={{ marginTop: 2 }}>
          {`Component ${index + 1}`}
          <IconButton
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
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <FormBox key="lootTableKey">
            <ItemSelect
              label="Item"
              required
              disabled={disabled}
              value={component.typeKey}
              valueGetter={(item) => item.key}
              onChange={(value) => onChange({ typeKey: value })}
            />
          </FormBox>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          <FormBox>
            <NumberTextField
              label="Min Amount"
              required
              value={component.min}
              min={0}
              onChange={(value) => onChange({ min: value })}
              disabled={disabled}
              error={component.min > component.max}
              wholeNumber
            />
          </FormBox>
          <FormBox>
            <NumberTextField
              label="Max Amount"
              required
              value={component.max}
              min={1}
              onChange={(value) => onChange({ max: value })}
              disabled={disabled}
              error={component.min > component.max}
              wholeNumber
            />
          </FormBox>
          <FormBox>
            <NumberTextField
              label="Probability"
              required
              value={component.probability}
              min={0}
              max={100}
              endAdornment="%"
              onChange={(value) => onChange({ probability: value })}
              disabled={disabled}
              wholeNumber
            />
          </FormBox>
        </Box>
      </Box>
      <Dialog
        open={deleting}
        onClose={handleOnClose}
        aria-labelledby="deleting-loot-table-component-dialog-title"
        aria-describedby="deleting-loot-table-component-dialog-description"
      >
        <DialogTitle id="deleting-loot-table-component-dialog-title">
          Delete loot table component {index + 1}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-loot-table-component-dialog-description">
            Are you sure you want to delete loot table component {index + 1}?
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

function createLootTableComponent(): LootTableComponent {
  return {
    min: 1,
    max: 1,
    probability: 100
  };
}

export interface LootTableComponentViewProps {
  components: LootTableComponent[] | undefined;
  disabled?: boolean;
  onChange: (component: LootTableComponent[]) => void;
}

const LootTableComponentView = ({ components, disabled = true, onChange }: LootTableComponentViewProps) => {
  return (
    <>
      <Typography gutterBottom variant="subtitle2" component="div">
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Components</div>
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            endIcon={<AddIcon fontSize="medium" />}
            disabled={disabled}
            onClick={() => {
              onChange([...(components || []), createLootTableComponent()]);
            }}
          >
            Add Component
          </Button>
        </Box>
      </Typography>
      {components?.map((component, index) => (
        <LootTableComponentFields
          key={`component-${index}`}
          component={component}
          index={index}
          total={components.length ?? 0}
          disabled={disabled}
          onChange={(value) => {
            const newComponents = [...(components || [])];
            const i = newComponents.indexOf(component);
            if (i > -1) {
              newComponents[i] = {
                ...component,
                ...value
              };
              onChange(newComponents);
            }
          }}
          onDelete={() => {
            const newComponents = [...(components || [])];
            const i = newComponents.indexOf(component);
            if (i > -1) {
              newComponents.splice(i, 1);
              onChange(newComponents);
            }
          }}
        />
      ))}
    </>
  );
};

export default LootTableComponentView;
