import { configureStore } from '@reduxjs/toolkit';

// Example slice (you can create multiple slices for different features)
import usrNavSlice from './slices/usrNavSlice';
import toggleAction from './slices/toggleAction';
import cardItemsSlice from './slices/cardItems';
import orderSchemaSlice from './slices/orderSchema';
import allSettings from './slices/allSettings';

const store = configureStore({
  reducer: {
    usrNavSlice: usrNavSlice,
    toggleAction: toggleAction,
    cardItems: cardItemsSlice,
    orderSchema: orderSchemaSlice,
    allSettings: allSettings,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
