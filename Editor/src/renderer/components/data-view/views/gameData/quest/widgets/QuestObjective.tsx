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
  QUEST_OBJECTIVE_TYPE_CRAFT, QUEST_OBJECTIVE_TYPE_DESTINATION,
  QUEST_OBJECTIVE_TYPE_GATHER, QUEST_OBJECTIVE_TYPE_TALK_TO_CREATURE
} from '../../../../../../../../../SharedLibrary/src/constants';
import { createQuestObjective } from '../../../../../../../../../SharedLibrary/src/util/converters.util';
import { useAppSelector } from '../../../../../../hooks';
import { selectDialogueTreesByCreature } from '../../../../../../store/slices/dialogue';
import CraftingRecipeSelect from '../../../../../widgets/form/craftingRecipe/CraftingRecipeSelect';
import CreatureSelect from '../../../../../widgets/form/creature/CreatureSelect';
import DialogueTreeSelect from '../../../../../widgets/form/dialogueTree/DialogueTreeSelect';
import ItemSelect from '../../../../../widgets/form/item/ItemSelect';
import NumberTextField from '../../../../../widgets/form/NumberTextField';
import Select from '../../../../../widgets/form/Select';
import Vector2Field from '../../../../../widgets/form/Vector2Field';
import FormBox from '../../../../../widgets/layout/FormBox';

import type { QuestObjective } from '../../../../../../../../../SharedLibrary/src/interface';

export interface ObjectiveFieldsProps {
  objective: QuestObjective;
  index: number;
  disabled: boolean;
  onChange: (value: Partial<QuestObjective>) => void;
  onDelete: () => void;
}

