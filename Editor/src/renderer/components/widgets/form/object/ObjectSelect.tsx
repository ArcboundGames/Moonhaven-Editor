import { useMemo } from 'react';

import { useAppSelector } from '../../../../hooks';
import { selectObjectTypesSortedWithName } from '../../../../store/slices/objects';
import Select from '../Select';

import type { NotRequiredSelectProps, RequiredSelectProps } from '../Select';
import type { LocalizedObjectType } from '../../../../../../../SharedLibrary/src/interface';

export interface ObjectNotRequiredSelectProps extends Omit<NotRequiredSelectProps<string>, 'options'> {
  onChange?: (value: string | undefined) => void;
  objects?: LocalizedObjectType[];
  required?: false;
}

export interface ObjectRequiredSelectProps extends Omit<RequiredSelectProps<string>, 'options'> {
  onChange?: (value: string) => void;
  objects?: LocalizedObjectType[];
  required: true;
}

type ObjectSelectProps = ObjectNotRequiredSelectProps | ObjectRequiredSelectProps;

const ObjectSelect = ({ objects, ...selectProps }: ObjectSelectProps) => {
  const allObjects = useAppSelector(selectObjectTypesSortedWithName);

  const finalObjects = useMemo(() => {
    if (objects) {
      return objects;
    }

    return allObjects;
  }, [allObjects, objects]);

  return (
    <Select<string>
      {...selectProps}
      options={finalObjects?.map((entry) => ({
        label: entry.name,
        value: entry.key
      }))}
    />
  );
};

export default ObjectSelect;
