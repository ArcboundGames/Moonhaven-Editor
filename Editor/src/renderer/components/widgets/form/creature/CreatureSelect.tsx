import { useMemo } from 'react';

import { useAppSelector } from '../../../../hooks';
import { selectCreatureTypesSortedWithName } from '../../../../store/slices/creatures';
import Select from '../Select';

import type { LocalizedCreatureType } from '../../../../../../../SharedLibrary/src/interface';
import type { NotRequiredSelectProps, RequiredSelectProps } from '../Select';

export interface CreatureNotRequiredSelectProps extends Omit<NotRequiredSelectProps<string>, 'options'> {
  onChange?: (value: string | undefined) => void;
  creatures?: LocalizedCreatureType[];
  required?: false;
}

export interface CreatureRequiredSelectProps extends Omit<RequiredSelectProps<string>, 'options'> {
  onChange?: (value: string) => void;
  creatures?: LocalizedCreatureType[];
  required: true;
}

type CreatureSelectProps = CreatureNotRequiredSelectProps | CreatureRequiredSelectProps;

const CreatureSelect = ({ creatures, ...selectProps }: CreatureSelectProps) => {
  const allCreatures = useAppSelector(selectCreatureTypesSortedWithName);

  const finalCreatures = useMemo(() => {
    if (creatures) {
      return creatures;
    }

    return allCreatures;
  }, [allCreatures, creatures]);

  return (
    <Select<string>
      {...selectProps}
      options={finalCreatures?.map((entry) => ({
        label: entry.name,
        value: entry.key
      }))}
    />
  );
};

export default CreatureSelect;
