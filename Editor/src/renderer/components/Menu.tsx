import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { toTitleCaseFromKey } from '../../../../SharedLibrary/src/util/string.util';
import { useAppDispatch, useAppSelector, useQuery } from '../hooks';
import {
  selectCraftingRecipeCategories,
  selectCraftingRecipeCategoryErrors,
  selectCraftingRecipeErrors,
  selectSelectedCraftingRecipeCategory,
  setSelectedCraftingRecipeCategory
} from '../store/slices/craftingRecipes';
import {
  selectCreatureCategories,
  selectCreatureCategoryErrors,
  selectCreatureErrors,
  selectCreatureTypesSortedWithName,
  selectSelectedCreatureCategory,
  setSelectedCreatureCategory
} from '../store/slices/creatures';
import { search, selectLoaded, selectSection, setSection } from '../store/slices/data';
import {
  selectDialogueTreeErrors,
  selectSelectedDialogueCreature,
  setSelectedDialogueCreature
} from '../store/slices/dialogue';
import { selectEventLogErrors } from '../store/slices/eventLogs';
import { selectFishingZoneErrors } from '../store/slices/fishing';
import {
  selectItemCategories,
  selectItemCategoryErrors,
  selectItemErrors,
  selectSelectedItemCategory,
  setSelectedItemCategory
} from '../store/slices/items';
import { selectLocalizationKeysErrors, selectLocalizationsErrors } from '../store/slices/localizations';
import { selectLootTableErrors } from '../store/slices/lootTables';
import {
  selectObjectCategories,
  selectObjectCategoryErrors,
  selectObjectErrors,
  selectObjectSubCategoriesByCategory,
  selectObjectSubCategoryErrors,
  selectSelectedObjectCategory,
  selectSelectedObjectSubCategory,
  setSelectedObjectCategory,
  setSelectedObjectSubCategory
} from '../store/slices/objects';
import { selectPlayerDataErrors } from '../store/slices/player';
import { selectQuestErrors } from '../store/slices/quests';
import { selectSkillErrors } from '../store/slices/skills';
import { selectWorldSettingsErrors } from '../store/slices/world';

import type { SelectChangeEvent } from '@mui/material/Select';
import type { Section } from '../../../../SharedLibrary/src/interface';

