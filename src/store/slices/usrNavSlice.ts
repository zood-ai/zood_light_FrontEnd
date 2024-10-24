import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UsrNavState {
  value: string;
}

const initialState: UsrNavState = {
  value: '',
};

export const usrNavSlice = createSlice({
  name: 'usrNav',
  initialState,
  reducers: {
    userNavigate: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { userNavigate } = usrNavSlice.actions;

export default usrNavSlice.reducer;
