import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UsrNavState {
  value: string;
  active: boolean;
}

const initialState: UsrNavState = {
  value: '',
  active:false
};

export const usrNavSlice :any = createSlice({
  name: 'usrNav',
  initialState,
  reducers: {
    userNavigate:(state, action:PayloadAction<any> ) => {
      state.value = action.payload;

    },
    toggleUserNavigate:(state, action:PayloadAction<any> ) => {
      state.active =  action.payload
    
    },
  },
});

export const { userNavigate,toggleUserNavigate } = usrNavSlice.actions;

export default usrNavSlice.reducer;
