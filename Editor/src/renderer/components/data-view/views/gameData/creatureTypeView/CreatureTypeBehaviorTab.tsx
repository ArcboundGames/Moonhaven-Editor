import Box from '@mui/material/Box';

import Select from 'renderer/components/widgets/form/Select';
import {
  ATTACK_TYPE_ARC,
  ATTACK_TYPE_NONE,
  ATTACK_TYPE_TOUCH,
  MOVEMENT_TYPE_JUMP,
  MOVEMENT_TYPE_WALK
} from '../../../../../../../../SharedLibrary/src/constants';
import { toTitleCaseFromKey } from '../../../../../../../../SharedLibrary/src/util/string.util';
import { useAppSelector } from '../../../../../hooks';
import { selectCreatureCategories } from '../../../../../store/slices/creatures';
import Checkbox from '../../../../widgets/form/Checkbox';
import MultiSelect from '../../../../widgets/form/MultiSelect';
import NumberTextField from '../../../../widgets/form/NumberTextField';
import Vector2Field from '../../../../widgets/form/Vector2Field';
import CreatureMultiSelect from '../../../../widgets/form/creature/CreatureMultiSelect';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';
import { OverriddenCreaturePropertyCard } from '../widgets/OverriddenPropertyCard';

import type { CreatureType, MovementType } from '../../../../../../../../SharedLibrary/src/interface';

export interface CreatureTypeBehaviorTabProps {
  data: CreatureType;
  disabled: boolean;
  movementType: MovementType | undefined;
  handleOnChange: (input: Partial<CreatureType>) => void;
}

const CreatureTypeBehaviorTab = ({ data, disabled, movementType, handleOnChange }: CreatureTypeBehaviorTabProps) => {
  const creatureCategories = useAppSelector(selectCreatureCategories);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
      <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
        <OverriddenCreaturePropertyCard
          title="Movement"
          type={data}
          setting="movementType"
          onChange={handleOnChange}
          defaultValue={MOVEMENT_TYPE_WALK}
          disabled={disabled}
          wrapperSx={{
            display: 'grid',
            width: '100%'
          }}
        >
          {{
            control: ({ controlled, value, helperText, onChange }) => (
              <Select
                label="Movement Type"
                required
                disabled={controlled || disabled}
                value={value}
                onChange={onChange}
                options={[
                  {
                    label: 'Walk',
                    value: MOVEMENT_TYPE_WALK
                  },
                  {
                    label: 'Jump',
                    value: MOVEMENT_TYPE_JUMP
                  }
                ]}
                error={value === undefined}
                helperText={helperText}
              />
            ),
            other: (movementType) => {
              if (movementType !== MOVEMENT_TYPE_JUMP) {
                return (
                  <>
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
                          min={1}
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
                  </>
                );
              }

              if (movementType === MOVEMENT_TYPE_JUMP) {
                return (
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <FormBox>
                      <NumberTextField
                        label="Jump Min Wait Time"
                        value={data.jumpMinWaitTime}
                        min={1}
                        max={10}
                        onChange={(value) =>
                          handleOnChange({
                            jumpMinWaitTime: value
                          })
                        }
                        required
                        disabled={disabled}
                        error={data.jumpMinWaitTime >= data.jumpMaxWaitTime}
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Jump Max Wait Time"
                        value={data.jumpMaxWaitTime}
                        min={1}
                        max={10}
                        onChange={(value) =>
                          handleOnChange({
                            jumpMaxWaitTime: value
                          })
                        }
                        required
                        disabled={disabled}
                        error={data.jumpMinWaitTime >= data.jumpMaxWaitTime}
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Jump Min Distance"
                        value={data.jumpMinDistance}
                        min={1}
                        max={10}
                        onChange={(value) =>
                          handleOnChange({
                            jumpMinDistance: value
                          })
                        }
                        required
                        disabled={disabled}
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Jump Max Distance"
                        value={data.jumpMaxDistance}
                        min={1}
                        max={10}
                        onChange={(value) =>
                          handleOnChange({
                            jumpMaxDistance: value
                          })
                        }
                        required
                        disabled={disabled}
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Jump Move Start Sprite Index"
                        value={data.jumpMoveStartSpriteIndex}
                        min={0}
                        onChange={(value) =>
                          handleOnChange({
                            jumpMoveStartSpriteIndex: value
                          })
                        }
                        required
                        disabled={disabled}
                        helperText="Zero index based"
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Jump Move End Sprite Index"
                        value={data.jumpMoveEndSpriteIndex}
                        min={0}
                        onChange={(value) =>
                          handleOnChange({
                            jumpMoveEndSpriteIndex: value
                          })
                        }
                        required
                        disabled={disabled}
                        helperText="Zero index based"
                        error={data.jumpMoveStartSpriteIndex >= data.jumpMoveEndSpriteIndex}
                      />
                    </FormBox>
                  </Box>
                );
              }

              return null;
            }
          }}
        </OverriddenCreaturePropertyCard>
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
              <OverriddenCreaturePropertyCard
                type={data}
                setting="attackType"
                onChange={handleOnChange}
                defaultValue={ATTACK_TYPE_NONE}
                disabled={disabled}
                wrapperSx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  width: '100%'
                }}
                layout="inline"
              >
                {{
                  control: ({ controlled, value, helperText, onChange }) => (
                    <Select
                      label="Attack Type"
                      required
                      disabled={controlled || disabled}
                      value={value}
                      onChange={onChange}
                      options={[
                        {
                          label: 'None',
                          emphasize: true,
                          value: ATTACK_TYPE_NONE
                        },
                        {
                          label: 'Touch',
                          value: ATTACK_TYPE_TOUCH
                        },
                        {
                          label: 'Arc',
                          value: ATTACK_TYPE_ARC
                        }
                      ]}
                      error={value === undefined}
                      helperText={helperText}
                    />
                  )
                }}
              </OverriddenCreaturePropertyCard>
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
                <FormBox>
                  <NumberTextField
                    label="Attack Damage"
                    value={data.attackDamage}
                    min={1}
                    max={1000}
                    onChange={(value) =>
                      handleOnChange({
                        attackDamage: value
                      })
                    }
                    required
                    wholeNumber
                    disabled={disabled}
                  />
                </FormBox>
                <FormBox>
                  <NumberTextField
                    label="Attack Knockback"
                    value={data.attackKnockback}
                    min={0}
                    max={20}
                    onChange={(value) =>
                      handleOnChange({
                        attackKnockback: value
                      })
                    }
                    required
                    disabled={disabled}
                  />
                </FormBox>
              </Box>
              {movementType !== MOVEMENT_TYPE_JUMP ? (
                <>
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
                        label="Attack Desired Min Range"
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
                        label="Attack Desired Max Range"
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
                </>
              ) : null}
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
              {movementType != MOVEMENT_TYPE_JUMP ? (
                <>
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
                </>
              ) : null}
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
