import Box from '@mui/material/Box';
import { useMemo } from 'react';

import {
  WEAPON_TYPE_ARC,
  WEAPON_TYPE_NONE,
  WEAPON_TYPE_POINT,
  WEAPON_TYPE_PROJECTILE,
  WEAPON_TYPE_PROJECTILE_LAUNCHER
} from '../../../../../../../../SharedLibrary/src/constants';
import { getDamagableData, getProjectileData } from '../../../../../../../../SharedLibrary/src/util/combat.util';
import { toWeaponType } from '../../../../../../../../SharedLibrary/src/util/converters.util';
import { getItemSetting } from '../../../../../../../../SharedLibrary/src/util/itemType.util';
import { isNullish } from '../../../../../../../../SharedLibrary/src/util/null.util';
import { toTitleCaseFromKey } from '../../../../../../../../SharedLibrary/src/util/string.util';
import { useAppSelector } from '../../../../../hooks';
import {
  selectCreatureCategories,
  selectCreatureCategoriesByKey,
  selectCreatureTypesSortedWithName
} from '../../../../../store/slices/creatures';
import {
  selectItemCategories,
  selectItemCategoriesByKey,
  selectItemTypesSortedWithName
} from '../../../../../store/slices/items';
import {
  selectObjectCategories,
  selectObjectCategoriesByKey,
  selectObjectSubCategories,
  selectObjectSubCategoriesByKey,
  selectObjectTypesSortedWithName
} from '../../../../../store/slices/objects';
import { selectSkillsSortedWithName } from '../../../../../store/slices/skills';
import Checkbox from '../../../../widgets/form/Checkbox';
import CreatureMultiSelect from '../../../../widgets/form/creature/CreatureMultiSelect';
import ItemMultiSelect from '../../../../widgets/form/item/ItemMultiSelect';
import MultiSelect from '../../../../widgets/form/MultiSelect';
import NumberTextField from '../../../../widgets/form/NumberTextField';
import Select from '../../../../widgets/form/Select';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';
import { OverriddenItemPropertyCard } from '../widgets/OverriddenPropertyCard';

import type { ItemType } from '../../../../../../../../SharedLibrary/src/interface';

export interface ItemViewCombatTabProps {
  data: ItemType;
  disabled: boolean;
  handleOnChange: (input: Partial<ItemType>) => void;
}

