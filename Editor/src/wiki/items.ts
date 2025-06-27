import { ALL_SEASONS, FALL, SPRING, SUMMER, WINTER } from '../../../SharedLibrary/src/constants';
import { getCreatureSetting } from '../../../SharedLibrary/src/util/creatureType.util';
import { isNotNullish } from '../../../SharedLibrary/src/util/null.util';
import toRecord from '../../../SharedLibrary/src/util/record.util';
import { toTitleCaseFromKey } from '../../../SharedLibrary/src/util/string.util';
import { getCraftingRecipes, getCreatures, getFishingZones, getItems, getLootTables, getObjects } from './file';

import type {
  FishingZone,
  Localization,
  LocalizedCraftingRecipe,
  LocalizedCreatureType,
  LocalizedItemType,
  LocalizedObjectType,
  LootTable,
  Season
} from '../../../SharedLibrary/src/interface';

function generateCropSections(
  item: LocalizedItemType,
  objectsByKey: Record<string, LocalizedObjectType>,
  objectsToItem: Record<string, LocalizedItemType>,
  lootTablesByKey: Record<string, LootTable>
): {
  cropInfobox: string;
  cropBody: string;
  cropFooter: string;
  stages: number | undefined;
  season: Season | undefined;
} {
  if (item.categoryKey === 'CROP' && item.key in objectsByKey) {
    const object = objectsByKey[item.key]; // Get crop object

    const { stages = [], lootTableKey } = object;
    const harvestStage = stages.find((stage) => stage.harvestable);
    const harvestStageIndex = harvestStage ? stages.indexOf(harvestStage) : stages.length;
    const { growthTime, regrowthTime } = stages.reduce(
      ({ growthTime: total, regrowthTime: regrowthTotal }, stage, index) => {
        if (harvestStageIndex === index) {
          return { growthTime: total, regrowthTime: regrowthTotal };
        }

        if (index > harvestStageIndex) {
          return { growthTime: total, regrowthTime: regrowthTotal + stage.growthDays };
        }

        return { growthTime: total + stage.growthDays, regrowthTime: regrowthTotal };
      },
      { growthTime: 0, regrowthTime: 0 }
    );

    let stagesTableHeader = '{| class=wikitable style="text-align:center;" id="roundedborder"';
    let stagesTableImageRow = '\n|-';
    let stagesTableDaysRow = '\n|-';
    stages.forEach((stage, index) => {
      if (index < harvestStageIndex) {
        stagesTableHeader += `\n!Stage ${index + 1}`;
        stagesTableDaysRow += `\n|${stage.growthDays} Day${stage.growthDays === 1 ? '' : 's'}`;
      } else if (index === harvestStageIndex) {
        stagesTableHeader += '\n!Harvest';
        stagesTableDaysRow += `\n|'''Total: ${growthTime} Day${growthTime === 1 ? '' : 's'}'''`;
      } else {
        stagesTableHeader += '\n!After-Harvest';
        stagesTableDaysRow += `\n|Regrowth: ${stage.growthDays} Day${stage.growthDays === 1 ? '' : 's'}`;
      }

      stagesTableImageRow += `\n|[[File:${object.name} Stage ${index + 1}.png|center|link=]]`;
    });

    const stagesTable = `${stagesTableHeader}${stagesTableImageRow}${stagesTableDaysRow}
|-
|}`;

    const seed = objectsToItem[object.key]; // Get seed
    const seedName = seed.name;

    let extra = '';
    let giveOrProduce = 'produces';
    if (isNotNullish(lootTableKey) && lootTableKey in lootTablesByKey) {
      const lootTable = lootTablesByKey[lootTableKey];
      const minAmount = lootTable.defaultGroup.components[0].min;
      const maxAmount = lootTable.defaultGroup.components[0].max;

      const amount = minAmount === maxAmount ? `${minAmount}` : `${minAmount} to ${maxAmount}`;
      giveOrProduce = `gives ${amount}`;

      if (lootTable.defaultGroup.components.length > 1) {
        const extraMinAmount = lootTable.defaultGroup.components[1].min;
        const extraMaxAmount = lootTable.defaultGroup.components[1].max;

        let extraAmount = '';
        if (extraMinAmount === extraMaxAmount) {
          if (extraMinAmount !== 1) {
            extraAmount = `${extraMinAmount}`;
          } else {
            extraAmount = 'another';
          }
        } else {
          extraAmount = `${extraMinAmount} to ${extraMaxAmount}`;
        }

        extra = `, with a ${lootTable.defaultGroup.components[1].probability}% chance for ${extraAmount} ${item.name}`;
      }
    }

    const regrowthText = regrowthTime > 0 ? ` every ${regrowthTime} days${extra}` : '';

    let wikiCategory = '';
    let seasonInfobox = '';
    let season: Season | undefined = undefined;
    if (isNotNullish(object.season) && object.season !== ALL_SEASONS) {
      season = object.season;
      const seasonName = toTitleCaseFromKey(season);
      wikiCategory = `\n\n[[Category:${seasonName} crops]]`;
      seasonInfobox = `\n|season      = [[${seasonName}]]`;
    }

    return {
      cropInfobox: `\n|seed        = {{name|${seedName}}}
|growth      = ${growthTime} days${seasonInfobox}`,
      cropBody: `\n\nThe '''${item.name}''' is a [[Vegetable|vegetable]] [[Crops|crop]] that grows from [[${seedName}]] after ${growthTime} days.

== Stages ==

When harvested, each ${item.name} plant ${giveOrProduce} ${item.name}${regrowthText}.

${stagesTable}

== Crop Growth Calendar ==

{{#lst:Crop Growth Calendars|${object.name}}}`,
      cropFooter: `

{{NavboxCrop}}${wikiCategory}`,
      stages: stages.length,
      season
    };
  }

  return {
    cropInfobox: '',
    cropBody: '',
    cropFooter: '',
    stages: undefined,
    season: undefined
  };
}

