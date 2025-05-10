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

export interface OrderStatusStat {
  status: string;
  count: number;
}

export interface OrderBrandTypeStat {
  productId: string;
  soldQuantity: number;
  revenue: number;
  refundedQuantity: number;
}

export interface AggregatedProductStatsResult {
  totalQuantity: number;
  totalRevenue: number;
  totalRefunded: number;
}
