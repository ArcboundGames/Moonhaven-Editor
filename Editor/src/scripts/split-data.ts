import dotenv from 'dotenv';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

import { atomicWrite, splitCombinedJson } from './json-io';

dotenv.config();

function getArg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const check = process.argv.includes('--check');
const combinedDir = resolve(getArg('--combined-dir') ?? process.env.COMBINED_DATA_PATH ?? '');
const outputDir = resolve(getArg('--data-dir') ?? process.env.STREAMING_DATA_PATH ?? '');
const combinedFile = getArg('--in-file') ?? 'combined.json';

if (!combinedDir || !outputDir) {
  console.error('Usage: data:split -- --combined-dir <dir> --data-dir <dir> [--check]');
  process.exit(1);
}

try {
  const combinedPath = join(combinedDir, combinedFile);
  const data = JSON.parse(readFileSync(combinedPath, 'utf8')) as Record<string, unknown>;
  const files = splitCombinedJson(data);
  if (Object.keys(files).length === 0) {
    throw new Error('Combined JSON contained no sections');
  }
  if (check) {
    for (const [key, contents] of Object.entries(files)) {
      const filePath = join(outputDir, `${key}.json`);
      if (!existsSync(filePath) || readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n') !== contents) {
        throw new Error(`Split output is stale: ${filePath}`);
      }
    }
    console.info('data:split --check passed');
  } else {
    mkdirSync(outputDir, { recursive: true });
    for (const [key, contents] of Object.entries(files)) {
      atomicWrite(join(outputDir, `${key}.json`), contents);
      console.info(`Wrote ${key}.json`);
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
