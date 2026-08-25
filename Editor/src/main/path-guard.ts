import { existsSync, lstatSync, mkdirSync, realpathSync, renameSync, unlinkSync, writeFileSync } from 'fs';
import { basename, dirname, extname, isAbsolute, join, normalize, relative, resolve, sep } from 'path';

export const MAX_WRITE_BYTES = 8 * 1024 * 1024;

export const ALLOWED_EXTENSIONS = new Set([
  '',
  '.json',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.txt',
  '.md'
]);

export function normalizeFsPath(input: string): string {
  return normalize(input).replaceAll('\\', '/');
}

export function toPathString(input: unknown): string {
  if (typeof input === 'string') {
    return input;
  }
  if (typeof input === 'object' && input !== null && 'toString' in input) {
    return String(input);
  }
  throw new Error('Invalid path');
}

export function resolveStreamingAssetsRoot(selectedPath: string): string {
  const resolved = resolve(selectedPath);
  return basename(resolved).toLowerCase() === 'data' ? resolve(resolved, '..') : resolved;
}

export function isTrustedSender(
  event: { sender?: { id?: number } } | undefined,
  expectedId: number | undefined
): boolean {
  return expectedId != null && event?.sender?.id === expectedId;
}

function realExistingPrefix(filePath: string): { real: string; rest: string } {
  const missing: string[] = [];
  let current = resolve(filePath);
  while (current && !existsSync(current)) {
    missing.unshift(basename(current));
    const parent = dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  if (existsSync(current) && lstatSync(current).isSymbolicLink()) {
    current = realpathSync(current);
  } else if (existsSync(current)) {
    current = realpathSync(current);
  }
  return { real: current, rest: missing.join(sep) };
}

export function resolveAllowedPath(
  root: string | undefined,
  input: unknown,
  options: { allowMissing?: boolean } = {}
): string {
  if (!root) {
    throw new Error('No workspace selected');
  }
  const raw = toPathString(input);
  if (!raw || raw.length > 4096) {
    throw new Error('Invalid path');
  }

  const resolvedInput = isAbsolute(raw) ? resolve(raw) : resolve(root, raw);
  const realRoot = existsSync(root) ? realpathSync(root) : resolve(root);
  const { real, rest } = realExistingPrefix(resolvedInput);
  const candidate = rest ? resolve(real, rest) : real;
  if (existsSync(candidate) && lstatSync(candidate).isSymbolicLink()) {
    throw new Error('Symbolic links are not allowed');
  }

  const relativePath = relative(realRoot, candidate);
  if (relativePath.startsWith('..') || isAbsolute(relativePath)) {
    throw new Error('Path escapes workspace');
  }

  const extension = extname(candidate).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    throw new Error(`Extension not allowed: ${extension}`);
  }

  if (!options.allowMissing && !existsSync(candidate)) {
    throw new Error('Path does not exist');
  }

  return candidate;
}

export function assertWriteSize(data: string | NodeJS.ArrayBufferView): void {
  const size = typeof data === 'string' ? Buffer.byteLength(data) : data.byteLength;
  if (size > MAX_WRITE_BYTES) {
    throw new Error('Payload too large');
  }
}

export function atomicWriteFile(filePath: string, data: string | NodeJS.ArrayBufferView): void {
  const directory = dirname(filePath);
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }
  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  try {
    writeFileSync(temporaryPath, data);
    renameSync(temporaryPath, filePath);
  } catch (error) {
    try {
      if (existsSync(temporaryPath)) {
        unlinkSync(temporaryPath);
      }
    } catch {
      // Best-effort cleanup after an interrupted write.
    }
    throw error;
  }
}

export function joinPaths(...paths: string[]): string {
  if (paths.length === 0 || paths.some((segment) => typeof segment !== 'string')) {
    throw new Error('Invalid path');
  }
  return normalizeFsPath(join(...paths));
}
