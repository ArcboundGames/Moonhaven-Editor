import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import {
  MAX_WRITE_BYTES,
  assertWriteSize,
  atomicWriteFile,
  isTrustedSender,
  joinPaths,
  resolveAllowedPath,
  resolveStreamingAssetsRoot
} from '../path-guard';

describe('path-guard', () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'moonhaven-workspace-'));
    mkdirSync(join(root, 'data'));
    writeFileSync(join(root, 'data', 'items.json'), '{"items":[]}');
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it('resolves a data folder to StreamingAssets', () => {
    expect(resolveStreamingAssetsRoot(join(root, 'data'))).toBe(root);
  });

  it('allows reads inside the workspace', () => {
    expect(resolveAllowedPath(root, join(root, 'data', 'items.json'))).toContain('items.json');
  });

  it('rejects traversal outside the workspace', () => {
    expect(() => resolveAllowedPath(root, join(root, 'data', '..', '..', 'outside.json'))).toThrow(
      'Path escapes workspace'
    );
  });

  it('rejects untrusted senders', () => {
    expect(isTrustedSender({ sender: { id: 2 } }, 1)).toBe(false);
    expect(isTrustedSender({ sender: { id: 1 } }, 1)).toBe(true);
  });

  it('rejects oversized payloads', () => {
    expect(() => assertWriteSize('a'.repeat(MAX_WRITE_BYTES + 1))).toThrow('Payload too large');
  });

  it('writes atomically and cleans up on success', () => {
    const target = join(root, 'data', 'world.json');
    atomicWriteFile(target, '{"ok":true}');
    expect(readFileSync(target, 'utf8')).toBe('{"ok":true}');
  });

  it('joins path segments without filesystem access', () => {
    expect(joinPaths(root, 'data', 'events.json').replace(/\\/g, '/')).toMatch(/data\/events\.json$/);
  });

  it('rejects symlink escape when the platform allows symlink creation', () => {
    const outside = mkdtempSync(join(tmpdir(), 'moonhaven-outside-'));
    writeFileSync(join(outside, 'secret.json'), 'secret');
    const link = join(root, 'data', 'escape.json');
    try {
      symlinkSync(join(outside, 'secret.json'), link);
    } catch {
      rmSync(outside, { recursive: true, force: true });
      return;
    }
    expect(() => resolveAllowedPath(root, link)).toThrow(/Symbolic links|Path escapes workspace/);
    rmSync(outside, { recursive: true, force: true });
  });
});