const ObjectiveFields = ({ objective, index, disabled, onChange, onDelete }: ObjectiveFieldsProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleOnDelete = useCallback(() => setDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    onDelete();
  }, [onDelete]);
  const handleOnClose = useCallback(() => setDeleting(false), []);

  const dialogueTrees = useAppSelector(
    useMemo(() => selectDialogueTreesByCreature(objective.creatureTypeKey), [objective.creatureTypeKey])
  );

  return (
    <>
      <Box>
        <Typography gutterBottom variant="subtitle2" component="div">
          {`Objective ${index + 1}`}
          <IconButton
            aria-label="delete"
            color="error"
            size="small"
            disabled={disabled}
            sx={{ ml: 1 }}
            onClick={handleOnDelete}
            title="Delete objective"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', alignItems: 'baseline' }}>
          <FormBox>
            <Select
              label="Objective Type"
              required
              disabled={disabled}
              value={objective.objectiveType}
              onChange={(value) =>
                onChange({
                  objectiveType: value
                })
              }
              options={[
                {
                  label: 'Gather',
                  value: QUEST_OBJECTIVE_TYPE_GATHER
                },
                {
                  label: 'Craft',
                  value: QUEST_OBJECTIVE_TYPE_CRAFT
                },
                {
                  label: 'Destination',
                  value: QUEST_OBJECTIVE_TYPE_DESTINATION
                },
                {
                  label: 'Talk to Creature',
                  value: QUEST_OBJECTIVE_TYPE_TALK_TO_CREATURE
                }
              ]}
            />
          </FormBox>
          {objective.objectiveType === QUEST_OBJECTIVE_TYPE_GATHER
            ? [
                <FormBox key="objective-gather">
                  <ItemSelect
                    label="Item"
                    required
                    disabled={disabled}
                    value={objective.itemTypeKey}
                    valueGetter={(entry) => entry.key}
                    onChange={(itemTypeKey) => onChange({ itemTypeKey })}
                  />
                </FormBox>,
                <FormBox key="objective-gather-amount">
                  <NumberTextField
                    label="Amount"
                    value={objective.itemAmount}
                    min={1}
                    onChange={(itemAmount) => onChange({ itemAmount })}
                    disabled={disabled}
                    required
                    wholeNumber
                  />
                </FormBox>
              ]
            : null}
          {objective.objectiveType === QUEST_OBJECTIVE_TYPE_CRAFT
            ? [
                <FormBox key="objective-craft">
                  <CraftingRecipeSelect
                    label="Crafting Recipe"
                    required
                    disabled={disabled}
                    value={objective.craftingRecipeKey}
                    onChange={(craftingRecipeKey) => onChange({ craftingRecipeKey })}
                  />
                </FormBox>,
                <FormBox key="objective-craft-amount">
                  <NumberTextField
                    label="Amount"
                    value={objective.craftingAmount}
                    min={1}
                    onChange={(craftingAmount) => onChange({ craftingAmount })}
                    disabled={disabled}
                    required
                    wholeNumber
                  />
                </FormBox>
              ]
            : null}
          {objective.objectiveType === QUEST_OBJECTIVE_TYPE_DESTINATION
            ? [
                <FormBox key="objective-item-amount">
                  <NumberTextField
                    label="Radius"
                    value={objective.destinationRadius}
                    min={1}
                    onChange={(destinationRadius) => onChange({ destinationRadius })}
                    disabled={disabled}
                    required
                  />
                </FormBox>,
                <Box key="objective-item">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <Vector2Field
                      value={objective.destinationPosition}
                      disabled={disabled}
                      onChange={(destinationPosition) => onChange({ destinationPosition })}
                      helperText="World Position"
                      required
                    />
                  </Box>
                </Box>
              ]
            : null}
          {objective.objectiveType === QUEST_OBJECTIVE_TYPE_TALK_TO_CREATURE
            ? [
                <FormBox key="objective-creature">
                  <CreatureSelect
                    label="Creature"
                    disabled={disabled}
                    value={objective.creatureTypeKey}
                    onChange={(creatureTypeKey) => onChange({ creatureTypeKey })}
                    required
                  />
                </FormBox>,
                <FormBox key="objective-creature-dialogue-tree">
                  <DialogueTreeSelect
                    label="Dialogue Tree"
                    disabled={disabled}
                    value={objective.creatureDialogueTreeKey}
                    dialogueTrees={dialogueTrees}
                    onChange={(creatureDialogueTreeKey) => onChange({ creatureDialogueTreeKey })}
                  />
                </FormBox>
              ]
            : null}
        </Box>
      </Box>
      <Dialog
        open={deleting}
        onClose={handleOnClose}
        aria-labelledby="deleting-objective-dialog-title"
        aria-describedby="deleting-objective-dialog-description"
      >
        <DialogTitle id="deleting-objective-dialog-title">Delete objective {index + 1}</DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-objective-dialog-description">
            Are you sure you want to delete objective {index + 1}?
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

export interface QuestObjectivesProps {
  objectives: QuestObjective[];
  disabled?: boolean;
  onChange: (colliders: QuestObjective[]) => void;
}

const QuestObjectives = ({ objectives, disabled = true, onChange }: QuestObjectivesProps) => {
  const boxes = useMemo(() => {
    if (objectives.length === 0) {
      return (
        <Typography gutterBottom variant="h6" component="div">
          <Box key="objective-empty" sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>Objectives</div>
            <Box sx={{ display: 'flex' }}>
              <Button
                variant="contained"
                color="secondary"
                size="medium"
                endIcon={<AddIcon fontSize="medium" />}
                disabled={disabled}
                onClick={() => {
                  onChange([...objectives, createQuestObjective()]);
                }}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Add Objective
              </Button>
            </Box>
          </Box>
        </Typography>
      );
    }

    return objectives.map((objective, index) => (
      <Box key={`objective-${index}`} sx={{ mb: 2 }}>
        {index === 0 ? (
          <Typography gutterBottom variant="h6" component="div">
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>Objectives</div>
              <Box sx={{ display: 'flex' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="medium"
                  endIcon={<AddIcon fontSize="medium" />}
                  disabled={disabled}
                  onClick={() => {
                    onChange([...objectives, createQuestObjective()]);
                  }}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Add Objective
                </Button>
              </Box>
            </Box>
          </Typography>
        ) : null}
        <ObjectiveFields
          objective={objective}
          index={index}
          disabled={disabled}
          onChange={(value) => {
            const newObjectives = [...objectives];
            const i = newObjectives.indexOf(objective);
            if (i > -1) {
              newObjectives[i] = {
                ...objective,
                ...value
              };
              onChange(newObjectives);
            }
          }}
          onDelete={() => {
            const newObjectives = [...objectives];
            const i = newObjectives.indexOf(objective);
            if (i > -1) {
              newObjectives.splice(i, 1);
              onChange(newObjectives);
            }
          }}
        />
      </Box>
    ));
  }, [disabled, objectives, onChange]);

  return <Box>{boxes}</Box>;
};

export default QuestObjectives;
