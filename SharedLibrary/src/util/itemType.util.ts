import { toItemSettings } from './converters.util';
import { isNotNullish, isNullish } from './null.util';

import type { ItemCategory, ItemSettings, ItemType, ObjectType, ProcessedRawItemType } from '../interface';

export function canItemDamageObject(
  itemType: ItemType | undefined,
  objectType: ObjectType | undefined,
  itemCategoriesByKey: Record<string, ItemCategory>
): boolean {
  if (objectType === undefined || itemType === undefined) {
    return false;
  }

  const damagesObjectKeys = getItemSetting('damagesObjectKeys', itemType, itemCategoriesByKey).value;
  if (damagesObjectKeys?.includes(objectType.key)) {
    return true;
  }

  const damagesObjectSubCategoryKeys = getItemSetting('damagesObjectSubCategoryKeys', itemType, itemCategoriesByKey).value;
  if (objectType.subCategoryKey && damagesObjectSubCategoryKeys?.includes(objectType.subCategoryKey)) {
    return true;
  }

  const damagesObjectCategoryKeys = getItemSetting('damagesObjectCategoryKeys', itemType, itemCategoriesByKey).value;
  if (objectType.categoryKey && damagesObjectCategoryKeys?.includes(objectType.categoryKey)) {
    return true;
  }

  return false;
}

export function getItemSetting<K extends keyof ItemSettings>(
  setting: K,
  type: ProcessedRawItemType | ItemType | undefined,
  itemCategoriesByKey: Record<string, ItemCategory>
): { value: ItemSettings[K]; controlledBy: 0 | 1 } {
  let controlledBy: 0 | 1 | 2;
  let value: ItemSettings[K] | undefined;

  if (isNullish(type)) {
    return { value: undefined, controlledBy: 1 };
  }

  const typeSettings = toItemSettings(type?.settings);
  const categorySettings = isNotNullish(type?.categoryKey) ? toItemSettings(itemCategoriesByKey?.[type.categoryKey]?.settings) : {};

  if (isNotNullish(typeSettings?.[setting])) {
    value = typeSettings?.[setting];
    controlledBy = 0;
  } else {
    value = categorySettings?.[setting];
    controlledBy = 1;
  }

  return { value, controlledBy };
}
