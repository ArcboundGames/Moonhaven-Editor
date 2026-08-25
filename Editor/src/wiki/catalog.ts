import { toTitleCaseFromKey } from '../../../SharedLibrary/src/util/string.util';
import { wikiFileName } from './filename';
import {
  getCreatures,
  getDialogue,
  getEvents,
  getFishingZones,
  getItems,
  getLootTables,
  getObjects,
  getPlayerSettings,
  getQuests,
  getSkills,
  getWorldSettings,
  getWorldZones
} from './file';

import type { Localization } from '../../../SharedLibrary/src/interface';
import type { WikiImageRef, WikiPage } from './types';

function page(title: string, content: string, sourceKeys: string[], images: WikiImageRef[] = []): WikiPage {
  return { id: wikiFileName(title).toLowerCase(), title, content, sourceKeys, images };
}

function list(keys: string[]) {
  return keys.map((key) => `[[${toTitleCaseFromKey(key)}]]`).join(' • ') || 'None';
}

export function buildCatalogPages(localization: Localization, localizationKeys: string[]): WikiPage[] {
  const { items, itemCategories } = getItems(localization, localizationKeys);
  const { creatures, creatureCategories } = getCreatures(localization, localizationKeys);
  const { objects, objectCategories } = getObjects(localization, localizationKeys);
  const { lootTables } = getLootTables();
  const { dialogueTrees } = getDialogue(localization, localizationKeys);
  const { eventLogs } = getEvents(localization, localizationKeys);
  const { quests } = getQuests(localization, localizationKeys);
  const { skills } = getSkills(localization, localizationKeys);
  const { fishingZones } = getFishingZones(localization, localizationKeys);
  const { worldZones } = getWorldZones(localization, localizationKeys);
  const { player } = getPlayerSettings();
  const { world } = getWorldSettings();

  const pages: WikiPage[] = [];

  pages.push(
    page(
      'Items',
      `== Item categories ==\n${itemCategories.map((category) => `* [[${toTitleCaseFromKey(category.key)}]]`).join('\n')}\n\n== Items ==\n${items
        .map((item) => `* [[${item.name}]]`)
        .join('\n')}\n`,
      items.map((item) => item.key)
    )
  );

  itemCategories.forEach((category) => {
    pages.push(
      page(
        toTitleCaseFromKey(category.key),
        `This is an item category.\n\n== Items ==\n${items
          .filter((item) => item.categoryKey === category.key)
          .map((item) => `* [[${item.name}]]`)
          .join('\n')}\n`,
        [category.key]
      )
    );
  });

  creatures.forEach((creature) => {
    pages.push(
      page(
        creature.name,
        `{{Infobox\n|name = ${creature.name}\n|image = ${wikiFileName(creature.name)}.png\n}}\n\nA creature in Moonhaven.\n`,
        [creature.key],
        [
          {
            sourcePath: `creatures/${creature.key.toLowerCase()}.png`,
            entityKey: creature.key,
            destinationFile: `${wikiFileName(creature.name)}.png`,
            transform: 'copy',
            pages: [creature.name],
            required: true
          }
        ]
      )
    );
  });

  pages.push(
    page(
      'Creatures',
      `== Categories ==\n${creatureCategories.map((category) => `* ${toTitleCaseFromKey(category.key)}`).join('\n')}\n\n== Creatures ==\n${creatures
        .map((creature) => `* [[${creature.name}]]`)
        .join('\n')}\n`,
      creatures.map((creature) => creature.key)
    )
  );

  objects.forEach((object) => {
    pages.push(
      page(
        object.name,
        `{{Infobox\n|name = ${object.name}\n|image = ${wikiFileName(object.name)}.png\n}}\n\nA placeable object.\n`,
        [object.key],
        [
          {
            sourcePath: `objects/${object.key.toLowerCase()}.png`,
            entityKey: object.key,
            destinationFile: `${wikiFileName(object.name)}.png`,
            transform: object.stages && object.stages.length > 1 ? 'manual' : 'copy',
            pages: [object.name],
            required: true
          }
        ]
      )
    );
  });

  pages.push(
    page(
      'Objects',
      `== Categories ==\n${objectCategories.map((category) => `* ${toTitleCaseFromKey(category.key)}`).join('\n')}\n\n== Objects ==\n${objects
        .map((object) => `* [[${object.name}]]`)
        .join('\n')}\n`,
      objects.map((object) => object.key)
    )
  );

  lootTables.forEach((table) => {
    pages.push(page(toTitleCaseFromKey(table.key), `Loot table '''${table.key}'''.\n`, [table.key]));
  });

  pages.push(
    page('Loot Tables', lootTables.map((table) => `* [[${toTitleCaseFromKey(table.key)}]]`).join('\n') + '\n', lootTables.map((table) => table.key))
  );

  dialogueTrees.forEach((tree) => {
    pages.push(page(tree.name, `Dialogue tree '''${tree.key}''' with ${(tree.dialogues ?? []).length} node(s).\n`, [tree.key]));
  });
  pages.push(page('Dialogue', dialogueTrees.map((tree) => `* [[${tree.name}]]`).join('\n') + '\n', dialogueTrees.map((tree) => tree.key)));

  eventLogs.forEach((eventLog) => {
    pages.push(page(eventLog.name, `Event '''${eventLog.key}'''.\n`, [eventLog.key]));
  });
  pages.push(page('Events', eventLogs.map((eventLog) => `* [[${eventLog.name}]]`).join('\n') + '\n', eventLogs.map((eventLog) => eventLog.key)));

  quests.forEach((quest) => {
    pages.push(page(quest.name, `Quest '''${quest.key}''' with ${(quest.tasks ?? []).length} task(s).\n`, [quest.key]));
  });
  pages.push(page('Quests', quests.map((quest) => `* [[${quest.name}]]`).join('\n') + '\n', quests.map((quest) => quest.key)));

  skills.forEach((skill) => {
    const levels = (skill.levels ?? []).map((level) => `* ${toTitleCaseFromKey(level.key)}`).join('\n');
    pages.push(page(skill.name, `Skill '''${skill.key}'''.\n\n== Levels ==\n${levels}\n`, [skill.key]));
  });
  pages.push(page('Skills', skills.map((skill) => `* [[${skill.name}]]`).join('\n') + '\n', skills.map((skill) => skill.key)));

  fishingZones.forEach((zone) => {
    pages.push(
      page(zone.name, `Fishing zone '''${zone.key}''' using loot table ${zone.lootTableKey ? `[[${toTitleCaseFromKey(zone.lootTableKey)}]]` : 'None'}.\n`, [
        zone.key
      ])
    );
  });
  pages.push(
    page('Fishing', fishingZones.map((zone) => `* [[${zone.name}]]`).join('\n') + '\n', fishingZones.map((zone) => zone.key))
  );

  worldZones.forEach((zone) => {
    pages.push(page(zone.name, `World zone '''${zone.key}'''.\n`, [zone.key]));
  });
  pages.push(
    page('World Zones', worldZones.map((zone) => `* [[${zone.name}]]`).join('\n') + '\n', worldZones.map((zone) => zone.key))
  );

  pages.push(
    page(
      'Player Settings',
      `Starting player configuration.\n\n* Starting items: ${list(Object.keys(player.startingItems ?? {}))}\n`,
      ['player']
    )
  );
  pages.push(
    page(
      'World Settings',
      `World simulation settings.\n\n* Rain chance: ${world.weather?.rainChance ?? 'unset'}\n* Snow chance: ${world.weather?.snowChance ?? 'unset'}\n`,
      ['world']
    )
  );

  return pages;
}
