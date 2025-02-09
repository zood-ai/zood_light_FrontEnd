export interface IBranches {
  name: string;
  reference: string;
  tax_group: { name: string };
  created_at: String;
}
export interface ICreateBranch {
  name: string;
  name_localized: string;
  tax_group_id: string;
  reference: string;
  image: string;
  tax_name: string;
  tax_number: string;
  phone: number;
  address: string;
  opening_from: string;
  opening_to: string;
  inventory_end_of_day_time: string;
  latitude: number;
  longitude: number;
  receipt_header: string;
  receipt_footer: string;
  employee_count: number;
  employee_cost: number;
}
