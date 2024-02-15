import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';

import { loadWorldZoneData } from 'renderer/store/slices/worldZones';
import {
  CRAFTING_RECIPES_DATA_FILE,
  CREATURES_DATA_FILE,
  DATA_FILE_EXTENSION,
  DIALOGUE_DATA_FILE,
  EVENTS_DATA_FILE,
  FISHING_DATA_FILE,
  ITEMS_DATA_FILE,
  LOCALIZATION_DATA_FILE,
  LOOT_TABLES_DATA_FILE,
  OBJECTS_DATA_FILE,
  PLAYER_DATA_FILE,
  QUESTS_DATA_FILE,
  SKILLS_DATA_FILE,
  WORLD_DATA_FILE,
  WORLD_ZONES_DATA_FILE
} from '../../../../SharedLibrary/src/constants';
import { useAppDispatch, useAppSelector } from '../hooks';
import { loadCraftingRecipeData } from '../store/slices/craftingRecipes';
import { loadCreatureData } from '../store/slices/creatures';
import { loaded, setPath as setPathAction } from '../store/slices/data';
import { loadDialogueData } from '../store/slices/dialogue';
import { loadEventLogData } from '../store/slices/eventLogs';
import { loadFishingData } from '../store/slices/fishing';
import { loadItemData } from '../store/slices/items';
import { loadLocalizationData } from '../store/slices/localizations';
import { loadLootTableData } from '../store/slices/lootTables';
import { loadObjectData, selectObjectDataFileLoaded } from '../store/slices/objects';
import { loadPlayerData } from '../store/slices/player';
import { loadQuestData } from '../store/slices/quests';
import { loadSkillData } from '../store/slices/skills';
import { loadWorldSettingsData } from '../store/slices/world';

import type { SyntheticEvent } from 'react';

const LandingArea = () => {
  const isObjectDataFileLoaded = useAppSelector(selectObjectDataFileLoaded);

  const [isGettingData, setIsGettingData] = useState(false);
  const [syncDataLoaded, setSyncDataLoaded] = useState(false);
  const [path, setPath] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleClose = (_: Event | SyntheticEvent<unknown, Event>, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setError(undefined);
  };

  const dispatch = useAppDispatch();

  const loadFile = useCallback(
    async (filePath: string, errorName: string, callback: (rawData: string) => void) => {
      const exists = await window.api.exists(filePath);
      if (!exists) {
        setError(`${errorName} file not found`);
        setIsGettingData(false);
        return false;
      }

      const rawData = await window.api.readFile(filePath, 'utf8');
      callback(rawData);
      return true;
    },
    [setError, setIsGettingData]
  );

  const onFileLoad = useCallback(() => {
    setError(undefined);
    setIsGettingData(true);
    window.electron.ipcRenderer.getDataFolder();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    window.electron.ipcRenderer.once<[string]>('getDataFolder', async (filePath) => {
      if (filePath) {
        const loadResults = await Promise.all([
          loadFile(
            await window.api.join(filePath, `${CREATURES_DATA_FILE}${DATA_FILE_EXTENSION}`),
            'Creatures',
            (rawData) => dispatch(loadCreatureData(rawData))
          ),
          loadFile(await window.api.join(filePath, `${ITEMS_DATA_FILE}${DATA_FILE_EXTENSION}`), 'Items', (rawData) =>
            dispatch(loadItemData(rawData))
          ),
          loadFile(
            await window.api.join(filePath, `${OBJECTS_DATA_FILE}${DATA_FILE_EXTENSION}`),
            'Objects',
            (rawData) => dispatch(loadObjectData(rawData))
          ),
          loadFile(
            await window.api.join(filePath, `${CRAFTING_RECIPES_DATA_FILE}${DATA_FILE_EXTENSION}`),
            'Crafting recipes',
            (rawData) => dispatch(loadCraftingRecipeData(rawData))
          ),
          loadFile(
            await window.api.join(filePath, `${LOOT_TABLES_DATA_FILE}${DATA_FILE_EXTENSION}`),
            'Loot tables',
            (rawData) => dispatch(loadLootTableData(rawData))
          ),
          loadFile(
            await window.api.join(filePath, `${DIALOGUE_DATA_FILE}${DATA_FILE_EXTENSION}`),
            'Dialogue',
            (rawData) => dispatch(loadDialogueData(rawData))
          ),
          loadFile(await window.api.join(filePath, `${PLAYER_DATA_FILE}${DATA_FILE_EXTENSION}`), 'Player', (rawData) =>
            dispatch(loadPlayerData(rawData))
          ),
          loadFile(await window.api.join(filePath, `${EVENTS_DATA_FILE}${DATA_FILE_EXTENSION}`), 'Events', (rawData) =>
            dispatch(loadEventLogData(rawData))
          ),
          loadFile(await window.api.join(filePath, `${WORLD_DATA_FILE}${DATA_FILE_EXTENSION}`), 'World', (rawData) =>
            dispatch(loadWorldSettingsData(rawData))
          ),
          loadFile(
            await window.api.join(filePath, `${FISHING_DATA_FILE}${DATA_FILE_EXTENSION}`),
            'Fishing',
            (rawData) => dispatch(loadFishingData(rawData))
          ),
          loadFile(await window.api.join(filePath, `${SKILLS_DATA_FILE}${DATA_FILE_EXTENSION}`), 'Skills', (rawData) =>
            dispatch(loadSkillData(rawData))
          ),
          loadFile(
            await window.api.join(filePath, `${LOCALIZATION_DATA_FILE}${DATA_FILE_EXTENSION}`),
            'Localizations',
            (rawData) => dispatch(loadLocalizationData(rawData))
          ),
          loadFile(await window.api.join(filePath, `${QUESTS_DATA_FILE}${DATA_FILE_EXTENSION}`), 'Quests', (rawData) =>
            dispatch(loadQuestData(rawData))
          ),
          loadFile(
            await window.api.join(filePath, `${WORLD_ZONES_DATA_FILE}${DATA_FILE_EXTENSION}`),
            'World Zones',
            (rawData) => dispatch(loadWorldZoneData(rawData))
          )
        ]);

        const loadedSuccessfully = loadResults.reduce((current, next) => current && next, true);

        if (loadedSuccessfully) {
          setPath(filePath);
          setSyncDataLoaded(true);
        } else {
          setIsGettingData(false);
        }
      } else {
        setIsGettingData(false);
      }
    });
  }, [dispatch, loadFile]);

  useEffect(() => {
    if (!syncDataLoaded || !isObjectDataFileLoaded || !path) {
      return;
    }
    dispatch(setPathAction(path));
    dispatch(loaded());
  }, [dispatch, isObjectDataFileLoaded, path, syncDataLoaded]);

  return (
    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <Card sx={{ width: '320px' }}>
        <CardContent>
          <Typography variant="h5" component="h2">
            Moonhaven Editor
          </Typography>
          <Typography variant="body2" component="p" color="textSecondary">
            Select your <strong>StreamingAssets\data</strong> directory to get started.
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={onFileLoad} disabled={isGettingData}>
            Load data directory
          </Button>
        </CardActions>
      </Card>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Note archived"
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default LandingArea;
