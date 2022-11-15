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
import { useCallback, useMemo, useState } from 'react';

import NumberTextField from '../../../../widgets/form/NumberTextField';
import TextField from '../../../../widgets/form/TextField';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';

import type { SkillLevel } from '../../../../../../../../SharedLibrary/src/interface';

export interface SkillLevelFieldsProps {
  skillLevel: SkillLevel;
  index: number;
  total: number;
  disabled: boolean;
  onChange: (value: Partial<SkillLevel>) => void;
  onDelete: () => void;
  updateLocalizedValue: (key: string, value: string) => void;
  getLocalizedValue: (key: string) => string;
  deleteLocalizedValues: (key: string[]) => void;
  moveLocalizations: (operations: { oldKey: string; newKey: string }[]) => void;
}

const SkillLevelFields = ({
  skillLevel,
  index,
  total,
  disabled,
  onChange,
  onDelete,
  updateLocalizedValue,
  getLocalizedValue,
  deleteLocalizedValues,
  moveLocalizations
}: SkillLevelFieldsProps) => {
  const [deleting, setDeleting] = useState(false);

  const nameKey = useMemo(() => `skill-level-${skillLevel.key.toLowerCase()}-name`, [skillLevel.key]);
  const descriptionKey = useMemo(() => `skill-level-${skillLevel.key.toLowerCase()}-description`, [skillLevel.key]);

  const handleOnDelete = useCallback(() => setDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    deleteLocalizedValues([nameKey, descriptionKey]);
    onDelete();
  }, [deleteLocalizedValues, descriptionKey, nameKey, onDelete]);
  const handleOnClose = useCallback(() => setDeleting(false), []);

  return (
    <>
      <Box sx={index + 1 < total ? { borderBottom: 1, borderColor: 'divider' } : {}}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            <FormBox>
              <TextField
                label="Key"
                value={skillLevel.key}
                onChange={(value) => {
                  moveLocalizations([
                    {
                      oldKey: nameKey,
                      newKey: `skill-level-${value.toLowerCase()}-name`
                    },
                    {
                      oldKey: descriptionKey,
                      newKey: `skill-level-${value.toLowerCase()}-description`
                    }
                  ]);
                  onChange({ key: value });
                }}
                required
                disabled={disabled}
              />
            </FormBox>
            <FormBox>
              <TextField
                label="Name"
                value={getLocalizedValue(nameKey)}
                onChange={(value) => updateLocalizedValue(nameKey, value)}
                required
                disabled={disabled}
              />
            </FormBox>
            <FormBox>
              <NumberTextField
                label="Damage Increase"
                value={skillLevel.damageIncrease}
                onChange={(value) =>
                  onChange({
                    damageIncrease: value
                  })
                }
                min={0}
                max={250}
                endAdornment="%"
                required
                disabled={disabled}
                wholeNumber
              />
            </FormBox>
            <FormBox>
              <NumberTextField
                label="Health Regen Increase"
                value={skillLevel.healthRegenIncrease}
                onChange={(value) =>
                  onChange({
                    healthRegenIncrease: value
                  })
                }
                min={0}
                max={250}
                endAdornment="%"
                required
                disabled={disabled}
                wholeNumber
              />
            </FormBox>
            <FormBox>
              <NumberTextField
                label="Energy Regen Increase"
                value={skillLevel.energyRegenIncrease}
                onChange={(value) =>
                  onChange({
                    energyRegenIncrease: value
                  })
                }
                min={0}
                max={250}
                endAdornment="%"
                required
                disabled={disabled}
                wholeNumber
              />
            </FormBox>
            <FormBox>
              <NumberTextField
                label="Energy Use Decrease"
                value={skillLevel.energyUseDescrease}
                onChange={(value) =>
                  onChange({
                    energyUseDescrease: value
                  })
                }
                min={0}
                max={100}
                endAdornment="%"
                required
                disabled={disabled}
                wholeNumber
              />
            </FormBox>
            <FormBox>
              <NumberTextField
                label="Crafting Speed Increase"
                value={skillLevel.craftingSpeedIncrease}
                onChange={(value) =>
                  onChange({
                    craftingSpeedIncrease: value
                  })
                }
                min={0}
                max={250}
                endAdornment="%"
                required
                disabled={disabled}
                wholeNumber
              />
            </FormBox>
            <FormBox>
              <NumberTextField
                label="Monster Loot Drop Rate Increase"
                value={skillLevel.monsterLootIncrease}
                onChange={(value) =>
                  onChange({
                    monsterLootIncrease: value
                  })
                }
                min={0}
                max={250}
                endAdornment="%"
                required
                disabled={disabled}
                wholeNumber
              />
            </FormBox>
            <FormBox>
              <NumberTextField
                label="Damage Reduction"
                value={skillLevel.damageReduction}
                onChange={(value) =>
                  onChange({
                    damageReduction: value
                  })
                }
                min={0}
                max={100}
                endAdornment="%"
                required
                disabled={disabled}
                wholeNumber
              />
            </FormBox>
            <FormBox>
              <NumberTextField
                label="Double Crop Chance"
                value={skillLevel.doubleCropChance}
                onChange={(value) =>
                  onChange({
                    doubleCropChance: value
                  })
                }
                min={0}
                max={100}
                endAdornment="%"
                required
                disabled={disabled}
                wholeNumber
              />
            </FormBox>
            <FormBox>
              <NumberTextField
                label="Fish Size Chance Increase"
                value={skillLevel.fishSizeChanceIncrease}
                onChange={(value) =>
                  onChange({
                    fishSizeChanceIncrease: value
                  })
                }
                min={0}
                max={250}
                endAdornment="%"
                required
                disabled={disabled}
                wholeNumber
              />
            </FormBox>
            <FormBox>
              <NumberTextField
                label="Fish Bite Speed Increase"
                value={skillLevel.fishBiteSpeedIncrease}
                onChange={(value) =>
                  onChange({
                    fishBiteSpeedIncrease: value
                  })
                }
                min={0}
                max={250}
                endAdornment="%"
                required
                disabled={disabled}
                wholeNumber
              />
            </FormBox>
            <FormBox>
              <NumberTextField
                label="Sell Price Increase"
                value={skillLevel.sellPriceIncrease}
                onChange={(value) =>
                  onChange({
                    sellPriceIncrease: value
                  })
                }
                min={0}
                max={250}
                endAdornment="%"
                required
                disabled={disabled}
                wholeNumber
              />
            </FormBox>
            <FormBox>
              <NumberTextField
                label="Buy Discount"
                value={skillLevel.buyDiscount}
                onChange={(value) =>
                  onChange({
                    buyDiscount: value
                  })
                }
                min={0}
                max={100}
                endAdornment="%"
                required
                disabled={disabled}
                wholeNumber
              />
            </FormBox>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              aria-label="delete"
              color="error"
              size="small"
              disabled={disabled}
              sx={{ ml: 1 }}
              onClick={handleOnDelete}
              title="Delete skill level"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <FormBox sx={{ mt: 0 }}>
            <TextField
              label="Description"
              value={getLocalizedValue(descriptionKey)}
              onChange={(value) => updateLocalizedValue(descriptionKey, value)}
              required
              disabled={disabled}
              multiline
              rows={4}
            />
          </FormBox>
        </Box>
      </Box>
      <Dialog
        open={deleting}
        onClose={handleOnClose}
        aria-labelledby="deleting-skill-level-dialog-title"
        aria-describedby="deleting-skill-level-dialog-description"
      >
        <DialogTitle id="deleting-skill-level-dialog-title">
          Delete skill level &quot;{getLocalizedValue(nameKey) ?? index + 1}&quot;
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-skill-level-dialog-description">
            Are you sure you want to delete skill level &quot;{getLocalizedValue(nameKey) ?? index + 1}&quot;?
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

function createSkillLevel(): SkillLevel {
  return {
    key: 'NEW_SKILL_LEVEL',
    damageIncrease: 0,
    healthRegenIncrease: 0,
    energyRegenIncrease: 0,
    energyUseDescrease: 0,
    craftingSpeedIncrease: 0,
    monsterLootIncrease: 0,
    damageReduction: 0,
    doubleCropChance: 0,
    fishSizeChanceIncrease: 0,
    fishBiteSpeedIncrease: 0,
    sellPriceIncrease: 0,
    buyDiscount: 0
  };
}

export interface SkillLevelCardProps {
  skillLevels: SkillLevel[] | undefined;
  disabled?: boolean;
  onChange: (skillLevels: SkillLevel[]) => void;
  updateLocalizedValue: (key: string, value: string) => void;
  getLocalizedValue: (key: string) => string;
  deleteLocalizedValues: (key: string[]) => void;
  moveLocalizations: (operations: { oldKey: string; newKey: string }[]) => void;
}

const SkillLevelCard = ({
  skillLevels,
  disabled = true,
  onChange,
  updateLocalizedValue,
  getLocalizedValue,
  deleteLocalizedValues,
  moveLocalizations
}: SkillLevelCardProps) => {
  return (
    <Card
      header={
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Skill Levels</div>
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            endIcon={<AddIcon fontSize="medium" />}
            disabled={disabled}
            onClick={() => {
              onChange([...(skillLevels || []), createSkillLevel()]);
            }}
          >
            Add skill level
          </Button>
        </Box>
      }
    >
      {skillLevels?.map((skillLevel, index) => (
        <SkillLevelFields
          key={`skill-level-${index}`}
          skillLevel={skillLevel}
          index={index}
          total={skillLevels.length}
          disabled={disabled}
          onChange={(value) => {
            const newSkillLevels = [...(skillLevels || [])];
            const i = newSkillLevels.indexOf(skillLevel);
            if (i > -1) {
              newSkillLevels[i] = {
                ...skillLevel,
                ...value
              };
              onChange(newSkillLevels);
            }
          }}
          onDelete={() => {
            const newSkillLevels = [...(skillLevels || [])];
            const i = newSkillLevels.indexOf(skillLevel);
            if (i > -1) {
              newSkillLevels.splice(i, 1);
              onChange(newSkillLevels);
            }
          }}
          updateLocalizedValue={updateLocalizedValue}
          getLocalizedValue={getLocalizedValue}
          deleteLocalizedValues={deleteLocalizedValues}
          moveLocalizations={moveLocalizations}
        />
      ))}
    </Card>
  );
};

export default SkillLevelCard;
