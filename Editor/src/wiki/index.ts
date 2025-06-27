import dotenv from 'dotenv';
import Wikiapi from 'wikiapi';

import { getEnglishLocalization } from '../../../SharedLibrary/src/util/localization.util';
import buildCraftingPage from './crafting-recipes';
import { getLocalizations } from './file';
import buildItemPages from './items';
import { generateNavigation } from './navigation';
import { editPage, getApiUrl, uploadImage } from './wiki.util';

(async () => {
  dotenv.config();

  const { localizationKeys, localizations } = getLocalizations();
  const { englishLocalization } = getEnglishLocalization(localizations);
  if (!englishLocalization) {
    return;
  }

  const wiki = new Wikiapi(getApiUrl());

  await wiki.login('WikiBot', 'VW7VP5xNMPgZ');

  // Items
  const { pages: itemPagesContent, crops } = buildItemPages(englishLocalization, localizationKeys);
  // eslint-disable-next-line no-restricted-syntax
  for (let i = 0; i < itemPagesContent.length; i++) {
    const page = itemPagesContent[i];
    console.info(`Uploading page ${i + 1} / ${itemPagesContent.length}`);

    // Upload images
    const baseImageName = page.name.replaceAll('_', ' ');
    await uploadImage(wiki, baseImageName);

    if (page.stages != null) {
      for (let s = 0; s < page.stages; s++) {
        await uploadImage(wiki, `${baseImageName} Stage ${s + 1}`);
      }
    }

    await editPage(wiki, page.name, page.content);
  }

  // Navigation
  console.info(`Generating navigation templates...`);
  await generateNavigation(wiki, { crops });

  // Crafting
  console.info(`Generating crafting page...`);
  const newCraftingContent = buildCraftingPage(englishLocalization, localizationKeys);
  await editPage(wiki, 'Crafting', newCraftingContent);
})();
