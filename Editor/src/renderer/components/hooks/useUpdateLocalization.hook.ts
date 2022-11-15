import { useCallback, useEffect, useMemo, useState } from 'react';

import { DATA_FILE_EXTENSION, LOCALIZATION_DATA_FILE } from '../../../../../SharedLibrary/src/constants';
import {
  getLocalizationKey,
  getEnglishLocalization,
  getLocalizedValue as getLocalizedValueFromLocalization,
  sortLocalization
} from '../../../../../SharedLibrary/src/util/localization.util';
import { isNotEmpty, toTitleCaseFromKey } from '../../../../../SharedLibrary/src/util/string.util';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectPath } from '../../store/slices/data';
import {
  selectLocalizationKeys,
  selectLocalizations,
  updateLocalizationsAndKeys
} from '../../store/slices/localizations';
import deepEqual from '../../util/deepEqual';
import saveJsonToFile from '../../util/save.util';

import type { Localization, LocalizationFile, Section } from '../../../../../SharedLibrary/src/interface';

interface NamedUpdateLocalizationProps<K extends string> extends BaseUpdateLocalizationProps<K> {
  fallbackName: string;
}

type UnnamedUpdateLocalizationProps<K extends string> = BaseUpdateLocalizationProps<K>;

interface UpdateLocalizationProps<K extends string> extends BaseUpdateLocalizationProps<K> {
  fallbackName?: string;
}

interface BaseUpdateLocalizationProps<K extends string> {
  prefix: Section;
  keys: K[];
  dataKeys?: {
    current: string;
    route: string;
  };
}

interface NamedResponse<K extends string> extends BaseResponse<K> {
  getLocalizedName: () => string;
}

type UnnamedResponse<K extends string> = BaseResponse<K>;

interface Response<K extends string> extends BaseResponse<K> {
  getLocalizedName?: () => string | undefined;
}

interface BaseResponse<K extends string> {
  saveLocalizations: () => void;
  deleteLocalizations: () => void;
  moveLocalizations: (
    operations: {
      oldKey: K;
      newKey: string;
    }[]
  ) => void;
  tempData: {
    localizationKeys: string[];
    localization: Localization | null;
  };
  getLocalizedValue: (key: K) => string;
  updateLocalizedValue: (key: K, value: string) => void;
  deleteLocalizedValues: (key: K[]) => void;
  isLocalizationDirty: boolean;
}

