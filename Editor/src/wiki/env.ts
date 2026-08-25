import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

dotenv.config();

const siblingDataDir = resolve(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'Moonhaven',
  'Moonhaven-Unity',
  'Assets',
  'StreamingAssets',
  'data'
);

export function getArg(name: string, fallback?: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

export function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

export function getDataDir(): string {
  const fromArg = getArg('--data-dir');
  const fromEnv = process.env.STREAMING_DATA_PATH;
  const selected = fromArg || fromEnv || (existsSync(siblingDataDir) ? siblingDataDir : '');
  if (!selected) {
    throw new Error('Set --data-dir or STREAMING_DATA_PATH');
  }
  return resolve(selected);
}

export function getAssetsDir(dataDir: string): string {
  const fromArg = getArg('--assets-dir');
  return resolve(fromArg ?? resolve(dataDir, '..'));
}

export function getWikiOutputDir(): string {
  return resolve(getArg('--out-dir') ?? resolve(__dirname, '..', '..', 'output', 'wiki'));
}

export function getApiUrl(): string {
  return process.env.WIKI_API ?? '';
}

export function getWikiImagesPath(): string {
  return process.env.WIKI_IMAGES_PATH ?? '';
}

export function getWikiUser(): string {
  return process.env.WIKI_USER ?? '';
}

export function getWikiPassword(): string {
  return process.env.WIKI_PASSWORD ?? '';
}

export function assertPublishConfirmation() {
  if (!hasFlag('--confirm') && process.env.WIKI_CONFIRM_PUBLISH !== 'YES') {
    throw new Error('wiki:publish requires --confirm after reviewing the publish plan');
  }
}

export function requireWikiCredentials() {
  const apiUrl = getApiUrl();
  const username = getWikiUser();
  const password = getWikiPassword();
  if (!apiUrl || !username || !password) {
    throw new Error('Wiki publish requires WIKI_API, WIKI_USER, and WIKI_PASSWORD in Editor/.env');
  }
  return { apiUrl, username, password };
}
