import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PosCashier {
  id: string;
  name: string;
}

interface PosCashierState {
  currentCashier: PosCashier | null;
}

const initialState: PosCashierState = {
  currentCashier: null,
};

const posCashierSlice = createSlice({
  name: 'posCashier',
  initialState,
  reducers: {
    setCurrentCashier: (state, action: PayloadAction<PosCashier | null>) => {
      state.currentCashier = action.payload;
    },
    clearCurrentCashier: (state) => {
      state.currentCashier = null;
    },
  },
});

export const { setCurrentCashier, clearCurrentCashier } = posCashierSlice.actions;
export default posCashierSlice.reducer;
