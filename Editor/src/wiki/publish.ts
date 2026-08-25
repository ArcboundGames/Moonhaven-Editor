import Wikiapi from 'wikiapi';

import { buildWiki } from './build';
import { checkWikiAssets } from './assets';
import { assertPublishConfirmation, getWikiImagesPath, hasFlag, requireWikiCredentials } from './env';
import { wikiFileName } from './filename';

async function editPage(wiki: Wikiapi, title: string, content: string) {
  const currentPage = await wiki.page(title);
  if (currentPage.wikitext !== content) {
    console.info(`Editing ${title}`);
    await wiki.edit(() => content, { bot: 1, summary: 'Bot update' });
  }
}

async function uploadImage(wiki: Wikiapi, imageName: string) {
  const imagesPath = getWikiImagesPath();
  if (!imagesPath) {
    throw new Error('WIKI_IMAGES_PATH is required to upload images');
  }
  const filename = `${wikiFileName(imageName)}.png`.replace(/\.png\.png$/, '.png');
  await wiki.upload({
    file_path: `${imagesPath}/${filename.replace(/\.png$/, '')}.png`.replace(/\.png\.png$/, '.png'),
    filename,
    comment: 'Bot update',
    ignorewarnings: 1,
    bot: 1
  });
}

(async () => {
  assertPublishConfirmation();
  const { apiUrl, username, password } = requireWikiCredentials();
  const manifest = buildWiki();
  const { missing, ready } = checkWikiAssets(manifest);
  console.info(`Publish plan for ${apiUrl}`);
  console.info(`Pages: ${manifest.pages.length}`);
  console.info(`Images ready: ${ready.length}`);
  console.info(`Images missing/manual: ${missing.length}`);
  for (const image of missing) {
    console.error(`MISSING ${image.destinationFile} from ${image.sourcePath || 'manual conversion'} (${image.entityKey})`);
  }
  if (missing.length > 0 && !hasFlag('--allow-missing')) {
    throw new Error('Refusing to publish with missing required wiki art. Re-run with --allow-missing after review.');
  }

  const wiki = new Wikiapi(apiUrl);
  await wiki.login(username, password);
  for (const image of ready) {
    await uploadImage(wiki, image.destinationFile.replace(/\.png$/i, ''));
  }
  for (const page of manifest.pages) {
    await editPage(wiki, page.title, page.content);
  }
})().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