const Menu = () => {
  const section = useAppSelector(selectSection);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const query = useQuery();
  const navigate = useNavigate();

  const handleSectionChange = useCallback(
    (event: SelectChangeEvent) => {
      if (event.target.value === section) {
        return;
      }
      if (event.target.value === 'player-data' || event.target.value === 'world-settings') {
        navigate(`/${event.target.value}`);
      } else {
        navigate(`/${event.target.value}/0`);
      }
      dispatch(setSection(event.target.value as Section));
    },
    [dispatch, navigate, section]
  );

  const resetQueryParams = useCallback(() => {
    if (location.search !== '') {
      navigate({ search: '' });
    }
  }, [navigate, location.search]);

  const handleCreatureCategoryChange = useCallback(
    (event: SelectChangeEvent) => {
      dispatch(setSelectedCreatureCategory(event.target.value));
      resetQueryParams();
    },
    [dispatch, resetQueryParams]
  );

  const handleItemCategoryChange = useCallback(
    (event: SelectChangeEvent) => {
      dispatch(setSelectedItemCategory(event.target.value));
      resetQueryParams();
    },
    [dispatch, resetQueryParams]
  );

  const handleCraftingRecipeCategoryChange = useCallback(
    (event: SelectChangeEvent) => {
      dispatch(setSelectedCraftingRecipeCategory(event.target.value));
      resetQueryParams();
    },
    [dispatch, resetQueryParams]
  );

  const handleObjectCategoryChange = useCallback(
    (event: SelectChangeEvent) => {
      dispatch(setSelectedObjectCategory(event.target.value));
      resetQueryParams();
    },
    [dispatch, resetQueryParams]
  );

  const handleObjectSubCategoryChange = useCallback(
    (event: SelectChangeEvent) => {
      dispatch(setSelectedObjectSubCategory(event.target.value));
      resetQueryParams();
    },
    [dispatch, resetQueryParams]
  );

  const handleDialogueCreatureChange = useCallback(
    (event: SelectChangeEvent) => {
      dispatch(setSelectedDialogueCreature(event.target.value));
      resetQueryParams();
    },
    [dispatch, resetQueryParams]
  );

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(search(event.target.value));
    },
    [dispatch]
  );

  const isLoaded = useAppSelector(selectLoaded);

  const selectedCreatureCategory = useAppSelector(selectSelectedCreatureCategory);
  const creatureCategories = useAppSelector(selectCreatureCategories);

  const selectedItemCategory = useAppSelector(selectSelectedItemCategory);
  const itemCategories = useAppSelector(selectItemCategories);

  const selectedCraftingRecipeCategory = useAppSelector(selectSelectedCraftingRecipeCategory);
  const craftingRecipeCategories = useAppSelector(selectCraftingRecipeCategories);

  const selectedObjectCategory = useAppSelector(selectSelectedObjectCategory);
  const objectCategories = useAppSelector(selectObjectCategories);
  const selectedObjectSubCategory = useAppSelector(selectSelectedObjectSubCategory);
  const objectSubCategories = useAppSelector(
    useMemo(() => selectObjectSubCategoriesByCategory(selectedObjectCategory), [selectedObjectCategory])
  );

  const selectedDialogueCreature = useAppSelector(selectSelectedDialogueCreature);
  const creatures = useAppSelector(selectCreatureTypesSortedWithName);

  const creatureErrors = useAppSelector(selectCreatureErrors);
  const creatureCategoryErrors = useAppSelector(selectCreatureCategoryErrors);
  const itemErrors = useAppSelector(selectItemErrors);
  const itemCategoryErrors = useAppSelector(selectItemCategoryErrors);
  const craftingRecipeErrors = useAppSelector(selectCraftingRecipeErrors);
  const craftingRecipeCategoryErrors = useAppSelector(selectCraftingRecipeCategoryErrors);
  const lootTableErrors = useAppSelector(selectLootTableErrors);
  const objectErrors = useAppSelector(selectObjectErrors);
  const objectCategoryErrors = useAppSelector(selectObjectCategoryErrors);
  const objectSubCategoryErrors = useAppSelector(selectObjectSubCategoryErrors);
  const dialogueTreeErrors = useAppSelector(selectDialogueTreeErrors);
  const playerDataErrors = useAppSelector(selectPlayerDataErrors);
  const eventLogErrors = useAppSelector(selectEventLogErrors);
  const worldSettingsErrors = useAppSelector(selectWorldSettingsErrors);
  const fishingZoneErrors = useAppSelector(selectFishingZoneErrors);
  const skillErrors = useAppSelector(selectSkillErrors);
  const localizationKeyErrors = useAppSelector(selectLocalizationKeysErrors);
  const localizationErrors = useAppSelector(selectLocalizationsErrors);
  const questErrors = useAppSelector(selectQuestErrors);

  const allLocalizationErrors = useMemo(() => {
    const allErrors: string[] = [];
    if (Object.keys(localizationKeyErrors).length > 0) {
      allErrors.push('Localization keys');
    }

    allErrors.push(...Object.keys(localizationErrors));

    return allErrors;
  }, [localizationErrors, localizationKeyErrors]);

  useEffect(() => {
    const paths = location.pathname.split('/');
    if (paths.length > 1 && paths[1] !== section) {
      dispatch(setSection(paths[1] as Section));
    }

    const creatureCategory = query.get('creatureCategory');
    if (creatureCategory && creatureCategory !== selectedCreatureCategory) {
      dispatch(setSelectedCreatureCategory(creatureCategory));
    }

    const itemCategory = query.get('itemCategory');
    if (itemCategory && itemCategory !== selectedItemCategory) {
      dispatch(setSelectedItemCategory(itemCategory));
    }

    const craftingRecipeCategory = query.get('craftingRecipeCategory');
    if (craftingRecipeCategory && craftingRecipeCategory !== selectedCraftingRecipeCategory) {
      dispatch(setSelectedCraftingRecipeCategory(craftingRecipeCategory));
    }

    const objectCategory = query.get('objectCategory');
    if (objectCategory && objectCategory !== selectedObjectCategory) {
      dispatch(setSelectedObjectCategory(objectCategory));
    }

    const objectSubCategory = query.get('objectSubCategory');
    if (objectSubCategory && objectSubCategory !== selectedObjectSubCategory) {
      dispatch(setSelectedObjectSubCategory(objectSubCategory));
    }

    const dialogueCreature = query.get('dialogueCreature');
    if (dialogueCreature && dialogueCreature !== selectedDialogueCreature) {
      dispatch(setSelectedDialogueCreature(dialogueCreature));
    }
  }, [
    location.pathname,
    dispatch,
    section,
    query,
    selectedItemCategory,
    selectedObjectCategory,
    selectedObjectSubCategory,
    selectedCraftingRecipeCategory,
    selectedCreatureCategory,
    selectedDialogueCreature
  ]);

  return isLoaded ? (
    <AppBar
      position="static"
      sx={{
        height: '90px',
        alignItems: 'center',
        flexDirection: 'row'
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <Box
          sx={{
            display: 'flex'
          }}
        >
          <Box
            sx={{
              minWidth: '160px'
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="section-label">Section</InputLabel>
              <Select
                labelId="section-label"
                id="section-select"
                value={section}
                label="Section"
                onChange={handleSectionChange}
              >
                <MenuItem value="crafting-recipe">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>Crafting Recipes</Box>
                    {craftingRecipeErrors && Object.keys(craftingRecipeErrors).length > 0 ? (
                      <ReportProblemIcon
                        color="error"
                        sx={{ ml: 1 }}
                        titleAccess={`Errors with: ${Object.keys(craftingRecipeErrors)
                          .map((key) => toTitleCaseFromKey(key))
                          .join(', ')}`}
                      />
                    ) : null}
                  </Box>
                </MenuItem>
                <MenuItem value="crafting-recipe-category">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>Crafting Recipe Categories</Box>
                    {craftingRecipeCategoryErrors && Object.keys(craftingRecipeCategoryErrors).length > 0 ? (
                      <ReportProblemIcon
                        color="error"
                        sx={{ ml: 1 }}
                        titleAccess={`Errors with: ${Object.keys(craftingRecipeCategoryErrors)
                          .map((key) => toTitleCaseFromKey(key))
                          .join(', ')}`}
                      />
                    ) : null}
                  </Box>
                </MenuItem>
                <MenuItem value="creature">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>Creatures</Box>
                    {creatureErrors && Object.keys(creatureErrors).length > 0 ? (
                      <ReportProblemIcon
                        color="error"
                        sx={{ ml: 1 }}
                        titleAccess={`Errors with: ${Object.keys(creatureErrors)
                          .map((key) => toTitleCaseFromKey(key))
                          .join(', ')}`}
                      />
                    ) : null}
                  </Box>
                </MenuItem>
                <MenuItem value="creature-category">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>Creature Categories</Box>
                    {creatureCategoryErrors && Object.keys(creatureCategoryErrors).length > 0 ? (
                      <ReportProblemIcon
                        color="error"
                        sx={{ ml: 1 }}
                        titleAccess={`Errors with: ${Object.keys(creatureCategoryErrors)
                          .map((key) => toTitleCaseFromKey(key))
                          .join(', ')}`}
                      />
                    ) : null}
                  </Box>
                </MenuItem>
                <MenuItem value="dialogue-tree">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>Dialogue Trees</Box>
                    {dialogueTreeErrors && Object.keys(dialogueTreeErrors).length > 0 ? (
                      <ReportProblemIcon
                        color="error"
                        sx={{ ml: 1 }}
                        titleAccess={`Errors with: ${Object.keys(dialogueTreeErrors)
                          .map((key) => toTitleCaseFromKey(key))
                          .join(', ')}`}
                      />
                    ) : null}
                  </Box>
                </MenuItem>
                <MenuItem value="event-log">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>Event Logs</Box>
                    {eventLogErrors && Object.keys(eventLogErrors).length > 0 ? (
                      <ReportProblemIcon
                        color="error"
                        sx={{ ml: 1 }}
                        titleAccess={`${Object.keys(eventLogErrors).length} errors`}
                      />
                    ) : null}
                  </Box>
                </MenuItem>
                <MenuItem value="fishing-zone">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>Fishing Zones</Box>
                    {fishingZoneErrors && Object.keys(fishingZoneErrors).length > 0 ? (
                      <ReportProblemIcon
                        color="error"
                        sx={{ ml: 1 }}
                        titleAccess={`Errors with: ${Object.keys(fishingZoneErrors)
                          .map((key) => toTitleCaseFromKey(key))
                          .join(', ')}`}
                      />
                    ) : null}
                  </Box>
                </MenuItem>
                <MenuItem value="item">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>Items</Box>
                    {itemErrors && Object.keys(itemErrors).length > 0 ? (
                      <ReportProblemIcon
                        color="error"
                        sx={{ ml: 1 }}
                        titleAccess={`Errors with: ${Object.keys(itemErrors)
                          .map((key) => toTitleCaseFromKey(key))
                          .join(', ')}`}
                      />
                    ) : null}
                  </Box>
                </MenuItem>
                <MenuItem value="item-category">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>Item Categories</Box>
                    {itemCategoryErrors && Object.keys(itemCategoryErrors).length > 0 ? (
                      <ReportProblemIcon
                        color="error"
                        sx={{ ml: 1 }}
                        titleAccess={`Errors with: ${Object.keys(itemCategoryErrors)
                          .map((key) => toTitleCaseFromKey(key))
                          .join(', ')}`}
                      />
                    ) : null}
                  </Box>
                </MenuItem>
                <MenuItem value="localization">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>Localization</Box>
                    {allLocalizationErrors.length > 0 ? (
                      <ReportProblemIcon
                        color="error"
                        sx={{ ml: 1 }}
                        titleAccess={`Errors with: ${allLocalizationErrors
                          .map((key) => toTitleCaseFromKey(key))
                          .join(', ')}`}
                      />
                    ) : null}
                  </Box>
                </MenuItem>
                <MenuItem value="loot-table">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>Loot Tables</Box>
                    {lootTableErrors && Object.keys(lootTableErrors).length > 0 ? (
                      <ReportProblemIcon
                        color="error"
                        sx={{ ml: 1 }}
                        titleAccess={`Errors with: ${Object.keys(lootTableErrors)
                          .map((key) => toTitleCaseFromKey(key))
                          .join(', ')}`}
                      />
                    ) : null}
                  </Box>
                </MenuItem>
                <MenuItem value="object">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>Objects</Box>
                    {objectErrors && Object.keys(objectErrors).length > 0 ? (
                      <ReportProblemIcon
                        color="error"
                        sx={{ ml: 1 }}
                        titleAccess={`Errors with: ${Object.keys(objectErrors)
                          .map((key) => toTitleCaseFromKey(key))
                          .join(', ')}`}
                      />
                    ) : null}
                  </Box>
                </MenuItem>
                <MenuItem value="object-category">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>Object Categories</Box>
                    {objectCategoryErrors && Object.keys(objectCategoryErrors).length > 0 ? (
                      <ReportProblemIcon
                        color="error"
                        sx={{ ml: 1 }}
                        titleAccess={`Errors with: ${Object.keys(objectCategoryErrors)
                          .map((key) => toTitleCaseFromKey(key))
                          .join(', ')}`}
                      />
                    ) : null}
                  </Box>
                </MenuItem>
                <MenuItem value="object-sub-category">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>Object Sub Categories</Box>
                    {objectSubCategoryErrors && Object.keys(objectSubCategoryErrors).length > 0 ? (
                      <ReportProblemIcon
                        color="error"
                        sx={{ ml: 1 }}
                        titleAccess={`Errors with: ${Object.keys(objectSubCategoryErrors)
                          .map((key) => toTitleCaseFromKey(key))
                          .join(', ')}`}
                      />
                    ) : null}
                  </Box>
                </MenuItem>
                <MenuItem value="player-data">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>Player Data</Box>
                    {playerDataErrors && Object.keys(playerDataErrors).length > 0 ? (
                      <ReportProblemIcon
                        color="error"
                        sx={{ ml: 1 }}
                        titleAccess={`${Object.keys(playerDataErrors).length} error${
                          Object.keys(playerDataErrors).length !== 1 ? 's' : ''
                        }`}
                      />
                    ) : null}
                  </Box>
                </MenuItem>
                <MenuItem value="quest">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>Quests</Box>
                    {questErrors && Object.keys(questErrors).length > 0 ? (
                      <ReportProblemIcon
                        color="error"
                        sx={{ ml: 1 }}
                        titleAccess={`Errors with: ${Object.keys(questErrors)
                          .map((key) => toTitleCaseFromKey(key))
                          .join(', ')}`}
                      />
                    ) : null}
                  </Box>
                </MenuItem>
                <MenuItem value="skill">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>Skills</Box>
                    {skillErrors && Object.keys(skillErrors).length > 0 ? (
                      <ReportProblemIcon
                        color="error"
                        sx={{ ml: 1 }}
                        titleAccess={`Errors with: ${Object.keys(skillErrors)
                          .map((key) => toTitleCaseFromKey(key))
                          .join(', ')}`}
                      />
                    ) : null}
                  </Box>
                </MenuItem>
                <MenuItem value="world-settings">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>World Settings</Box>
                    {worldSettingsErrors && Object.keys(worldSettingsErrors).length > 0 ? (
                      <ReportProblemIcon
                        color="error"
                        sx={{ ml: 1 }}
                        titleAccess={`${Object.keys(worldSettingsErrors).length} error${
                          Object.keys(worldSettingsErrors).length !== 1 ? 's' : ''
                        }`}
                      />
                    ) : null}
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          {section === 'creature' && (
            <Box
              sx={{
                marginLeft: '16px',
                minWidth: '160px'
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="creature-category-label">Category</InputLabel>
                <Select
                  labelId="creature-category-label"
                  id="creature-category-select"
                  value={selectedCreatureCategory}
                  label="Category"
                  onChange={handleCreatureCategoryChange}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  {creatureCategories?.map((creatureCategory) => (
                    <MenuItem key={creatureCategory.key} value={creatureCategory.key}>
                      {toTitleCaseFromKey(creatureCategory.key)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          {section === 'item' && (
            <Box
              sx={{
                marginLeft: '16px',
                minWidth: '160px'
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="item-category-label">Category</InputLabel>
                <Select
                  labelId="item-category-label"
                  id="item-category-select"
                  value={selectedItemCategory}
                  label="Category"
                  onChange={handleItemCategoryChange}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  {itemCategories?.map((itemCategory) => (
                    <MenuItem key={itemCategory.key} value={itemCategory.key}>
                      {toTitleCaseFromKey(itemCategory.key)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          {section === 'crafting-recipe' && (
            <Box
              sx={{
                marginLeft: '16px',
                minWidth: '160px'
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="crafting-recipe-category-label">Category</InputLabel>
                <Select
                  labelId="crafting-recipe-category-label"
                  id="crafting-recipe-category-select"
                  value={selectedCraftingRecipeCategory}
                  label="Category"
                  onChange={handleCraftingRecipeCategoryChange}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  {craftingRecipeCategories?.map((category) => (
                    <MenuItem key={category.key} value={category.key}>
                      {toTitleCaseFromKey(category.key)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          {(section === 'object' || section === 'object-sub-category') && (
            <Box
              sx={{
                marginLeft: '16px',
                minWidth: '160px'
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="object-category-label">Category</InputLabel>
                <Select
                  labelId="object-category-label"
                  id="object-category-select"
                  value={selectedObjectCategory}
                  label="Category"
                  onChange={handleObjectCategoryChange}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  {objectCategories?.map((objectCategory) => (
                    <MenuItem key={objectCategory.key} value={objectCategory.key}>
                      {toTitleCaseFromKey(objectCategory.key)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          {section === 'object' && (
            <Box
              sx={{
                marginLeft: '16px',
                minWidth: '160px'
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="object-sub-category-label">Sub Category</InputLabel>
                <Select
                  labelId="object-sub-category-label"
                  id="object-sub-category-select"
                  value={selectedObjectSubCategory}
                  label="Sub Category"
                  onChange={handleObjectSubCategoryChange}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  {objectSubCategories?.map((objectSubCategory) => (
                    <MenuItem key={objectSubCategory.key} value={objectSubCategory.key}>
                      {toTitleCaseFromKey(objectSubCategory.key)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          {section === 'dialogue-tree' && (
            <Box
              sx={{
                marginLeft: '16px',
                minWidth: '160px'
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="dialogue-creature-label">Creature</InputLabel>
                <Select
                  labelId="dialogue-creature-label"
                  id="dialogue-creature-select"
                  value={selectedDialogueCreature}
                  label="Creature"
                  onChange={handleDialogueCreatureChange}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  {creatures?.map((creature) => (
                    <MenuItem key={creature.key} value={creature.key}>
                      {creature.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex'
          }}
        >
          <TextField
            id="search"
            label="Search"
            variant="outlined"
            sx={{
              width: '300px'
            }}
            onChange={handleSearchChange}
          />
        </Box>
      </Toolbar>
    </AppBar>
  ) : null;
};

export default Menu;
