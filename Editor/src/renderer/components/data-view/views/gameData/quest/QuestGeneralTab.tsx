import { useMemo } from 'react';
import Box from '@mui/material/Box';

import Select from '../../../../widgets/form/Select';
import NumberTextField from '../../../../widgets/form/NumberTextField';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';
import TextField from '../../../../widgets/form/TextField';
import {
  QUEST_COMPLETION_TRIGGER_AUTO_COMPLETE,
  QUEST_COMPLETION_TRIGGER_TALK_TO_CREATURE,
  QUEST_SOURCE_CREATURE
} from '../../../../../../../../SharedLibrary/src/constants';
import CreatureSelect from '../../../../widgets/form/creature/CreatureSelect';
import DialogueTreeSelect from '../../../../widgets/form/dialogueTree/DialogueTreeSelect';
import { useAppSelector } from '../../../../../hooks';
import { selectDialogueTreesByCreature } from '../../../../../store/slices/dialogue';
import EventMultiAutocomplete from '../../../../widgets/form/event/EventMultiAutocomplete';

import type { Quest } from '../../../../../../../../SharedLibrary/src/interface';

export interface QuestGeneralTabProps {
  data: Quest;
  disabled: boolean;
  handleOnChange: (input: Partial<Quest>) => void;
  getLocalizedValue: (key: string) => string;
  updateLocalizedValue: (key: string, value: string) => void;
}

const QuestGeneralTab = ({
  data,
  disabled,
  handleOnChange,
  getLocalizedValue,
  updateLocalizedValue
}: QuestGeneralTabProps) => {
  const sourceDialogueTrees = useAppSelector(
    useMemo(() => selectDialogueTreesByCreature(data.sourceCreatureTypeKey), [data.sourceCreatureTypeKey])
  );

  const completionDialogueTrees = useAppSelector(
    useMemo(() => selectDialogueTreesByCreature(data.completionCreatureTypeKey), [data.completionCreatureTypeKey])
  );

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
          <Card header="General">
            <FormBox>
              <NumberTextField
                label="ID"
                value={data.id}
                onChange={(value) =>
                  handleOnChange({
                    id: value
                  })
                }
                required
                error={data.id <= 0}
                disabled={disabled}
                wholeNumber
              />
            </FormBox>
            <FormBox>
              <TextField
                label="Key"
                value={data.key}
                onChange={(value) => handleOnChange({ key: value })}
                required
                disabled={disabled}
              />
            </FormBox>
            <FormBox>
              <TextField
                label="Name"
                value={getLocalizedValue('name')}
                onChange={(value) => updateLocalizedValue('name', value)}
                required
                disabled={disabled}
              />
            </FormBox>
          </Card>
        </Box>
        <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
          <Card header="Prerequisites" sx={{ overflow: 'visible' }}>
            <FormBox sx={{ position: 'relative' }}>
              <EventMultiAutocomplete
                values={data?.prerequisiteEventKeys}
                onChange={(prerequisiteEventKeys) =>
                  handleOnChange({
                    prerequisiteEventKeys
                  })
                }
              />
            </FormBox>
          </Card>
          <Card header="Source">
            <FormBox>
              <Select
                label="Source"
                disabled={disabled}
                value={data.source}
                onChange={(value) => {
                  if (value === data.source) {
                    return;
                  }
                  handleOnChange({
                    source: value,
                    sourceCreatureTypeKey: undefined
                  });
                }}
                options={[
                  {
                    label: 'Creature',
                    value: QUEST_SOURCE_CREATURE
                  }
                ]}
              />
            </FormBox>
            {data.source === QUEST_SOURCE_CREATURE
              ? [
                  <FormBox key="source-creature">
                    <CreatureSelect
                      label="Creature"
                      disabled={disabled}
                      value={data.sourceCreatureTypeKey}
                      onChange={(sourceCreatureTypeKey) => {
                        if (sourceCreatureTypeKey === data.sourceCreatureTypeKey) {
                          return;
                        }
                        handleOnChange({ sourceCreatureTypeKey, sourceCreatureDialogueTreeKey: undefined });
                      }}
                      required
                    />
                  </FormBox>,
                  <FormBox key="source-creature-dialogue-tree">
                    <DialogueTreeSelect
                      label="Dialogue Tree"
                      disabled={disabled}
                      value={data.sourceCreatureDialogueTreeKey}
                      dialogueTrees={sourceDialogueTrees}
                      onChange={(sourceCreatureDialogueTreeKey) => handleOnChange({ sourceCreatureDialogueTreeKey })}
                    />
                  </FormBox>
                ]
              : null}
          </Card>
          <Card header="Completion">
            <FormBox>
              <Select
                label="Completion Trigger"
                required
                disabled={disabled}
                value={data.completionTrigger}
                onChange={(value) => {
                  if (value === data.completionTrigger) {
                    return;
                  }
                  handleOnChange({
                    completionTrigger: value,
                    completionCreatureTypeKey: undefined,
                    completionCreatureDialogueTreeKey: undefined
                  });
                }}
                options={[
                  {
                    label: 'Auto Complete',
                    value: QUEST_COMPLETION_TRIGGER_AUTO_COMPLETE
                  },
                  {
                    label: 'Talk to Creature',
                    value: QUEST_COMPLETION_TRIGGER_TALK_TO_CREATURE
                  }
                ]}
              />
            </FormBox>
            {data.completionTrigger === QUEST_COMPLETION_TRIGGER_TALK_TO_CREATURE
              ? [
                  <FormBox key="completion-trigger-creature">
                    <CreatureSelect
                      label="Creature"
                      disabled={disabled}
                      value={data.completionCreatureTypeKey}
                      onChange={(completionCreatureTypeKey) => {
                        if (completionCreatureTypeKey === data.completionCreatureTypeKey) {
                          return;
                        }
                        handleOnChange({ completionCreatureTypeKey, completionCreatureDialogueTreeKey: undefined });
                      }}
                      required
                    />
                  </FormBox>,
                  <FormBox key="completion-trigger-creature-dialogue-tree">
                    <DialogueTreeSelect
                      label="Dialogue Tree"
                      disabled={disabled}
                      value={data.completionCreatureDialogueTreeKey}
                      dialogueTrees={completionDialogueTrees}
                      onChange={(completionCreatureDialogueTreeKey) =>
                        handleOnChange({ completionCreatureDialogueTreeKey })
                      }
                    />
                  </FormBox>
                ]
              : null}
          </Card>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
        <Card header="Text">
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' }}>
            <FormBox>
              <TextField
                label="Text"
                value={getLocalizedValue('text')}
                onChange={(value) => updateLocalizedValue('text', value)}
                required
                disabled={disabled}
                multiline
                rows={8}
              />
            </FormBox>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default QuestGeneralTab;
