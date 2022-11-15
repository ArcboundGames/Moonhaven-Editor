import { isNotNullish } from './null.util';

export function cleanObject<T extends object>(data: T): T {
  if (!data) {
    return data;
  }

  cleanObjectRecursive(data);

  return data;
}

function cleanObjectRecursive<T extends object>(data: T): boolean {
  if (data === undefined) {
    return true;
  }

  if (Array.isArray(data)) {
    return false;
  }

  if (Object.keys(data).length === 0) {
    return true;
  }

  let hasNonEmptyKey = false;
  for (const key of Object.keys(data)) {
    const dataKey = key as keyof typeof data;
    if (typeof data[dataKey] === 'object') {
      const result = cleanObjectRecursive(data[dataKey] as unknown as object);
      if (result) {
        delete data[dataKey];
      } else {
        hasNonEmptyKey = true;
      }
    } else if (isNotNullish(data[dataKey])) {
      hasNonEmptyKey = true;
    }
  }

  return !hasNonEmptyKey;
}
