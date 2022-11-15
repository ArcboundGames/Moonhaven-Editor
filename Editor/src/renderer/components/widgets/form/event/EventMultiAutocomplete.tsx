import { useMemo } from 'react';

import { toTitleCaseFromKey } from '../../../../../../../SharedLibrary/src/util/string.util';
import { useAppSelector } from '../../../../hooks';
import { selectEventLogs } from '../../../../store/slices/eventLogs';
import MultiAutocomplete from '../MultiAutocomplete';

interface EventAutocompleteProps {
  label?: string;
  values: string[] | undefined;
  onChange: (value: string[] | undefined) => void;
}

const EventAutocomplete = ({ label, ...otherProps }: EventAutocompleteProps) => {
  const finalLabel = useMemo(() => label ?? 'Events', [label]);

  const eventLogs = useAppSelector(selectEventLogs);

  const eventLogOptions = useMemo(
    () =>
      eventLogs.map((eventLog) => ({
        label: toTitleCaseFromKey(eventLog.key),
        id: eventLog.key
      })),
    [eventLogs]
  );

  return <MultiAutocomplete options={eventLogOptions} label={finalLabel} {...otherProps} />;
};

export default EventAutocomplete;
