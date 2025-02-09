export interface ICreditNotesList {
  branch: string;
  credit_amount: number;
  id: number;
  invoice_number: string;
  item: {
    name: string;
  };
  invoice: {
    id: string;
    invoice_number: string;
  };
  status: number;
  supplier: string;
  type: string;
}

export interface Item {
  id: string;
  name: string;
  type: string;
  code: string;
  exclude_product_from_gp: number;
  category_name: string;
  category_id: string;
  suppliers: string;
  unit: string;
  supplier_id: string;
  pack_unit: string;
  cost: number;
  tax_group: string;
  pivot: {
    invoice_id: string;
    item_id: string;
    id: number;
    unit: string;
    cost: number;
    total_cost: number;
    tax_group_id: string;
    quantity: number;
    invoice_quantity: number;
    created_at: string;
    updated_at: string;
    sub_total: number;
  };
}

export interface CreditNote {
  id: string;
  invoice_number: string;
  business_date: string;
  invoice_date: string;
  supplier_name: string;
  sub_total: number;
  total_vat: number;
  total: number;
  note: string;
  creditNotices: [];
  invoice: {
    id: string;
    status: number;
    credit_value: number;
    total: number;
  };
  items: Item[];
  item: Item;
  supplier: string;
  branch: string;
  type: string;
  credit_amount: number;
  status: number;
}
