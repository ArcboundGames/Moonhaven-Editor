/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PreloadedState, Reducer, StoreEnhancer } from 'redux';

const round = (number: number) => Math.round(number * 100) / 100;

const monitorReducerEnhancer: StoreEnhancer =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  (createStore) => (reducer: Reducer<any, any>, preloadedState?: PreloadedState<any> | undefined) => {
    const monitoredReducer: Reducer<any, any> = (state, action) => {
      const start = performance.now();
      const newState = reducer(state, action);
      const end = performance.now();
      const diff = round(end - start);

      // eslint-disable-next-line no-console
      console.info('reducer process time:', diff);

      return newState;
    };

    return createStore(monitoredReducer, preloadedState);
  };

export default monitorReducerEnhancer;
