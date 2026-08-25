import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, join } from 'path';

import { getArg, getWikiImagesPath, getWikiOutputDir, hasFlag } from './env';
import { wikiFileName } from './filename';
import { buildWiki } from './build';

import type { WikiImageRef, WikiManifest } from './types';

function loadManifest(): WikiManifest {
  const manifestPath = getArg('--manifest') ?? join(getWikiOutputDir(), 'manifest.json');
  if (existsSync(manifestPath)) {
    return JSON.parse(readFileSync(manifestPath, 'utf8')) as WikiManifest;
  }
  return buildWiki();
}

function sourcePath(assetsDir: string, image: WikiImageRef): string {
  return image.sourcePath ? join(assetsDir, image.sourcePath) : '';
}

export function checkWikiAssets(manifest: WikiManifest): { missing: WikiImageRef[]; ready: WikiImageRef[] } {
  const missing: WikiImageRef[] = [];
  const ready: WikiImageRef[] = [];
  for (const image of manifest.images) {
    if (image.transform === 'manual' || !image.sourcePath || !existsSync(sourcePath(manifest.assetsDir, image))) {
      if (image.required) {
        missing.push(image);
      }
      continue;
    }
    ready.push(image);
  }
  return { missing, ready };
}

if (require.main === module) {
  const manifest = loadManifest();
  const { missing, ready } = checkWikiAssets(manifest);
  const stagingDir = join(getWikiOutputDir(), 'assets');
  mkdirSync(stagingDir, { recursive: true });
  writeFileSync(
    join(stagingDir, 'ownership.json'),
    `${JSON.stringify(
      {
        generated: true,
        files: ready.map((image) => wikiFileName(image.destinationFile))
      },
      null,
      2
    )}\n`
  );

  if (hasFlag('--check')) {
    for (const image of missing) {
      console.error(
        `MISSING wiki art ${image.destinationFile}: source ${image.sourcePath || '(none)'} entity ${image.entityKey}`
      );
    }
    console.info(`Wiki asset check: ${ready.length} ready, ${missing.length} missing/manual`);
    if (missing.length > 0) {
      process.exitCode = 1;
    }
  } else if (hasFlag('--apply')) {
    const destinationRoot = getWikiImagesPath();
    if (!destinationRoot) {
      throw new Error('WIKI_IMAGES_PATH is required for wiki:assets --apply');
    }
    mkdirSync(destinationRoot, { recursive: true });
    for (const image of ready) {
      const destination = join(destinationRoot, basename(image.destinationFile));
      if (existsSync(destination)) {
        const ownership = JSON.parse(readFileSync(join(stagingDir, 'ownership.json'), 'utf8')) as {
          files: string[];
        };
        if (!ownership.files.includes(wikiFileName(image.destinationFile))) {
          console.error(`Refusing to overwrite unmanaged wiki image ${destination}`);
          process.exitCode = 1;
          continue;
        }
      }
      copyFileSync(sourcePath(manifest.assetsDir, image), destination);
    }
  } else {
    for (const image of ready) {
      copyFileSync(sourcePath(manifest.assetsDir, image), join(stagingDir, basename(image.destinationFile)));
    }
    writeFileSync(join(stagingDir, 'missing.json'), `${JSON.stringify(missing, null, 2)}\n`);
    console.info(`Staged ${ready.length} wiki image(s); ${missing.length} missing/manual`);
  }
}
