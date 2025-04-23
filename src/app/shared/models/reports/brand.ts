export interface ProductMonthlySales {
  productId: string;
  month: number;
  year: number;
  quantitySold: number;
}

export interface TopBrandTypeByMonth {
  month: number;
  year: number;
  brands: TopItem[];
  types: TopItem[];
}
export interface TopItem {
  name: string;
  quantity: number;
}
