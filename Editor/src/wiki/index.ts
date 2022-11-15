import Wikiapi from 'wikiapi';

import { getEnglishLocalization } from '../../../SharedLibrary/src/util/localization.util';
import buildCraftingPage from './crafting-recipes';
import { getLocalizations } from './file';
import buildItemPages from './items';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

(async () => {
  const { localizationKeys, localizations } = getLocalizations();
  const { englishLocalization } = getEnglishLocalization(localizations);
  if (!englishLocalization) {
    return;
  }

  const wiki = new Wikiapi('https://arcboundgames.ga/api.php');

  await wiki.login('WikiBot', 'VW7VP5xNMPgZ');

  // Crafting
  const newCraftingContent = buildCraftingPage(englishLocalization, localizationKeys);
  const crafting = await wiki.page('Crafting');
  if (crafting.wikitext !== newCraftingContent) {
    await wiki.edit(() => newCraftingContent, { bot: 1, summary: 'Bot update' });
  }

  // Items
  const itemPagesContent = buildItemPages(englishLocalization, localizationKeys);
  // eslint-disable-next-line no-restricted-syntax
  for (const page of itemPagesContent) {
    const currentPage = await wiki.page(page.name);
    if (currentPage.wikitext !== page.content) {
      await wiki.edit(() => page.content, { bot: 1, summary: 'Bot update' });
    }
  }
})();
