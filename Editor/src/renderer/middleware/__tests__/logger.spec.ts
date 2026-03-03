import logger from '../../middleware/logger';

describe('logger middleware', () => {
  let store: { getState: jest.Mock; dispatch: jest.Mock };
  let next: jest.Mock;
  let invoke: (action: { type: string }) => unknown;

  beforeEach(() => {
    store = { getState: jest.fn(() => ({ test: true })), dispatch: jest.fn() };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    next = jest.fn((action) => action);
    invoke = (action) => logger(store)(next)(action);
    jest.spyOn(console, 'group').mockImplementation();
    jest.spyOn(console, 'info').mockImplementation();
    jest.spyOn(console, 'groupEnd').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls next with the action', () => {
    const action = { type: 'TEST_ACTION' };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('returns the result of next', () => {
    const action = { type: 'TEST_ACTION' };
    next.mockReturnValue('next-result');
    expect(invoke(action)).toBe('next-result');
  });

  it('logs the action type as a group', () => {
    invoke({ type: 'MY_ACTION' });
    expect(console.group).toHaveBeenCalledWith('MY_ACTION');
  });

  it('logs dispatching info', () => {
    const action = { type: 'MY_ACTION' };
    invoke(action);
    expect(console.info).toHaveBeenCalledWith('dispatching', action);
  });

  it('logs next state', () => {
    invoke({ type: 'MY_ACTION' });
    expect(console.info).toHaveBeenCalledWith('next state', { test: true });
  });

  it('closes the console group', () => {
    invoke({ type: 'MY_ACTION' });
    expect(console.groupEnd).toHaveBeenCalled();
  });
});
