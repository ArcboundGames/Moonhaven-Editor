import { readFileSync, readdirSync, renameSync, writeFileSync } from 'fs';
import { join } from 'path';

function sortObject(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortObject);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, sortObject(child)])
    );
  }
  return value;
}

export function stableJson(value: unknown): string {
  return `${JSON.stringify(sortObject(value), null, 2)}\n`;
}

export function atomicWrite(path: string, contents: string) {
  const temporaryPath = `${path}.${process.pid}.tmp`;
  writeFileSync(temporaryPath, contents);
  renameSync(temporaryPath, path);
}

export function combineJsonFiles(inputDir: string): Record<string, unknown> {
  const combined: Record<string, unknown> = {};
  const jsonFiles = readdirSync(inputDir)
    .filter((file) => file.endsWith('.json'))
    .sort((left, right) => left.localeCompare(right));
  if (jsonFiles.length === 0) {
    throw new Error(`No JSON files found in ${inputDir}`);
  }
  for (const file of jsonFiles) {
    combined[file.replace(/\.json$/, '')] = JSON.parse(readFileSync(join(inputDir, file), 'utf8'));
  }
  return combined;
}

export function splitCombinedJson(data: Record<string, unknown>): Record<string, string> {
  return Object.fromEntries(
    Object.keys(data)
      .sort((left, right) => left.localeCompare(right))
      .map((key) => [key, stableJson(data[key])])
  );
}
