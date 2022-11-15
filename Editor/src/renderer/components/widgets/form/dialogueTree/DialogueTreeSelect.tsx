import { useMemo } from 'react';

import { toTitleCaseFromKey } from '../../../../../../../SharedLibrary/src/util/string.util';
import { useAppSelector } from '../../../../hooks';
import { selectDialogueTrees } from '../../../../store/slices/dialogue';
import Select from '../Select';

import type { DialogueTree } from '../../../../../../../SharedLibrary/src/interface';
import type { NotRequiredSelectProps, RequiredSelectProps } from '../Select';

export interface DialogueTreeNotRequiredSelectProps extends Omit<NotRequiredSelectProps<string>, 'options'> {
  onChange?: (value: string | undefined) => void;
  dialogueTrees?: DialogueTree[];
  required?: false;
}

export interface DialogueTreeRequiredSelectProps extends Omit<RequiredSelectProps<string>, 'options'> {
  onChange?: (value: string) => void;
  dialogueTrees?: DialogueTree[];
  required: true;
}

type DialogueTreeSelectProps = DialogueTreeNotRequiredSelectProps | DialogueTreeRequiredSelectProps;

const DialogueTreeSelect = ({ dialogueTrees, ...selectProps }: DialogueTreeSelectProps) => {
  const allDialogueTrees = useAppSelector(selectDialogueTrees);

  const finalDialogueTrees = useMemo(() => {
    if (dialogueTrees) {
      return dialogueTrees;
    }

    return allDialogueTrees;
  }, [allDialogueTrees, dialogueTrees]);

  return (
    <Select<string>
      {...selectProps}
      options={finalDialogueTrees?.map((entry) => ({
        label: toTitleCaseFromKey(entry.key),
        value: entry.key
      }))}
    />
  );
};

export default DialogueTreeSelect;
