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
import { selectItemTypesByKeyWithName, selectItemTypesSortedWithName } from '../../../../../store/slices/items';
import ItemSelect from '../../../../widgets/form/item/ItemSelect';
import NumberTextField from '../../../../widgets/form/NumberTextField';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';
import SpriteImage from '../../../../widgets/SpriteImage';

import type { LocalizedItemType } from '../../../../../../../../SharedLibrary/src/interface';

export interface ItemsListCardFieldsProps {
  itemType: string;
  amount: number;
  index: number;
  total: number;
  disabled: boolean;
  itemsByKey: Record<string, LocalizedItemType>;
  labelLowerCase: string;
  onChange: (value: number) => void;
  onDelete: () => void;
}

const ItemsListCardFields = ({
  itemType,
  amount,
  disabled,
  itemsByKey,
  labelLowerCase,
  onChange,
  onDelete
}: ItemsListCardFieldsProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleOnDelete = useCallback(() => setDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    onDelete();
  }, [onDelete]);
  const handleOnClose = useCallback(() => setDeleting(false), []);

  const name = useMemo(() => itemsByKey[itemType]?.name ?? itemType, [itemType, itemsByKey]);

  return (
    <>
      <Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', alignItems: 'center' }}>
          <Typography gutterBottom variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <SpriteImage dataKey={itemType} width={16} height={16} sprite={0} type="item" errorStyle="inline" />
            <Box sx={{ ml: 1.5 }}>{name}</Box>
          </Typography>
          <FormBox>
            <NumberTextField
              label="Amount"
              value={amount}
              min={1}
              onChange={(value) => onChange(value)}
              disabled={disabled}
              required
              wholeNumber
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

export interface ItemsListCardProps {
  data: Record<string, number> | undefined;
  disabled?: boolean;
  label: string;
  pluralLabel?: string;
  hideCard?: boolean;
  onChange: (data: Record<string, number>) => void;
}

const ItemsListCard = ({ data, disabled = true, label, pluralLabel, hideCard, onChange }: ItemsListCardProps) => {
  const [adding, setAdding] = useState(false);
  const [itemTypeToAdd, setItemTypeToAdd] = useState<string | undefined>(undefined);

  const itemsByKey = useAppSelector(selectItemTypesByKeyWithName);
  const items = useAppSelector(selectItemTypesSortedWithName);

  const filteredItems = useMemo(() => items.filter((item) => !data || !(item.key in data)), [data, items]);

  const handleOnAdd = useCallback(() => {
    setItemTypeToAdd(undefined);
    setAdding(true);
  }, []);
  const handleOnAddClose = useCallback(() => {
    setItemTypeToAdd(undefined);
    setAdding(false);
  }, []);
  const handleOnAddConfirm = useCallback(() => {
    if (!itemTypeToAdd) {
      return;
    }
    const newData = { ...data };
    newData[itemTypeToAdd] = 1;
    onChange(newData);
    setItemTypeToAdd(undefined);
    setAdding(false);
  }, [data, itemTypeToAdd, onChange]);

  const keys = useMemo(() => (data ? Object.keys(data) : []), [data]);

  const labelLowerCase = useMemo(() => label.toLowerCase(), [label]);

  const renderedItems = useMemo(() => {
    if (!data) {
      return null;
    }

    return keys.map((itemType, index) => (
      <ItemsListCardFields
        key={`item-${index}`}
        itemType={itemType}
        amount={data[itemType] ?? 0}
        index={index}
        total={keys.length}
        disabled={disabled}
        itemsByKey={itemsByKey}
        labelLowerCase={labelLowerCase}
        onChange={(value) => {
          const newData = { ...data };
          newData[itemType] = value;
          onChange(newData);
        }}
        onDelete={() => {
          const newData = { ...data };
          delete newData[itemType];
          onChange(newData);
        }}
      />
    ));
  }, [data, disabled, itemsByKey, keys, labelLowerCase, onChange]);

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
          {renderedItems}
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
          {renderedItems}
        </Card>
      )}
      <Dialog
        open={adding}
        onClose={handleOnAddClose}
        aria-labelledby="add-item-dialog-title"
        aria-describedby="add-item-dialog-description"
      >
        <DialogTitle id="add-item-dialog-title">Add {label}</DialogTitle>
        <DialogContent sx={{ width: 300 }}>
          <Box sx={{ mt: 3, mb: 3, ml: 2, mr: 2 }}>
            <FormBox>
              <ItemSelect
                label="Item"
                required
                disabled={disabled}
                value={itemTypeToAdd}
                valueGetter={(item) => item.key}
                onChange={(value) => setItemTypeToAdd(value)}
                items={filteredItems}
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
            disabled={disabled || itemTypeToAdd === undefined}
          >
            Add {labelLowerCase}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ItemsListCard;
