import type Wikiapi from 'wikiapi';

export function getApiUrl() {
  return process.env.WIKI_API ?? '';
}

export function getWikiImagesPath() {
  return process.env.WIKI_IMAGES_PATH ?? '';
}

export function getStreamingDataPath() {
  return process.env.STREAMING_DATA_PATH ?? '';
}

export async function purge(title: string) {
  console.info(`Purging ${title}...`);
  try {
    await fetch(getApiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        action: 'purge',
        titles: title,
        format: 'json'
      })
    });
  } catch (error) {
    console.error('Error purging page:', error);
  }
}

export async function editPage(wiki: Wikiapi, title: string, content: string) {
  try {
    const currentPage = await wiki.page(title);
    if (currentPage.wikitext !== content) {
      console.info(`Editing file ${title}...`);
      await wiki.edit(() => content, { bot: 1, summary: 'Bot update' });
    }
  } catch (e: unknown) {
    console.error('Error editing page', e);
  }

  await purge(title);
}

export async function uploadImage(wiki: Wikiapi, imageName: string) {
  try {
    console.info(`Uploading ${imageName}.png...`);
    await wiki.upload({
      file_path: `${getWikiImagesPath()}/${imageName}.png`,
      filename: `${imageName}.png`,
      comment: 'Bot update',
      ignorewarnings: 1, // overwrite
      bot: 1
    });
  } catch (e: unknown) {
    console.error('Error uploading image', e);

    if (e instanceof Error) {
      const data = JSON.parse(e.message) as { info: string };
      console.info(data.info);
    }
  }

  await purge(`File:${imageName}.png`);
}
