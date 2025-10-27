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
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  FALL,
  LOOT_TYPE_STAGE_DROP,
  OBJECT_SPRITE_TARGET_SIZE,
  SPRING,
  STAGES_TYPE_BREAKABLE,
  STAGES_TYPE_GROWABLE,
  STAGES_TYPE_GROWABLE_WITH_HEALTH,
  STAGE_JUMP_CONDITION_HARVEST,
  STAGE_JUMP_CONDITION_TIME,
  SUMMER,
  WINTER
} from '../../../../../../../../SharedLibrary/src/constants';
import { createObjectTypeStage } from '../../../../../../../../SharedLibrary/src/util/converters.util';
import { toTitleCaseFromKey } from '../../../../../../../../SharedLibrary/src/util/string.util';
import Checkbox from '../../../../widgets/form/Checkbox';
import NumberTextField from '../../../../widgets/form/NumberTextField';
import Select from '../../../../widgets/form/Select';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';
import SpriteImage from '../../../../widgets/SpriteImage';
import { SpriteExtraData } from '../widgets/SpriteExtraData';

import type {
  LootTable,
  LootType,
  ObjectTypeStage,
  Sprite,
  StagesType
} from '../../../../../../../../SharedLibrary/src/interface';

export interface StageFieldsProps {
  stage: ObjectTypeStage;
  lootType: LootType | undefined;
  stagesType: StagesType | undefined;
  index: number;
  total: number;
  disabled: boolean;
  lootTables: LootTable[];
  dataKey: string;
  dataKeyChanged: boolean;
  spriteWidth: number | undefined;
  spriteHeight: number | undefined;
  defaultSprite: number | undefined;
  showDefaultSprite: boolean;
  onDefaultSpriteChange: ((defaultSprite: number) => void) | undefined;
  onChange: (value: Partial<ObjectTypeStage>) => void;
  onDelete: () => void;
  canChangeDefaultSprite: boolean;
  sprite: Sprite | undefined;
  onSpriteChange: (index: number, sprite: Partial<Sprite>) => void;
  season: string | undefined;
}

