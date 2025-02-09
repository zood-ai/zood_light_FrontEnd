export interface IProductsList {
  name: string;
  sku: string;
  category: {
    id: string;
    name: string;
  };
  price: number;
  tax_group: string;
  created_at: string;
}
