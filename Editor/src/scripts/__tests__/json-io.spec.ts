import { combineJsonFiles, splitCombinedJson, stableJson } from '../json-io';
import { mkdirSync, mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

describe('json-io', () => {
  it('sorts combined inputs and round-trips', () => {
    const dir = mkdtempSync(join(tmpdir(), 'moonhaven-json-'));
    mkdirSync(join(dir, 'nested'));
    writeFileSync(join(dir, 'b.json'), '{"z":1,"a":2}');
    writeFileSync(join(dir, 'a.json'), '{"m":true}');
    const combined = combineJsonFiles(dir);
    expect(Object.keys(combined)).toEqual(['a', 'b']);
    const split = splitCombinedJson(combined);
    expect(split.b).toBe(stableJson({ a: 2, z: 1 }));
  });
});
