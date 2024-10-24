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
  },
});

export const { setCardItem } = cardItemsSlice.actions;

export default cardItemsSlice.reducer;
