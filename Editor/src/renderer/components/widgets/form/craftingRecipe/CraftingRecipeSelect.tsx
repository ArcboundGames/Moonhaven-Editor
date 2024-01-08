import { useMemo } from 'react';

import useSortedLocalizedRecipes from 'renderer/components/hooks/crafting-recipes/useSortedLocalizedRecipes';
import Select from '../Select';

import type { LocalizedCraftingRecipe } from '../../../../../../../SharedLibrary/src/interface';
import type { NotRequiredSelectProps, RequiredSelectProps } from '../Select';

export interface CraftingRecipeNotRequiredSelectProps extends Omit<NotRequiredSelectProps<string>, 'options'> {
  onChange?: (value: string | undefined) => void;
  craftingRecipes?: LocalizedCraftingRecipe[];
  required?: false;
}

export interface CraftingRecipeRequiredSelectProps extends Omit<RequiredSelectProps<string>, 'options'> {
  onChange?: (value: string) => void;
  craftingRecipes?: LocalizedCraftingRecipe[];
  required: true;
}

type CraftingRecipeSelectProps = CraftingRecipeNotRequiredSelectProps | CraftingRecipeRequiredSelectProps;

const CraftingRecipeSelect = ({ craftingRecipes, ...selectProps }: CraftingRecipeSelectProps) => {
  const allCraftingRecipes = useSortedLocalizedRecipes();

  const finalCraftingRecipes = useMemo(() => {
    if (craftingRecipes) {
      return craftingRecipes;
    }

    return allCraftingRecipes;
  }, [allCraftingRecipes, craftingRecipes]);

  return (
    <Select<string>
      {...selectProps}
      options={finalCraftingRecipes?.map((entry) => ({
        label: entry.name,
        value: entry.key
      }))}
    />
  );
};

export default CraftingRecipeSelect;
