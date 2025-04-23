import { Component, inject, OnInit } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/service/order.service';
import { Order } from '../../../shared/models/orders/order';
import { TagModule } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/service/product.service';
import { Pagination } from '../../../shared/models/paginations/pagination';
import {
  BestSelling,
  GetProductsResponse,
  ProductDisplay,
} from '../../../shared/models/reports/bestselling';
import { map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-top-products',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RippleModule,
    TagModule,
    RouterLink,
  ],
  templateUrl: './top-products.component.html',
  styleUrl: './top-products.component.scss',
})
export class TopProductsComponent implements OnInit {
  private orderService = inject(OrderService);
  private shopService = inject(ProductService);

  bestSellingProducts?: Pagination<BestSelling>;
  productsRes?: Pagination<ProductDisplay>;

  responsiveOptions: any[] | undefined;

  products: any | undefined;

  ngOnInit(): void {
    this.getBestSellingProducts();
  }

  getBestSellingProducts() {
    this.orderService
      .getBestSellingProducts(0, 10)
      .pipe(
        map((response) => response.products?.data ?? []),
        switchMap((bestSellingList) => {
          if (!bestSellingList.length) {
            return of([]);
          }

          return this.shopService.getBestSellingProducts({
            bestSellingList,
            pageNumber: 1,
            pageSize: 5,
          });
        })
      )
      .subscribe({
        next: (result) => {
          const res = result as GetProductsResponse;
          this.products = res?.products?.data ?? [];
        },
        error: (err) => console.error(err),
      });
  }
}
