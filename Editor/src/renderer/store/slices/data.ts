import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type { Section } from '../../../../../SharedLibrary/src/interface';

// Define a type for the slice state
export interface DataState {
  loaded: boolean;
  path?: string;
  section: Section;
  search?: string;
}

// Define the initial state using that type
const initialState: DataState = {
  loaded: false,
  section: 'object'
};

export const dataSlice = createSlice({
  name: 'data',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setPath: (state, action: PayloadAction<string>) => {
      return { ...state, path: action.payload };
    },
    loaded: (state) => {
      return { ...state, loaded: true };
    },
    setSection: (state, action: PayloadAction<Section>) => {
      return { ...state, section: action.payload };
    },
    search: (state, action: PayloadAction<string>) => {
      return { ...state, search: action.payload };
    }
  }
});

export const { setPath, loaded, setSection, search } = dataSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectLoaded = (state: RootState) => state.data.loaded;
export const selectPath = (state: RootState) => state.data.path;
export const selectSection = (state: RootState) => state.data.section;
export const selectSearch = (state: RootState) => state.data.search;

export default dataSlice.reducer;
