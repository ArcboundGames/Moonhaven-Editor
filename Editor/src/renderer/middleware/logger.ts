/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { Middleware } from 'redux';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logger: Middleware = (store) => (next) => (action: any) => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.info('next state', store.getState());
  console.groupEnd();
  return result;
};

export default logger;
