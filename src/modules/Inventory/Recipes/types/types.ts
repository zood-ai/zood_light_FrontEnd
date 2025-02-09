export interface IRecipesList {
  name: string;
  price: number | null;
  type: string;
  cost: number;
  category_id: string;
  id: string;
  quantity: number;
  cost_percentage?: number;
  gross_profit_percentage?: number;
}
export interface IItem {
  value?: string;
  id?: string;
  cost: number;
  unit: string;
  quantity?: number;
}
