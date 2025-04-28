import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

import {
  MessageService,
  ConfirmationService,
  LazyLoadEvent,
} from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Checkbox } from 'primeng/checkbox';
import { Product } from '../../shared/models/catalog/product';
import { ProductService } from '../../core/service/product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    TableModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule,
    Toast,
    ConfirmDialog,
    RouterLink,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class ProductsComponent implements OnInit {
  searchKeyword: string = '';
  products: Product[] = [];

  private productService = inject(ProductService);

  statuses: any[] = [];

  activityValues: number[] = [0, 100];

  totalRecords = 0;
  loading = false;

  searchTerm = '';
  sortField = '';
  sortOrder = 1;

  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.productService.getAllProducts({ page: 0, pageSize: 10 });
    this.productService.products$.subscribe((data) => {
      this.products = data.products;
      this.totalRecords = data.totalCount;
      this.loading = false;
    });

    this.statuses = [
      { label: 'Active', value: true },
      { label: 'InActive', value: false },
    ];
  }

  loadProductsLazy(event: any) {
    this.loading = true;

    const page = (event.first ?? 0) / (event.rows ?? 10);
    const pageSize = event.rows ?? 10;

    this.sortField = event.sortField ?? '';
    this.sortOrder = event.sortOrder ?? 1;

    console.log('Page event===============:', event.filters);
    if (
      (event.filters.stock && event.filters.stock.length > 0) ||
      (event.filters.averageRating && event.filters.averageRating.length > 0)
    ) {
      this.productService.getFilterProducts({
        page: page,
        pageSize: pageSize,
        stock: event.filters.stock[0],
        averageRating: event.filters.averageRating[0],
      });
    } else {
      this.productService.getAllProducts({
        page,
        pageSize,
        search: this.searchTerm,
        sortField: this.sortField,
        sortDirection: this.sortOrder === 1 ? 'asc' : 'desc',
      });
    }
  }

  confirmDelete(event: Event, id: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },

      accept: () => {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Record deleted',
            });
            this.productService.getAllProducts({ page: 0, pageSize: 10 });
          },
          error: (error) => {
            console.error(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete record',
            });
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }

  formatCurrency(value: number) {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }

  onSearch() {
    if (this.searchKeyword.trim()) {
      this.productService.getAllProducts({
        page: 0,
        pageSize: 10,
        search: this.searchKeyword,
      });
    } else {
      this.productService.getAllProducts({ page: 0, pageSize: 10 });
    }
  }

  exportExcel(table: Table) {
    const flatData = table.value.map((product) => {
      const flatProduct = {
        id: product.id,
        name: product.name,
        shortDescription: product.shortDescription,
        price: product.price,
        originalPrice: product.originalPrice,
        brand: product.brand,
        type: product.type,
        stock: product.stock,
        averageRating: product.averageRating,
        totalReview: product.totalReview,
        imageUrls:
          product.imageUrls?.map((img: any) => img.imageUrl).join('; ') || '',
        variants:
          product.variants
            ?.map(
              (variant: any) =>
                `${variant.color}-${variant.size}(+${variant.additionalPrice})`
            )
            .join('; ') || '',
        categories:
          product.categories?.map((cat: any) => cat.name).join('; ') || '',
      };
      return flatProduct;
    });

    // Tạo sheet từ dữ liệu đã "flatten"
    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = {
      Sheets: { Products: worksheet },
      SheetNames: ['Products'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    FileSaver.saveAs(blob, 'products.xlsx');
  }

  clear(table: any) {
    table.clear();
    this.searchTerm = '';
    this.loadProductsLazy({
      first: 0,
      rows: 10,
      sortField: '',
      sortOrder: 1,
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getSeverity(active: boolean) {
    switch (active) {
      case true:
        return 'success';

      case false:
        return 'danger';

      default:
        return 'info';
    }
  }
}
