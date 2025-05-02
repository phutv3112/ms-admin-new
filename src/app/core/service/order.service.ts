import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Order } from '../../shared/models/orders/order';
import { Observable } from 'rxjs';
import { BestSellingProductsResponse } from '../../shared/models/reports/bestselling';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseUrl = environment.orderUrl;
  private http = inject(HttpClient);

  getAllOrders() {
    return this.http.get<{ orders: Order[] }>(`${this.baseUrl}/orders`);
  }

  getRecentOrders(pageSize?: number) {
    return this.http.get<{ orders: Order[] }>(
      `${this.baseUrl}/orders/recent?pageSize=${pageSize}`
    );
  }

  getDiscountById(id: string): Observable<{ order: Order }> {
    return this.http.get<{ order: Order }>(`${this.baseUrl}/orders/${id}`);
  }

  refundedOrder(id: string): Observable<{ isSuccess: boolean }> {
    return this.http.put<{ isSuccess: boolean }>(
      `${this.baseUrl}/orders/refunded/${id}`,
      {}
    );
  }

  getOrdersForUser(buyerEmail: string) {
    return this.http.get<{ orders: Order[] }>(
      this.baseUrl + '/orders/customer/' + buyerEmail
    );
  }

  getBestSellingProducts(
    pageIndex: number,
    pageSize: number,
    month?: number,
    year?: number
  ) {
    let params = new HttpParams();
    params = params.append('pageIndex', pageIndex.toString());
    params = params.append('pageSize', pageSize.toString());
    if (month) {
      params = params.append('month', month.toString());
    }
    if (year) {
      params = params.append('year', year.toString());
    }
    return this.http.get<BestSellingProductsResponse>(
      this.baseUrl + '/orders/best-selling',
      {
        params,
      }
    );
  }
}
