import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  AggregatedProductStatsResult,
  MonthlySummary,
  OrderBrandTypeStat,
  OrderStatusStat,
  ProductSalesRevenueByMonth,
} from '../../shared/models/reports/report';
import {
  ProductMonthlySales,
  TopBrandTypeByMonth,
} from '../../shared/models/reports/brand';
import {
  GetProductsResponse,
  GetTopCustomersResponse,
} from '../../shared/models/reports/bestselling';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  orderUrl = environment.orderUrl;
  productUrl = environment.productUrl;
  private http = inject(HttpClient);

  getMonthlySummary() {
    return this.http.get<MonthlySummary>(
      `${this.orderUrl}/orders/monthly-summary`
    );
  }
  getMonthlySalesReport() {
    return this.http.get<ProductSalesRevenueByMonth[]>(
      `${this.orderUrl}/orders/reports/sales`
    );
  }

  getMonthlySalesProducts() {
    return this.http.get<ProductMonthlySales[]>(
      this.orderUrl + '/orders/reports/sales-by-product-month'
    );
  }

  getSalesBrandType(salesData: ProductMonthlySales[]) {
    return this.http.post<TopBrandTypeByMonth[]>(
      this.productUrl + '/products/sales-brand-type',
      { salesData }
    );
  }

  getTopRatedProducts(
    pageIndex?: number,
    pageSize?: number,
    filterType?: string,
    day?: number,
    month?: number,
    year?: number
  ) {
    let params = new HttpParams();
    if (pageIndex) {
      params = params.append('pageIndex', pageIndex.toString());
    }
    if (pageSize) {
      params = params.append('pageSize', pageSize.toString());
    }
    if (filterType) {
      params = params.append('filterType', filterType.toString());
    }
    if (day) {
      params = params.append('day', day.toString());
    }
    if (month) {
      params = params.append('month', month.toString());
    }
    if (year) {
      params = params.append('year', year.toString());
    }
    return this.http.get<GetProductsResponse>(
      this.productUrl + '/products/top-rated',
      { params }
    );
  }
  getTopCustomers(
    pageIndex?: number,
    pageSize?: number,
    filterType?: string,
    day?: number,
    month?: number,
    year?: number
  ) {
    let params = new HttpParams();
    if (pageIndex) {
      params = params.append('pageIndex', pageIndex.toString());
    }
    if (pageSize) {
      params = params.append('pageSize', pageSize.toString());
    }
    if (filterType) {
      params = params.append('filterType', filterType.toString());
    }
    if (day) {
      params = params.append('day', day.toString());
    }
    if (month) {
      params = params.append('month', month.toString());
    }
    if (year) {
      params = params.append('year', year.toString());
    }
    return this.http.get<GetTopCustomersResponse>(
      this.orderUrl + '/orders/reports/top-customers',
      { params }
    );
  }
  getOrderStatusStats(
    filterType?: string,
    day?: number,
    month?: number,
    year?: number
  ) {
    let params = new HttpParams();
    if (filterType) {
      params = params.append('filterType', filterType.toString());
    }
    if (day) {
      params = params.append('day', day.toString());
    }
    if (month) {
      params = params.append('month', month.toString());
    }
    if (year) {
      params = params.append('year', year.toString());
    }
    return this.http.get<OrderStatusStat[]>(
      this.orderUrl + '/orders/reports/status-stats',
      { params }
    );
  }

  getOrderBrandTypeStats(
    filterType?: string,
    day?: number,
    month?: number,
    year?: number
  ) {
    let params = new HttpParams();
    if (filterType) {
      params = params.append('filterType', filterType.toString());
    }
    if (day) {
      params = params.append('day', day.toString());
    }
    if (month) {
      params = params.append('month', month.toString());
    }
    if (year) {
      params = params.append('year', year.toString());
    }
    return this.http.get<OrderBrandTypeStat[]>(
      this.orderUrl + '/orders/reports/brand-type-stats',
      { params }
    );
  }

  getCatalogBrandTypeStats(
    productStats: OrderBrandTypeStat[],
    brandName: string,
    typeName: string
  ) {
    return this.http.post<AggregatedProductStatsResult>(
      this.productUrl + '/products/reports/brand-type-stats',
      { productStats, brandName, typeName }
    );
  }
}