const ItemViewCombatTab = ({ data, disabled, handleOnChange }: ItemViewCombatTabProps) => {
  const items = useAppSelector(selectItemTypesSortedWithName);
  const itemCategories = useAppSelector(selectItemCategories);
  const itemCategoriesByKey = useAppSelector(selectItemCategoriesByKey);

  const objectCategories = useAppSelector(selectObjectCategories);
  const objectCategoriesByKey = useAppSelector(selectObjectCategoriesByKey);
  const objectSubCategories = useAppSelector(selectObjectSubCategories);
  const objectSubCategoriesByKey = useAppSelector(selectObjectSubCategoriesByKey);
  const objects = useAppSelector(selectObjectTypesSortedWithName);

  const creatureCategories = useAppSelector(selectCreatureCategories);
  const creatureCategoriesByKey = useAppSelector(selectCreatureCategoriesByKey);
  const creatures = useAppSelector(selectCreatureTypesSortedWithName);

  const sortedSkills = useAppSelector(selectSkillsSortedWithName);

  const { projectileItemCategories, projectileItems } = useMemo(
    () => getProjectileData(itemCategories, itemCategoriesByKey, items),
    [itemCategories, itemCategoriesByKey, items]
  );

  const {
    damagableObjectCategories,
    damagableObjectSubCategories,
    damagableObjects,
    damagableCreatureCategories,
    damagableCreatures
  } = useMemo(
    () =>
      getDamagableData(
        objectCategories,
        objectCategoriesByKey,
        objectSubCategories,
        objectSubCategoriesByKey,
        objects,
        creatureCategories,
        creatureCategoriesByKey,
        creatures
      ),
    [
      creatureCategories,
      creatureCategoriesByKey,
      creatures,
      objectCategories,
      objectCategoriesByKey,
      objectSubCategories,
      objectSubCategoriesByKey,
      objects
    ]
  );

  const weaponType = useMemo(
    () => getItemSetting('weaponType', data, itemCategoriesByKey),
    [data, itemCategoriesByKey]
  ).value;

  const isWeaponTypeNone = isNullish(weaponType) || weaponType === WEAPON_TYPE_NONE;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '5fr 4fr' }}>
      <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <Card header="Weapon">
              <OverriddenItemPropertyCard
                level={0}
                type={data}
                setting="weaponType"
                layout="inline"
                onOverrideChange={(overridden) =>
                  handleOnChange({
                    settings: {
                      ...data.settings,
                      weaponType: overridden ? weaponType : undefined
                    }
                  })
                }
                disabled={disabled}
              >
                {{
                  control: (controlled, value, helperText) => (
                    <Select
                      label="Weapon Type"
                      required
                      disabled={disabled}
                      value={value}
                      error={!controlled && !isWeaponTypeNone && value === undefined}
                      onChange={(newValue) =>
                        handleOnChange({
                          settings: {
                            ...data.settings,
                            weaponType: toWeaponType(newValue)
                          }
                        })
                      }
                      options={[
                        {
                          label: 'None',
                          value: WEAPON_TYPE_NONE,
                          emphasize: true
                        },
                        {
                          label: 'Point',
                          value: WEAPON_TYPE_POINT
                        },
                        {
                          label: 'Arc',
                          value: WEAPON_TYPE_ARC
                        },
                        {
                          label: 'Projectile Launcher',
                          value: WEAPON_TYPE_PROJECTILE_LAUNCHER
                        },
                        {
                          label: 'Projectile',
                          value: WEAPON_TYPE_PROJECTILE
                        }
                      ]}
                      helperText={helperText}
                    />
                  )
                }}
              </OverriddenItemPropertyCard>
            </Card>
            {weaponType && weaponType !== WEAPON_TYPE_NONE ? (
              <Card header="Damage">
                <FormBox>
                  <NumberTextField
                    label="Damage"
                    value={data.damage}
                    min={1}
                    onChange={(value) => handleOnChange({ damage: value })}
                    required
                    disabled={isWeaponTypeNone || disabled}
                    wholeNumber
                  />
                </FormBox>
                {weaponType === WEAPON_TYPE_ARC ? (
                  <FormBox>
                    <NumberTextField
                      label="Damage Arc Radius"
                      value={data.damageArcRadius}
                      min={0.0625}
                      max={10}
                      onChange={(value) => handleOnChange({ damageArcRadius: value })}
                      required
                      disabled={isWeaponTypeNone || disabled}
                    />
                  </FormBox>
                ) : null}
                {weaponType === WEAPON_TYPE_PROJECTILE ? (
                  <>
                    <FormBox>
                      <NumberTextField
                        label="Projectile Speed"
                        value={data.projectileSpeed}
                        min={0}
                        max={20}
                        onChange={(value) => handleOnChange({ projectileSpeed: value })}
                        required
                        disabled={isWeaponTypeNone || disabled}
                        error={data.projectileSpeed <= 0}
                      />
                    </FormBox>
                    <FormBox>
                      <NumberTextField
                        label="Projectile Distance"
                        value={data.projectileDistance}
                        min={1}
                        max={50}
                        onChange={(value) => handleOnChange({ projectileDistance: value })}
                        required
                        disabled={isWeaponTypeNone || disabled}
                      />
                    </FormBox>
                  </>
                ) : null}
              </Card>
            ) : null}
          </Box>
          {weaponType && weaponType !== WEAPON_TYPE_NONE ? (
            <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
              <Card header="Input">
                <OverriddenItemPropertyCard
                  level={0}
                  type={data}
                  layout="inline"
                  setting="hasCombatPriority"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        hasCombatPriority: overridden ? false : undefined
                      }
                    })
                  }
                  disabled={isWeaponTypeNone || disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <Checkbox
                        label="Has Combat Priority"
                        checked={value}
                        onChange={
                          controlled
                            ? undefined
                            : (newValue) =>
                                handleOnChange({
                                  settings: {
                                    ...data.settings,
                                    hasCombatPriority: newValue
                                  }
                                })
                        }
                        disabled={isWeaponTypeNone || disabled || controlled}
                        helperText={helperText}
                      />
                    )
                  }}
                </OverriddenItemPropertyCard>
                <OverriddenItemPropertyCard
                  level={0}
                  type={data}
                  layout="inline"
                  setting="resetTriggerOnAttack"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        resetTriggerOnAttack: overridden ? false : undefined
                      }
                    })
                  }
                  disabled={isWeaponTypeNone || disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <Checkbox
                        label="Reset Trigger on Attack"
                        checked={value}
                        onChange={
                          controlled
                            ? undefined
                            : (newValue) =>
                                handleOnChange({
                                  settings: {
                                    ...data.settings,
                                    resetTriggerOnAttack: newValue
                                  }
                                })
                        }
                        disabled={isWeaponTypeNone || disabled || controlled}
                        helperText={helperText}
                      />
                    )
                  }}
                </OverriddenItemPropertyCard>
              </Card>
              <OverriddenItemPropertyCard
                level={0}
                type={data}
                setting="damagedIncreasedBySkillKey"
                onOverrideChange={(overridden) =>
                  handleOnChange({
                    settings: {
                      ...data.settings,
                      damagedIncreasedBySkillKey: overridden ? '' : undefined
                    }
                  })
                }
                disabled={isWeaponTypeNone || disabled}
              >
                {{
                  control: (controlled, value, helperText) => (
                    <Select
                      label="Skill"
                      value={value}
                      onChange={(newValue) =>
                        handleOnChange({
                          settings: {
                            ...data.settings,
                            damagedIncreasedBySkillKey: newValue
                          }
                        })
                      }
                      disabled={controlled || disabled}
                      options={sortedSkills?.map((entry) => ({
                        label: entry.name,
                        value: entry.key
                      }))}
                      helperText={helperText}
                    />
                  )
                }}
              </OverriddenItemPropertyCard>
            </Box>
          ) : null}
        </Box>
      </Box>
      {weaponType && weaponType !== WEAPON_TYPE_NONE ? (
        <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
          {weaponType === WEAPON_TYPE_PROJECTILE_LAUNCHER ? (
            <Card header="Projectiles">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', marginTop: 2 }}>
                <OverriddenItemPropertyCard
                  level={0}
                  type={data}
                  setting="projectileItemCategoryKeys"
                  layout="inline"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        projectileItemCategoryKeys: overridden ? [] : undefined
                      }
                    })
                  }
                  disabled={isWeaponTypeNone || disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <MultiSelect
                        label="Projectile Item Category"
                        values={data.settings?.projectileItemCategoryKeys}
                        onChange={(values: string[]) =>
                          handleOnChange({
                            settings: {
                              ...data.settings,
                              projectileItemCategoryKeys: values.length === 0 ? undefined : values
                            }
                          })
                        }
                        options={projectileItemCategories.map((option) => ({
                          label: toTitleCaseFromKey(option.key),
                          value: option.key
                        }))}
                        disabled={
                          isWeaponTypeNone ||
                          disabled ||
                          controlled ||
                          (projectileItemCategories.length === 0 && value?.length === 0)
                        }
                        helperText={helperText}
                      />
                    )
                  }}
                </OverriddenItemPropertyCard>
                <OverriddenItemPropertyCard
                  level={0}
                  type={data}
                  setting="projectileItemKeys"
                  layout="inline"
                  onOverrideChange={(overridden) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        projectileItemKeys: overridden ? [] : undefined
                      }
                    })
                  }
                  disabled={isWeaponTypeNone || disabled}
                >
                  {{
                    control: (controlled, value, helperText) => (
                      <ItemMultiSelect
                        label="Projectile Item"
                        values={data.settings?.projectileItemKeys}
                        onChange={(values: string[]) =>
                          handleOnChange({
                            settings: {
                              ...data.settings,
                              projectileItemKeys: values.length === 0 ? undefined : values
                            }
                          })
                        }
                        items={projectileItems}
                        disabled={
                          disabled ||
                          controlled ||
                          value === undefined ||
                          (projectileItems.length === 0 && value.length === 0)
                        }
                        helperText={helperText}
                      />
                    )
                  }}
                </OverriddenItemPropertyCard>
              </Box>
            </Card>
          ) : null}
          {weaponType !== WEAPON_TYPE_PROJECTILE_LAUNCHER ? (
            <>
              <Card header="Target Creatures">
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', marginTop: 2 }}>
                  <OverriddenItemPropertyCard
                    level={0}
                    type={data}
                    setting="damagesCreatureCategoryKeys"
                    layout="inline"
                    onOverrideChange={(overridden) =>
                      handleOnChange({
                        settings: {
                          ...data.settings,
                          damagesCreatureCategoryKeys: overridden ? [] : undefined
                        }
                      })
                    }
                    disabled={isWeaponTypeNone || disabled}
                  >
                    {{
                      control: (controlled, value, helperText) => (
                        <MultiSelect
                          label="Damages Creature Category"
                          values={data.settings?.damagesCreatureCategoryKeys}
                          onChange={(values: string[]) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                damagesCreatureCategoryKeys: values.length === 0 ? undefined : values
                              }
                            })
                          }
                          options={damagableCreatureCategories.map((option) => ({
                            label: toTitleCaseFromKey(option.key),
                            value: option.key
                          }))}
                          disabled={
                            disabled ||
                            controlled ||
                            value === undefined ||
                            (damagableCreatureCategories.length === 0 && value.length === 0)
                          }
                          helperText={helperText}
                        />
                      )
                    }}
                  </OverriddenItemPropertyCard>
                  <OverriddenItemPropertyCard
                    level={0}
                    type={data}
                    setting="damagesCreatureKeys"
                    layout="inline"
                    onOverrideChange={(overridden) =>
                      handleOnChange({
                        settings: {
                          ...data.settings,
                          damagesCreatureKeys: overridden ? [] : undefined
                        }
                      })
                    }
                    disabled={isWeaponTypeNone || disabled}
                  >
                    {{
                      control: (controlled, value, helperText) => (
                        <CreatureMultiSelect
                          label="Damages Creature"
                          values={data.settings?.damagesCreatureKeys}
                          onChange={(values: string[]) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                damagesCreatureKeys: values.length === 0 ? undefined : values
                              }
                            })
                          }
                          creatures={damagableCreatures}
                          disabled={
                            disabled ||
                            controlled ||
                            value === undefined ||
                            (damagableCreatures.length === 0 && value.length === 0)
                          }
                          helperText={helperText}
                        />
                      )
                    }}
                  </OverriddenItemPropertyCard>
                </Box>
              </Card>
              <Card header="Target Objects">
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', marginTop: 2 }}>
                  <OverriddenItemPropertyCard
                    level={0}
                    type={data}
                    setting="damagesObjectCategoryKeys"
                    layout="inline"
                    onOverrideChange={(overridden) =>
                      handleOnChange({
                        settings: {
                          ...data.settings,
                          damagesObjectCategoryKeys: overridden ? [] : undefined
                        }
                      })
                    }
                    disabled={isWeaponTypeNone || disabled}
                  >
                    {{
                      control: (controlled, value, helperText) => (
                        <MultiSelect
                          label="Damages Object Category"
                          values={data.settings?.damagesObjectCategoryKeys}
                          onChange={(values: string[]) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                damagesObjectCategoryKeys: values.length === 0 ? undefined : values
                              }
                            })
                          }
                          options={damagableObjectCategories.map((option) => ({
                            label: toTitleCaseFromKey(option.key),
                            value: option.key
                          }))}
                          disabled={
                            disabled ||
                            controlled ||
                            value === undefined ||
                            (damagableObjectCategories.length === 0 && value.length === 0)
                          }
                          helperText={helperText}
                        />
                      )
                    }}
                  </OverriddenItemPropertyCard>
                  <OverriddenItemPropertyCard
                    level={0}
                    type={data}
                    setting="damagesObjectSubCategoryKeys"
                    layout="inline"
                    onOverrideChange={(overridden) =>
                      handleOnChange({
                        settings: {
                          ...data.settings,
                          damagesObjectSubCategoryKeys: overridden ? [] : undefined
                        }
                      })
                    }
                    disabled={isWeaponTypeNone || disabled}
                  >
                    {{
                      control: (controlled, value, helperText) => (
                        <MultiSelect
                          label="Damages Object Sub Category"
                          values={data.settings?.damagesObjectSubCategoryKeys}
                          onChange={(values: string[]) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                damagesObjectSubCategoryKeys: values.length === 0 ? undefined : values
                              }
                            })
                          }
                          options={damagableObjectSubCategories.map((option) => ({
                            label: toTitleCaseFromKey(option.key),
                            value: option.key
                          }))}
                          disabled={
                            disabled ||
                            controlled ||
                            value === undefined ||
                            (damagableObjectSubCategories.length === 0 && value.length === 0)
                          }
                          helperText={helperText}
                        />
                      )
                    }}
                  </OverriddenItemPropertyCard>
                  <OverriddenItemPropertyCard
                    level={0}
                    type={data}
                    setting="damagesObjectKeys"
                    layout="inline"
                    onOverrideChange={(overridden) =>
                      handleOnChange({
                        settings: {
                          ...data.settings,
                          damagesObjectKeys: overridden ? [] : undefined
                        }
                      })
                    }
                    disabled={isWeaponTypeNone || disabled}
                  >
                    {{
                      control: (controlled, value, helperText) => (
                        <MultiSelect
                          label="Damages Object"
                          values={data.settings?.damagesObjectKeys}
                          onChange={(values: string[]) =>
                            handleOnChange({
                              settings: {
                                ...data.settings,
                                damagesObjectKeys: values.length === 0 ? undefined : values
                              }
                            })
                          }
                          options={damagableObjects.map((option) => ({
                            label: option.name,
                            value: option.key
                          }))}
                          disabled={
                            disabled ||
                            controlled ||
                            value === undefined ||
                            (damagableObjects.length === 0 && value.length === 0)
                          }
                          helperText={helperText}
                        />
                      )
                    }}
                  </OverriddenItemPropertyCard>
                </Box>
              </Card>
            </>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
};

export default ItemViewCombatTab;
