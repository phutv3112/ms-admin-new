export interface MonthlySummary {
  currentOrderCount: number;
  previousOrderCount: number;
  orderGrowthPercentage: number;
  currentRevenue: number;
  previousRevenue: number;
  revenueGrowthPercentage: number;
  currentProductSold: number;
  previousProductSold: number;
  productSoldGrowthPercentage: number;
}

export interface ProductSalesRevenueByMonth {
  month: number;
  year: number;
  totalQuantitySold: number;
  totalRevenue: number;
}
