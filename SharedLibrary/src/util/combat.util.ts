import { STAGES_TYPE_GROWABLE_WITH_HEALTH, WEAPON_TYPE_PROJECTILE } from '../constants';
import { getCreatureSetting } from './creatureType.util';
import { getItemSetting } from './itemType.util';
import { getObjectSetting } from './objectType.util';

import type {
  CreatureCategory,
  CreatureType,
  ItemCategory,
  ItemType,
  LocalizedCreatureType,
  LocalizedItemType,
  LocalizedObjectType,
  ObjectCategory,
  ObjectSubCategory,
  ObjectType
} from '../interface';

export function damagableObjectFilter<OT extends LocalizedObjectType | ObjectType>(
  objectOrSubCategory: OT | ObjectSubCategory,
  objectCategoriesByKey: Record<string, ObjectCategory>,
  objectSubCategoriesByKey: Record<string, ObjectSubCategory>
) {
  const { value: breakable } = getObjectSetting('breakable', objectOrSubCategory, objectCategoriesByKey, objectSubCategoriesByKey);
  if (breakable) {
    return true;
  }

  const { value: hasHealth } = getObjectSetting('hasHealth', objectOrSubCategory, objectCategoriesByKey, objectSubCategoriesByKey);
  if (hasHealth) {
    return true;
  }

  const { value: stagesType } = getObjectSetting('stagesType', objectOrSubCategory, objectCategoriesByKey, objectSubCategoriesByKey);
  if (stagesType === STAGES_TYPE_GROWABLE_WITH_HEALTH) {
    return true;
  }

  return false;
}

export function getDamagableData<OT extends LocalizedObjectType | ObjectType, CT extends LocalizedCreatureType | CreatureType>(
  objectCategories: ObjectCategory[],
  objectCategoriesByKey: Record<string, ObjectCategory>,
  objectSubCategories: ObjectSubCategory[],
  objectSubCategoriesByKey: Record<string, ObjectSubCategory>,
  objects: OT[],
  creatureCategories: CreatureCategory[],
  creatureCategoriesByKey: Record<string, CreatureCategory>,
  creatures: CT[]
): {
  damagableObjectCategories: ObjectCategory[];
  damagableObjectCategoryKeys: string[];
  damagableObjectSubCategories: ObjectCategory[];
  damagableObjectSubCategoryKeys: string[];
  damagableObjects: OT[];
  damagableObjectKeys: string[];
  damagableCreatureCategories: CreatureCategory[];
  damagableCreatureCategoryKeys: string[];
  damagableCreatures: CT[];
  damagableCreatureKeys: string[];
} {
  const damagableObjectCategories = objectCategories.filter(
    (objectCategory) =>
      objectCategory.settings?.breakable ||
      objectCategory.settings?.hasHealth ||
      objectCategory.settings?.stagesType === STAGES_TYPE_GROWABLE_WITH_HEALTH
  );

  const damagableObjectSubCategories = objectSubCategories.filter((objectSubCategory) =>
    damagableObjectFilter(objectSubCategory, objectCategoriesByKey, objectSubCategoriesByKey)
  );

  const damagableObjects = objects.filter((object) => damagableObjectFilter(object, objectCategoriesByKey, objectSubCategoriesByKey));

  const damagableCreatureCategories = creatureCategories.filter((objectCategory) => objectCategory.settings?.hasHealth);

  const damagableCreatures = creatures.filter(
    (creature) => getCreatureSetting('hasHealth', creature, creatureCategoriesByKey).value === true
  );

  return {
    damagableObjectCategories,
    damagableObjectCategoryKeys: damagableObjectCategories.map((objectCategory) => objectCategory.key),
    damagableObjectSubCategories,
    damagableObjectSubCategoryKeys: damagableObjectSubCategories.map((objectSubCategory) => objectSubCategory.key),
    damagableObjects,
    damagableObjectKeys: damagableObjects.map((object) => object.key),
    damagableCreatureCategories,
    damagableCreatureCategoryKeys: damagableCreatureCategories.map((creatureCategory) => creatureCategory.key),
    damagableCreatures,
    damagableCreatureKeys: damagableCreatures.map((creature) => creature.key)
  };
}

export function getProjectileData<IT extends LocalizedItemType | ItemType>(
  itemCategories: ItemCategory[],
  itemCategoriesByKey: Record<string, ItemCategory>,
  items: IT[]
): {
  projectileItemCategories: ItemCategory[];
  projectileItemCategoryKeys: string[];
  projectileItems: IT[];
  projectileItemKeys: string[];
} {
  const projectileItemCategories = itemCategories.filter((itemCategory) => itemCategory.settings?.weaponType === WEAPON_TYPE_PROJECTILE);

  const projectileItems = items.filter((item) => getItemSetting('weaponType', item, itemCategoriesByKey).value === WEAPON_TYPE_PROJECTILE);

  return {
    projectileItemCategories,
    projectileItemCategoryKeys: projectileItemCategories.map((itemCategory) => itemCategory.key),
    projectileItems,
    projectileItemKeys: projectileItems.map((item) => item.key)
  };
}
