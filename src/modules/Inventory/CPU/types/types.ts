export interface ICPUList {
  name: string;
  order_email: string;
  primary_email: string;
  comment: string;
  accept_price_change: number;
  min_order: number;
  max_order: number;
  branches: string[];
  id: string;
}

export type ICpuOrderRules = {
  order_day: string;
  delivery_day: string;
  order_time: string;
};

export type IPivot = {
  cc_email: string;
  customer_code: number;
  order_rules: ICpuOrderRules[];
};

export type ICpuBranchesPivot = {
  id: string;
  name: string;
  pivot: IPivot;
};
export type ICpuBranches = {
  id: string;
  name: string;
  cc_email: string;
  customer_code: number;
  order_rules: ICpuOrderRules[];
};
export interface ICpuOne {
  name: string;
  primary_email: string;
  accept_price_change: number;
  max_order: number;
  min_order: number;
  phone: string;
  comment: string;
  branch_id: string;
  branches: ICpuBranches[];
}
