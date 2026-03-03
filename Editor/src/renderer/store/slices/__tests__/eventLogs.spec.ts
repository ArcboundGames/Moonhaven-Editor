import { toEventLog, toProcessedRawEventLog } from '../../../../../../SharedLibrary/src/util/converters.util';
import * as validateMod from '../../../util/validate.util';
import reducer, {
  loadEventLogData,
  selectEventLogById,
  selectEventLogByKey,
  selectEventLogErrors,
  selectEventLogs,
  selectEventLogsById,
  selectEventLogsByKey,
  selectRawEventLogData,
  setRawEventLogData,
  updateEventLogs,
  validateEventLogs,
  type EventLogsState
} from '../eventLogs';

import type { EventLog } from '../../../../../../SharedLibrary/src/interface';
import type { RootState } from '../..';

jest.mock('../../../util/validate.util', () => ({
  validateEventLogs: jest.fn(() => ({}))
}));

function makeEventLog(key: string, id: number): EventLog {
  return toEventLog(toProcessedRawEventLog({ key, id }));
}

const initialState: EventLogsState = {
  rawData: '',
  eventLogs: [],
  eventLogsById: {},
  eventLogsByKey: {},
  errors: {}
};

function mockRootState(overrides: Partial<EventLogsState> = {}): Pick<RootState, 'eventLogs'> {
  return { eventLogs: { ...initialState, ...overrides } } as Pick<RootState, 'eventLogs'>;
}

describe('eventLogs slice', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('initial state', () => {
    it('returns the correct initial state', () => {
      const state = reducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    describe('setRawEventLogData', () => {
      it('sets rawData', () => {
        const state = reducer(initialState, setRawEventLogData('raw'));
        expect(state.rawData).toBe('raw');
      });
    });

    describe('updateEventLogs', () => {
      it('builds lookup by id and key', () => {
        const e1 = makeEventLog('EVT_A', 1);
        const e2 = makeEventLog('EVT_B', 2);
        const state = reducer(initialState, updateEventLogs([e1, e2]));
        expect(state.eventLogs).toEqual([e1, e2]);
        expect(state.eventLogsById[1]).toEqual(e1);
        expect(state.eventLogsByKey['EVT_B']).toEqual(e2);
      });
    });

    describe('validateEventLogs', () => {
      it('calls validate and stores errors', () => {
        const mockErrors = { EVT_A: ['err'] };
        jest.mocked(validateMod.validateEventLogs).mockReturnValue(mockErrors);
        const state = reducer(
          initialState,
          validateEventLogs({ eventLogs: [], localization: null, localizationKeys: [] })
        );
        expect(state.errors).toEqual(mockErrors);
        expect(validateMod.validateEventLogs).toHaveBeenCalledWith([], null, []);
      });
    });

    describe('loadEventLogData', () => {
      it('parses JSON and builds lookups', () => {
        const json = JSON.stringify({ eventLogs: [{ key: 'EVT_A', id: 1 }] });
        const state = reducer(initialState, loadEventLogData(json));
        expect(state.rawData).toBe(json);
        expect(state.eventLogs).toHaveLength(1);
        expect(state.eventLogs[0].key).toBe('EVT_A');
        expect(state.eventLogsById[1].key).toBe('EVT_A');
        expect(state.eventLogsByKey['EVT_A'].id).toBe(1);
      });

      it('returns same state on duplicate rawData', () => {
        const json = JSON.stringify({ eventLogs: [] });
        const prev: EventLogsState = { ...initialState, rawData: json };
        const state = reducer(prev, loadEventLogData(json));
        expect(state).toBe(prev);
      });

      it('handles missing eventLogs array', () => {
        const json = JSON.stringify({});
        const state = reducer(initialState, loadEventLogData(json));
        expect(state.eventLogs).toEqual([]);
      });
    });
  });

  describe('selectors', () => {
    const e1 = makeEventLog('EVT_A', 1);

    it('selectRawEventLogData', () => {
      expect(selectRawEventLogData(mockRootState({ rawData: 'x' }) as RootState)).toBe('x');
    });

    it('selectEventLogs', () => {
      expect(selectEventLogs(mockRootState({ eventLogs: [e1] }) as RootState)).toEqual([e1]);
    });

    it('selectEventLogsById', () => {
      expect(selectEventLogsById(mockRootState({ eventLogsById: { 1: e1 } }) as RootState)).toEqual({ 1: e1 });
    });

    it('selectEventLogsByKey', () => {
      expect(selectEventLogsByKey(mockRootState({ eventLogsByKey: { EVT_A: e1 } }) as RootState)).toEqual({
        EVT_A: e1
      });
    });

    it('selectEventLogById with valid id', () => {
      expect(selectEventLogById(1)(mockRootState({ eventLogsById: { 1: e1 } }) as RootState)).toEqual(e1);
    });

    it('selectEventLogById with undefined', () => {
      expect(selectEventLogById(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    it('selectEventLogByKey with valid key', () => {
      expect(selectEventLogByKey('EVT_A')(mockRootState({ eventLogsByKey: { EVT_A: e1 } }) as RootState)).toEqual(e1);
    });

    it('selectEventLogByKey with undefined', () => {
      expect(selectEventLogByKey(undefined)(mockRootState() as RootState)).toBeUndefined();
    });

    it('selectEventLogErrors', () => {
      const errors = { EVT_A: ['err'] };
      expect(selectEventLogErrors(mockRootState({ errors }) as RootState)).toEqual(errors);
    });
  });
});
