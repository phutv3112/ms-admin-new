import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../shared/models/catalog/category';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = environment.productUrl;
  private http = inject(HttpClient);

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  // categoriesSubject để lưu mảng category
  // BehaviorSubject để có thể phát ra giá trị mới, đảm bảo categoriesSubject mới nhất, nếu k thay đổi thì nó sẽ tái sử dụng
  // đỡ phải call api nhều không cần thiết
  // categories$ là Observable để các component khác có thể subscribe và nhận giá trị mới từ categoriesSubject
  categories$ = this.categoriesSubject.asObservable();

  // pipe là một phương thức quan trọng trong RxJS, dùng để xử lý và chuyển đổi dữ liệu trong một Observable. Khi bạn gọi pipe, bạn có thể chuyển qua các operator để biến đổi, lọc, kết hợp, hoặc thực hiện các tác vụ khác trên dữ liệu mà Observable phát ra.
  // tap là một operator trong RxJS được sử dụng để thực hiện các tác vụ phụ (side effects) mà không làm thay đổi dữ liệu được phát ra từ Observable.
  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(this.baseUrl + '/products/categories')
      .pipe(
        tap((data) => {
          this.categoriesSubject.next(data);
        })
      );
  }

  createCategory(name: string) {
    return this.http.post<{ id: string }>(
      this.baseUrl + '/products/categories',
      { name }
    );
  }
  deleteCategory(id: string) {
    return this.http.delete(this.baseUrl + '/products/categories/' + id);
  }
  updateCategory(id: string, name: string, isActived: boolean) {
    return this.http.put(this.baseUrl + '/products/categories/' + id, {
      name,
      isActived,
    });
  }
  getCategoryId(id: string) {
    return this.http.get<Category>(this.baseUrl + '/products/categories/' + id);
  }

  getAllBrands() {
    return this.http.get<{ brands: string[] }>(
      this.baseUrl + '/products/brands'
    );
    // .subscribe((data) => {
    //   this.brandsSubject.next(data.brands);
    // });
  }
  getAllProductTypes() {
    return this.http.get<{ types: string[] }>(this.baseUrl + '/products/types');
    // .subscribe((data) => {
    //   this.typesSubject.next(data.types);
    // });
  }
}
