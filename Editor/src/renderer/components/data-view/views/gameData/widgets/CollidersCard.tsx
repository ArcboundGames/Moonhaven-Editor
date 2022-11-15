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
import React, { useCallback, useMemo, useState } from 'react';

import { BOX_COLLIDER_TYPE, POLYGON_COLLIDER_TYPE } from '../../../../../../../../SharedLibrary/src/constants';
import { isNotNullish, isNullish } from '../../../../../../../../SharedLibrary/src/util/null.util';
import Checkbox from '../../../../widgets/form/Checkbox';
import NumberTextField from '../../../../widgets/form/NumberTextField';
import Select from '../../../../widgets/form/Select';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';

import type { Collider, Sprite } from '../../../../../../../../SharedLibrary/src/interface';

export interface ColliderFieldsProps {
  index: number;
  collider: Collider;
  onChange: (value: Partial<Collider>) => void;
  onDelete: () => void;
  disabled?: boolean;
}

const ColliderFields = ({ index, collider, onChange, onDelete, disabled = false }: ColliderFieldsProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleOnDelete = useCallback(() => setDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    onDelete();
  }, [onDelete]);
  const handleOnClose = useCallback(() => setDeleting(false), []);

  return (
    <>
      <Typography gutterBottom variant="subtitle2" component="div" sx={{ marginTop: 2 }} color="secondary">
        {`Collider ${index + 1}`}
        <IconButton
          aria-label="delete"
          color="error"
          size="small"
          disabled={disabled}
          sx={{ ml: 1 }}
          onClick={handleOnDelete}
          title="Delete collider"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <Box display="flex" alignItems="center" sx={{ m: 1, height: '84px' }}>
          <Select
            label="Type"
            required
            disabled={disabled}
            value={collider.type}
            onChange={(value) =>
              onChange({
                type: value
              })
            }
            options={[
              {
                label: 'Box',
                value: BOX_COLLIDER_TYPE
              },
              {
                label: 'Polygon',
                value: POLYGON_COLLIDER_TYPE
              }
            ]}
          />
        </Box>
        <Box display="flex" flexDirection="column" sx={{ m: 1, ml: 3 }}>
          <Checkbox
            label="Is Trigger"
            checked={Boolean(collider.isTrigger)}
            onChange={(value) =>
              onChange({
                isTrigger: value
              })
            }
            disabled={disabled}
          />
          <Checkbox
            label="Used By Compositet"
            checked={Boolean(collider.usedByComposite)}
            onChange={(value) =>
              onChange({
                usedByComposite: value
              })
            }
            disabled={disabled}
          />
        </Box>
      </Box>
      {collider.type === 'BOX' ? (
        <Box>
          <Typography gutterBottom variant="subtitle2" component="div" sx={{ marginTop: 2 }}>
            Size
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            <FormBox>
              <NumberTextField
                label="X"
                helperText="Pixels"
                value={collider.size?.x}
                min={1}
                onChange={(value) =>
                  onChange({
                    size: {
                      x: value,
                      y: collider.size?.y ?? 0
                    }
                  })
                }
                disabled={disabled}
                required
                error={collider.size === undefined}
              />
            </FormBox>
            <FormBox>
              <NumberTextField
                label="Y"
                helperText="Pixels"
                value={collider.size?.y}
                min={1}
                onChange={(value) =>
                  onChange({
                    size: {
                      x: collider.size?.x ?? 0,
                      y: value
                    }
                  })
                }
                disabled={disabled}
                required
                error={collider.size === undefined}
              />
            </FormBox>
          </Box>
          <Typography gutterBottom variant="subtitle2" component="div" sx={{ marginTop: 2 }}>
            Offset
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            <FormBox>
              <NumberTextField
                label="X"
                helperText="Pixels"
                value={collider.offset?.x}
                onChange={(value) =>
                  onChange({
                    offset: {
                      x: value,
                      y: collider.offset?.y ?? 0
                    }
                  })
                }
                disabled={disabled}
                required
                error={collider.offset === undefined}
              />
            </FormBox>
            <FormBox>
              <NumberTextField
                label="Y"
                helperText="Pixels"
                value={collider.offset?.y}
                onChange={(value) =>
                  onChange({
                    offset: {
                      x: collider.offset?.x ?? 0,
                      y: value
                    }
                  })
                }
                disabled={disabled}
                required
                error={collider.offset === undefined}
              />
            </FormBox>
          </Box>
        </Box>
      ) : null}
      <Dialog
        open={deleting}
        onClose={handleOnClose}
        aria-labelledby="deleting-collider-dialog-title"
        aria-describedby="deleting-collider-dialog-description"
      >
        <DialogTitle id="deleting-collider-dialog-title">Delete collider {index + 1}</DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-collider-dialog-description">
            Are you sure you want to delete collider {index + 1}?
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

export interface GeneralCollidersCardProps {
  collidersType: 'colliders';
  colliders: Collider[] | undefined;
  onChange: (colliders: Collider[]) => void;
  disabled?: boolean;
}

export interface SpriteCollidersCardProps {
  collidersType: 'sprite-colliders';
  colliders: Record<string, Sprite> | undefined;
  onChange: (colliders: Record<string, Sprite>) => void;
  disabled?: boolean;
}

export type CollidersCardProps = GeneralCollidersCardProps | SpriteCollidersCardProps;

function isCollidersProps(props: CollidersCardProps): props is GeneralCollidersCardProps {
  return props.collidersType === 'colliders';
}

function createPolygonCollider(): Collider {
  return {
    type: 'POLYGON',
    isTrigger: false,
    usedByComposite: false
  };
}

function createBoxCollider(): Collider {
  return {
    type: 'BOX',
    isTrigger: false,
    usedByComposite: false,
    size: {
      y: 1,
      x: 1
    },
    offset: {
      x: 0,
      y: 0
    }
  };
}

// eslint-disable-next-line react/display-name
const CollidersCard = React.memo((props: CollidersCardProps) => {
  const { collidersType, disabled = false } = props;

  const [deleting, setDeleting] = useState(false);
  const [spriteToDelete, setSpriteToDelete] = useState<string | undefined>(undefined);

  const handleOnDelete = useCallback((sprite: string) => {
    setSpriteToDelete(sprite);
    setDeleting(true);
  }, []);
  const handleOnClose = useCallback(() => {
    setSpriteToDelete(undefined);
    setDeleting(false);
  }, []);
  const handleOnDeleteConfirm = useCallback(() => {
    if (spriteToDelete && !isCollidersProps(props)) {
      const { colliders, onChange } = props;
      const newColliders = { ...colliders };
      delete newColliders[spriteToDelete].colliders;
      onChange(newColliders);
    }
    setSpriteToDelete(undefined);
    setDeleting(false);
  }, [spriteToDelete, props]);

  const [adding, setAdding] = useState(false);
  const [spriteToAdd, setSpriteToAdd] = useState<number | undefined>(undefined);

  const handleOnAdd = useCallback(() => {
    setSpriteToAdd(undefined);
    setAdding(true);
  }, []);
  const handleOnAddClose = useCallback(() => {
    setSpriteToAdd(undefined);
    setAdding(false);
  }, []);
  const handleOnAddConfirm = useCallback(() => {
    if (spriteToAdd && !isCollidersProps(props)) {
      const { colliders, onChange } = props;
      if (
        isNullish(colliders?.[`${spriteToAdd - 1}`]?.colliders) ||
        colliders?.[`${spriteToAdd - 1}`]?.colliders?.length === 0
      ) {
        onChange({
          ...colliders,
          [`${spriteToAdd - 1}`]: {
            ...colliders?.[`${spriteToAdd - 1}`],
            colliders: [createBoxCollider()]
          }
        });
      }
    }
    setSpriteToAdd(undefined);
    setAdding(false);
  }, [spriteToAdd, props]);

  const total = useMemo(
    () => (Array.isArray(props.colliders) ? props.colliders.length : Object.entries(props.colliders || {}).length),
    [props.colliders]
  );

  return (
    <>
      <Card
        header={
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>{collidersType === 'sprite-colliders' ? 'Sprite Colliders' : 'Colliders'}</div>
            <Button
              variant="contained"
              color="secondary"
              size="medium"
              endIcon={<AddIcon fontSize="medium" />}
              disabled={disabled}
              onClick={() => {
                if (isCollidersProps(props)) {
                  const { colliders = [], onChange } = props;
                  onChange([...colliders, createPolygonCollider()]);
                } else {
                  handleOnAdd();
                }
              }}
            >
              {collidersType === 'sprite-colliders' ? 'Add Sprite' : 'Add Collider'}
            </Button>
          </Box>
        }
      >
        {isCollidersProps(props)
          ? (props.colliders || []).map((collider, index) => (
              <Box
                key={`collider-${index}`}
                sx={{
                  ...(index < (props.colliders ? props.colliders.length - 1 : 0) ? { pb: 2 } : {}),
                  ...(index > 0 ? { borderTop: 1, borderColor: 'divider' } : {})
                }}
              >
                <ColliderFields
                  index={index}
                  collider={collider}
                  disabled={disabled}
                  onChange={(value) => {
                    const { onChange } = props;
                    const newColliders = [...(props.colliders || [])];
                    const i = newColliders.indexOf(collider);
                    if (i > -1) {
                      newColliders[i] = {
                        ...collider,
                        ...value
                      };
                      onChange(newColliders);
                    }
                  }}
                  onDelete={() => {
                    const { onChange } = props;
                    const newColliders = [...(props.colliders || [])];
                    const i = newColliders.indexOf(collider);
                    if (i > -1) {
                      newColliders.splice(i, 1);
                      onChange(newColliders);
                    }
                  }}
                />
              </Box>
            ))
          : Object.entries(props.colliders || {}).map(([spriteKey, sprite], spriteIndex) =>
              isNotNullish(sprite.colliders) ? (
                <Box
                  key={`sprite-collider-sprite-${spriteKey}`}
                  sx={spriteIndex < total - 1 ? { mt: 2, pb: 2, borderBottom: 1, borderColor: 'divider' } : { mt: 2 }}
                >
                  <Typography gutterBottom variant="subtitle1" component="div" sx={{ marginTop: 2 }} color="primary">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        {`Sprite ${Number(spriteKey) + 1}`}
                        <IconButton
                          aria-label="delete"
                          color="error"
                          size="small"
                          disabled={disabled}
                          sx={{ ml: 1 }}
                          onClick={() => handleOnDelete(spriteKey)}
                          title="Delete sprite collider"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                      <Box>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          endIcon={<AddIcon fontSize="small" />}
                          disabled={disabled}
                          onClick={() => {
                            const { colliders: sprites, onChange } = props;
                            onChange({
                              ...(sprites ?? {}),
                              [spriteKey]: {
                                ...sprite,
                                colliders: [...(sprite.colliders ?? []), createBoxCollider()]
                              }
                            });
                          }}
                        >
                          Add Collider
                        </Button>
                      </Box>
                    </Box>
                  </Typography>
                  {sprite.colliders.map((collider, index) => (
                    <Box
                      key={`sprite-collider-${index}`}
                      sx={{
                        ...(index < (sprite.colliders?.length ?? 0) - 1 ? { pb: 2 } : {}),
                        ...(index > 0 ? { borderTop: 1, borderColor: 'divider' } : {})
                      }}
                    >
                      <ColliderFields
                        index={index}
                        collider={collider}
                        disabled={disabled}
                        onChange={(value) => {
                          const { onChange, colliders: sprites } = props;
                          const newSpriteColliders = [...(sprite.colliders || [])];
                          const i = newSpriteColliders.indexOf(collider);
                          if (i > -1) {
                            newSpriteColliders[i] = {
                              ...collider,
                              ...value
                            };
                            onChange({
                              ...(sprites ?? {}),
                              [spriteKey]: {
                                ...sprite,
                                colliders: newSpriteColliders
                              }
                            });
                          }
                        }}
                        onDelete={() => {
                          const { onChange, colliders: sprites } = props;
                          const newSpriteColliders = [...(sprite.colliders || [])];
                          const i = newSpriteColliders.indexOf(collider);
                          if (i > -1) {
                            newSpriteColliders.splice(i, 1);
                            onChange({
                              ...(sprites ?? {}),
                              [spriteKey]: {
                                ...sprite,
                                colliders: newSpriteColliders
                              }
                            });
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : null
            )}
      </Card>
      <Dialog
        open={deleting}
        onClose={handleOnClose}
        aria-labelledby="deleting-collider-dialog-title"
        aria-describedby="deleting-collider-dialog-description"
      >
        <DialogTitle id="deleting-collider-dialog-title">Delete sprite colliders</DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-collider-dialog-description">
            Are you sure you want to delete all colliders for sprite {Number(spriteToDelete ?? 0) + 1}?
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
      <Dialog
        open={adding}
        onClose={handleOnAddClose}
        aria-labelledby="add-collider-dialog-title"
        aria-describedby="add-collider-dialog-description"
      >
        <DialogTitle id="add-collider-dialog-title">Add sprite collider</DialogTitle>
        <DialogContent sx={{ width: 300 }}>
          <Box sx={{ mt: 3, mb: 3, ml: 2, mr: 2 }}>
            <NumberTextField
              label="Sprite"
              value={spriteToAdd}
              min={1}
              step={1}
              onChange={(value) => setSpriteToAdd(value)}
              disabled={disabled}
              required
              wholeNumber
            />
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
            disabled={disabled || spriteToAdd === undefined || Number.isNaN(spriteToAdd) || spriteToAdd % 1 !== 0}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default CollidersCard;
