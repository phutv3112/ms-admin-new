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
import { Dialog } from 'primeng/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Tooltip } from 'primeng/tooltip';

import { ActivatedRoute, RouterLink } from '@angular/router';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ProductHistory } from '../../../shared/models/catalog/product';
import { ProductService } from '../../../core/service/product.service';

@Component({
  selector: 'app-product-history',
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
  templateUrl: './product-history.component.html',
  styleUrl: './product-history.component.scss',
})
export class ProductHistoryComponent implements OnInit {
  histories: ProductHistory[] = [];

  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  productId: string | null = null;

  statuses: any[] = [];

  totalRecords = 0;

  @ViewChild('filter') filter!: ElementRef;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id');
      if (this.productId) {
        this.loadHistory(this.productId);
      }
    });

    this.statuses = [
      { label: 'Active', value: true },
      { label: 'InActive', value: false },
    ];
  }

  loadHistory(id: string) {
    this.productService.getProductHistory(id).subscribe({
      next: (response) => {
        this.histories = response.histories;
        this.totalRecords = response.histories.length;
      },
      error: (error) => {
        console.error('Error loading product history', error);
      },
    });
  }

  exportExcel(table: Table) {
    const worksheet = XLSX.utils.json_to_sheet(table.value);
    const workbook = {
      Sheets: { ProductHistory: worksheet },
      SheetNames: ['ProductHistory'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    FileSaver.saveAs(blob, 'ProductHistory.xlsx');
  }

  formatCurrency(value: number) {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
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
