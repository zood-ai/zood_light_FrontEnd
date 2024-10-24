import { configureStore } from '@reduxjs/toolkit';

// Example slice (you can create multiple slices for different features)
import usrNavSlice from './slices/usrNavSlice';
import cardItemsSlice from './slices/cardItems';

const store = configureStore({
  reducer: {
    usrNavSlice: usrNavSlice,
    cardItems: cardItemsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
