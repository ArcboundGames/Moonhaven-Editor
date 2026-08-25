export type ContentFileName =
  | 'items'
  | 'creatures'
  | 'objects'
  | 'crafting_recipes'
  | 'loot_tables'
  | 'dialogue'
  | 'events'
  | 'quests'
  | 'skills'
  | 'fishing'
  | 'world_zones'
  | 'player'
  | 'world'
  | 'localizations';

export interface ContentCollection {
  path: string;
  keyScope: string;
  idScope?: string;
  enforceUpperSnakeKey?: boolean;
}

export interface ContentDefinition {
  file: ContentFileName;
  collections: ContentCollection[];
  directArt: 'item' | 'creature' | 'object' | 'player' | 'none';
  wikiPolicy: 'page' | 'index' | 'embedded' | 'reference';
}

export const CONTENT_REGISTRY: ContentDefinition[] = [
  {
    file: 'items',
    collections: [
      { path: 'categories', keyScope: 'item-categories' },
      { path: 'items', keyScope: 'items', idScope: 'items' }
    ],
    directArt: 'item',
    wikiPolicy: 'page'
  },
  {
    file: 'creatures',
    collections: [
      { path: 'categories', keyScope: 'creature-categories' },
      { path: 'creatures', keyScope: 'creatures', idScope: 'creatures' }
    ],
    directArt: 'creature',
    wikiPolicy: 'page'
  },
  {
    file: 'objects',
    collections: [
      { path: 'categories', keyScope: 'object-categories' },
      { path: 'subCategories', keyScope: 'object-sub-categories' },
      { path: 'objects', keyScope: 'objects', idScope: 'objects' }
    ],
    directArt: 'object',
    wikiPolicy: 'page'
  },
  {
    file: 'crafting_recipes',
    collections: [
      { path: 'categories', keyScope: 'recipe-categories' },
      { path: 'recipes', keyScope: 'recipes' }
    ],
    directArt: 'none',
    wikiPolicy: 'embedded'
  },
  {
    file: 'loot_tables',
    collections: [{ path: 'lootTables', keyScope: 'loot-tables' }],
    directArt: 'none',
    wikiPolicy: 'reference'
  },
  {
    file: 'dialogue',
    collections: [{ path: 'dialogueTrees', keyScope: 'dialogue-trees', idScope: 'dialogue-trees' }],
    directArt: 'none',
    wikiPolicy: 'page'
  },
  {
    file: 'events',
    collections: [{ path: 'eventLogs', keyScope: 'events', idScope: 'events' }],
    directArt: 'none',
    wikiPolicy: 'reference'
  },
  {
    file: 'quests',
    collections: [{ path: 'quests', keyScope: 'quests', idScope: 'quests' }],
    directArt: 'none',
    wikiPolicy: 'page'
  },
  {
    file: 'skills',
    collections: [{ path: 'skills', keyScope: 'skills', idScope: 'skills' }],
    directArt: 'none',
    wikiPolicy: 'page'
  },
  {
    file: 'fishing',
    collections: [{ path: 'zones', keyScope: 'fishing-zones', idScope: 'fishing-zones' }],
    directArt: 'none',
    wikiPolicy: 'page'
  },
  {
    file: 'world_zones',
    collections: [{ path: 'zones', keyScope: 'world-zones', idScope: 'world-zones' }],
    directArt: 'none',
    wikiPolicy: 'page'
  },
  { file: 'player', collections: [], directArt: 'player', wikiPolicy: 'reference' },
  { file: 'world', collections: [], directArt: 'none', wikiPolicy: 'reference' },
  {
    file: 'localizations',
    collections: [{ path: 'localizations', keyScope: 'languages', enforceUpperSnakeKey: false }],
    directArt: 'none',
    wikiPolicy: 'embedded'
  }
];

export function getValueAtPath(value: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((current, segment) => {
    if (typeof current !== 'object' || current === null || !(segment in current)) {
      return undefined;
    }
    return (current as Record<string, unknown>)[segment];
  }, value);
}
