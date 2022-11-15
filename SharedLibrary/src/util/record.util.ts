export default function toRecord<T>(array: T[], getKey: (value: T) => string | undefined): Record<string, T> {
  return array.reduce((record, entry) => {
    const key = getKey(entry);
    if (key === undefined) {
      return record;
    }

    record[key] = entry;
    return record;
  }, {} as Record<string, T>);
}
