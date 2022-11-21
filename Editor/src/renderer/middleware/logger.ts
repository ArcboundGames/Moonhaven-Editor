/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-console */
import type { Middleware } from 'redux';

const logger: Middleware = (store) => (next) => (action) => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.info('next state', store.getState());
  console.groupEnd();
  return result;
};

export default logger;
