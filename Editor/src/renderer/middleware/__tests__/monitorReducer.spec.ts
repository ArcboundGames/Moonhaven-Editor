import { configureStore } from '@reduxjs/toolkit';

import monitorReducerEnhancer from '../../middleware/monitorReducer';

describe('monitorReducerEnhancer', () => {
  it('logs reducer process time when an action is dispatched', () => {
    const infoSpy = jest.spyOn(console, 'info').mockImplementation();

    const store = configureStore({
      reducer: (state: number = 0, action) => {
        if (action.type === 'INCREMENT') {
          return state + 1;
        }
        return state;
      },
      enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(monitorReducerEnhancer)
    });

    // Clear logs from store initialization
    infoSpy.mockClear();

    store.dispatch({ type: 'INCREMENT' });

    expect(infoSpy).toHaveBeenCalledWith('reducer process time:', expect.any(Number));

    infoSpy.mockRestore();
  });

  it('passes through the reducer result correctly', () => {
    jest.spyOn(console, 'info').mockImplementation();

    const store = configureStore({
      reducer: (state: number = 0, action) => {
        if (action.type === 'INCREMENT') {
          return state + 1;
        }
        return state;
      },
      enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(monitorReducerEnhancer)
    });

    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'INCREMENT' });

    expect(store.getState()).toBe(2);

    jest.restoreAllMocks();
  });
});
