import { useCallback, useMemo } from 'react';

import {
  getEnglishLocalization,
  getLocalizationKey,
  getLocalizedValue as getLocalizedValueFromLocalization
} from '../../../../../SharedLibrary/src/util/localization.util';
import { useAppSelector } from '../../hooks';
import { selectLocalizationKeys, selectLocalizations } from '../../store/slices/localizations';

export default function useLocalization() {
  const localizations = useAppSelector(selectLocalizations);
  const keys = useAppSelector(selectLocalizationKeys);

  const { englishLocalization } = useMemo(() => getEnglishLocalization(localizations), [localizations]);

  const getLocalizedValue = useCallback(
    (key: string): string => getLocalizedValueFromLocalization(englishLocalization, keys, key),
    [englishLocalization, keys]
  );

  return {
    getLocalizedValue,
    getLocalizationKey
  };
}
