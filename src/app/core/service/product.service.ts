import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  BrandResponse,
  FilterProductRequest,
  InventoryById,
  InventoryHistory,
  InventoryHistoryResponse,
  InventoryItem,
  Product,
  ProductLazyResponse,
  ProductReview,
  ProductTypeResponse,
} from '../../shared/models/catalog/product';
import {
  GetBestSellingRequest,
  GetProductsResponse,
} from '../../shared/models/reports/bestselling';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl = environment.productUrl;
  private http = inject(HttpClient);

  private productsSubject = new BehaviorSubject<ProductLazyResponse>({
    products: [],
    totalCount: 0,
  });
  products$ = this.productsSubject.asObservable();

  createProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/products`, formData);
  }
  getAllProducts(params: {
    page: number;
    pageSize: number;
    search?: string;
    sortField?: string;
    sortDirection?: string;
  }) {
    return this.http
      .get<ProductLazyResponse>(`${this.baseUrl}/products/admin`, { params })
      .subscribe((data) => {
        this.productsSubject.next(data);
      });
  }

  getFilterProducts(request: FilterProductRequest) {
    return this.http
      .post<ProductLazyResponse>(`${this.baseUrl}/products/filters/admin`, {
        request,
      })
      .subscribe((data) => {
        this.productsSubject.next(data);
      });
  }

  deleteProduct(id: string) {
    return this.http.delete(this.baseUrl + '/products/' + id);
  }
  getProductById(productId: string): Observable<{ product: Product }> {
    return this.http.get<{ product: Product }>(
      `${this.baseUrl}/products/${productId}`
    );
  }

  updateProduct(productId: string, formData: FormData): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/products/${productId}`,
      formData
    );
  }

  getBestSellingProducts(request: GetBestSellingRequest) {
    let params = new HttpParams();
    if (request.pageNumber) {
      params = params.append('pageIndex', request.pageNumber.toString());
    }
    if (request.pageSize) {
      params = params.append('pageSize', request.pageSize.toString());
    }
    return this.http.post<GetProductsResponse>(
      this.baseUrl + '/products/best-selling',
      request,
      { params }
    );
  }

  getInventories() {
    return this.http.get<{ inventoryItems: InventoryItem[] }>(
      `${this.baseUrl}/products/inventories`
    );
  }
  getInventoryById(id: string) {
    return this.http.get<{ inventory: InventoryById }>(
      `${this.baseUrl}/products/inventories/${id}`
    );
  }
  getInventoryHistory(id: string) {
    return this.http.get<{ histories: InventoryHistoryResponse[] }>(
      `${this.baseUrl}/products/inventories/history/${id}`
    );
  }
  updateInventory(history: InventoryHistory) {
    return this.http.put(`${this.baseUrl}/products/inventory`, {
      inventoryHistory: history,
    });
  }

  // Brand and Type
  getAllBrands() {
    return this.http.get<BrandResponse[]>(
      `${this.baseUrl}/products/manage/brands`
    );
  }
  getBrandById(id: string) {
    return this.http.get<BrandResponse>(
      `${this.baseUrl}/products/manage/brands/${id}`
    );
  }
  addNewBrand(formData: FormData) {
    return this.http.post<BrandResponse>(
      `${this.baseUrl}/products/manage/brands`,
      formData
    );
  }
  updateBrand(formData: FormData, id: string) {
    return this.http.put<BrandResponse>(
      `${this.baseUrl}/products/manage/brands/${id}`,
      formData
    );
  }
  deleteBrand(id: string) {
    return this.http.delete(`${this.baseUrl}/products/manage/brands/${id}`);
  }
  // Types
  getAllTypes() {
    return this.http.get<ProductTypeResponse[]>(
      `${this.baseUrl}/products/manage/types`
    );
  }
  getTypeById(id: string) {
    return this.http.get<ProductTypeResponse>(
      `${this.baseUrl}/products/manage/types/${id}`
    );
  }
  addNewType(name: string, changedBy: string) {
    return this.http.post<ProductTypeResponse>(
      `${this.baseUrl}/products/manage/types`,
      { name, changedBy }
    );
  }
  updateType(id: string, name: string, changedBy: string) {
    return this.http.put<boolean>(
      `${this.baseUrl}/products/manage/types/${id}`,
      { id, name, changedBy }
    );
  }
  deleteType(id: string) {
    return this.http.delete(`${this.baseUrl}/products/manage/types/${id}`);
  }

  // reviews
  getAllReviews(productId: string) {
    return this.http.get<ProductReview[]>(
      `${this.baseUrl}/products/admin/reviews/${productId}`
    );
  }
  deleteReviewById(id: string) {
    return this.http.delete(`${this.baseUrl}/products/admin/reviews/${id}`);
  }
}
