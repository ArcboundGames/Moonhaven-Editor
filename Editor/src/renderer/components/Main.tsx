import Box from '@mui/system/Box';
import { useEffect, useMemo } from 'react';

import {
  CRAFTING_RECIPES_DATA_FILE,
  CREATURES_DATA_FILE,
  DATA_FILE_EXTENSION,
  DIALOGUE_DATA_FILE,
  FISHING_DATA_FILE,
  ITEMS_DATA_FILE,
  LOCALIZATION_DATA_FILE,
  LOOT_TABLES_DATA_FILE,
  OBJECTS_DATA_FILE,
  PLAYER_DATA_FILE,
  QUESTS_DATA_FILE,
  SKILLS_DATA_FILE,
  WORLD_DATA_FILE
} from '../../../../SharedLibrary/src/constants';
import { getDamagableData, getProjectileData } from '../../../../SharedLibrary/src/util/combat.util';
import { getEnglishLocalization } from '../../../../SharedLibrary/src/util/localization.util';
import { getObjectSetting } from '../../../../SharedLibrary/src/util/objectType.util';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  loadCraftingRecipeData,
  selectCraftingRecipeCategories,
  selectCraftingRecipeCategoriesByKey,
  selectCraftingRecipes,
  selectCraftingRecipesByKey,
  validateCraftingRecipeCategories,
  validateCraftingRecipes
} from '../store/slices/craftingRecipes';
import {
  loadCreatureData,
  localizeCreatures,
  selectCreatureCategories,
  selectCreatureCategoriesByKey,
  selectCreatureTypes,
  selectCreatureTypesByKey,
  validateCreatureCategories,
  validateCreatures
} from '../store/slices/creatures';
import { selectLoaded, selectPath } from '../store/slices/data';
import {
  loadDialogueData,
  selectDialogueTrees,
  selectDialogueTreesByKey,
  validateDialogueTrees
} from '../store/slices/dialogue';
import { selectEventLogs, selectEventLogsByKey, validateEventLogs } from '../store/slices/eventLogs';
import { loadFishingData, selectFishingZones, validateFishingZones } from '../store/slices/fishing';
import {
  loadItemData,
  localizeItems,
  selectIconsVersion,
  selectItemCategories,
  selectItemCategoriesByKey,
  selectItemTypes,
  selectItemTypesByKey,
  validateItemCategories,
  validateItems
} from '../store/slices/items';
import {
  loadLocalizationData,
  selectLocalizationKeys,
  selectLocalizations,
  validateLocalizationKeys,
  validateLocalizations
} from '../store/slices/localizations';
import {
  loadLootTableData,
  selectLootTables,
  selectLootTablesByKey,
  validateLootTables
} from '../store/slices/lootTables';
import {
  loadObjectData,
  localizeObjects,
  selectObjectCategories,
  selectObjectCategoriesByKey,
  selectObjectSubCategories,
  selectObjectSubCategoriesByKey,
  selectObjectTypes,
  selectObjectTypesByKey,
  selectSpritesVersion,
  validateObjectCategories,
  validateObjectSubCategories,
  validateObjects
} from '../store/slices/objects';
import { loadPlayerData, selectPlayerData, validatePlayerData } from '../store/slices/player';
import { loadQuestData, localizeQuests, selectQuests, validateQuests } from '../store/slices/quests';
import { loadSkillData, localizeSkills, selectSkills, selectSkillsByKey, validateSkills } from '../store/slices/skills';
import { loadWorldSettingsData, selectWorldSettings, validateWorldSettings } from '../store/slices/world';
import ErrorBoundary from './ErrorBoundary';
import LandingArea from './LandingArea';
import Menu from './Menu';
import DataView from './data-view/DataView';

