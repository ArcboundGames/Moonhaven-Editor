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
import { useCallback, useMemo, useState } from 'react';

import ItemSelect from '../../../../../widgets/form/item/ItemSelect';
import NumberTextField from '../../../../../widgets/form/NumberTextField';
import Card from '../../../../../widgets/layout/Card';
import FormBox from '../../../../../widgets/layout/FormBox';
import SpriteImage from '../../../../../widgets/SpriteImage';
import { ALL_SEASONS, SEASONS } from '../../../../../../../../../SharedLibrary/src/constants';
import { toSeason } from '../../../../../../../../../SharedLibrary/src/util/converters.util';
import { toTitleCaseFromKey } from '../../../../../../../../../SharedLibrary/src/util/string.util';
import Select from 'renderer/components/widgets/form/Select';

import type { LocalizedItemType, Season } from '../../../../../../../../../SharedLibrary/src/interface';

export interface ShopItemsCardProps {
  prices: Record<string, Record<string, number>>;
  disabled?: boolean;
  itemsByKey: Record<string, LocalizedItemType>;
  onChange: (prices: Record<string, Record<string, number>>) => void;
}

const ShopItemsCard = ({ prices, disabled = true, itemsByKey, onChange }: ShopItemsCardProps) => {
  const [adding, setAdding] = useState(false);
  const [itemToAdd, setItemToAdd] = useState<string | undefined>(undefined);

  const [season, setSeason] = useState<Season | typeof ALL_SEASONS>(ALL_SEASONS);
  const seasonPrices = useMemo(() => prices[season] ?? {}, [prices, season]);

  const handleOnAdd = useCallback(() => {
    setItemToAdd(undefined);
    setAdding(true);
  }, []);
  const handleOnAddClose = useCallback(() => {
    setItemToAdd(undefined);
    setAdding(false);
  }, []);
  const handleOnAddConfirm = useCallback(() => {
    if (itemToAdd) {
      const newSalePrices = {
        ...prices,
        [season]: {
          ...seasonPrices,
          [itemToAdd]: 1
        }
      };

      onChange(newSalePrices);
      setItemToAdd(undefined);
      setAdding(false);
    }
  }, [itemToAdd, prices, seasonPrices, season, onChange]);

  const [itemToDelete, setItemToDelete] = useState<LocalizedItemType | string | undefined>(undefined);
  const handleOnDeleteConfirm = useCallback(() => {
    if (!itemToDelete) {
      return;
    }

    const newSeasonPrices = { ...seasonPrices };

    delete newSeasonPrices[typeof itemToDelete === 'string' ? itemToDelete : itemToDelete.key];

    onChange({
      ...prices,
      [season]: {
        ...newSeasonPrices
      }
    });
    setItemToDelete(undefined);
  }, [itemToDelete, onChange, prices, season, seasonPrices]);
  const handleOnDeleteClose = useCallback(() => setItemToDelete(undefined), []);

  return (
    <>
      <Card
        header={
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
              Items
              <Select
                label="Season"
                required
                disabled={disabled}
                value={season}
                onChange={(value) => {
                  const newSeason = toSeason(value);
                  if (newSeason) {
                    setSeason(newSeason);
                  }
                }}
                options={[ALL_SEASONS, ...SEASONS]?.map((entry) => ({
                  label: toTitleCaseFromKey(entry),
                  value: entry
                }))}
                sx={{
                  minWidth: 120
                }}
              />
            </Box>
            <Button
              variant="contained"
              color="secondary"
              size="medium"
              endIcon={<AddIcon fontSize="medium" />}
              disabled={disabled}
              onClick={() => handleOnAdd()}
            >
              Add Item
            </Button>
          </Box>
        }
      >
        {Object.keys(seasonPrices)?.map((itemKey) => {
          const item = itemsByKey[itemKey];
          return (
            <Box
              key={`shop-item-${itemKey}`}
              sx={{ display: 'grid', gridTemplateColumns: '2fr 8fr 4fr 1fr', alignItems: 'center' }}
            >
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    flexDirection: 'column',
                    height: 'calc(100% - 32px)',
                    justifyContent: 'center'
                  }}
                >
                  <SpriteImage
                    dataKey={itemKey}
                    width={16}
                    height={16}
                    sprite={0}
                    type="item"
                    targetSize={64}
                    errorMessage="Icon not found"
                    errorStyle="inline"
                  />
                </Box>
              </Box>
              <Box>{item.name}</Box>
              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                <FormBox>
                  <NumberTextField
                    label="Price"
                    value={seasonPrices[itemKey]}
                    onChange={(value) =>
                      onChange({
                        ...prices,
                        [season]: {
                          ...seasonPrices,
                          [itemKey]: value ?? 0
                        }
                      })
                    }
                    min={1}
                    required
                    disabled={disabled}
                    wholeNumber
                  />
                </FormBox>
              </Box>
              <Box sx={{ justifyContent: 'center' }}>
                <IconButton
                  aria-label="delete"
                  color="error"
                  size="small"
                  disabled={disabled}
                  sx={{ ml: 1 }}
                  onClick={() => setItemToDelete(item ?? itemKey)}
                  title="Delete shop item"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          );
        })}
      </Card>
      <Dialog
        open={adding}
        onClose={handleOnAddClose}
        aria-labelledby="add-shop-item-dialog-title"
        aria-describedby="add-shop-item-dialog-description"
      >
        <DialogTitle id="add-shop-item-dialog-title">Add shop item</DialogTitle>
        <DialogContent sx={{ width: 300 }}>
          <Box sx={{ mt: 3, mb: 3, ml: 2, mr: 2 }}>
            <FormBox>
              <ItemSelect
                label="Item"
                required
                disabled={disabled}
                value={itemToAdd}
                valueGetter={(item) => item.key}
                onChange={(value) => setItemToAdd(value)}
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
            disabled={disabled || itemToAdd === undefined}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {itemToDelete ? (
        <Dialog
          open
          onClose={handleOnDeleteClose}
          aria-labelledby="deleting-shop-item-dialog-title"
          aria-describedby="deleting-shop-item-dialog-description"
        >
          <DialogTitle id="deleting-shop-item-dialog-title">
            Delete shop item {typeof itemToDelete === 'string' ? itemToDelete : itemToDelete.name}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="deleting-shop-item-dialog-description">
              Are you sure you want to delete shop item{' '}
              {typeof itemToDelete === 'string' ? itemToDelete : itemToDelete.name}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOnDeleteClose} color="primary" autoFocus disabled={disabled}>
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

export default ShopItemsCard;
