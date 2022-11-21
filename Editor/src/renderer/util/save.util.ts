import parserBabel from 'prettier/parser-babel';
import prettier from 'prettier/standalone';

import { setRawCraftingRecipeData } from '../store/slices/craftingRecipes';
import { setRawDialogueData } from '../store/slices/dialogue';
import { setRawEventLogData } from '../store/slices/eventLogs';
import { setRawFishingData } from '../store/slices/fishing';
import { setRawItemData } from '../store/slices/items';
import { setRawLocalizationData } from '../store/slices/localizations';
import { setRawLootTableData } from '../store/slices/lootTables';
import { setRawObjectData } from '../store/slices/objects';
import { setRawPlayerData } from '../store/slices/player';
import { setRawQuestData } from '../store/slices/quests';
import { setRawSkillData } from '../store/slices/skills';
import { setRawUiData } from '../store/slices/ui';

import type { AnyAction, Dispatch } from '@reduxjs/toolkit';
import type { Section } from '../../../../SharedLibrary/src/interface';

const saveJsonToFile = async function (
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  section: Section,
  dispatch: Dispatch<AnyAction>
) {
  const dataString = prettier.format(JSON.stringify(data, null, 2), { parser: 'json', plugins: [parserBabel] });

  console.log(dataString);

  switch (section) {
    case 'item':
    case 'item-category':
      dispatch(setRawItemData(dataString));
      break;
    case 'crafting-recipe':
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
    case 'ui':
      dispatch(setRawUiData(dataString));
      break;
    case 'dialogue-tree':
      dispatch(setRawDialogueData(dataString));
      break;
    case 'player-data':
      dispatch(setRawPlayerData(dataString));
      break;
    case 'event-log':
      dispatch(setRawEventLogData(dataString));
      break;
    case 'fishing-zone':
      dispatch(setRawFishingData(dataString));
      break;
    case 'skill':
      dispatch(setRawSkillData(dataString));
      break;
    case 'localization':
      dispatch(setRawLocalizationData(dataString));
      break;
    case 'quest':
      dispatch(setRawQuestData(dataString));
      break;
    default:
      break;
  }

  await window.api.writeFile(path, dataString);
};

export default saveJsonToFile;
