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
import { Category } from '../../shared/models/catalog/category';
import { DatePickerModule } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Checkbox } from 'primeng/checkbox';
import { Discount } from '../../shared/models/catalog/discount';
import { DiscountService } from '../../core/service/discount.service';
import { RouterLink } from '@angular/router';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/service/auth.service';
import { discountDateValidator } from '../../shared/common/validator';

@Component({
  selector: 'app-discounts',
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
    Dialog,
    Toast,
    ConfirmDialog,
    Checkbox,
    RouterLink,
    FloatLabel,
    DatePickerModule,
    TextareaModule,
    ReactiveFormsModule,
  ],
  templateUrl: './discounts.component.html',
  styleUrl: './discounts.component.scss',
})
export class DiscountsComponent implements OnInit {
  discounts: Discount[] = [];

  private discountService = inject(DiscountService);
  private authService = inject(AuthService);

  userProfile: any = null;

  statuses: any[] = [];

  loading: boolean = true;
  totalRecords = 0;

  @ViewChild('filter') filter!: ElementRef;

  visible: boolean = false;

  discountForm!: FormGroup;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.userProfile = this.authService.userInfo;
  }

  showCreateDialog() {
    this.visible = true;
  }

  ngOnInit() {
    this.discountService.getAllDiscounts().subscribe((data) => {
      this.discounts = data;
      this.totalRecords = data.length;
    });

    this.discountForm = this.fb.group(
      {
        name: ['', Validators.required],
        description: [''],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        isActive: [false],
      },
      { validators: discountDateValidator() }
    );

    this.statuses = [
      { label: 'Active', value: true },
      { label: 'InActive', value: false },
      { label: 'Expired', value: 'expired' },
    ];
  }

  createDiscount() {
    if (this.discountForm.invalid) return;
    if (this.userProfile) {
      const formValue = this.discountForm.value;
      const request = {
        ...formValue,
        startDate: new Date(formValue.startDate).toISOString(),
        endDate: new Date(formValue.endDate).toISOString(),
        createdBy: this.userProfile.userName,
      };

      this.discountService.createDiscount(request).subscribe({
        next: (data) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Discount created successfully',
          });
          this.discountService.getAllDiscounts().subscribe((data) => {
            this.discounts = data;
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'danger',
            summary: 'Failed',
            detail: err.error.detail,
          });
        },
        complete: () => {
          this.visible = false;
          this.discountForm.reset();
        },
      });
    }
  }

  get f() {
    return this.discountForm.controls;
  }

  confirmDelete(event: Event, discount: Discount) {
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
        this.discountService.deleteDiscount(discount.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Record deleted',
            });
            this.discountService.getAllDiscounts().subscribe((data) => {
              this.discounts = data;
            });
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
