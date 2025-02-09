export interface IProduction {
  isCateogry: boolean;
  itemId: string;
  itemUnit: string;
  categoryName: string;
  status: number;
  date: string;
  total: number;
  unit: string;
  is_main: boolean;
  branches: IBranch[];
}

export interface IBranch {
  id: string;
  item_id: string;
  is_cpu: boolean;
  has: number;
  need: number;
  name: string;
}