const StageFields = ({
  stage,
  lootType,
  stagesType,
  index,
  total,
  disabled,
  lootTables,
  dataKey,
  dataKeyChanged,
  spriteWidth,
  spriteHeight,
  defaultSprite,
  onChange,
  onDelete,
  showDefaultSprite,
  canChangeDefaultSprite,
  onDefaultSpriteChange,
  sprite,
  onSpriteChange,
  season
}: StageFieldsProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleOnDelete = useCallback(() => setDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    onDelete();
  }, [onDelete]);
  const handleOnClose = useCallback(() => setDeleting(false), []);

  const paused = useMemo(() => {
    if (stage.jumpToStage !== undefined && stage.jumpCondition === STAGE_JUMP_CONDITION_TIME) {
      return false;
    }

    if (index === total - 1) {
      return true;
    }

    return stage.pause ?? false;
  }, [index, stage.jumpCondition, stage.jumpToStage, stage.pause, total]);

  const imageKey = useMemo(() => {
    if (season) {
      return `${dataKey}-${season}`.toLowerCase();
    }

    return dataKey;
  }, [dataKey, season]);

  return (
    <>
      <Box sx={index < total - 1 ? { borderBottom: 1, borderColor: 'divider', pb: 2 } : {}}>
        <Typography gutterBottom variant="subtitle2" component="div" sx={{ marginTop: 2 }}>
          {`Stage ${index + 1}`}
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
        <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 3fr)' }}>
          <Box>
            {dataKeyChanged ? null : (
              <Box
                key={`object-sprite-${index}`}
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    m: 1,
                    mt: 2,
                    mb: 2,
                    height: `${
                      spriteHeight
                        ? Math.floor(OBJECT_SPRITE_TARGET_SIZE / spriteHeight) * spriteHeight
                        : OBJECT_SPRITE_TARGET_SIZE
                    }px`
                  }}
                >
                  <Box sx={{ ml: 1 }}>
                    <SpriteImage
                      dataKey={imageKey}
                      width={spriteWidth}
                      height={spriteHeight}
                      sprite={index}
                      type="object"
                      targetSize={
                        spriteHeight
                          ? Math.floor(OBJECT_SPRITE_TARGET_SIZE / spriteHeight) * spriteHeight
                          : OBJECT_SPRITE_TARGET_SIZE
                      }
                    />
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)' }}>
            <SpriteExtraData
              index={index}
              showDefaultSprite={showDefaultSprite}
              defaultSprite={defaultSprite}
              canChangeDefaultSprite={canChangeDefaultSprite}
              onDefaultSpriteChange={onDefaultSpriteChange}
              disabled={disabled}
              sprite={sprite}
              onChange={onSpriteChange}
            />
            <Box sx={{ ml: 3 }}>
              <Box
                sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', alignItems: 'flex-start' }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <FormBox>
                    <Checkbox
                      label="Pause"
                      checked={paused}
                      onChange={(value) =>
                        onChange({
                          pause: value
                        })
                      }
                      disabled={
                        disabled ||
                        index === total - 1 ||
                        (stage.jumpToStage !== undefined && stage.jumpCondition === STAGE_JUMP_CONDITION_TIME)
                      }
                      sx={{ ml: 1 }}
                    />
                  </FormBox>
                  {stagesType === STAGES_TYPE_GROWABLE || stagesType === STAGES_TYPE_GROWABLE_WITH_HEALTH ? (
                    <FormBox key="harvestable-box">
                      <Checkbox
                        label="Harvestable"
                        checked={stage.harvestable}
                        onChange={(value) =>
                          onChange({
                            harvestable: value
                          })
                        }
                        disabled={disabled}
                        sx={{ ml: 1 }}
                      />
                    </FormBox>
                  ) : (
                    <Box key="empty-harvestable-box" />
                  )}
                  <FormBox key="autoWiggleCollidable-box">
                    <Checkbox
                      label="Auto Wiggle Collidable"
                      checked={stage.autoWiggleCollidable}
                      onChange={(value) =>
                        onChange({
                          autoWiggleCollidable: value
                        })
                      }
                      disabled={disabled}
                      sx={{ ml: 1 }}
                    />
                  </FormBox>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {(stagesType === STAGES_TYPE_GROWABLE || stagesType === STAGES_TYPE_GROWABLE_WITH_HEALTH) &&
                  ((index < total - 1 && !stage.pause) ||
                    (stage.jumpToStage !== undefined && stage.jumpCondition === STAGE_JUMP_CONDITION_TIME)) ? (
                    <FormBox key="stage-growth-days">
                      <NumberTextField
                        label="Growth Days"
                        value={stage.growthDays}
                        min={1}
                        onChange={(value) =>
                          onChange({
                            growthDays: value
                          })
                        }
                        required
                        disabled={disabled}
                        wholeNumber
                        helperText="In game days"
                      />
                    </FormBox>
                  ) : null}
                  {stagesType === STAGES_TYPE_GROWABLE_WITH_HEALTH ? (
                    <FormBox key="stage-health">
                      <NumberTextField
                        label="Health"
                        value={stage.health}
                        min={1}
                        onChange={(value) =>
                          onChange({
                            health: value
                          })
                        }
                        required
                        disabled={disabled}
                        wholeNumber
                      />
                    </FormBox>
                  ) : null}
                  {stagesType === STAGES_TYPE_BREAKABLE ? (
                    <FormBox key="stage-health-threshold">
                      <NumberTextField
                        label="Health Threshold"
                        value={stage.threshold}
                        min={1}
                        max={100}
                        endAdornment={<InputAdornment position="end">%</InputAdornment>}
                        onChange={(value) =>
                          onChange({
                            threshold: value
                          })
                        }
                        disabled={disabled}
                        wholeNumber
                      />
                    </FormBox>
                  ) : null}
                  {lootType === LOOT_TYPE_STAGE_DROP ? (
                    <FormBox key="stage-loot-table">
                      <Select
                        label="Loot Table"
                        disabled={disabled}
                        value={stage.lootTableKey}
                        onChange={(value) =>
                          onChange({
                            lootTableKey: value
                          })
                        }
                        options={lootTables.map((entry) => ({
                          label: toTitleCaseFromKey(entry.key),
                          value: entry.key
                        }))}
                      />
                    </FormBox>
                  ) : null}
                  {stagesType === STAGES_TYPE_GROWABLE || stagesType === STAGES_TYPE_GROWABLE_WITH_HEALTH ? (
                    <>
                      <FormBox>
                        <Select
                          label="Jumps To"
                          disabled={disabled}
                          value={stage.jumpToStage}
                          onChange={(value) => {
                            if (value === undefined) {
                              onChange({ jumpToStage: undefined, jumpCondition: undefined });
                            } else {
                              onChange({ jumpToStage: value });
                            }
                          }}
                          options={[...Array(total)].map((_, i) => ({
                            label: `Stage ${i + 1}`,
                            value: i
                          }))}
                          error={
                            stage.jumpToStage !== undefined &&
                            (Number.isNaN(stage.jumpToStage) || stage.jumpToStage < 0 || stage.jumpToStage >= total)
                          }
                        />
                      </FormBox>
                      {stage.jumpToStage !== undefined ? (
                        <FormBox key="stage-jump-condition">
                          <Select
                            label="Jump Condition"
                            disabled={disabled}
                            value={stage.jumpCondition}
                            onChange={(value) =>
                              onChange({
                                jumpCondition: value
                              })
                            }
                            options={[
                              {
                                label: 'Time',
                                value: STAGE_JUMP_CONDITION_TIME
                              },
                              {
                                label: 'Harvest',
                                value: STAGE_JUMP_CONDITION_HARVEST
                              }
                            ]}
                            error={stage.jumpToStage !== undefined && stage.jumpCondition === undefined}
                          />
                        </FormBox>
                      ) : null}
                    </>
                  ) : null}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Dialog
        open={deleting}
        onClose={handleOnClose}
        aria-labelledby="deleting-stage-dialog-title"
        aria-describedby="deleting-stage-dialog-description"
      >
        <DialogTitle id="deleting-stage-dialog-title">Delete stage {index + 1}</DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-stage-dialog-description">
            Are you sure you want to delete stage {index + 1}?
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

