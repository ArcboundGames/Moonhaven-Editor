import { syncRawSectionState } from '../save.util';

const sections = [
  'item',
  'item-category',
  'creature',
  'creature-category',
  'crafting-recipe',
  'crafting-recipe-category',
  'loot-table',
  'object',
  'object-category',
  'object-sub-category',
  'dialogue-tree',
  'player-data',
  'starting-item',
  'event-log',
  'world-settings',
  'fishing-zone',
  'skill',
  'localization',
  'localization-key',
  'quest',
  'world-zone'
] as const;

describe('syncRawSectionState', () => {
  it('dispatches raw state for every data section', () => {
    const dispatched: string[] = [];
    const dispatch = ((action: { type: string }) => {
      dispatched.push(action.type);
      return action;
    }) as Parameters<typeof syncRawSectionState>[2];

    sections.forEach((section) => {
      syncRawSectionState(section, '{}', dispatch);
    });

    expect(dispatched).toHaveLength(sections.length);
  });
});
