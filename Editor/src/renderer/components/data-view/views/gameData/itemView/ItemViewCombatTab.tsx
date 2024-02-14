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
    () => getItemSetting('weaponType', data, itemCategoriesByKey).value,
    [data, itemCategoriesByKey]
  );

  const isWeaponTypeNone = isNullish(weaponType) || weaponType === WEAPON_TYPE_NONE;

  const canDamageObjects = useMemo(
    () =>
      [
        ...(getItemSetting('damagesObjectKeys', data, itemCategoriesByKey).value ?? []),
        ...(getItemSetting('damagesObjectCategoryKeys', data, itemCategoriesByKey).value ?? []),
        ...(getItemSetting('damagesObjectSubCategoryKeys', data, itemCategoriesByKey).value ?? [])
      ].length > 0,
    [data, itemCategoriesByKey]
  );

  const canDamageCreatures = useMemo(
    () =>
      [
        ...(getItemSetting('damagesCreatureKeys', data, itemCategoriesByKey).value ?? []),
        ...(getItemSetting('damagesCreatureCategoryKeys', data, itemCategoriesByKey).value ?? [])
      ].length > 0,
    [data, itemCategoriesByKey]
  );

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '5fr 4fr' }}>
      <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <Card header="Weapon">
              <OverriddenItemPropertyCard
                type={data}
                setting="weaponType"
                layout="inline"
                onChange={handleOnChange}
                defaultValue={weaponType ?? WEAPON_TYPE_NONE}
                disabled={disabled}
              >
                {{
                  control: ({ controlled, value, helperText, onChange }) => (
                    <Select
                      label="Weapon Type"
                      required
                      disabled={disabled}
                      value={value}
                      error={!controlled && !isWeaponTypeNone && value === undefined}
                      onChange={onChange}
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
                {canDamageCreatures ? (
                  <FormBox>
                    <NumberTextField
                      label="Creature Damage"
                      value={data.creatureDamage}
                      min={1}
                      onChange={(value) => handleOnChange({ creatureDamage: value })}
                      required
                      disabled={isWeaponTypeNone || disabled}
                      wholeNumber
                    />
                  </FormBox>
                ) : null}
                {canDamageObjects ? (
                  <FormBox>
                    <NumberTextField
                      label="Object Damage"
                      value={data.objectDamage}
                      min={1}
                      onChange={(value) => handleOnChange({ objectDamage: value })}
                      required
                      disabled={isWeaponTypeNone || disabled}
                      wholeNumber
                    />
                  </FormBox>
                ) : null}
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
                {weaponType === WEAPON_TYPE_PROJECTILE_LAUNCHER ? (
                  <FormBox>
                    <NumberTextField
                      label="Launcher Damage"
                      value={data.launcherDamage}
                      min={1}
                      onChange={(value) => handleOnChange({ launcherDamage: value })}
                      required
                      disabled={isWeaponTypeNone || disabled}
                      wholeNumber
                    />
                  </FormBox>
                ) : null}
              </Card>
            ) : null}
          </Box>
          {weaponType && weaponType !== WEAPON_TYPE_NONE ? (
            <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
              <Card header="Input">
                <OverriddenItemPropertyCard
                  label="Has Combat Priority"
                  type={data}
                  layout="inline"
                  setting="hasCombatPriority"
                  onChange={handleOnChange}
                  defaultValue={false}
                  disabled={isWeaponTypeNone || disabled}
                  variant="boolean"
                />
                <OverriddenItemPropertyCard
                  label="Reset Trigger on Attack"
                  type={data}
                  layout="inline"
                  setting="resetTriggerOnAttack"
                  onChange={handleOnChange}
                  defaultValue={false}
                  disabled={isWeaponTypeNone || disabled}
                  variant="boolean"
                />
              </Card>
              {canDamageCreatures ? (
                <OverriddenItemPropertyCard
                  type={data}
                  setting="creatureDamageIncreasedBySkillKey"
                  onChange={handleOnChange}
                  defaultValue={''}
                  disabled={isWeaponTypeNone || disabled}
                >
                  {{
                    control: ({ controlled, value, helperText, onChange }) => (
                      <Select
                        label="Creature Damage Skill"
                        value={value}
                        onChange={onChange}
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
              ) : null}
              {canDamageObjects ? (
                <OverriddenItemPropertyCard
                  type={data}
                  setting="objectDamageIncreasedBySkillKey"
                  onChange={handleOnChange}
                  defaultValue={''}
                  disabled={isWeaponTypeNone || disabled}
                >
                  {{
                    control: ({ controlled, value, helperText, onChange }) => (
                      <Select
                        label="Object Damage Skill"
                        value={value}
                        onChange={onChange}
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
              ) : null}
              {weaponType === WEAPON_TYPE_PROJECTILE_LAUNCHER ? (
                <OverriddenItemPropertyCard
                  type={data}
                  setting="launcherDamageIncreasedBySkillKey"
                  onChange={handleOnChange}
                  defaultValue={''}
                  disabled={isWeaponTypeNone || disabled}
                >
                  {{
                    control: ({ controlled, value, helperText, onChange }) => (
                      <Select
                        label="Launcher Damage Skill"
                        value={value}
                        onChange={onChange}
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
              ) : null}
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
                  type={data}
                  setting="projectileItemCategoryKeys"
                  layout="inline"
                  onChange={handleOnChange}
                  defaultValue={[]}
                  disabled={isWeaponTypeNone || disabled}
                >
                  {{
                    control: ({ controlled, value, helperText, onChange }) => (
                      <MultiSelect
                        label="Projectile Item Category"
                        values={value}
                        onChange={onChange}
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
                  type={data}
                  setting="projectileItemKeys"
                  layout="inline"
                  onChange={handleOnChange}
                  defaultValue={[]}
                  disabled={isWeaponTypeNone || disabled}
                >
                  {{
                    control: ({ controlled, value, helperText, onChange }) => (
                      <ItemMultiSelect
                        label="Projectile Item"
                        values={value}
                        onChange={onChange}
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
                    type={data}
                    setting="damagesCreatureCategoryKeys"
                    layout="inline"
                    onChange={handleOnChange}
                    defaultValue={[]}
                    disabled={isWeaponTypeNone || disabled}
                  >
                    {{
                      control: ({ controlled, value, helperText, onChange }) => (
                        <MultiSelect
                          label="Damages Creature Category"
                          values={value}
                          onChange={onChange}
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
                    type={data}
                    setting="damagesCreatureKeys"
                    layout="inline"
                    onChange={handleOnChange}
                    defaultValue={[]}
                    disabled={isWeaponTypeNone || disabled}
                  >
                    {{
                      control: ({ controlled, value, helperText, onChange }) => (
                        <CreatureMultiSelect
                          label="Damages Creature"
                          values={value}
                          onChange={onChange}
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
                    type={data}
                    setting="damagesObjectCategoryKeys"
                    layout="inline"
                    onChange={handleOnChange}
                    defaultValue={[]}
                    disabled={isWeaponTypeNone || disabled}
                  >
                    {{
                      control: ({ controlled, value, helperText, onChange }) => (
                        <MultiSelect
                          label="Damages Object Category"
                          values={value}
                          onChange={onChange}
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
                    type={data}
                    setting="damagesObjectSubCategoryKeys"
                    layout="inline"
                    onChange={handleOnChange}
                    defaultValue={[]}
                    disabled={isWeaponTypeNone || disabled}
                  >
                    {{
                      control: ({ controlled, value, helperText, onChange }) => (
                        <MultiSelect
                          label="Damages Object Sub Category"
                          values={value}
                          onChange={onChange}
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
                    type={data}
                    setting="damagesObjectKeys"
                    layout="inline"
                    onChange={handleOnChange}
                    defaultValue={[]}
                    disabled={isWeaponTypeNone || disabled}
                  >
                    {{
                      control: ({ controlled, value, helperText, onChange }) => (
                        <MultiSelect
                          label="Damages Object"
                          values={value}
                          onChange={onChange}
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
