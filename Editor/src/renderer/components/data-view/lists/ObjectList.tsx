import Box from '@mui/material/Box';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { IMAGE_FILE_EXTENSION } from '../../../../../../SharedLibrary/src/constants';
import { getObjectSetting } from '../../../../../../SharedLibrary/src/util/objectType.util';
import { useAppDispatch, useAppSelector, useDebounce } from '../../../hooks';
import { selectPath, selectSearch } from '../../../store/slices/data';
import {
  incrementSpritesVersion,
  selectObjectCategoriesByKey,
  selectObjectErrors,
  selectObjectSubCategoriesByKey,
  selectObjectTypesByCategoryAndSubCategory,
  selectSelectedObjectCategory,
  selectSelectedObjectSubCategory
} from '../../../store/slices/objects';
import { getObjectListSpriteIndex, getSectionPath, getSpriteCountFromImagePath } from '../../../util/sprite.util';
import useDebouncedDispatch from '../../hooks/useDebouncedDispatch';
import DataViewList from '../DataViewList';

import type { ObjectType } from '../../../../../../SharedLibrary/src/interface';
import type { DataViewListItem } from '../DataViewList';

const ObjectList = () => {
  const dispatch = useAppDispatch();

  const path = useAppSelector(selectPath);
  const selectedObjectCategory = useAppSelector(selectSelectedObjectCategory);
  const selectedObjectSubCategory = useAppSelector(selectSelectedObjectSubCategory);
  const objects = useAppSelector(
    useMemo(
      () => selectObjectTypesByCategoryAndSubCategory(selectedObjectCategory, selectedObjectSubCategory),
      [selectedObjectCategory, selectedObjectSubCategory]
    )
  );

  const categoriesByKey = useAppSelector(selectObjectCategoriesByKey);
  const subCategoriesByKey = useAppSelector(selectObjectSubCategoriesByKey);

  const errors = useAppSelector(selectObjectErrors);

  const searchTerm = useAppSelector(selectSearch);
  const debouncedSearchTerm = useDebounce(searchTerm?.toLowerCase(), 250);

  const filteredObjects = useMemo(() => {
    if (!debouncedSearchTerm) {
      return objects;
    }
    return objects.filter((objectType) => objectType.name.toLowerCase().includes(debouncedSearchTerm));
  }, [debouncedSearchTerm, objects]);

  const [, updateState] = useState<unknown>();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [spriteCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!path) {
      return;
    }

    const finalPath = path;

    let alive = true;
    async function getCount(filteredObject: ObjectType) {
      const { value: changesSpritesWithSeason } = getObjectSetting(
        'changesSpritesWithSeason',
        filteredObject,
        categoriesByKey,
        subCategoriesByKey
      );

      let { key } = filteredObject;
      if (changesSpritesWithSeason === true) {
        key += '-SPRING';
      }
      const imagePath = (
        await window.api.join(finalPath, '..', getSectionPath('object'), `${key.toLowerCase()}${IMAGE_FILE_EXTENSION}`)
      ).replace(/\\/g, '/');

      const newSpriteCount = await getSpriteCountFromImagePath(
        imagePath,
        filteredObject.sprite.width,
        filteredObject.sprite.height
      );

      if (alive) {
        spriteCounts[key] = newSpriteCount;
        forceUpdate();
      }
    }

    filteredObjects.map((filteredObject) => getCount(filteredObject));

    return () => {
      alive = false;
    };
  }, [filteredObjects, path, forceUpdate, spriteCounts, categoriesByKey, subCategoriesByKey]);

  const objectSubCategoriesByKey = useAppSelector(selectObjectSubCategoriesByKey);

  const listItems: DataViewListItem[] = filteredObjects.map((object) => {
    const objectSubCategory = object.subCategoryKey ? objectSubCategoriesByKey[object.subCategoryKey] : undefined;
    const { value: stagesType } = getObjectSetting('stagesType', object, categoriesByKey, subCategoriesByKey);
    const { value: changesSpritesWithSeason } = getObjectSetting(
      'changesSpritesWithSeason',
      object,
      categoriesByKey,
      subCategoriesByKey
    );

    let { key } = object;
    if (changesSpritesWithSeason === true) {
      key += '-SPRING';
    }

    return {
      dataKey: object.key,
      name: object.name,
      sprite: object.sprite
        ? {
            key,
            width: object.sprite.width,
            height: object.sprite.height,
            default: getObjectListSpriteIndex(object, stagesType, objectSubCategory, spriteCounts[key] ?? 0)
          }
        : {
            key,
            default: objectSubCategory?.rulesets?.[0]?.defaultSprite
          },
      errors: errors[object.key]
    };
  });

  const debouncedDispatch = useDebouncedDispatch(dispatch, incrementSpritesVersion);
  const onSpritesChange = useCallback(() => debouncedDispatch.dispatch(), [debouncedDispatch]);

  return (
    <Box sx={{ height: '100%' }}>
      <DataViewList section="object" items={listItems} onSpritesChange={onSpritesChange} search="?tab=0" />
    </Box>
  );
};

export default ObjectList;