function generateSeedSections(
  item: LocalizedItemType,
  itemName: string,
  objectsByKey: Record<string, LocalizedObjectType>
) {
  if (item.categoryKey === 'SEED' && item.objectTypeKey && item.objectTypeKey in objectsByKey) {
    const object = objectsByKey[item.objectTypeKey]; // Get crop object

    const { stages = [] } = object;
    const harvestStage = stages.find((stage) => stage.harvestable);
    const harvestStageIndex = harvestStage ? stages.indexOf(harvestStage) : stages.length;
    const { growthTime } = stages.reduce(
      ({ growthTime: total, regrowthTime: regrowthTotal }, stage, index) => {
        if (harvestStageIndex === index) {
          return { growthTime: total, regrowthTime: regrowthTotal };
        }

        if (index > harvestStageIndex) {
          return { growthTime: total, regrowthTime: regrowthTotal + stage.growthDays };
        }

        return { growthTime: total + stage.growthDays, regrowthTime: regrowthTotal };
      },
      { growthTime: 0, regrowthTime: 0 }
    );

    let wikiCategory = '';
    let seasonInfobox = '';
    if (isNotNullish(object.season)) {
      const seasonName = toTitleCaseFromKey(object.season);
      wikiCategory = `\n\n[[Category:${seasonName} seeds]]`;
      seasonInfobox = `\n|season      = [[${seasonName}]]`;
    }

    return {
      seedInfobox: `\n|crop        = {{Name|${object.name}}}
|growth      = ${growthTime} days${seasonInfobox}`,
      seedBody: `\n\n'''${itemName}''' is a type of seed. Mature plants yield [[${object.name}]]s.

== Stages ==

{{#lsth:${object.name}|Stages}}`,
      seedFooter: `

{{NavboxSeeds}}${wikiCategory}`
    };
  }

  return {
    seedInfobox: '',
    seedBody: '',
    seedFooter: ''
  };
}

