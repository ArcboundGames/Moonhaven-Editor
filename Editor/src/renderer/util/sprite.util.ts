import {
  ACCENT_TYPE_FARMLAND,
  ACCENT_TYPE_EMPTY_GROUND,
  ACCENT_TYPE_INSIDE,
  CREATURES_DATA_FILE,
  IMAGE_FILE_EXTENSION,
  ITEMS_DATA_FILE,
  OBJECTS_DATA_FILE,
  SEASONS,
  STAGES_TYPE_GROWABLE,
  STAGES_TYPE_GROWABLE_WITH_HEALTH
} from '../../../../SharedLibrary/src/constants';
import { isNotNullish } from '../../../../SharedLibrary/src/util/null.util';
import { getObjectSetting } from '../../../../SharedLibrary/src/util/objectType.util';

import type {
  AccentType,
  ObjectCategory,
  ObjectSubCategory,
  ObjectType,
  Section,
  StagesType
} from '../../../../SharedLibrary/src/interface';

export function getSectionPath(section: Section): string {
  switch (section) {
    case 'creature':
      return CREATURES_DATA_FILE;
    case 'item':
      return ITEMS_DATA_FILE;
    case 'object':
      return OBJECTS_DATA_FILE;
    default:
      return '';
  }
}

export async function getSpriteCountFromImagePath(imagePath: string, width: number, height: number): Promise<number> {
  const size = await window.api.sizeOf(imagePath);

  if (!size.width || !size.height) {
    return 0;
  }

  const columns = Math.floor(size.width / width);
  const rows = Math.floor(size.height / height);

  return rows * columns;
}

export async function getAccentSpriteCount(
  path: string | undefined,
  type: Section,
  key: string | undefined,
  accentType: AccentType,
  width: number | undefined = 16,
  height: number | undefined = 16
): Promise<number> {
  if (!path || !key) {
    return 0;
  }

  const imagePath = (
    await window.api.join(
      path,
      '..',
      getSectionPath(type),
      `${key.toLowerCase()}-${accentType.toLowerCase()}${IMAGE_FILE_EXTENSION}`
    )
  ).replace(/\\/g, '/');

  return getSpriteCountFromImagePath(imagePath, width, height);
}

export async function getSpriteCount(
  path: string | undefined,
  type: Section,
  key: string | undefined,
  width: number | undefined = 16,
  height: number | undefined = 16
): Promise<number> {
  if (!path || !key) {
    return 0;
  }

  const imagePath = (
    await window.api.join(path, '..', getSectionPath(type), `${key.toLowerCase()}${IMAGE_FILE_EXTENSION}`)
  ).replace(/\\/g, '/');

  return getSpriteCountFromImagePath(imagePath, width, height);
}

async function getObjectSpriteCounts(type: ObjectType, path: string | undefined, key: string) {
  const [spriteCount, emptyGroundSpriteCount, farmlandSpriteCount, insideSpriteCount] = await Promise.all([
    path ? await getSpriteCount(path, 'object', key, type.sprite?.width, type.sprite?.height) : 0,
    path
      ? await getAccentSpriteCount(path, 'object', key, ACCENT_TYPE_EMPTY_GROUND, type.sprite?.width, type.sprite?.height)
      : 0,
    path
      ? await getAccentSpriteCount(path, 'object', key, ACCENT_TYPE_FARMLAND, type.sprite?.width, type.sprite?.height)
      : 0,
    path
      ? await getAccentSpriteCount(path, 'object', key, ACCENT_TYPE_INSIDE, type.sprite?.width, type.sprite?.height)
      : 0
  ]);

  return {
    key,
    spriteCount,
    accentSpriteCounts: {
      [ACCENT_TYPE_EMPTY_GROUND]: emptyGroundSpriteCount,
      [ACCENT_TYPE_FARMLAND]: farmlandSpriteCount,
      [ACCENT_TYPE_INSIDE]: insideSpriteCount
    }
  };
}

export async function getObjectSpriteCountsWithSeason(
  type: ObjectType,
  path: string | undefined,
  changesSpritesWithSeason: boolean | undefined
) {
  if (changesSpritesWithSeason === true) {
    let spriteCounts: Record<string, number> = {};

    let accentSpritesCounts: Record<
      string,
      {
        [ACCENT_TYPE_EMPTY_GROUND]: number;
        [ACCENT_TYPE_FARMLAND]: number;
        [ACCENT_TYPE_INSIDE]: number;
      }
    > = {};

    const seasonCounts = await Promise.all(
      SEASONS.map((season) => getObjectSpriteCounts(type, path, `${type.key}-${season}`))
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const { key, spriteCount, accentSpriteCounts } of seasonCounts) {
      spriteCounts = { ...spriteCounts, [key]: spriteCount };
      accentSpritesCounts = { ...accentSpritesCounts, [key]: accentSpriteCounts };
    }

    return { spriteCounts, accentSpritesCounts };
  }

  const { key, spriteCount, accentSpriteCounts } = await getObjectSpriteCounts(type, path, type.key);

  return { spriteCounts: { [key]: spriteCount }, accentSpritesCounts: { [key]: accentSpriteCounts } };
}

export async function getObjectsSpritesCountsWithSeason(
  objects: ObjectType[],
  path: string | undefined,
  categoriesByKey: Record<string, ObjectCategory>,
  subCategoriesByKey: Record<string, ObjectSubCategory>
) {
  const results = await Promise.all(
    objects.map((type) => {
      const { value: changesSpritesWithSeason = undefined } = getObjectSetting(
        'changesSpritesWithSeason',
        type,
        categoriesByKey,
        subCategoriesByKey
      );

      return getObjectSpriteCountsWithSeason(type, path, changesSpritesWithSeason);
    })
  );

  let allSpriteCounts: Record<string, number> = {};

  let allAccentSpritesCounts: Record<
    string,
    {
      [ACCENT_TYPE_EMPTY_GROUND]: number;
      [ACCENT_TYPE_FARMLAND]: number;
      [ACCENT_TYPE_INSIDE]: number;
    }
  > = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const { spriteCounts, accentSpritesCounts } of results) {
    allSpriteCounts = { ...allSpriteCounts, ...spriteCounts };
    allAccentSpritesCounts = { ...allAccentSpritesCounts, ...accentSpritesCounts };
  }

  return { allSpriteCounts, allAccentSpritesCounts };
}

export function getObjectListSpriteIndex(
  object: ObjectType,
  stagesType: StagesType | undefined,
  subCategory: ObjectSubCategory | undefined,
  spriteCount: number
) {
  if (subCategory?.rulesets?.[0]?.defaultSprite !== undefined) {
    return subCategory?.rulesets?.[0]?.defaultSprite;
  }

  if (
    (stagesType === STAGES_TYPE_GROWABLE || stagesType === STAGES_TYPE_GROWABLE_WITH_HEALTH) &&
    isNotNullish(object.sprite) &&
    spriteCount > 0
  ) {
    let lastHarvestableStage: number | undefined;
    if (isNotNullish(object.stages) && object.stages.length === spriteCount) {
      for (let i = spriteCount - 1; i >= 0; i -= 1) {
        if (object.stages[i].harvestable) {
          lastHarvestableStage = i;
          break;
        }
      }
    }

    return lastHarvestableStage ?? spriteCount - 1;
  }

  return object.sprite?.defaultSprite ?? 0;
}
