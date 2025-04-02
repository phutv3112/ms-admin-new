import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../shared/models/catalog/category';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = environment.productUrl;
  private http = inject(HttpClient);

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  getCategories() {
    return this.http
      .get<Category[]>(this.baseUrl + 'products/categories')
      .subscribe((data) => {
        this.categoriesSubject.next(data);
      });
  }
  createCategory(name: string) {
    return this.http.post<{ id: string }>(
      this.baseUrl + 'products/categories',
      { name }
    );
  }
  deleteCategory(id: string) {
    return this.http.delete(this.baseUrl + 'products/categories/' + id);
  }
  updateCategory(id: string, name: string, isActived: boolean) {
    return this.http.put(this.baseUrl + 'products/categories/' + id, {
      name,
      isActived,
    });
  }
  getCategoryId(id: string) {
    return this.http.get<Category>(this.baseUrl + 'products/categories/' + id);
  }
}
