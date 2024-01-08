import { useMemo } from 'react';

import { useAppSelector } from 'renderer/hooks';
import { selectLocalization } from 'renderer/store/slices/localizations';

const DEFAULT_LOCALIZATION = 'en';

export default function useLocalization() {
  const localizationSelector = useMemo(() => selectLocalization(DEFAULT_LOCALIZATION), []);
  return useAppSelector(localizationSelector);
}
