/* eslint-disable no-else-return */
import { useMemo } from 'react';

import {
  PLACEMENT_LAYER_IN_AIR,
  PLACEMENT_LAYER_IN_GROUND,
  PLACEMENT_LAYER_ON_GROUND
} from '../../../../../../../../SharedLibrary/src/constants';
import { getObjectSetting } from '../../../../../../../../SharedLibrary/src/util/objectType.util';

import type {
  LocalizedObjectType,
  ObjectCategory,
  ObjectSubCategory
} from '../../../../../../../../SharedLibrary/src/interface';

export function useByAdjacentPlacementLayer(
  placementLayer: string | undefined,
  categories: ObjectCategory[],
  subCategories: ObjectSubCategory[],
  objects: LocalizedObjectType[],
  categoriesByKey: Record<string, ObjectCategory>,
  subCategoriesByKey: Record<string, ObjectSubCategory>
) {
  const adjacentCategories = useMemo(
    () => (placementLayer ? categories.filter((entry) => entry.settings?.placementLayer === placementLayer) : []),
    [categories, placementLayer]
  );
  const adjacentCategoriesKeys = useMemo(() => adjacentCategories.map((entry) => entry.key), [adjacentCategories]);

  const adjacentSubCategories = useMemo(
    () =>
      subCategories.filter((entry) => {
        if (!placementLayer) {
          return [];
        }
        return getObjectSetting('placementLayer', entry, categoriesByKey, {}).value === placementLayer;
      }),
    [subCategories, placementLayer, categoriesByKey]
  );
  const adjacentSubCategoriesKeys = useMemo(
    () => adjacentSubCategories.map((entry) => entry.key),
    [adjacentSubCategories]
  );

  const adjacentObjects = useMemo(
    () =>
      objects.filter((entry) => {
        if (!placementLayer) {
          return [];
        }
        return getObjectSetting('placementLayer', entry, categoriesByKey, subCategoriesByKey).value === placementLayer;
      }),
    [objects, placementLayer, categoriesByKey, subCategoriesByKey]
  );
  const adjacentObjectsKeys = useMemo(() => adjacentObjects.map((entry) => entry.key), [adjacentObjects]);

  return {
    adjacentCategories,
    adjacentCategoriesKeys,
    adjacentSubCategories,
    adjacentSubCategoriesKeys,
    adjacentObjects,
    adjacentObjectsKeys
  };
}

export function useByBelowPlacementLayer(
  placementLayer: string | undefined,
  categories: ObjectCategory[],
  subCategories: ObjectSubCategory[],
  objects: LocalizedObjectType[],
  categoriesByKey: Record<string, ObjectCategory>,
  subCategoriesByKey: Record<string, ObjectSubCategory>
) {
  const belowLayer = useMemo(() => {
    if (placementLayer === PLACEMENT_LAYER_ON_GROUND) {
      return PLACEMENT_LAYER_IN_GROUND;
    } else if (placementLayer === PLACEMENT_LAYER_IN_AIR) {
      return PLACEMENT_LAYER_ON_GROUND;
    }

    return undefined;
  }, [placementLayer]);

  const {
    adjacentCategories: belowCategories,
    adjacentCategoriesKeys: belowCategoriesKeys,
    adjacentSubCategories: belowSubCategories,
    adjacentSubCategoriesKeys: belowSubCategoriesKeys,
    adjacentObjects: belowObjects,
    adjacentObjectsKeys: belowObjectsKeys
  } = useByAdjacentPlacementLayer(belowLayer, categories, subCategories, objects, categoriesByKey, subCategoriesByKey);

  return {
    belowCategories,
    belowCategoriesKeys,
    belowSubCategories,
    belowSubCategoriesKeys,
    belowObjects,
    belowObjectsKeys
  };
}
