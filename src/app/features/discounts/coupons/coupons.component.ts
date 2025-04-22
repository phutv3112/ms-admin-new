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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Checkbox } from 'primeng/checkbox';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';
import { DiscountService } from '../../../core/service/discount.service';
import {
  Discount,
  DiscountCode,
  DiscountCodeDto,
} from '../../../shared/models/catalog/discount';

@Component({
  selector: 'app-coupons',
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
    Tooltip,
    RouterLink,
    FloatLabel,
    DatePickerModule,
    TextareaModule,
    ReactiveFormsModule,
  ],
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss',
})
export class CouponsComponent implements OnInit {
  @ViewChild('filter') filter!: ElementRef;
  statuses: any[] = [];
  discountTypes: any[] = [];
  discountCodes: DiscountCodeDto[] = [];

  private discountService = inject(DiscountService);

  ngOnInit() {
    this.discountService.getAllDiscountCodes().subscribe((data) => {
      this.discountCodes = data;
    });
    this.statuses = [
      { label: 'Active', value: true },
      { label: 'InActive', value: false },
    ];
    this.discountTypes = [
      { label: 'Percentage', value: 0 },
      { label: 'Fixed Amount', value: 1 },
    ];
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

  getStatus(discount: Discount): string {
    const now = new Date();
    const endDate = new Date(discount.endDate);

    if (endDate < now) {
      return 'expired';
    }

    return discount.isActive ? 'active' : 'inactive';
  }

  getSeverity(discount: Discount) {
    const status = this.getStatus(discount);
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warn';
      case 'expired':
        return 'danger';
      default:
        return 'info';
    }
  }
}
