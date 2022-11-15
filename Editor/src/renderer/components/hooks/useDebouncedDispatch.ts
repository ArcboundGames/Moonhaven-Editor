import { useMemo } from 'react';

import type { ActionCreator, AnyAction } from 'redux';
import type { useAppDispatch } from '../../hooks';

export interface DebouncedDispatch {
  timeout?: number | undefined;
  dispatch: (this: DebouncedDispatch) => void;
}

export default function useDebouncedDispatch(
  dispatch: ReturnType<typeof useAppDispatch>,
  action: ActionCreator<AnyAction>
) {
  const debouncedDispatch: DebouncedDispatch = useMemo(
    () => ({
      // eslint-disable-next-line func-names, object-shorthand
      dispatch: function (this: DebouncedDispatch) {
        if (this.timeout) {
          return;
        }
        this.timeout = window.setTimeout(() => {
          dispatch(action());
          clearTimeout(this.timeout);
          this.timeout = undefined;
        }, 500);
      }
    }),
    [action, dispatch]
  );

  return debouncedDispatch;
}
