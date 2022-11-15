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

import {
  PLACEMENT_LAYER_IN_AIR,
  PLACEMENT_LAYER_IN_GROUND,
  PLACEMENT_LAYER_ON_GROUND
} from '../../../../../../../../SharedLibrary/src/constants';
import { toPlacementLayer } from '../../../../../../../../SharedLibrary/src/util/converters.util';
import { getObjectSetting } from '../../../../../../../../SharedLibrary/src/util/objectType.util';
import { toTitleCaseFromKey } from '../../../../../../../../SharedLibrary/src/util/string.util';
import MultiSelect from '../../../../widgets/form/MultiSelect';
import Select from '../../../../widgets/form/Select';
import TextField from '../../../../widgets/form/TextField';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';

import type {
  DestructionMenuButton,
  DestructionMenuButtonConditions,
  LocalizedObjectType,
  ObjectCategory,
  ObjectSubCategory
} from '../../../../../../../../SharedLibrary/src/interface';

export interface DestructionMenuButtonConditionsProps {
  title: string;
  conditions: DestructionMenuButtonConditions | undefined;
  disabled: boolean;
  options: { key: string; name: string }[];
  onChange: (value: Partial<DestructionMenuButtonConditions>) => void;
}

const DestructionMenuButtonConditionsFields = ({
  title,
  conditions,
  disabled,
  options,
  onChange
}: DestructionMenuButtonConditionsProps) => {
  return (
    <Box display="flex" flexDirection="column" sx={{ pr: 1 }}>
      <Typography gutterBottom variant="body2" component="div" sx={{ mt: 0.5, mb: 1.5, fontSize: '0.8rem' }}>
        {title}
      </Typography>
      <FormBox key="conditions-include" sx={{ height: 'auto', mt: 2 }}>
        <MultiSelect
          label="Include"
          values={conditions?.include}
          onChange={(values: string[]) =>
            onChange({
              include: values
            })
          }
          options={
            options?.map((option) => ({
              label: option.name,
              value: option.key
            })) ?? []
          }
          disabled={disabled}
        />
      </FormBox>
      <FormBox key="conditions-exclude" sx={{ height: 'auto', mt: 2 }}>
        <MultiSelect
          label="Exclude"
          values={conditions?.exclude}
          onChange={(values: string[]) =>
            onChange({
              exclude: values
            })
          }
          options={
            options?.map((option) => ({
              label: option.name,
              value: option.key
            })) ?? []
          }
          disabled={disabled}
        />
      </FormBox>
    </Box>
  );
};

export interface DestructionMenuButtonFieldsProps {
  button: DestructionMenuButton;
  objects: LocalizedObjectType[];
  objectCategories: ObjectCategory[];
  objectCategoriesByKey: Record<string, ObjectCategory>;
  objectSubCategories: ObjectSubCategory[];
  objectSubCategoriesByKey: Record<string, ObjectSubCategory>;
  index: number;
  total: number;
  disabled: boolean;
  onChange: (value: Partial<DestructionMenuButton>) => void;
  onDelete: () => void;
  updateLocalizedValue: (key: string, value: string) => void;
  getLocalizedValue: (key: string) => string;
  deleteLocalizedValues: (key: string[]) => void;
}

