export interface IReveiceOrders {
  supplier_name: string;
  status: string;
  total_cost: number;
  delivery_date: string;
  reference: string;
  business_date: string;
  added_by: string;
  id: string;
}

export interface IReveiceOrderOne {
  id: string;
  supplier_name: string;
  status: string;
  reference: string;
  cost: number;
  items: [
    {
      reference: string;
      name: string;
      order_unit: string;
      price_per_unit: number;
    }
  ];
}
export interface IItem {
  id: string;
  code: string;
  name: string;
  order_unit: string;
  quantity: number;
  invoice_quantity: number;
  cost: number;
  tax_group_id: string;
  sub_total: number;
  tax_amount: number;
  price_per_unit: number;
  total_cost: number;
  case_unit?: string;
  stock_counts: [{ unit: string }];
}
