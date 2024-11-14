import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  id?: any;
  image?: any;
  discount_amount: any;
}

interface Payment {
  tendered: 180;
  amount: 0;
  tips: 0;
  meta: {
    external_additional_payment_info: 'some info';
  };
  payment_method_id: '';
}
interface Tax {
  id: string;
  rate: number;
  amount: number;
}
interface OrderSchemaState {
  type: number;
  branch_id: string;
  discount_amount: number;
  taxes: Tax[];
  customer_id: string;
  products: Product[];
  payments: Payment[];
  subtotal_price: number;
  total_price: number;
  is_sales_order: number;
  total_taxes: number;
  tendered?: any;
  invoice_number: any;
  discount_type: number;
  discount_id: string;
}

const initialState: OrderSchemaState = {
  type: 0,
  branch_id: '',
  discount_amount: 0,
  customer_id: '',
  discount_type: 2,
  discount_id: '0aaa23cb-2156-4778-b6dd-a69ba6642552',

  taxes: [
    {
      id: '',
      rate: 0,
      amount: 0,
    },
  ],
  products: [
    {
      product_id: '',
      quantity: 0,
      unit_price: 0,
      total_price: 0,
      discount_amount: 0,
    },
  ],
  payments: [
    {
      tendered: 180,
      amount: 0,
      payment_method_id: '',
      tips: 0,
      meta: {
        external_additional_payment_info: 'some info',
      },
    },
  ],
  subtotal_price: 0,
  total_price: 0,
  total_taxes: 0,
  is_sales_order: 0,
  invoice_number: `ORD-${Math.floor(Math.random() * 999999999)}`,
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
    addTax: (state, action: PayloadAction<Tax[]>) => {
      state.taxes = action.payload;
    },
    resetOrder: (state) => {
      return initialState;
    },
  },
});

export const {
  updatePayment,
  resetOrder,
  updateField,
  addProduct,
  addPayment,
  addTax,
} = orderSchemaSlice.actions;

export default orderSchemaSlice.reducer;
