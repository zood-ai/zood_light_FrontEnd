import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Payment {
  amount: number;
  payment_method_id: string;
}

interface OrderSchemaState {
  type: number;
  branch_id: string;
  discount_amount: number;
  customer_id: string;
  products: Product[];
  payments: Payment[];
  subtotal_price: number;
  total_price: number;
  is_sales_order: number;
  tendered: any;
}

const initialState: OrderSchemaState = {
  type: 0,
  branch_id: '',
  discount_amount: 0,
  customer_id: '',
  tendered: 180,
  products: [
    {
      product_id: '',
      quantity: 0,
      unit_price: 0,
      total_price: 0,
    },
  ],
  payments: [
    {
      amount: 0,
      payment_method_id: '',
    },
  ],
  subtotal_price: 0,
  total_price: 0,
  is_sales_order: 0,
};

const orderSchemaSlice: any = createSlice({
  name: 'orderSchema',
  initialState,
  reducers: {
    // Update a specific payment in the payments array
    updatePayment: (state, action: PayloadAction<Payment[]>) => {
      state.payments = action.payload;
    },
    // Update a single field (for scalar values like type, branch_id, etc.)
    updateField: <K extends keyof OrderSchemaState>(
      state,
      action: PayloadAction<{ field: K; value: OrderSchemaState[K] }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    // Add a new product to the products array
    addProduct: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    // Add a new payment to the payments array
    addPayment: (state, action: PayloadAction<Payment[]>) => {
      state.payments = action.payload;
    },
    resetOrder: (state) => {
      return initialState;
    },
  },
});

export const { updatePayment,resetOrder, updateField, addProduct, addPayment } =
  orderSchemaSlice.actions;

export default orderSchemaSlice.reducer;
