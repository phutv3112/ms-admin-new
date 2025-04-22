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
import { InventoryHistoryResponse } from '../../../shared/models/catalog/product';
import { ProductService } from '../../../core/service/product.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-inventory-history',
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
    RouterLink,
  ],
  templateUrl: './inventory-history.component.html',
  styleUrl: './inventory-history.component.scss',
})
export class InventoryHistoryComponent implements OnInit {
  histories: InventoryHistoryResponse[] = [];

  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  inventoryId: string | null = null;

  @ViewChild('filter') filter!: ElementRef;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.inventoryId = params.get('id');
      if (this.inventoryId) {
        this.loadHistory(this.inventoryId);
      }
    });
  }

  loadHistory(id: string) {
    this.productService.getInventoryHistory(id).subscribe({
      next: (response) => {
        this.histories = response.histories;
        console.log(this.histories);
      },
      error: (error) => {
        console.error('Error loading inventory history', error);
      },
    });
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