const DestructionMenuButtonFields = ({
  button,
  objects,
  objectCategories,
  objectCategoriesByKey,
  objectSubCategories,
  objectSubCategoriesByKey,
  index,
  total,
  disabled,
  onChange,
  onDelete,
  updateLocalizedValue,
  getLocalizedValue,
  deleteLocalizedValues
}: DestructionMenuButtonFieldsProps) => {
  const [deleting, setDeleting] = useState(false);

  const textKey = useMemo(() => `destruction-menu-button-${index}-text`, [index]);

  const handleOnDelete = useCallback(() => setDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    deleteLocalizedValues([textKey]);
    onDelete();
  }, [deleteLocalizedValues, onDelete, textKey]);
  const handleOnClose = useCallback(() => setDeleting(false), []);

  const filteredObjects = useMemo(
    () =>
      objects.filter(
        (type) =>
          button.placementLayer ===
          getObjectSetting('placementLayer', type, objectCategoriesByKey, objectSubCategoriesByKey).value
      ),
    [button.placementLayer, objectCategoriesByKey, objectSubCategoriesByKey, objects]
  );

  const filteredSubCategories = useMemo(
    () =>
      objectSubCategories.filter(
        (subCategory) =>
          button.placementLayer ===
          getObjectSetting('placementLayer', subCategory, objectCategoriesByKey, objectSubCategoriesByKey).value
      ),
    [button.placementLayer, objectCategoriesByKey, objectSubCategoriesByKey, objectSubCategories]
  );

  const filteredCategories = useMemo(
    () => objectCategories.filter((category) => button.placementLayer === category.settings?.placementLayer),
    [button.placementLayer, objectCategories]
  );

  return (
    <>
      <Box sx={index < total ? { borderBottom: 1, borderColor: 'divider', pb: 3 } : {}}>
        <Typography gutterBottom variant="subtitle2" component="div" color="primary" sx={{ marginTop: 2 }}>
          {`Button ${index}`}
          <IconButton
            aria-label="delete"
            color="error"
            size="small"
            disabled={disabled}
            sx={{ ml: 1 }}
            onClick={handleOnDelete}
            title="Delete stage"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
          <Box display="flex" flexDirection="column" sx={{ pr: 1 }}>
            <Typography gutterBottom variant="body2" component="div" sx={{ mt: 0.5, mb: 1.5, fontSize: '0.8rem' }}>
              General
            </Typography>
            <FormBox>
              <TextField
                label="Text"
                value={getLocalizedValue(textKey)}
                onChange={(text) => updateLocalizedValue(textKey, text)}
                required
                disabled={disabled}
              />
            </FormBox>
            <FormBox sx={{ mb: 0, pb: 0 }}>
              <Select
                label="Placement Layer"
                value={button.placementLayer}
                onChange={(value) => onChange({ placementLayer: toPlacementLayer(value) })}
                disabled={disabled}
                required
                options={[
                  {
                    label: 'In Ground',
                    value: PLACEMENT_LAYER_IN_GROUND
                  },
                  {
                    label: 'On Ground',
                    value: PLACEMENT_LAYER_ON_GROUND
                  },
                  {
                    label: 'In Air',
                    value: PLACEMENT_LAYER_IN_AIR
                  }
                ]}
              />
            </FormBox>
          </Box>
          <Box display="flex" flexDirection="column" sx={{ pl: 1, pr: 1 }}>
            <DestructionMenuButtonConditionsFields
              title="Categories"
              conditions={button.categories}
              options={filteredCategories.map((option) => ({
                name: toTitleCaseFromKey(option.key),
                key: option.key
              }))}
              disabled={disabled}
              onChange={(value) =>
                onChange({
                  categories: {
                    ...button.categories,
                    ...value
                  }
                })
              }
            />
          </Box>
          <Box display="flex" flexDirection="column" sx={{ pl: 1, pr: 1 }}>
            <DestructionMenuButtonConditionsFields
              title="Sub Categories"
              conditions={button.subCategories}
              options={filteredSubCategories.map((option) => ({
                name: toTitleCaseFromKey(option.key),
                key: option.key
              }))}
              disabled={disabled}
              onChange={(value) =>
                onChange({
                  subCategories: {
                    ...button.subCategories,
                    ...value
                  }
                })
              }
            />
          </Box>
          <Box display="flex" flexDirection="column" sx={{ pl: 1 }}>
            <DestructionMenuButtonConditionsFields
              title="Objects"
              conditions={button.objects}
              options={filteredObjects}
              disabled={disabled}
              onChange={(value) =>
                onChange({
                  objects: {
                    ...button.objects,
                    ...value
                  }
                })
              }
            />
          </Box>
        </Box>
      </Box>
      <Dialog
        open={deleting}
        onClose={handleOnClose}
        aria-labelledby="deleting-button-dialog-title"
        aria-describedby="deleting-button-dialog-description"
      >
        <DialogTitle id="deleting-button-dialog-title">Delete button {index}</DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-button-dialog-description">
            Are you sure you want to delete button {index}?
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

function createDestructionMenuButton(): DestructionMenuButton {
  return {};
}

export interface DestructionMenuButtonCardProps {
  buttons: DestructionMenuButton[] | undefined;
  objects: LocalizedObjectType[];
  objectCategories: ObjectCategory[];
  objectCategoriesByKey: Record<string, ObjectCategory>;
  objectSubCategories: ObjectSubCategory[];
  objectSubCategoriesByKey: Record<string, ObjectSubCategory>;
  disabled?: boolean;
  onChange: (colliders: DestructionMenuButton[]) => void;
  updateLocalizedValue: (key: string, value: string) => void;
  getLocalizedValue: (key: string) => string;
  deleteLocalizedValues: (key: string[]) => void;
}

const DestructionMenuButtonCard = ({
  buttons,
  objects,
  objectCategories,
  objectCategoriesByKey,
  objectSubCategories,
  objectSubCategoriesByKey,
  disabled = true,
  onChange,
  updateLocalizedValue,
  getLocalizedValue,
  deleteLocalizedValues
}: DestructionMenuButtonCardProps) => {
  return (
    <Card
      header={
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Buttons</div>
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            endIcon={<AddIcon fontSize="medium" />}
            disabled={disabled}
            onClick={() => {
              onChange([...(buttons || []), createDestructionMenuButton()]);
            }}
          >
            Add button
          </Button>
        </Box>
      }
    >
      {buttons?.map((button, index) => (
        <DestructionMenuButtonFields
          key={`button-${index}`}
          button={button}
          objects={objects}
          objectCategories={objectCategories}
          objectCategoriesByKey={objectCategoriesByKey}
          objectSubCategories={objectSubCategories}
          objectSubCategoriesByKey={objectSubCategoriesByKey}
          index={index + 1}
          total={buttons.length ?? 0}
          disabled={disabled}
          onChange={(value) => {
            const newButtons = [...(buttons || [])];
            const i = newButtons.indexOf(button);
            if (i > -1) {
              newButtons[i] = {
                ...button,
                ...value
              };
              onChange(newButtons);
            }
          }}
          onDelete={() => {
            const newButtons = [...(buttons || [])];
            const i = newButtons.indexOf(button);
            if (i > -1) {
              newButtons.splice(i, 1);
              onChange(newButtons);
            }
          }}
          updateLocalizedValue={updateLocalizedValue}
          getLocalizedValue={getLocalizedValue}
          deleteLocalizedValues={deleteLocalizedValues}
        />
      ))}
    </Card>
  );
};

export default DestructionMenuButtonCard;
