---
name: moonhaven-wiki-publish
description: Publishes validated Moonhaven wiki pages and staged images to the configured local MediaWiki. Use only when the user explicitly asks to upload or publish wiki content.
disable-model-invocation: true
---

# Publish Moonhaven Wiki

1. Require configured `WIKI_API`, credentials, data path, and image path.
2. Run `npm run data:validate`.
3. Run `npm run wiki:build` and `npm run wiki:assets -- --check`.
4. Show target URL, page creates/updates, image copies/uploads, hashes,
   missing/manual assets, and known broken references.
5. Ask for confirmation immediately before applying staged images or making
   MediaWiki requests.
6. Run the explicit apply step, then `npm run wiki:publish`.
7. Fail on any rejected page/image operation and report partial completion.

Never publish as an implicit side effect of content editing.
