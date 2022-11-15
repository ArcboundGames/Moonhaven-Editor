import Box from '@mui/material/Box';

import { toTitleCaseFromKey } from '../../../../../../../../SharedLibrary/src/util/string.util';
import { useAppSelector } from '../../../../../hooks';
import { selectCreatureCategories } from '../../../../../store/slices/creatures';
import Checkbox from '../../../../widgets/form/Checkbox';
import CreatureMultiSelect from '../../../../widgets/form/creature/CreatureMultiSelect';
import MultiSelect from '../../../../widgets/form/MultiSelect';
import NumberTextField from '../../../../widgets/form/NumberTextField';
import Vector2Field from '../../../../widgets/form/Vector2Field';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';

import type { CreatureType } from '../../../../../../../../SharedLibrary/src/interface';

export interface CreatureTypeBehaviorTabProps {
  data: CreatureType;
  disabled: boolean;
  handleOnChange: (input: Partial<CreatureType>) => void;
}

const CreatureTypeBehaviorTab = ({ data, disabled, handleOnChange }: CreatureTypeBehaviorTabProps) => {
  const creatureCategories = useAppSelector(selectCreatureCategories);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
      <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
        <Card header="Movement">
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            <FormBox>
              <NumberTextField
                label="Walk Speed"
                value={data.walkSpeed}
                min={1}
                max={10}
                onChange={(value) =>
                  handleOnChange({
                    walkSpeed: value
                  })
                }
                required
                disabled={disabled}
              />
            </FormBox>
            {data.dangerBehaviorEnabled ? (
              <FormBox>
                <NumberTextField
                  label="Run Speed"
                  value={data.runSpeed}
                  min={0}
                  max={10}
                  onChange={(value) =>
                    handleOnChange({
                      runSpeed: value
                    })
                  }
                  required
                  error={data.runSpeed <= data.walkSpeed}
                  disabled={disabled}
                />
              </FormBox>
            ) : null}
          </Box>
        </Card>
        <Card header="Danger Behavior">
          <FormBox>
            <Checkbox
              label="Enabled"
              checked={data.dangerBehaviorEnabled}
              onChange={(value) =>
                handleOnChange({
                  dangerBehaviorEnabled: value
                })
              }
              disabled={disabled}
            />
          </FormBox>
          {data.dangerBehaviorEnabled ? (
            <Box key="danagerFields">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <FormBox>
                  <NumberTextField
                    label="Detection Radius"
                    value={data.dangerRadius}
                    min={1}
                    max={20}
                    onChange={(value) =>
                      handleOnChange({
                        dangerRadius: value
                      })
                    }
                    required
                    disabled={disabled}
                  />
                </FormBox>
                <FormBox>
                  <NumberTextField
                    label="Danger Tolerance"
                    value={data.dangerTolerance}
                    min={0}
                    max={1}
                    onChange={(value) =>
                      handleOnChange({
                        dangerTolerance: value
                      })
                    }
                    required
                    disabled={disabled}
                  />
                </FormBox>
                <FormBox>
                  <Checkbox
                    label="Danger from Players"
                    checked={data.dangerFromPlayers}
                    onChange={(value) =>
                      handleOnChange({
                        dangerFromPlayers: value
                      })
                    }
                    disabled={disabled}
                  />
                </FormBox>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                <FormBox>
                  <MultiSelect
                    label="Danger from Creature Category"
                    values={data.dangerCreatureCategoryKeys}
                    onChange={(values: string[]) =>
                      handleOnChange({
                        dangerCreatureCategoryKeys: values
                      })
                    }
                    options={creatureCategories.map((option) => ({
                      label: toTitleCaseFromKey(option.key),
                      value: option.key
                    }))}
                    disabled={disabled || creatureCategories.length === 0}
                  />
                </FormBox>
                <FormBox>
                  <CreatureMultiSelect
                    label="Danger from Creature"
                    values={data.dangerCreatureKeys}
                    onChange={(values: string[]) =>
                      handleOnChange({
                        dangerCreatureKeys: values
                      })
                    }
                    disabled={disabled}
                  />
                </FormBox>
              </Box>
            </Box>
          ) : null}
        </Card>
        <Card header="Attack Behavior">
          <FormBox>
            <Checkbox
              label="Enabled"
              checked={data.attackBehaviorEnabled}
              onChange={(value) =>
                handleOnChange({
                  attackBehaviorEnabled: value
                })
              }
              disabled={disabled}
            />
          </FormBox>
          {data.attackBehaviorEnabled ? (
            <Box key="attackFields">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <FormBox>
                  <NumberTextField
                    label="Attack Radius"
                    value={data.attackRadius}
                    min={1}
                    max={20}
                    onChange={(value) =>
                      handleOnChange({
                        attackRadius: value
                      })
                    }
                    required
                    disabled={disabled}
                  />
                </FormBox>
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  borderBottom: 1,
                  borderColor: 'divider'
                }}
              >
                <FormBox>
                  <NumberTextField
                    label="Attack Destired Min Range"
                    value={data.attackDesiredRangeMin}
                    min={1}
                    max={20}
                    onChange={(value) =>
                      handleOnChange({
                        attackDesiredRangeMin: value
                      })
                    }
                    required
                    error={data.attackDesiredRangeMin >= data.attackDesiredRangeMax}
                    disabled={disabled}
                  />
                </FormBox>
                <FormBox>
                  <NumberTextField
                    label="Attack Destired Max Range"
                    value={data.attackDesiredRangeMax}
                    min={1}
                    max={20}
                    onChange={(value) =>
                      handleOnChange({
                        attackDesiredRangeMax: value
                      })
                    }
                    required
                    error={data.attackDesiredRangeMin >= data.attackDesiredRangeMax}
                    disabled={disabled}
                  />
                </FormBox>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderBottom: 1,
                  borderColor: 'divider'
                }}
              >
                <FormBox sx={{ alignItems: 'flex-start' }}>
                  <Checkbox
                    label="Use Strafing"
                    checked={data.attackUseStrafing}
                    onChange={(value) =>
                      handleOnChange({
                        attackUseStrafing: value
                      })
                    }
                    disabled={disabled}
                  />
                </FormBox>
                {data.attackUseStrafing ? (
                  <Box
                    key="strafing-time"
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'
                    }}
                  >
                    <FormBox>
                      <NumberTextField
                        label="Strafing Time Min"
                        value={data.attackStrafingTimeMin}
                        min={1}
                        max={10}
                        onChange={(value) =>
                          handleOnChange({
                            attackStrafingTimeMin: value
                          })
                        }
                        disabled={disabled}
                        error={data.attackStrafingTimeMin >= data.attackStrafingTimeMax}
                        helperText="Seconds"
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Strafing Time Max"
                        value={data.attackStrafingTimeMax}
                        min={1}
                        max={10}
                        onChange={(value) =>
                          handleOnChange({
                            attackStrafingTimeMax: value
                          })
                        }
                        disabled={disabled}
                        error={data.attackStrafingTimeMin >= data.attackStrafingTimeMax}
                        helperText="Seconds"
                      />
                    </FormBox>
                  </Box>
                ) : null}
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <FormBox>
                  <Checkbox
                    label="Target Players"
                    checked={data.attackTargetPlayers}
                    onChange={(value) =>
                      handleOnChange({
                        attackTargetPlayers: value
                      })
                    }
                    disabled={disabled}
                  />
                </FormBox>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                <FormBox>
                  <MultiSelect
                    label="Target Creature Category"
                    values={data.dangerCreatureCategoryKeys}
                    onChange={(values: string[]) =>
                      handleOnChange({
                        dangerCreatureCategoryKeys: values
                      })
                    }
                    options={creatureCategories.map((option) => ({
                      label: toTitleCaseFromKey(option.key),
                      value: option.key
                    }))}
                    disabled={disabled || creatureCategories.length === 0}
                  />
                </FormBox>
                <FormBox>
                  <CreatureMultiSelect
                    label="Target Creature"
                    values={data.dangerCreatureKeys}
                    onChange={(values: string[]) =>
                      handleOnChange({
                        dangerCreatureKeys: values
                      })
                    }
                    disabled={disabled}
                  />
                </FormBox>
              </Box>
            </Box>
          ) : null}
        </Card>
      </Box>
      <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
        <Card header="Wander Behavior">
          <FormBox>
            <Checkbox
              label="Enabled"
              checked={data.wanderBehaviorEnabled}
              onChange={(value) =>
                handleOnChange({
                  wanderBehaviorEnabled: value
                })
              }
              disabled={disabled}
            />
          </FormBox>
          {data.wanderBehaviorEnabled ? (
            <Box key="wanderFields" sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <FormBox>
                <NumberTextField
                  label="Wander Time"
                  value={data.wanderTime}
                  min={0}
                  max={20}
                  onChange={(value) =>
                    handleOnChange({
                      wanderTime: value
                    })
                  }
                  required
                  error={data.wanderTime <= 0}
                  disabled={disabled}
                />
              </FormBox>
              <FormBox>
                <NumberTextField
                  label="Wander Radius"
                  value={data.wanderRadius}
                  min={1}
                  max={20}
                  onChange={(value) =>
                    handleOnChange({
                      wanderRadius: value
                    })
                  }
                  required
                  disabled={disabled}
                />
              </FormBox>
              <FormBox sx={{ alignItems: 'flex-start' }}>
                <Checkbox
                  label="Use Custom Anchor"
                  checked={data.wanderUseCustomAnchor}
                  onChange={(value) =>
                    handleOnChange({
                      wanderUseCustomAnchor: value,
                      wanderUseSpawnAnchor: false
                    })
                  }
                  disabled={disabled}
                />
              </FormBox>
              <FormBox sx={{ alignItems: 'flex-start' }}>
                <Checkbox
                  label="Use Spawn Anchor"
                  checked={data.wanderUseSpawnAnchor}
                  onChange={(value) =>
                    handleOnChange({
                      wanderUseSpawnAnchor: value,
                      wanderUseCustomAnchor: false
                    })
                  }
                  disabled={disabled}
                />
              </FormBox>
              {data.wanderUseCustomAnchor ? (
                <Box key="anchor">
                  <FormBox sx={{ height: '60px' }}>Anchor</FormBox>
                  <Vector2Field
                    value={data?.wanderAnchor}
                    helperText="World Position"
                    disabled={disabled}
                    required
                    onChange={(value) =>
                      handleOnChange({
                        wanderAnchor: value
                      })
                    }
                  />
                </Box>
              ) : null}
              {data.wanderUseSpawnAnchor || data.wanderUseCustomAnchor ? (
                <Box key="hard-lease">
                  <FormBox sx={{ alignItems: 'flex-start' }}>
                    <Checkbox
                      label="Use Hard Leash"
                      checked={data.wanderUseHardLeash}
                      onChange={(value) =>
                        handleOnChange({
                          wanderUseHardLeash: value
                        })
                      }
                      disabled={disabled}
                    />
                  </FormBox>
                  {data.wanderUseHardLeash ? (
                    <FormBox>
                      <NumberTextField
                        label="Hard Leash Range"
                        value={data.wanderHardLeashRange}
                        min={1}
                        max={25}
                        onChange={(value) =>
                          handleOnChange({
                            wanderHardLeashRange: value
                          })
                        }
                        required
                        disabled={disabled}
                      />
                    </FormBox>
                  ) : null}
                </Box>
              ) : null}
            </Box>
          ) : null}
        </Card>
      </Box>
    </Box>
  );
};

export default CreatureTypeBehaviorTab;
