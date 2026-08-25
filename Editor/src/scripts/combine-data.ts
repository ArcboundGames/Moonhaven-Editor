import dotenv from 'dotenv';
import { existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';

import { atomicWrite, combineJsonFiles, stableJson } from './json-io';

dotenv.config();

function getArg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const check = process.argv.includes('--check');
const inputDir = resolve(getArg('--data-dir') ?? process.env.STREAMING_DATA_PATH ?? '');
const outputDir = resolve(getArg('--out-dir') ?? process.env.COMBINED_DATA_PATH ?? '');
const outputFileName = getArg('--out-file') ?? 'combined.json';

if (!inputDir || !outputDir) {
  console.error('Usage: data:combine -- --data-dir <dir> --out-dir <dir> [--check]');
  process.exit(1);
}

try {
  const combined = combineJsonFiles(inputDir);
  const output = stableJson(combined);
  const outputPath = join(outputDir, outputFileName);
  if (check) {
    if (!existsSync(outputPath)) {
      throw new Error(`Combined file missing for --check: ${outputPath}`);
    }
    const { readFileSync } = require('fs') as typeof import('fs');
    if (readFileSync(outputPath, 'utf8').replace(/\r\n/g, '\n') !== output) {
      throw new Error(`Combined JSON is stale: ${outputPath}`);
    }
    console.info('data:combine --check passed');
  } else {
    mkdirSync(outputDir, { recursive: true });
    atomicWrite(outputPath, output);
    console.info(`Combined JSON written to: ${outputPath}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
