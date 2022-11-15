import { ENGLISH_LOCALIZATION } from '../constants';
import { isNullish } from './null.util';

import type { Localization, Section } from '../interface';

export function getLocalizationKey(prefix: Section, key: string, dataKey?: string) {
  return dataKey ? `${prefix}_${dataKey.toLowerCase()}_${key}` : `${prefix}_${key}`;
}

export function getEnglishLocalization(localizations: Localization[]) {
  const index = localizations.findIndex((localization) => localization.key.toLowerCase() === ENGLISH_LOCALIZATION.toLowerCase());

  if (index < 0) {
    return {
      englishLocalization: null,
      englishIndex: index
    };
  }

  return {
    englishLocalization: localizations[index],
    englishIndex: index
  };
}

export function getLocalizedValue(localization: Localization | undefined | null, keys: string[], key: string) {
  if (isNullish(localization)) {
    return '';
  }

  const index = keys.indexOf(key);
  if (index < 0) {
    return '';
  }

  return localization.values[key] ?? '';
}

export function sortLocalization(localization: Localization): Localization {
  return {
    ...localization,
    values: Object.entries(localization.values)
      .sort(([a], [b]) => a.localeCompare(b))
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {} as Record<string, string>)
  };
}
