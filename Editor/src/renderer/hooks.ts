import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import type { TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Hook
export function useDebounce<T>(value: T, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      if (delay <= 0) {
        setDebouncedValue(value);
        return;
      }

      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return delay <= 0 ? value : debouncedValue;
}

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function useTraceUpdate(props: Record<string, unknown>) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {} as Record<string, unknown>);
    if (Object.keys(changedProps).length > 0) {
      // eslint-disable-next-line no-console
      console.info('Changed props:', changedProps);
    }
    prev.current = props;
  });
}

export function useAsyncEffect<T>(
  asyncFunc: () => Promise<T>,
  callback: (result: T) => void,
  deps?: React.DependencyList | undefined
) {
  useEffect(() => {
    let alive = true;
    async function processAsync() {
      const result = await asyncFunc();

      if (alive) {
        callback(result);
      }
    }

    processAsync();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps ?? []), asyncFunc, callback]);
}