export function useUpdateLocalization<K extends string>(props: UnnamedUpdateLocalizationProps<K>): UnnamedResponse<K>;
export function useUpdateLocalization<K extends string>(props: NamedUpdateLocalizationProps<K>): NamedResponse<K>;
export function useUpdateLocalization<K extends string>({
  prefix,
  keys: localizationKeys,
  fallbackName,
  dataKeys
}: UpdateLocalizationProps<K>): Response<K> {
  const dispatch = useAppDispatch();
  const path = useAppSelector(selectPath);

  const localizations = useAppSelector(selectLocalizations);
  const keys = useAppSelector(selectLocalizationKeys);

  const [values, setValues] = useState<Record<string, string>>({});
  const [originalKeys, setOriginalKeys] = useState<string[]>([]);

  const { englishLocalization, englishIndex } = useMemo(() => getEnglishLocalization(localizations), [localizations]);

  const getKey = useCallback((key: string, dataKey?: string) => getLocalizationKey(prefix, key, dataKey), [prefix]);

  const getValue = useCallback(
    (key: string): string => getLocalizedValueFromLocalization(englishLocalization, keys, key),
    [englishLocalization, keys]
  );

  const storedValues = useMemo(() => {
    const storedKeys = localizationKeys;
    setOriginalKeys(storedKeys);
    const temp = storedKeys.reduce((newValues, key) => {
      newValues[key] = getValue(getKey(key, dataKeys?.route));
      return newValues;
    }, {} as Record<string, string>);
    return temp;
  }, [dataKeys?.route, getKey, getValue, localizationKeys]);

  useEffect(() => {
    setValues(storedValues);
  }, [storedValues]);

  const isDeepEqual = useMemo(() => deepEqual(storedValues, values), [storedValues, values]);

  const save = useCallback(
    async (localizationData: LocalizationFile) => {
      if (!path) {
        return;
      }

      saveJsonToFile(
        await window.api.join(path, `${LOCALIZATION_DATA_FILE}${DATA_FILE_EXTENSION}`),
        localizationData,
        'localization',
        dispatch
      );
    },
    [dispatch, path]
  );

  const updateAddLocalizationKeys = useCallback(
    (localization: Localization | null, currentKeys: string[]) => {
      const payload = Object.keys(values).reduce((payloadToSave, key) => {
        payloadToSave[getKey(key, dataKeys?.current)] = values[key];
        return payloadToSave;
      }, {} as Record<string, string>);

      if (englishIndex === undefined || !localization) {
        return {
          keys: currentKeys,
          localizations
        };
      }

      const newLocalizations = [...localizations];
      const newLocalization = sortLocalization({
        ...localization,
        values: {
          ...localization.values,
          ...payload
        }
      });
      newLocalizations[englishIndex] = newLocalization;

      let newKeys = [...currentKeys, ...Object.keys(payload)];
      newKeys = newKeys.filter((value, index, self) => self.indexOf(value) === index);
      newKeys.sort((a, b) => a.localeCompare(b));

      return {
        keys: newKeys,
        localizations: newLocalizations,
        localization: newLocalization
      };
    },
    [dataKeys, englishIndex, getKey, localizations, values]
  );

  const deleteLocalizationKeys = useCallback(
    (localization: Localization | null, currentKeys: string[]) => {
      const keysToRemove = originalKeys.reduce((oldKeys, key) => {
        oldKeys.push(getKey(key, dataKeys?.route));
        return oldKeys;
      }, [] as string[]);

      if (englishIndex === undefined || !localization) {
        return {
          keys: currentKeys,
          localizations,
          localization
        };
      }

      const newLocalizations = [...localizations];
      const newValues = Object.keys(localization.values).reduce((remaining, key) => {
        if (!keysToRemove.includes(key)) {
          remaining[key] = localization.values[key];
        }
        return remaining;
      }, {} as Record<string, string>);

      const newLocalization = {
        ...localization,
        values: newValues
      };
      newLocalizations[englishIndex] = newLocalization;

      const newKeys = currentKeys.reduce((remaining, key) => {
        if (!keysToRemove.includes(key)) {
          remaining.push(key);
        }
        return remaining;
      }, [] as string[]);

      return {
        keys: newKeys,
        localizations: newLocalizations,
        localization: newLocalization
      };
    },
    [dataKeys?.route, englishIndex, getKey, localizations, originalKeys]
  );

  const saveLocalizations = useCallback(() => {
    const afterDeleteData = deleteLocalizationKeys(englishLocalization, keys);
    const afterUpdateAddData = updateAddLocalizationKeys(afterDeleteData.localization, afterDeleteData.keys);

    save({
      keys: afterUpdateAddData.keys,
      localizations: afterUpdateAddData.localizations
    });

    dispatch(
      updateLocalizationsAndKeys({ keys: afterUpdateAddData.keys, localizations: afterUpdateAddData.localizations })
    );
  }, [deleteLocalizationKeys, dispatch, englishLocalization, keys, save, updateAddLocalizationKeys]);

  const tempData = useMemo(() => {
    const { keys: newKeys, localizations: newLocalizations } = updateAddLocalizationKeys(englishLocalization, keys);
    return {
      localizationKeys: newKeys,
      localization: getEnglishLocalization(newLocalizations).englishLocalization
    };
  }, [englishLocalization, keys, updateAddLocalizationKeys]);

  const getLocalizedValue = useCallback(
    (key: K): string => {
      return values[key] ?? '';
    },
    [values]
  );

  const updateLocalizedValue = useCallback(
    (key: K, value: string) => {
      if (value === values[key]) {
        return;
      }

      setValues({
        ...values,
        [key]: value
      });
    },
    [values]
  );

  const deleteLocalizations = useCallback(() => {
    const { keys: newKeys, localizations: newLocalizations } = deleteLocalizationKeys(englishLocalization, keys);

    save({
      keys: newKeys,
      localizations: newLocalizations
    });

    dispatch(updateLocalizationsAndKeys({ keys: newKeys, localizations: newLocalizations }));
  }, [deleteLocalizationKeys, dispatch, englishLocalization, keys, save]);

  const getLocalizedName = useCallback(() => {
    const { name } = values;
    if (isNotEmpty(name)) {
      return name;
    }

    const { current: key } = dataKeys ?? {};
    if (isNotEmpty(key)) {
      return toTitleCaseFromKey(key);
    }

    return fallbackName;
  }, [dataKeys, fallbackName, values]);

  const moveLocalizations = useCallback(
    (
      operations: {
        oldKey: K;
        newKey: string;
      }[]
    ) => {
      const newValues = { ...values };

      operations.forEach((operation) => {
        const temp = newValues[operation.oldKey];
        delete newValues[operation.oldKey];
        newValues[operation.newKey] = temp;
      });

      setValues(newValues);
    },
    [values]
  );

  const deleteLocalizedValues = useCallback(
    (oldKeys: K[]) => {
      const newValues = { ...values };

      oldKeys.forEach((oldKey) => {
        delete newValues[oldKey];
      });

      setValues(newValues);
    },
    [values]
  );

  const result: Response<K> = {
    saveLocalizations,
    deleteLocalizations,
    moveLocalizations,
    tempData,
    getLocalizedValue,
    updateLocalizedValue,
    deleteLocalizedValues,
    isLocalizationDirty: !isDeepEqual
  };

  if (fallbackName) {
    result.getLocalizedName = getLocalizedName;
  }

  return result;
}
