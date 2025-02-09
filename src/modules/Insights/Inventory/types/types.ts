export interface IInventory {
  branch: string;
  sales: number;
  target_gp: number;
  actual_gp: number;
  waste: number;
  accounted_waste: number;
  unaccounted_waste: number;
  has_count: boolean;
}
