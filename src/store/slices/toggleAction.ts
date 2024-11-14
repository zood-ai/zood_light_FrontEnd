import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface toggleActionState {
  value: boolean;
  data: any;
}

const initialState: toggleActionState = {
  value: false,
  data: null,
};

export const toggleActionSlice = createSlice({
  name: 'toggleAction',
  initialState,
  reducers: {
    toggleActionView: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
    toggleActionViewData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
  },
});

export const { toggleActionView, toggleActionViewData } =
  toggleActionSlice.actions;

export default toggleActionSlice.reducer;
