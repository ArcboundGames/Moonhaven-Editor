import parserBabel from 'prettier/parser-babel';
import prettier from 'prettier/standalone';

import { setRawCraftingRecipeData } from 'renderer/store/slices/craftingRecipes';
import { setRawCreatureData } from 'renderer/store/slices/creatures';
import { setRawDialogueData } from 'renderer/store/slices/dialogue';
import { setRawEventLogData } from 'renderer/store/slices/eventLogs';
import { setRawFishingData } from 'renderer/store/slices/fishing';
import { setRawItemData } from 'renderer/store/slices/items';
import { setRawLocalizationData } from 'renderer/store/slices/localizations';
import { setRawLootTableData } from 'renderer/store/slices/lootTables';
import { setRawObjectData } from 'renderer/store/slices/objects';
import { setRawPlayerData } from 'renderer/store/slices/player';
import { setRawQuestData } from 'renderer/store/slices/quests';
import { setRawSkillData } from 'renderer/store/slices/skills';
import { setRawWorldSettingsData } from 'renderer/store/slices/world';
import { setRawWorldZoneData } from 'renderer/store/slices/worldZones';

import type { AnyAction, Dispatch } from '@reduxjs/toolkit';
import type { Section } from '../../../../SharedLibrary/src/interface';

export function syncRawSectionState(section: Section, dataString: string, dispatch: Dispatch<AnyAction>) {
  switch (section) {
    case 'item':
    case 'item-category':
      dispatch(setRawItemData(dataString));
      break;
    case 'creature':
    case 'creature-category':
      dispatch(setRawCreatureData(dataString));
      break;
    case 'crafting-recipe':
    case 'crafting-recipe-category':
      dispatch(setRawCraftingRecipeData(dataString));
      break;
    case 'loot-table':
      dispatch(setRawLootTableData(dataString));
      break;
    case 'object':
    case 'object-category':
    case 'object-sub-category':
      dispatch(setRawObjectData(dataString));
      break;
    case 'dialogue-tree':
      dispatch(setRawDialogueData(dataString));
      break;
    case 'player-data':
    case 'starting-item':
      dispatch(setRawPlayerData(dataString));
      break;
    case 'event-log':
      dispatch(setRawEventLogData(dataString));
      break;
    case 'world-settings':
      dispatch(setRawWorldSettingsData(dataString));
      break;
    case 'fishing-zone':
      dispatch(setRawFishingData(dataString));
      break;
    case 'skill':
      dispatch(setRawSkillData(dataString));
      break;
    case 'localization':
    case 'localization-key':
      dispatch(setRawLocalizationData(dataString));
      break;
    case 'quest':
      dispatch(setRawQuestData(dataString));
      break;
    case 'world-zone':
      dispatch(setRawWorldZoneData(dataString));
      break;
    default: {
      const exhaustive: never = section;
      throw new Error(`Unhandled data section: ${String(exhaustive)}`);
    }
  }
}

const saveJsonToFile = async function (
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  section: Section,
  dispatch: Dispatch<AnyAction>
) {
  const dataString = prettier.format(JSON.stringify(data, null, 2), { parser: 'json', plugins: [parserBabel] });
  syncRawSectionState(section, dataString, dispatch);
  await window.api.writeFile(path, dataString);
};

export default saveJsonToFile;
