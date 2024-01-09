import Box from '@mui/material/Box';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { useAppSelector } from '../../hooks';
import { selectSection } from '../../store/slices/data';
import CraftingRecipeCategoryList from './lists/CraftingRecipeCategoryList';
import CraftingRecipeList from './lists/CraftingRecipeList';
import CreatureCategoryList from './lists/CreatureCategoryList';
import CreatureList from './lists/CreatureList';
import DialogueTreeList from './lists/DialogueTreeList';
import EventLogList from './lists/EventLogList';
import FishingZoneList from './lists/FishingZoneList';
import ItemCategoryList from './lists/ItemCategoryList';
import ItemList from './lists/ItemList';
import LocalizationList from './lists/LocalizationList';
import LootTableList from './lists/LootTableList';
import ObjectCategoryList from './lists/ObjectCategoryList';
import ObjectList from './lists/ObjectList';
import ObjectSubCategoryList from './lists/ObjectSubCategoryList';
import QuestList from './lists/QuestList';
import SkillList from './lists/SkillList';
import CraftingRecipeCategoryView from './views/gameData/CraftingRecipeCategoryView';
import CraftingRecipeView from './views/gameData/CraftingRecipeView';
import CreatureCategoryView from './views/gameData/CreatureCategoryView';
import CreatureTypeView from './views/gameData/CreatureTypeView';
import DialogueTreeView from './views/gameData/DialogueTreeView';
import EventLogView from './views/gameData/EventLogView';
import FishingZoneView from './views/gameData/FishingZoneView';
import ItemCategoryView from './views/gameData/ItemCategoryView';
import ItemView from './views/gameData/ItemView';
import LocalizationKeysView from './views/gameData/LocalizationKeysView';
import LocalizationView from './views/gameData/LocalizationView';
import LootTableView from './views/gameData/LootTableView';
import ObjectCategoryView from './views/gameData/ObjectCategoryView';
import ObjectSubCategoryView from './views/gameData/ObjectSubCategoryView';
import ObjectTypeView from './views/gameData/ObjectTypeView';
import PlayerDataView from './views/gameData/PlayerDataView';
import QuestView from './views/gameData/QuestView';
import SkillView from './views/gameData/SkillView';
import WorldSettingsView from './views/gameData/WorldSettingsView';

const DataView = () => {
  const section = useAppSelector(selectSection);
  if (!section) {
    return null;
  }

  let List: React.FunctionComponent | undefined;
  switch (section) {
    case 'creature':
      List = CreatureList;
      break;
    case 'creature-category':
      List = CreatureCategoryList;
      break;
    case 'item':
      List = ItemList;
      break;
    case 'item-category':
      List = ItemCategoryList;
      break;
    case 'crafting-recipe':
      List = CraftingRecipeList;
      break;
    case 'crafting-recipe-category':
      List = CraftingRecipeCategoryList;
      break;
    case 'loot-table':
      List = LootTableList;
      break;
    case 'object':
      List = ObjectList;
      break;
    case 'object-category':
      List = ObjectCategoryList;
      break;
    case 'object-sub-category':
      List = ObjectSubCategoryList;
      break;
    case 'dialogue-tree':
      List = DialogueTreeList;
      break;
    case 'event-log':
      List = EventLogList;
      break;
    case 'fishing-zone':
      List = FishingZoneList;
      break;
    case 'skill':
      List = SkillList;
      break;
    case 'localization':
    case 'localization-key':
      List = LocalizationList;
      break;
    case 'quest':
      List = QuestList;
      break;
    default:
      break;
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      {List && <List />}
      <Box
        id="routes"
        sx={{
          flexGrow: 1,
          display: 'flex',
          height: '100%'
        }}
      >
        <Routes>
          <Route path="/creature/:dataKey" element={<CreatureTypeView />} />
          <Route path="/creature-category/:dataKey" element={<CreatureCategoryView />} />
          <Route path="/item/:dataKey" element={<ItemView />} />
          <Route path="/item-category/:dataKey" element={<ItemCategoryView />} />
          <Route path="/loot-table/:dataKey" element={<LootTableView />} />
          <Route path="/crafting-recipe/:dataKey" element={<CraftingRecipeView />} />
          <Route path="/crafting-recipe-category/:dataKey" element={<CraftingRecipeCategoryView />} />
          <Route path="/object/:dataKey" element={<ObjectTypeView />} />
          <Route path="/object-category/:dataKey" element={<ObjectCategoryView />} />
          <Route path="/object-sub-category/:dataKey" element={<ObjectSubCategoryView />} />
          <Route path="/dialogue-tree/:dataKey" element={<DialogueTreeView />} />
          <Route path="/player-data" element={<PlayerDataView />} />
          <Route path="/event-log/:dataKey" element={<EventLogView />} />
          <Route path="/world-settings" element={<WorldSettingsView />} />
          <Route path="/fishing-zone/:dataKey" element={<FishingZoneView />} />
          <Route path="/skill/:dataKey" element={<SkillView />} />
          <Route path="/localization/main" element={<LocalizationKeysView />} />
          <Route path="/localization/:dataKey" element={<LocalizationView />} />
          <Route path="/quest/:dataKey" element={<QuestView />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default DataView;
