import { configureStore } from '@reduxjs/toolkit';

// Example slice (you can create multiple slices for different features)
import usrNavSlice from './slices/usrNavSlice';
import cardItemsSlice from './slices/cardItems';
import orderSchemaSlice from './slices/orderSchema';

const store = configureStore({
  reducer: {
    usrNavSlice: usrNavSlice,
    cardItems: cardItemsSlice,
    orderSchema: orderSchemaSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
