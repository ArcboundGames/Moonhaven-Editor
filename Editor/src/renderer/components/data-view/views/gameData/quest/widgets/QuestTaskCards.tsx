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

import { createQuestTask } from '../../../../../../../../../SharedLibrary/src/util/converters.util';
import NumberTextField from '../../../../../widgets/form/NumberTextField';
import TextField from '../../../../../widgets/form/TextField';
import Card from '../../../../../widgets/layout/Card';
import FormBox from '../../../../../widgets/layout/FormBox';
import QuestObjectives from './QuestObjective';

import type { QuestTask } from '../../../../../../../../../SharedLibrary/src/interface';

export interface TaskFieldsProps {
  task: QuestTask;
  index: number;
  disabled: boolean;
  onChange: (value: Partial<QuestTask>) => void;
  onDelete: () => void;
}

const TaskFields = ({ task, index, disabled, onChange, onDelete }: TaskFieldsProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleOnDelete = useCallback(() => setDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    onDelete();
  }, [onDelete]);
  const handleOnClose = useCallback(() => setDeleting(false), []);

  return (
    <>
      <Box>
        <Typography gutterBottom variant="subtitle2" component="div">
          {`Task ${index + 1}`}
          <IconButton
            aria-label="delete"
            color="error"
            size="small"
            disabled={disabled}
            sx={{ ml: 1 }}
            onClick={handleOnDelete}
            title="Delete task"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
          <FormBox>
            <NumberTextField
              label="ID"
              value={task.id}
              onChange={(value) =>
                onChange({
                  id: value
                })
              }
              required
              min={1}
              disabled={disabled}
              wholeNumber
            />
          </FormBox>
          <FormBox>
            <TextField
              label="Key"
              value={task.key}
              onChange={(value) => onChange({ key: value })}
              required
              disabled={disabled}
            />
          </FormBox>
        </Box>
        <QuestObjectives
          objectives={task.objectives}
          disabled={disabled}
          onChange={(objectives) => onChange({ objectives })}
        />
      </Box>
      <Dialog
        open={deleting}
        onClose={handleOnClose}
        aria-labelledby="deleting-task-dialog-title"
        aria-describedby="deleting-task-dialog-description"
      >
        <DialogTitle id="deleting-task-dialog-title">Delete task {index + 1}</DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-task-dialog-description">
            Are you sure you want to delete task {index + 1}?
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

export interface TaskCardsProps {
  tasks: QuestTask[];
  disabled?: boolean;
  onChange: (colliders: QuestTask[]) => void;
}

const TaskCards = ({ tasks, disabled = true, onChange }: TaskCardsProps) => {
  const cards = useMemo(() => {
    if (tasks.length === 0) {
      return (
        <Card
          header={
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>Tasks</div>
              <Box sx={{ display: 'flex' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  endIcon={<AddIcon fontSize="medium" />}
                  disabled={disabled}
                  onClick={() => {
                    onChange([...tasks, createQuestTask()]);
                  }}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Add Task
                </Button>
              </Box>
            </Box>
          }
        />
      );
    }

    return tasks.map((task, index) => (
      <Card
        key={`task-${index}`}
        header={
          index === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>Tasks</div>
              <Box sx={{ display: 'flex' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  endIcon={<AddIcon fontSize="medium" />}
                  disabled={disabled}
                  onClick={() => {
                    onChange([...tasks, createQuestTask()]);
                  }}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Add Task
                </Button>
              </Box>
            </Box>
          ) : null
        }
        sx={{ mb: 2 }}
      >
        <TaskFields
          task={task}
          index={index}
          disabled={disabled}
          onChange={(value) => {
            const newTasks = [...tasks];
            const i = newTasks.indexOf(task);
            if (i > -1) {
              newTasks[i] = {
                ...task,
                ...value
              };
              onChange(newTasks);
            }
          }}
          onDelete={() => {
            const newTasks = [...tasks];
            const i = newTasks.indexOf(task);
            if (i > -1) {
              newTasks.splice(i, 1);
              onChange(newTasks);
            }
          }}
        />
      </Card>
    ));
  }, [tasks, disabled, onChange]);

  return <Box>{cards}</Box>;
};

export default TaskCards;
