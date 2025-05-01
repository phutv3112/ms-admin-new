import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  MonthlySummary,
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
}
