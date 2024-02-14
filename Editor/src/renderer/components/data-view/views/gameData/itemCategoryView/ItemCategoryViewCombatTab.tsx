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
import Select from '../../../../widgets/form/Select';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';

import type { ItemCategory, ItemType } from '../../../../../../../../SharedLibrary/src/interface';

export interface ItemCategoryViewCombatTabProps {
  data: ItemCategory;
  disabled: boolean;
  handleOnChange: (input: Partial<ItemType>) => void;
}

const ItemCategoryViewCombatTab = ({ data, disabled, handleOnChange }: ItemCategoryViewCombatTabProps) => {
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

  const { projectileItemCategories, projectileItemCategoryKeys, projectileItems } = useMemo(
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

  const weaponType = data.settings?.weaponType;

  const isWeaponTypeNone = isNullish(weaponType) || weaponType === WEAPON_TYPE_NONE;

  const canDamageObjects = useMemo(
    () =>
      [
        ...(data.settings?.damagesObjectKeys ?? []),
        ...(data.settings?.damagesObjectCategoryKeys ?? []),
        ...(data.settings?.damagesObjectSubCategoryKeys ?? [])
      ].length > 0,
    [data]
  );

  const canDamageCreatures = useMemo(
    () =>
      [...(data.settings?.damagesCreatureKeys ?? []), ...(data.settings?.damagesCreatureCategoryKeys ?? [])].length > 0,
    [data]
  );

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '5fr 4fr' }}>
      <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <Card header="Damage">
              <FormBox sx={{ pb: 0, mb: 0 }}>
                <Select
                  label="Weapon Type"
                  required
                  disabled={disabled}
                  value={data.settings?.weaponType}
                  onChange={(value) =>
                    handleOnChange({
                      settings: {
                        ...data.settings,
                        weaponType: toWeaponType(value)
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
                />
              </FormBox>
            </Card>
          </Box>
          {weaponType && weaponType !== WEAPON_TYPE_NONE ? (
            <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
              <Card header="Input">
                <FormBox sx={{ pb: 0, mb: 0 }}>
                  <Checkbox
                    label="Has Combat Priority"
                    checked={Boolean(data.settings?.hasCombatPriority)}
                    onChange={(value) =>
                      handleOnChange({
                        settings: {
                          ...data.settings,
                          hasCombatPriority: value
                        }
                      })
                    }
                    disabled={isWeaponTypeNone || disabled}
                  />
                </FormBox>
                <FormBox sx={{ pb: 0, mb: 0 }}>
                  <Checkbox
                    label="Reset Trigger on Attack"
                    checked={Boolean(data.settings?.resetTriggerOnAttack)}
                    onChange={(value) =>
                      handleOnChange({
                        settings: {
                          ...data.settings,
                          resetTriggerOnAttack: value
                        }
                      })
                    }
                    disabled={isWeaponTypeNone || disabled}
                  />
                </FormBox>
              </Card>
              <Card header="Damage Increase Skill">
                {canDamageCreatures ? (
                  <FormBox>
                    <Select
                      label="Creature Damage Skill"
                      value={data.settings?.creatureDamageIncreasedBySkillKey}
                      onChange={(value) => {
                        handleOnChange({
                          settings: {
                            ...data.settings,
                            creatureDamageIncreasedBySkillKey: value
                          }
                        });
                      }}
                      disabled={disabled}
                      options={sortedSkills?.map((entry) => ({
                        label: entry.name,
                        value: entry.key
                      }))}
                    />
                  </FormBox>
                ) : null}
                {canDamageObjects ? (
                  <FormBox>
                    <Select
                      label="Object Damage Skill"
                      value={data.settings?.objectDamageIncreasedBySkillKey}
                      onChange={(value) => {
                        handleOnChange({
                          settings: {
                            ...data.settings,
                            objectDamageIncreasedBySkillKey: value
                          }
                        });
                      }}
                      disabled={disabled}
                      options={sortedSkills?.map((entry) => ({
                        label: entry.name,
                        value: entry.key
                      }))}
                    />
                  </FormBox>
                ) : null}
                {weaponType === WEAPON_TYPE_PROJECTILE_LAUNCHER ? (
                  <FormBox>
                    <Select
                      label="Launcher Damage Skill"
                      value={data.settings?.launcherDamageIncreasedBySkillKey}
                      onChange={(value) => {
                        handleOnChange({
                          settings: {
                            ...data.settings,
                            launcherDamageIncreasedBySkillKey: value
                          }
                        });
                      }}
                      disabled={disabled}
                      options={sortedSkills?.map((entry) => ({
                        label: entry.name,
                        value: entry.key
                      }))}
                    />
                  </FormBox>
                ) : null}
              </Card>
            </Box>
          ) : null}
        </Box>
      </Box>
      {weaponType && weaponType !== WEAPON_TYPE_NONE ? (
        <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
          {data.settings?.weaponType === WEAPON_TYPE_PROJECTILE_LAUNCHER ? (
            <Card header="Projectile Items">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', marginTop: 2 }}>
                <FormBox key="projectile-item-category" sx={{ height: 'auto', mt: 2 }}>
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
                      (projectileItemCategoryKeys.length === 0 &&
                        (data.settings?.projectileItemCategoryKeys === undefined ||
                          data.settings?.projectileItemCategoryKeys.length === 0))
                    }
                  />
                </FormBox>
                <FormBox key="projectile-item" sx={{ height: 'auto', mb: 0, pb: 0, mt: 1.5 }}>
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
                      isWeaponTypeNone ||
                      disabled ||
                      (projectileItems.length === 0 &&
                        (data.settings?.projectileItemKeys === undefined ||
                          data.settings?.projectileItemKeys.length === 0))
                    }
                  />
                </FormBox>
              </Box>
            </Card>
          ) : null}
          {weaponType !== WEAPON_TYPE_PROJECTILE_LAUNCHER ? (
            <>
              <Card header="Target Creatures">
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', marginTop: 2 }}>
                  <FormBox key="damages-creature-category" sx={{ height: 'auto', mt: 2 }}>
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
                        isWeaponTypeNone ||
                        disabled ||
                        (damagableCreatureCategories.length === 0 &&
                          (data.settings?.damagesCreatureCategoryKeys === undefined ||
                            data.settings?.damagesCreatureCategoryKeys.length === 0))
                      }
                    />
                  </FormBox>
                  <FormBox key="damages-creature" sx={{ height: 'auto', mb: 0, pb: 0, mt: 1.5 }}>
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
                        isWeaponTypeNone ||
                        disabled ||
                        (damagableCreatures.length === 0 &&
                          (data.settings?.damagesCreatureKeys === undefined ||
                            data.settings?.damagesCreatureKeys.length === 0))
                      }
                    />
                  </FormBox>
                </Box>
              </Card>
              <Card header="Target Objects">
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', marginTop: 2 }}>
                  <FormBox key="damages-object-category" sx={{ height: 'auto', mt: 2 }}>
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
                        isWeaponTypeNone ||
                        disabled ||
                        (damagableObjectCategories.length === 0 &&
                          (data.settings?.damagesObjectCategoryKeys === undefined ||
                            data.settings?.damagesObjectCategoryKeys.length === 0))
                      }
                    />
                  </FormBox>
                  <FormBox key="damages-object-sub-category" sx={{ height: 'auto', mt: 1.5 }}>
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
                        isWeaponTypeNone ||
                        disabled ||
                        (damagableObjectSubCategories.length === 0 &&
                          (data.settings?.damagesObjectSubCategoryKeys === undefined ||
                            data.settings?.damagesObjectSubCategoryKeys.length === 0))
                      }
                    />
                  </FormBox>
                  <FormBox key="damages-object" sx={{ height: 'auto', mb: 0, pb: 0, mt: 1.5 }}>
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
                        isWeaponTypeNone ||
                        disabled ||
                        (damagableObjects.length === 0 &&
                          (data.settings?.damagesObjectKeys === undefined ||
                            data.settings?.damagesObjectKeys.length === 0))
                      }
                    />
                  </FormBox>
                </Box>
              </Card>
            </>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
};

export default ItemCategoryViewCombatTab;
