import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../shared/models/catalog/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl = environment.productUrl;
  private http = inject(HttpClient);

  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  createProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}products`, formData);
  }
  getAllProducts() {
    return this.http
      .get<{ products: Product[] }>(`${this.baseUrl}products/admin`)
      .subscribe((data) => {
        this.productsSubject.next(data.products);
      });
  }
  deleteProduct(id: string) {
    return this.http.delete(this.baseUrl + 'products/' + id);
  }
  getProductById(productId: string): Observable<{ product: Product }> {
    return this.http.get<{ product: Product }>(
      `${this.baseUrl}products/${productId}`
    );
  }

  updateProduct(productId: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}products/${productId}`, formData);
  }
}
