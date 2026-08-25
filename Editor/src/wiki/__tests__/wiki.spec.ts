import { mkdirSync, mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { wikiFileName } from '../filename';
import { setWikiDataDir } from '../file';
import { buildNavBoxCrop } from '../navigation';
import { assertPublishConfirmation } from '../env';
import { buildWiki } from '../build';

function writeData(dir: string, file: string, value: unknown) {
  writeFileSync(join(dir, `${file}.json`), JSON.stringify(value));
}

describe('wiki filename normalization', () => {
  it('replaces every space', () => {
    expect(wikiFileName('Copper Ore')).toBe('Copper_Ore');
    expect(wikiFileName('  Iron  Bar ')).toBe('Iron_Bar');
  });
});

describe('navigation seasons', () => {
  it('uses the matching season lists', () => {
    const page = buildNavBoxCrop({
      crops: {
        SPRING: ['Parsnip'],
        SUMMER: ['Melon'],
        FALL: ['Pumpkin'],
        WINTER: ['Winter Root']
      }
    });
    expect(page.content).toContain('Parsnip');
    expect(page.content).toContain('Melon');
    expect(page.content).toContain('Pumpkin');
    expect(page.content).toContain('Winter Root');
    expect(page.content).not.toMatch(/Summer]]\s*\n\|\[\[Parsnip\]\]/);
    expect(page.content).toContain('[[Winter#Crops|Winter]]');
  });
});

describe('publish confirmation', () => {
  const originalArgv = process.argv;
  const originalEnv = process.env.WIKI_CONFIRM_PUBLISH;

  afterEach(() => {
    process.argv = originalArgv;
    process.env.WIKI_CONFIRM_PUBLISH = originalEnv;
  });

  it('blocks publish without confirmation', () => {
    process.argv = ['node', 'publish.ts'];
    delete process.env.WIKI_CONFIRM_PUBLISH;
    expect(() => assertPublishConfirmation()).toThrow(/requires --confirm/);
  });

  it('allows an explicit confirm flag', () => {
    process.argv = ['node', 'publish.ts', '--confirm'];
    expect(() => assertPublishConfirmation()).not.toThrow();
  });
});

describe('offline wiki build', () => {
  let dataDir: string;
  let assetsDir: string;

  beforeAll(() => {
    const root = mkdtempSync(join(tmpdir(), 'moonhaven-wiki-'));
    dataDir = join(root, 'data');
    assetsDir = root;
    mkdirSync(dataDir);
    writeData(dataDir, 'items', {
      categories: [{ key: 'MATERIAL' }],
      items: [{ id: 1, key: 'COPPER_ORE', categoryKey: 'MATERIAL' }]
    });
    writeData(dataDir, 'creatures', {
      categories: [{ key: 'NPC' }],
      creatures: [
        {
          id: 1,
          key: 'SHOPKEEP',
          categoryKey: 'NPC',
          settings: { isShopkeeper: true },
          experience: 0,
          sprite: { width: 16, height: 16 },
          shop: { prices: { SPRING: { COPPER_ORE: 10 } }, openTimes: [0, 0, 0, 0, 0, 0, 0], closeTimes: [1, 1, 1, 1, 1, 1, 1] }
        }
      ]
    });
    writeData(dataDir, 'objects', { categories: [], subCategories: [], objects: [] });
    writeData(dataDir, 'crafting_recipes', {
      categories: [{ key: 'BASIC' }],
      recipes: [{ key: 'COPPER_BAR', itemTypeKey: 'COPPER_ORE', categoryKey: 'BASIC', ingredients: { COPPER_ORE: 1 } }]
    });
    writeData(dataDir, 'loot_tables', { lootTables: [{ key: 'ORE', groups: [] }] });
    writeData(dataDir, 'fishing', { zones: [{ id: 1, key: 'RIVER', lootTableKey: 'ORE' }] });
    writeData(dataDir, 'dialogue', { dialogueTrees: [{ id: 1, key: 'HELLO', dialogues: [], startingDialogueId: 0, priority: 0, runOnlyOnce: false }] });
    writeData(dataDir, 'events', { eventLogs: [{ id: 1, key: 'INTRO' }] });
    writeData(dataDir, 'quests', { quests: [{ id: 1, key: 'FIRST', tasks: [], prerequisiteEventKeys: [], experienceReward: 0, itemRewards: {} }] });
    writeData(dataDir, 'skills', { skills: [{ id: 1, key: 'MINING', levels: [] }] });
    writeData(dataDir, 'world_zones', { zones: [{ id: 1, key: 'TOWN' }] });
    writeData(dataDir, 'player', { startingItems: { COPPER_ORE: 1 } });
    writeData(dataDir, 'world', { weather: { rainChance: 0.2, snowChance: 0.1 } });
    writeData(dataDir, 'localizations', {
      keys: ['item_copper_ore_name', 'item_copper_ore_description', 'creature_shopkeep_name'],
      localizations: [
        {
          key: 'en-US',
          name: 'English',
          values: {
            item_copper_ore_name: 'Copper Ore',
            item_copper_ore_description: 'A chunk of copper.',
            creature_shopkeep_name: 'The Shopkeep'
          }
        }
      ]
    });
    setWikiDataDir(dataDir);
  });

  it('builds pages for every content type without MediaWiki', () => {
    const manifest = buildWiki(dataDir, assetsDir);
    const titles = manifest.pages.map((page) => page.title);
    expect(titles).toEqual(expect.arrayContaining([
      'Copper Ore',
      'Crafting',
      'NavboxCrop',
      'Creatures',
      'The Shopkeep',
      'Loot Tables',
      'Dialogue',
      'Events',
      'Quests',
      'Skills',
      'Fishing',
      'World Zones',
      'Player Settings',
      'World Settings'
    ]));
    const itemPage = manifest.pages.find((page) => page.title === 'Copper Ore');
    expect(itemPage?.content).toContain('The Shopkeep');
    expect(itemPage?.content).toContain('Copper_Ore.png');
  });
});