const Main = () => {
  const dispatch = useAppDispatch();

  const isLoaded = useAppSelector(selectLoaded);
  const path = useAppSelector(selectPath);

  // Creatures
  const creatures = useAppSelector(selectCreatureTypes);
  const creaturesByKey = useAppSelector(selectCreatureTypesByKey);
  const creatureCategories = useAppSelector(selectCreatureCategories);
  const creatureCategoriesByKey = useAppSelector(selectCreatureCategoriesByKey);

  // Items
  const items = useAppSelector(selectItemTypes);
  const itemsByKey = useAppSelector(selectItemTypesByKey);
  const itemCategories = useAppSelector(selectItemCategories);
  const itemCategoriesByKey = useAppSelector(selectItemCategoriesByKey);
  const iconsVersion = useAppSelector(selectIconsVersion);

  // Crafting Recipes
  const craftingRecipes = useAppSelector(selectCraftingRecipes);
  const craftingRecipesByKey = useAppSelector(selectCraftingRecipesByKey);
  const craftingRecipeCategories = useAppSelector(selectCraftingRecipeCategories);
  const craftingRecipeCategoriesByKey = useAppSelector(selectCraftingRecipeCategoriesByKey);

  // Loot Tables
  const lootTables = useAppSelector(selectLootTables);
  const lootTablesByKey = useAppSelector(selectLootTablesByKey);

  // Objects
  const objects = useAppSelector(selectObjectTypes);
  const objectsByKey = useAppSelector(selectObjectTypesByKey);
  const objectCategories = useAppSelector(selectObjectCategories);
  const objectCategoriesByKey = useAppSelector(selectObjectCategoriesByKey);
  const objectSubCategories = useAppSelector(selectObjectSubCategories);
  const objectSubCategoriesByKey = useAppSelector(selectObjectSubCategoriesByKey);
  const spritesVersion = useAppSelector(selectSpritesVersion);

  // Dialogue Trees
  const dialogueTrees = useAppSelector(selectDialogueTrees);
  const dialogueTreesByKey = useAppSelector(selectDialogueTreesByKey);

  // Player Data
  const playerData = useAppSelector(selectPlayerData);

  // Event Logs
  const eventLogs = useAppSelector(selectEventLogs);
  const eventLogsByKey = useAppSelector(selectEventLogsByKey);

  // World Settings
  const worldSettings = useAppSelector(selectWorldSettings);

  // Fishing Zones
  const fishingZones = useAppSelector(selectFishingZones);

  // Skills
  const skills = useAppSelector(selectSkills);
  const skillsByKey = useAppSelector(selectSkillsByKey);

  // Localization
  const localizationKeys = useAppSelector(selectLocalizationKeys);
  const localizations = useAppSelector(selectLocalizations);
  const { englishLocalization: localization } = useMemo(() => getEnglishLocalization(localizations), [localizations]);

  // Quests
  const quests = useAppSelector(selectQuests);

  const { projectileItemCategoryKeys, projectileItemKeys } = useMemo(
    () => getProjectileData(itemCategories, itemCategoriesByKey, items),
    [itemCategories, itemCategoriesByKey, items]
  );

  const {
    damagableObjectCategoryKeys,
    damagableObjectSubCategoryKeys,
    damagableObjectKeys,
    damagableCreatureCategoryKeys,
    damagableCreatureKeys
  } = useMemo(
    () =>
      getDamagableData(
        objectCategories,
        objectCategoriesByKey,
        objectSubCategories,
        objectSubCategoriesByKey,
        objects,
        creatureCategories,
        creatureCategoriesByKey,
        creatures
      ),
    [
      creatureCategories,
      creatureCategoriesByKey,
      creatures,
      objectCategories,
      objectCategoriesByKey,
      objectSubCategories,
      objectSubCategoriesByKey,
      objects
    ]
  );

  const workstations = useMemo(
    () =>
      objects.filter((type) => {
        const { value: isWorkstation } = getObjectSetting(
          'isWorkstation',
          type,
          objectCategoriesByKey,
          objectSubCategoriesByKey
        );
        return isWorkstation;
      }),
    [objects, objectCategoriesByKey, objectSubCategoriesByKey]
  );

  const workstationKeys = useMemo(() => workstations.map((workstation) => workstation.key), [workstations]);

  useEffect(() => {
    if (!isLoaded || !path) {
      return;
    }

    let directory: string | undefined;

    const setupListeners = async () => {
      const creaturesDataFilePath = await window.api.join(path, `${CREATURES_DATA_FILE}${DATA_FILE_EXTENSION}`);
      const itemsDataFilePath = await window.api.join(path, `${ITEMS_DATA_FILE}${DATA_FILE_EXTENSION}`);
      const objectsDataFilePath = await window.api.join(path, `${OBJECTS_DATA_FILE}${DATA_FILE_EXTENSION}`);
      const craftingRecipesDataFilePath = await window.api.join(
        path,
        `${CRAFTING_RECIPES_DATA_FILE}${DATA_FILE_EXTENSION}`
      );
      const lootTablesDataFilePath = await window.api.join(path, `${LOOT_TABLES_DATA_FILE}${DATA_FILE_EXTENSION}`);
      const dialogueDataFilePath = await window.api.join(path, `${DIALOGUE_DATA_FILE}${DATA_FILE_EXTENSION}`);
      const worldDataFilePath = await window.api.join(path, `${WORLD_DATA_FILE}${DATA_FILE_EXTENSION}`);
      const playerDataFilePath = await window.api.join(path, `${PLAYER_DATA_FILE}${DATA_FILE_EXTENSION}`);
      const fishingDataFilePath = await window.api.join(path, `${FISHING_DATA_FILE}${DATA_FILE_EXTENSION}`);
      const skillsDataFilePath = await window.api.join(path, `${SKILLS_DATA_FILE}${DATA_FILE_EXTENSION}`);
      const localizationDataFilePath = await window.api.join(path, `${LOCALIZATION_DATA_FILE}${DATA_FILE_EXTENSION}`);
      const questsDataFilePath = await window.api.join(path, `${QUESTS_DATA_FILE}${DATA_FILE_EXTENSION}`);

      const files = [
        creaturesDataFilePath,
        itemsDataFilePath,
        objectsDataFilePath,
        craftingRecipesDataFilePath,
        lootTablesDataFilePath,
        dialogueDataFilePath,
        worldDataFilePath,
        playerDataFilePath,
        fishingDataFilePath,
        skillsDataFilePath,
        localizationDataFilePath
      ];

      window.electron.ipcRenderer.on<[string, string]>('onFileChange', (file, data) => {
        if (!data || !files.includes(file)) {
          return;
        }

        if (file === creaturesDataFilePath) {
          dispatch(loadCreatureData(data));
        } else if (file === itemsDataFilePath) {
          dispatch(loadItemData(data));
        } else if (file === objectsDataFilePath) {
          dispatch(loadObjectData(data));
        } else if (file === craftingRecipesDataFilePath) {
          dispatch(loadCraftingRecipeData(data));
        } else if (file === lootTablesDataFilePath) {
          dispatch(loadLootTableData(data));
        } else if (file === dialogueDataFilePath) {
          dispatch(loadDialogueData(data));
        } else if (file === worldDataFilePath) {
          dispatch(loadWorldSettingsData(data));
        } else if (file === playerDataFilePath) {
          dispatch(loadPlayerData(data));
        } else if (file === fishingDataFilePath) {
          dispatch(loadFishingData(data));
        } else if (file === skillsDataFilePath) {
          dispatch(loadSkillData(data));
        } else if (file === localizationDataFilePath) {
          dispatch(loadLocalizationData(data));
        } else if (file === questsDataFilePath) {
          dispatch(loadQuestData(data));
        }
      });

      directory = await window.api.join(path, '..');

      window.electron.ipcRenderer.subscribeToFile(directory);
    };

    setupListeners();

    return () => {
      if (directory) {
        window.electron.ipcRenderer.unsubscribeFromFile(directory);
      }
    };
  }, [dispatch, isLoaded, path]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(
      validateLocalizationKeys({
        localizationKeys
      })
    );
  }, [dispatch, isLoaded, localizationKeys]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(
      validateLocalizations({
        localizations,
        localizationKeys
      })
    );
  }, [dispatch, isLoaded, localizations, localizationKeys]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(
      localizeItems({
        localization,
        localizationKeys
      })
    );
    dispatch(
      localizeCreatures({
        localization,
        localizationKeys
      })
    );
    dispatch(
      localizeSkills({
        localization,
        localizationKeys
      })
    );
    dispatch(
      localizeObjects({
        localization,
        localizationKeys
      })
    );
    dispatch(
      localizeQuests({
        localization,
        localizationKeys
      })
    );
  }, [dispatch, isLoaded, localization, localizationKeys]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(
      validateCreatures({
        creatures,
        creaturesByKey,
        creatureCategoriesByKey,
        itemsByKey,
        lootTablesByKey,
        eventLogsByKey,
        localization,
        localizationKeys,
        path
      })
    );
  }, [
    creatureCategoriesByKey,
    creatures,
    dispatch,
    isLoaded,
    itemsByKey,
    lootTablesByKey,
    eventLogsByKey,
    path,
    creaturesByKey,
    localization,
    localizationKeys
  ]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(
      validateCreatureCategories({
        creatureCategories
      })
    );
  }, [dispatch, isLoaded, creatureCategories]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(
      validateItems({
        items,
        itemsByKey,
        itemCategoriesByKey,
        objectsByKey,
        skillsByKey,
        localization,
        localizationKeys,
        damagableObjectKeys,
        damagableObjectCategoryKeys,
        damagableObjectSubCategoryKeys,
        damagableCreatureKeys,
        damagableCreatureCategoryKeys,
        projectileItemKeys,
        projectileItemCategoryKeys,
        path
      })
    );
  }, [
    damagableObjectCategoryKeys,
    damagableObjectKeys,
    damagableObjectSubCategoryKeys,
    damagableCreatureKeys,
    damagableCreatureCategoryKeys,
    dispatch,
    isLoaded,
    itemCategoriesByKey,
    items,
    objectsByKey,
    path,
    iconsVersion,
    itemsByKey,
    projectileItemKeys,
    projectileItemCategoryKeys,
    skillsByKey,
    localization,
    localizationKeys
  ]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(
      validateItemCategories({
        itemCategories,
        skillsByKey,
        damagableObjectKeys,
        damagableObjectCategoryKeys,
        damagableObjectSubCategoryKeys,
        damagableCreatureKeys,
        damagableCreatureCategoryKeys,
        projectileItemKeys,
        projectileItemCategoryKeys
      })
    );
  }, [
    damagableObjectCategoryKeys,
    damagableObjectKeys,
    damagableObjectSubCategoryKeys,
    damagableCreatureKeys,
    damagableCreatureCategoryKeys,
    dispatch,
    isLoaded,
    itemCategories,
    projectileItemKeys,
    projectileItemCategoryKeys,
    skillsByKey
  ]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(validateCraftingRecipeCategories({ craftingRecipeCategories }));
  }, [dispatch, craftingRecipeCategories, isLoaded]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(
      validateCraftingRecipes({
        craftingRecipes,
        craftingRecipeCategoriesByKey,
        skillsByKey,
        itemsByKey,
        workstationKeys
      })
    );
  }, [dispatch, craftingRecipes, craftingRecipeCategoriesByKey, skillsByKey, itemsByKey, workstationKeys, isLoaded]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(validateLootTables({ lootTables, itemsByKey }));
  }, [dispatch, isLoaded, itemsByKey, lootTables]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(
      validateObjects({
        objects,
        objectCategoriesByKey,
        objectSubCategories,
        objectSubCategoriesByKey,
        lootTablesByKey,
        objectsByKey,
        localization,
        localizationKeys,
        path
      })
    );
  }, [
    dispatch,
    isLoaded,
    localization,
    localizationKeys,
    lootTablesByKey,
    objectCategoriesByKey,
    objectSubCategories,
    objectSubCategoriesByKey,
    objects,
    objectsByKey,
    path,
    spritesVersion
  ]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(
      validateObjectCategories({ objectCategories, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey })
    );
  }, [dispatch, isLoaded, objectCategories, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(
      validateObjectSubCategories({
        objectSubCategories,
        objectCategoriesByKey,
        objectSubCategoriesByKey,
        objectsByKey
      })
    );
  }, [dispatch, isLoaded, objectCategoriesByKey, objectSubCategories, objectSubCategoriesByKey, objectsByKey]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(
      validateDialogueTrees({
        dialogueTrees,
        creaturesByKey,
        eventLogsByKey,
        localization,
        localizationKeys
      })
    );
  }, [dispatch, isLoaded, dialogueTrees, creaturesByKey, eventLogsByKey, localization, localizationKeys]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(
      validatePlayerData({
        playerData,
        itemsByKey
      })
    );
  }, [dispatch, isLoaded, itemsByKey, playerData]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(
      validateEventLogs({
        eventLogs,
        localization,
        localizationKeys
      })
    );
  }, [dispatch, isLoaded, eventLogs, localization, localizationKeys]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(
      validateWorldSettings({
        worldSettings
      })
    );
  }, [dispatch, isLoaded, worldSettings]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(
      validateFishingZones({
        fishingZones,
        lootTablesByKey
      })
    );
  }, [dispatch, isLoaded, fishingZones, lootTablesByKey]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(
      validateSkills({
        skills,
        localization,
        localizationKeys
      })
    );
  }, [dispatch, isLoaded, skills, localization, localizationKeys]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    dispatch(
      validateQuests({
        quests,
        itemsByKey,
        craftingRecipesByKey,
        creaturesByKey,
        dialogueTreesByKey,
        eventLogsByKey,
        localization,
        localizationKeys
      })
    );
  }, [
    dispatch,
    isLoaded,
    skills,
    localization,
    localizationKeys,
    itemsByKey,
    creaturesByKey,
    quests,
    dialogueTreesByKey,
    craftingRecipesByKey,
    eventLogsByKey
  ]);

  return (
    <ErrorBoundary>
      <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Menu />
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            height: 'calc(100vh - 90px)'
          }}
        >
          {isLoaded ? <DataView /> : <LandingArea />}
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

export default Main;
