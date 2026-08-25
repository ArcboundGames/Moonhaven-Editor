import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import { getEnglishLocalization } from '../../../SharedLibrary/src/util/localization.util';
import { buildCatalogPages } from './catalog';
import buildCraftingPage from './crafting-recipes';
import { getArg, getAssetsDir, getDataDir, getWikiOutputDir, hasFlag } from './env';
import { getLocalizations, setWikiDataDir } from './file';
import buildItemPages from './items';
import { buildNavBoxCrop } from './navigation';
import { wikiFileName } from './filename';

import type { WikiImageRef, WikiManifest, WikiPage } from './types';

export function buildWiki(dataDir = getDataDir(), assetsDir = getAssetsDir(dataDir)): WikiManifest {
  setWikiDataDir(dataDir);
  const { localizationKeys, localizations } = getLocalizations();
  const { englishLocalization } = getEnglishLocalization(localizations);
  if (!englishLocalization) {
    throw new Error('English localization is required for wiki generation');
  }

  const { pages: itemPages, crops } = buildItemPages(englishLocalization, localizationKeys);
  const itemWikiPages: WikiPage[] = itemPages.map((itemPage) => {
    const images: WikiImageRef[] = [
      {
        sourcePath: `items/${itemPage.key.toLowerCase()}.png`,
        entityKey: itemPage.key,
        destinationFile: `${itemPage.name}.png`,
        transform: 'copy',
        pages: [itemPage.name],
        required: true
      }
    ];
    if (itemPage.stages != null) {
      for (let stage = 1; stage <= itemPage.stages; stage += 1) {
        images.push({
          sourcePath: '',
          entityKey: itemPage.name,
          destinationFile: `${itemPage.name} Stage ${stage}.png`,
          transform: 'manual',
          pages: [itemPage.name],
          required: true
        });
      }
    }
    return {
      id: itemPage.name.toLowerCase(),
      title: itemPage.name.replaceAll('_', ' '),
      content: itemPage.content,
      sourceKeys: [itemPage.name],
      images
    };
  });

  const craftingPage: WikiPage = {
    id: 'crafting',
    title: 'Crafting',
    content: buildCraftingPage(englishLocalization, localizationKeys),
    sourceKeys: ['crafting'],
    images: []
  };

  const pages = [...itemWikiPages, craftingPage, buildNavBoxCrop({ crops }), ...buildCatalogPages(englishLocalization, localizationKeys)];
  const images = pages.flatMap((wikiPage) => wikiPage.images);
  return {
    version: 1,
    generatedAt: new Date(0).toISOString(),
    dataDir,
    assetsDir,
    pages,
    images
  };
}

function stableManifest(manifest: WikiManifest): WikiManifest {
  return {
    ...manifest,
    generatedAt: new Date(0).toISOString(),
    pages: [...manifest.pages].sort((left, right) => left.title.localeCompare(right.title)),
    images: [...manifest.images].sort((left, right) => left.destinationFile.localeCompare(right.destinationFile))
  };
}

if (require.main === module) {
  const manifest = stableManifest(buildWiki());
  if (hasFlag('--check')) {
    console.info(`Wiki build check passed with ${manifest.pages.length} page(s) and ${manifest.images.length} image reference(s).`);
  } else {
    const outDir = getWikiOutputDir();
    mkdirSync(join(outDir, 'pages'), { recursive: true });
    writeFileSync(join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
    for (const wikiPage of manifest.pages) {
      writeFileSync(join(outDir, 'pages', `${wikiFileName(wikiPage.title)}.wiki`), wikiPage.content);
    }
    console.info(`Wrote ${manifest.pages.length} wiki pages to ${outDir}`);
  }
  if (getArg('--fail-on-empty') && manifest.pages.length === 0) {
    process.exitCode = 1;
  }
}
