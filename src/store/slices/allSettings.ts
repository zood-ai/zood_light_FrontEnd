import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface allSettingsState {
  value: any;
  reFetch: number;
}

const initialState: allSettingsState = {
  value: [],
  reFetch: 0,
};

export const allSettingsSlice: any = createSlice({
  name: 'allSettings',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
    reFetchSettings: (state) => {
      state.reFetch += 1;
    },
  },
});

export const { setSettings, reFetchSettings } = allSettingsSlice.actions;

export default allSettingsSlice.reducer;
