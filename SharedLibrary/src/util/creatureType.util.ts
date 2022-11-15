import { toCreatureSettings } from './converters.util';
import { isNotNullish, isNullish } from './null.util';

import type { CreatureCategory, CreatureSettings, CreatureType, ProcessedRawCreatureType } from '../interface';

export function getCreatureSetting<K extends keyof CreatureSettings>(
  setting: K,
  type: ProcessedRawCreatureType | CreatureType | undefined,
  creatureCategoriesByKey: Record<string, CreatureCategory>
): { value: CreatureSettings[K]; controlledBy: 0 | 1 } {
  let controlledBy: 0 | 1 | 2;
  let value: CreatureSettings[K] | undefined;

  if (isNullish(type)) {
    return { value: undefined, controlledBy: 1 };
  }

  const typeSettings = toCreatureSettings(type?.settings);
  const categorySettings = isNotNullish(type?.categoryKey) ? toCreatureSettings(creatureCategoriesByKey?.[type.categoryKey]?.settings) : {};

  if (isNotNullish(typeSettings?.[setting])) {
    value = typeSettings?.[setting];
    controlledBy = 0;
  } else {
    value = categorySettings?.[setting];
    controlledBy = 1;
  }

  return { value, controlledBy };
}
