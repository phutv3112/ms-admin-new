import { Component, inject, OnInit } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/service/order.service';
import { Order } from '../../../shared/models/orders/order';
import { TagModule } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/service/product.service';
import { Pagination } from '../../../shared/models/paginations/pagination';
import { DatePicker } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import {
  BestSelling,
  GetProductsResponse,
  ProductDisplay,
} from '../../../shared/models/reports/bestselling';
import { map, of, switchMap } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-best-selling',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RippleModule,
    TagModule,
    RouterLink,
    DatePicker,
    FormsModule,
  ],
  templateUrl: './best-selling.component.html',
  styleUrl: './best-selling.component.scss',
})
export class BestSellingComponent implements OnInit {
  private orderService = inject(OrderService);
  private shopService = inject(ProductService);

  bestSellingProducts?: Pagination<BestSelling>;
  productsRes?: Pagination<ProductDisplay>;

  responsiveOptions: any[] | undefined;

  products: any | undefined;

  date: Date | undefined = new Date();
  month: number | undefined;
  year: number | undefined;

  ngOnInit(): void {
    this.getBestSellingProducts();
  }
  onDateChange() {
    this.getBestSellingProducts();
  }

  exportExcel(table: Table) {
    console.log('table value===================', table.value);
    const worksheet = XLSX.utils.json_to_sheet(table.value);
    const workbook = {
      Sheets: { BestSelling: worksheet },
      SheetNames: ['BestSelling'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    FileSaver.saveAs(blob, 'best-selling.xlsx');
  }

  getBestSellingProducts() {
    if (this.date) {
      this.month = this.date.getMonth() + 1;
      this.year = this.date.getFullYear();
    }
    this.orderService
      .getBestSellingProducts(0, 10, this.month, this.year)
      .pipe(
        map((response) => response.products?.data ?? []),
        switchMap((bestSellingList) => {
          if (!bestSellingList.length) {
            return of([]);
          }

          return this.shopService.getBestSellingProducts({
            bestSellingList,
            pageNumber: 1,
            pageSize: 10,
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
