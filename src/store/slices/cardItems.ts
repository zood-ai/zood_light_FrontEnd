import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface cardItemsState {
  value: any;
}

const initialState: cardItemsState = {
  value: [],
};

export const cardItemsSlice :any = createSlice({
  name: 'cardItems',
  initialState,
  reducers: {
    setCardItem: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
    resetCard: (state) => {
      return initialState;
    },
  },
});

export const { setCardItem , resetCard} = cardItemsSlice.actions;

export default cardItemsSlice.reducer;
