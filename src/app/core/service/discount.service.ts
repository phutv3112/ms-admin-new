import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DiscountRequest,
  Discount,
  UpdateDiscountRequest,
  DiscountCode,
  CreateDiscountCode,
  UpdateDiscountCode,
  DiscountCodeDto,
} from '../../shared/models/catalog/discount';

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  baseUrl = environment.discountUrl;
  private http = inject(HttpClient);

  createDiscount(discount: DiscountRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/discounts`, discount);
  }
  getAllDiscounts() {
    return this.http.get<Discount[]>(`${this.baseUrl}/discounts`);
  }
  deleteDiscount(id: string) {
    return this.http.delete(this.baseUrl + '/discounts/' + id);
  }
  getDiscountById(id: string): Observable<Discount> {
    return this.http.get<Discount>(`${this.baseUrl}/discounts/${id}`);
  }

  updateDiscount(id: string, discount: UpdateDiscountRequest): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/discounts/${id}`, discount);
  }
  getDiscountCodesByDiscountId(id: string): Observable<DiscountCode[]> {
    return this.http.get<DiscountCode[]>(
      `${this.baseUrl}/discounts/coupons/code/${id}`
    );
  }

  // Coupons
  createDiscountCode(discountCode: CreateDiscountCode): Observable<any> {
    return this.http.post(`${this.baseUrl}/discounts/coupons`, discountCode);
  }
  updateDiscountCode(
    id: string,
    discountCode: UpdateDiscountCode
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/discounts/coupons/${id}`,
      discountCode
    );
  }
  getDiscountCodeById(id: string): Observable<DiscountCode> {
    return this.http.get<DiscountCode>(
      `${this.baseUrl}/discounts/coupons/${id}`
    );
  }
  deleteDiscountCode(id: string) {
    return this.http.delete(this.baseUrl + '/discounts/coupons/' + id);
  }
  getAllDiscountCodes() {
    return this.http.get<DiscountCodeDto[]>(
      `${this.baseUrl}/discounts/coupons`
    );
  }
}
