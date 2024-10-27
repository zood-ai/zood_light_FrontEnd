import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface toggleActionState {
  value: boolean;
}

const initialState: toggleActionState = {
  value: false,
};

export const toggleActionSlice = createSlice({
  name: 'toggleAction',
  initialState,
  reducers: {
    toggleActionView: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { toggleActionView } = toggleActionSlice.actions;

export default toggleActionSlice.reducer;
