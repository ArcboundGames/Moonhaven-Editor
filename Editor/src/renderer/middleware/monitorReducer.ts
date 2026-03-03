/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Reducer, StoreEnhancer } from 'redux';

const round = (number: number) => Math.round(number * 100) / 100;

const monitorReducerEnhancer: StoreEnhancer =
  (createStore) =>
  (...args: any[]) => {
    const [reducer, ...rest] = args;
    const monitoredReducer: Reducer<any, any> = (state, action) => {
      const start = performance.now();
      const newState = reducer(state, action);
      const end = performance.now();
      const diff = round(end - start);

      console.info('reducer process time:', diff);

      return newState;
    };

    return createStore(monitoredReducer, ...rest);
  };

export default monitorReducerEnhancer;