export default function buildItemPages(
  localization: Localization,
  localizationKeys: string[]
): {
  pages: {
    name: string;
    content: string;
    stages: number | undefined;
  }[];
  crops: Record<Season, string[]>;
} {
  const { craftingRecipes } = getCraftingRecipes(localization, localizationKeys);
  const { items, itemsByKey } = getItems(localization, localizationKeys);
  const { lootTables, lootTablesByKey } = getLootTables();
  const { objects, objectsByKey } = getObjects(localization, localizationKeys);
  const { fishingZones } = getFishingZones();
  const { creatures, creatureCategoriesByKey } = getCreatures(localization, localizationKeys);

  const recipesByItemKey = toRecord(craftingRecipes, (entry) => entry.itemTypeKey);
  const fishingZonesByLootTableKey = toRecord(fishingZones, (entry) => entry.lootTableKey);

  const shopKeepers = creatures.filter(
    (creature) => getCreatureSetting('isShopkeeper', creature, creatureCategoriesByKey).value === true
  );
  const itemsToShopKeepers = shopKeepers.reduce((record, shopKeeper) => {
    if (isNotNullish(shopKeeper.shop)) {
      Object.keys(shopKeeper.shop.prices).forEach((soldItemKey) => {
        if (!(soldItemKey in record)) {
          record[soldItemKey] = [];
        }
        record[soldItemKey].push(shopKeeper);
      });
    }

    return record;
  }, {} as Record<string, LocalizedCreatureType[]>);

  const objectsToItem = items.reduce((record, item) => {
    if (item.objectTypeKey) {
      const object = objectsByKey[item.objectTypeKey];
      if (object) {
        record[object.key] = item;
      }
    }

    return record;
  }, {} as Record<string, LocalizedItemType>);

  const recipesThatUseItem = craftingRecipes.reduce((record, recipe) => {
    Object.keys(recipe.ingredients ?? {}).forEach((itemKey) => {
      if (!(itemKey in record)) {
        record[itemKey] = [];
      }

      record[itemKey].push(recipe);
    });

    return record;
  }, {} as Record<string, LocalizedCraftingRecipe[]>);

  const objectsWithLootTable = objects.reduce((record, object) => {
    const objectLootTables = [object.lootTableKey, ...(object.stages ?? []).map((stage) => stage.lootTableKey)].filter(
      (value, index, self) => value !== undefined && self.indexOf(value) === index
    ) as string[];

    if (objectLootTables.length === 0) {
      return record;
    }

    objectLootTables.forEach((lootTableKey) => {
      if (!(lootTableKey in record)) {
        record[lootTableKey] = [];
      }
      record[lootTableKey].push(object);
    });

    return record;
  }, {} as Record<string, LocalizedObjectType[]>);

  const lootTablesContainingItem = lootTables.reduce((record, lootTable) => {
    const allComponents = [
      ...lootTable.defaultGroup.components.map((component) => component.typeKey),
      ...lootTable.groups.flatMap((group) => group.components.map((component) => component.typeKey))
    ].filter((value, index, self) => value !== undefined && self.indexOf(value) === index) as string[];

    allComponents.forEach((component) => {
      if (!(component in record)) {
        record[component] = [];
      }
      record[component].push(lootTable);
    });

    return record;
  }, {} as Record<string, LootTable[]>);

  const fishingZonesThatDropItems = Object.keys(lootTablesContainingItem).reduce((record, itemKey) => {
    const fishingZonesThatDropItem = (lootTablesContainingItem[itemKey] ?? [])
      .flatMap((lootTable) => fishingZonesByLootTableKey[lootTable.key])
      .filter((value, index, self) => value !== undefined && self.indexOf(value) === index);

    fishingZonesThatDropItem.sort((a, b) => a.key.localeCompare(b.key));

    if (fishingZonesThatDropItem.length > 0) {
      record[itemKey] = fishingZonesThatDropItem;
    }

    return record;
  }, {} as Record<string, FishingZone[]>);

  const objectsThatDropItems = Object.keys(lootTablesContainingItem).reduce((record, itemKey) => {
    const objectsThatDropItem = (lootTablesContainingItem[itemKey] ?? [])
      .flatMap((lootTable) => objectsWithLootTable[lootTable.key])
      .filter((value, index, self) => value !== undefined && self.indexOf(value) === index);

    objectsThatDropItem.sort((a, b) => a.name.localeCompare(b.name));

    if (objectsThatDropItem.length > 0) {
      record[itemKey] = objectsThatDropItem;
    }

    return record;
  }, {} as Record<string, LocalizedObjectType[]>);

  const itemPagesContent: ReturnType<typeof buildItemPages>['pages'] = [];
  const crops: ReturnType<typeof buildItemPages>['crops'] = {
    [SPRING]: [],
    [SUMMER]: [],
    [FALL]: [],
    [WINTER]: []
  };

  items.forEach((item) => {
    const source: string[] = [];
    if (item.key in recipesByItemKey) {
      source.push('[[Crafting]]');
    }

    if (item.key in fishingZonesThatDropItems && fishingZonesThatDropItems[item.key].length > 0) {
      source.push(
        fishingZonesThatDropItems[item.key].map((entry) => `[[${toTitleCaseFromKey(entry.key)}]]`).join(' • ')
      );
    }

    if (item.key in objectsThatDropItems && objectsThatDropItems[item.key].length > 0) {
      source.push(
        objectsThatDropItems[item.key]
          .filter((object) => object.name !== item.name)
          .map((entry) => `[[${entry.name}]]`)
          .join(' • ')
      );
    }

    if (item.key in itemsToShopKeepers && itemsToShopKeepers[item.key].length > 0) {
      source.push(
        itemsToShopKeepers[item.key]
          .filter((creature) => creature.name !== item.name)
          .map((creature) => `[[${creature.name}]]`)
          .join(' • ')
      );
    }

    const sourceText = source.length === 0 ? 'None' : source.join(' • ');

    const { cropInfobox, cropBody, cropFooter, stages, season } = generateCropSections(
      item,
      objectsByKey,
      objectsToItem,
      lootTablesByKey
    );

    if (season != null) {
      crops[season].push(item.name);
    }

    const { seedInfobox, seedBody, seedFooter } = generateSeedSections(item, item.name, objectsByKey);

    let output = `<onlyinclude>{{{{{1|Infobox}}}
|name        = ${item.name}
|image       = ${item.name.replace(' ', '_')}.png
|description = ${item.description}
|sellprice   = ${item.sellPrice}`;

    output += `${cropInfobox}${seedInfobox}`;

    if (sourceText !== '') {
      output += `\n|source      = ${sourceText}`;
    }

    if (item.key in recipesByItemKey) {
      const recipe = recipesByItemKey[item.key];
      const recipeIngredients = recipe.ingredients ?? {};

      const ingredients = Object.keys(recipeIngredients).reduce((ingredientList, ingredient) => {
        const ingredientItem = itemsByKey[ingredient];
        if (!ingredientItem) {
          return ingredientList;
        }

        ingredientList.push({
          name: ingredientItem.name,
          amount: recipeIngredients[ingredient]
        });

        return ingredientList;
      }, [] as { name: string; amount: number }[]);

      ingredients.sort((a, b) => a.name.localeCompare(b.name));

      output += `\n|recipe      = ''Starter''
|ingredients = ${ingredients.reduce((text, ingredient) => {
        return `${text}{{name|${ingredient.name}|${ingredient.amount}}}`;
      }, '')}`;

      if (isNotNullish(recipe.workstation) && recipe.workstation in objectsByKey) {
        output += `\n|workstation = {{name|${objectsByKey[recipe.workstation].name}}}`;
      }
    }

    output += '\n}}</onlyinclude>';

    output += `${cropBody}${seedBody}`;

    /**
     * Recipes
     */
    if (item.key in recipesThatUseItem) {
      output += `\n\n== Recipes ==

{{Recipes|header}}\n`;

      output += recipesThatUseItem[item.key]
        .reduce((array, recipe) => {
          if (isNotNullish(recipe.itemTypeKey) && recipe.itemTypeKey in itemsByKey) {
            array.push(`{{:${itemsByKey[recipe.itemTypeKey].name}|RecipeRow}}`);
          }

          return array;
        }, [] as string[])
        .join('\n');

      output += `\n{{Recipes|footer}}`;
    }

    output += `${cropFooter}${seedFooter}`;

    itemPagesContent.push({ name: item.name.replace(/ /g, '_'), content: output, stages });
  });

  return { pages: itemPagesContent, crops };
}
