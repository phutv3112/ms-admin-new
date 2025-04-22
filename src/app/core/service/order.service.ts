import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Order } from '../../shared/models/orders/order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseUrl = environment.orderUrl;
  private http = inject(HttpClient);

  getAllOrders() {
    return this.http.get<{ orders: Order[] }>(`${this.baseUrl}/orders`);
  }

  getDiscountById(id: string): Observable<{ order: Order }> {
    return this.http.get<{ order: Order }>(`${this.baseUrl}/orders/${id}`);
  }
}