export interface StagesCardProps {
  stages: ObjectTypeStage[] | undefined;
  lootType: LootType | undefined;
  stagesType: StagesType | undefined;
  disabled?: boolean;
  lootTables: LootTable[];
  dataKey: string;
  dataKeyChanged: boolean;
  spriteWidth: number | undefined;
  spriteHeight: number | undefined;
  defaultSprite: number | undefined;
  expectedStageCount: number;
  onDefaultSpriteChange: (defaultSprite: number) => void;
  onChange: (colliders: ObjectTypeStage[]) => void;
  showDefaultSprite: boolean;
  canChangeDefaultSprite: boolean;
  sprites: Record<string, Sprite | undefined> | undefined;
  onSpriteChange: (index: number, sprite: Partial<Sprite>) => void;
  changesSpritesWithSeason?: boolean;
}

const StagesCard = ({
  stages,
  lootType,
  stagesType,
  disabled = true,
  lootTables,
  dataKey,
  dataKeyChanged,
  spriteWidth,
  spriteHeight,
  defaultSprite,
  expectedStageCount,
  onDefaultSpriteChange,
  onChange,
  showDefaultSprite,
  canChangeDefaultSprite,
  sprites,
  onSpriteChange,
  changesSpritesWithSeason
}: StagesCardProps) => {
  const [season, setSeason] = useState<string | undefined>();
  useEffect(() => {
    if (changesSpritesWithSeason) {
      if (!season) {
        setSeason('SPRING');
      }
    } else if (season) {
      setSeason(undefined);
    }
  }, [changesSpritesWithSeason, season]);

  const stageCount = useMemo(() => stages?.length ?? 0, [stages]);
  return (
    <Card
      header={
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Stages</div>
          <Box sx={{ display: 'flex' }}>
            {changesSpritesWithSeason === true ? (
              <Select
                key="stages-season"
                sx={{ width: '140px', mr: 2 }}
                label="Season"
                required
                disabled={disabled}
                value={season}
                onChange={(value) => setSeason(value)}
                options={[
                  {
                    label: 'Spring',
                    value: SPRING
                  },
                  {
                    label: 'Summer',
                    value: SUMMER
                  },
                  {
                    label: 'Fall',
                    value: FALL
                  },
                  {
                    label: 'Winter',
                    value: WINTER
                  }
                ]}
              />
            ) : null}
            {stageCount < expectedStageCount ? (
              <Button
                key="create-missing-stages"
                variant="contained"
                color="primary"
                size="medium"
                endIcon={<AddIcon fontSize="medium" />}
                disabled={disabled}
                onClick={() => {
                  const newStages = [...(stages || [])];
                  for (let i = stageCount; i < expectedStageCount; i += 1) {
                    newStages.push(createObjectTypeStage());
                  }
                  onChange(newStages);
                }}
                sx={{ mr: 2 }}
              >
                Create missing stages
              </Button>
            ) : null}
            <Button
              variant="contained"
              color="secondary"
              size="medium"
              endIcon={<AddIcon fontSize="medium" />}
              disabled={disabled}
              onClick={() => {
                onChange([...(stages || []), createObjectTypeStage()]);
              }}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Add Stage
            </Button>
          </Box>
        </Box>
      }
    >
      {stages?.map((stage, index) => (
        <StageFields
          key={`stage-${index}`}
          stage={stage}
          lootType={lootType}
          stagesType={stagesType}
          index={index}
          total={stages.length ?? 0}
          disabled={disabled}
          lootTables={lootTables}
          dataKey={dataKey}
          dataKeyChanged={dataKeyChanged}
          spriteWidth={spriteWidth}
          spriteHeight={spriteHeight}
          showDefaultSprite={showDefaultSprite}
          onChange={(value) => {
            const newStages = [...(stages || [])];
            const i = newStages.indexOf(stage);
            if (i > -1) {
              newStages[i] = {
                ...stage,
                ...value
              };
              onChange(newStages);
            }
          }}
          onDelete={() => {
            const newStages = [...(stages || [])];
            const i = newStages.indexOf(stage);
            if (i > -1) {
              newStages.splice(i, 1);
              onChange(newStages);
            }
          }}
          defaultSprite={showDefaultSprite ? defaultSprite : undefined}
          canChangeDefaultSprite={Boolean(showDefaultSprite && canChangeDefaultSprite)}
          onDefaultSpriteChange={showDefaultSprite ? onDefaultSpriteChange : undefined}
          sprite={sprites?.[index]}
          onSpriteChange={onSpriteChange}
          season={season}
        />
      ))}
    </Card>
  );
};

export default StagesCard;
