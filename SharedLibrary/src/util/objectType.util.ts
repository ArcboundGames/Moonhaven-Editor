import { toObjectSettings, toProcessedRawObjectSettings } from './converters.util';
import { isNotNullish, isNullish } from './null.util';

import type {
  ObjectCategory,
  ObjectSettings,
  ObjectSubCategory,
  ObjectType,
  ProcessedRawObjectSubCategory,
  ProcessedRawObjectType
} from '../interface';

function hasSubCategory(type: ProcessedRawObjectType | ProcessedRawObjectSubCategory | undefined): type is ProcessedRawObjectType {
  return Boolean(type && 'subCategoryKey' in type);
}

export function getObjectSetting<K extends keyof ObjectSettings>(
  setting: K,
  type: ProcessedRawObjectType | ObjectType | ProcessedRawObjectSubCategory | ObjectSubCategory | undefined,
  categoriesByKey: Record<string, ObjectCategory> | undefined,
  subCategoriesByKey?: Record<string, ObjectSubCategory>
): { value: ObjectSettings[K]; controlledBy: 0 | 1 | 2 } {
  let controlledBy: 0 | 1 | 2;
  let value: ObjectSettings[K] | undefined;

  if (isNullish(type)) {
    return { value: undefined, controlledBy: 2 };
  }

  const typeSettings = toObjectSettings(toProcessedRawObjectSettings(type?.settings));
  const subCategorySettings =
    hasSubCategory(type) && isNotNullish(type?.subCategoryKey)
      ? toObjectSettings(toProcessedRawObjectSettings(subCategoriesByKey?.[type.subCategoryKey]?.settings))
      : {};
  const categorySettings = isNotNullish(type?.categoryKey)
    ? toObjectSettings(toProcessedRawObjectSettings(categoriesByKey?.[type.categoryKey]?.settings))
    : {};

  if (isNotNullish(typeSettings?.[setting])) {
    value = typeSettings?.[setting];
    controlledBy = 0;
  } else if (isNotNullish(subCategorySettings?.[setting])) {
    value = subCategorySettings?.[setting];
    controlledBy = 1;
  } else {
    value = categorySettings?.[setting];
    controlledBy = 2;
  }

  return { value, controlledBy };
}
