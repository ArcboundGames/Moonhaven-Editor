import { createSlice } from '@reduxjs/toolkit';

import { toEventLog, toProcessedRawEventLog } from '../../../../../SharedLibrary/src/util/converters.util';
import { validateEventLogs as validateDataEventLogs } from '../../util/validate.util';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type { EventLog, EventsFile, Localization } from '../../../../../SharedLibrary/src/interface';

// Define a type for the slice state
export interface EventLogsState {
  rawData: string;
  eventLogs: EventLog[];
  eventLogsById: Record<number, EventLog>;
  eventLogsByKey: Record<string, EventLog>;
  errors: Record<string, string[]>;
}

// Define the initial state using that type
const initialState: EventLogsState = {
  rawData: '',
  eventLogs: [],
  eventLogsById: {},
  eventLogsByKey: {},
  errors: {}
};

export const eventLogsSlice = createSlice({
  name: 'eventLogs',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setRawEventLogData: (state, action: PayloadAction<string>) => ({ ...state, rawData: action.payload }),
    updateEventLogs: (state, action: PayloadAction<EventLog[]>) => {
      const eventLogsById: Record<number, EventLog> = {};
      const eventLogsByKey: Record<string, EventLog> = {};
      action.payload.forEach((eventLog) => {
        eventLogsById[eventLog.id] = eventLog;
        eventLogsByKey[eventLog.key] = eventLog;
      });
      return {
        ...state,
        eventLogs: action.payload,
        eventLogsById,
        eventLogsByKey
      };
    },
    validateEventLogs: (
      state,
      action: PayloadAction<{
        eventLogs: EventLog[];
        localization: Localization | null | undefined;
        localizationKeys: string[];
      }>
    ) => {
      const { eventLogs, localization, localizationKeys } = action.payload;

      return {
        ...state,
        errors: validateDataEventLogs(eventLogs, localization, localizationKeys)
      };
    },
    loadEventLogData: (state, action: PayloadAction<string>) => {
      if (action.payload === state.rawData) {
        return state;
      }

      const data = JSON.parse(action.payload) as EventsFile;

      const eventLogsById: Record<number, EventLog> = {};
      const eventLogsByKey: Record<string, EventLog> = {};
      const eventLogs =
        data.eventLogs?.map<EventLog>((rawEventLog) => {
          const eventLog: EventLog = toEventLog(toProcessedRawEventLog(rawEventLog));
          eventLogsById[eventLog.id] = eventLog;
          eventLogsByKey[eventLog.key] = eventLog;
          return eventLog;
        }) ?? [];

      return {
        ...state,
        eventLogs,
        eventLogsById,
        eventLogsByKey,
        rawData: action.payload
      };
    }
  }
});

export const { setRawEventLogData, loadEventLogData, updateEventLogs, validateEventLogs } = eventLogsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectRawEventLogData = (state: RootState) => state.eventLogs.rawData;

export const selectEventLogs = (state: RootState) => state.eventLogs.eventLogs;

export const selectEventLogsById = (state: RootState) => state.eventLogs.eventLogsById;

export const selectEventLogsByKey = (state: RootState) => state.eventLogs.eventLogsByKey;

export const selectEventLogById = (id?: number) => (state: RootState) =>
  id ? state.eventLogs.eventLogsById?.[id] : undefined;

export const selectEventLogByKey = (key?: string) => (state: RootState) =>
  key ? state.eventLogs.eventLogsByKey?.[key] : undefined;

export const selectEventLogErrors = (state: RootState) => state.eventLogs.errors;

export default eventLogsSlice.reducer;
