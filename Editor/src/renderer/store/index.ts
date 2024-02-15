import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';

import loggerMiddleware from '../middleware/logger';
import monitorReducersEnhancer from '../middleware/monitorReducer';
import craftingRecipesReducer from './slices/craftingRecipes';
import creaturesReducer from './slices/creatures';
import dataReducer from './slices/data';
import dialogueReducer from './slices/dialogue';
import eventLogsReducer from './slices/eventLogs';
import fishingReducer from './slices/fishing';
import itemsReducer from './slices/items';
import localizationsReducer from './slices/localizations';
import lootTablesReducer from './slices/lootTables';
import objectsReducer from './slices/objects';
import playerReducer from './slices/player';
import questsReducer from './slices/quests';
import skillsReducer from './slices/skills';
import worldReducer from './slices/world';
import worldZonesReducer from './slices/worldZones';

export const store = configureStore({
  reducer: {
    craftingRecipes: craftingRecipesReducer,
    creatures: creaturesReducer,
    items: itemsReducer,
    lootTables: lootTablesReducer,
    objects: objectsReducer,
    data: dataReducer,
    dialogue: dialogueReducer,
    player: playerReducer,
    eventLogs: eventLogsReducer,
    world: worldReducer,
    fishing: fishingReducer,
    skills: skillsReducer,
    localizations: localizationsReducer,
    quests: questsReducer,
    worldZones: worldZonesReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware).concat(loggerMiddleware),
  enhancers: [monitorReducersEnhancer]
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type AppThunkOptions = {
  dispatch: AppDispatch;
  state: RootState;
};
