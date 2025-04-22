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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DiscountService } from '../../../core/service/discount.service';
import {
  Discount,
  DiscountCode,
} from '../../../shared/models/catalog/discount';
import {
  discountDateValidator,
  discountUpdateDateValidator,
} from '../../../shared/common/validator';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-discount-details',
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
  templateUrl: './discount-details.component.html',
  styleUrl: './discount-details.component.scss',
})
export class DiscountDetailsComponent implements OnInit {
  discountForm!: FormGroup;

  discount!: Discount;
  @ViewChild('filter') filter!: ElementRef;
  id: string = '';
  userProfile: any = null;

  statuses: any[] = [];
  discountTypes: any[] = [];
  discountCodes: DiscountCode[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private discountService: DiscountService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.discountForm = this.fb.group(
      {
        name: ['', Validators.required],
        description: [''],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        isActive: [false],
      },
      { validators: discountUpdateDateValidator() }
    );
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id')!;
    });
    this.userProfile = this.authService.userInfo;
  }

  get f() {
    return this.discountForm.controls;
  }

  ngOnInit() {
    if (this.id) {
      this.discountService.getDiscountById(this.id).subscribe((data) => {
        this.discount = data;
        this.discountForm.patchValue({
          name: data.name,
          description: data.description,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          isActive: data.isActive,
        });
      });
      this.discountService
        .getDiscountCodesByDiscountId(this.id)
        .subscribe((data) => {
          this.discountCodes = data;
        });
    }
    this.statuses = [
      { label: 'Active', value: true },
      { label: 'InActive', value: false },
    ];
    this.discountTypes = [
      { label: 'Percentage', value: 0 },
      { label: 'Fixed Amount', value: 1 },
    ];
  }

  updateDiscount() {
    if (this.discountForm.invalid) return;
    if (this.userProfile) {
      var request = {
        name: this.discountForm.value.name,
        description: this.discountForm.value.description,
        startDate: this.discountForm.value.startDate,
        endDate: this.discountForm.value.endDate,
        isActive: this.discountForm.value.isActive,
        updatedBy: this.userProfile?.userName,
      };
      this.discountService.updateDiscount(this.id, request).subscribe({
        next: (data) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Discount updated successfully',
          });
          this.router.navigate(['/discounts']);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'danger',
            summary: 'Failed',
            detail: err.error.detail,
          });
        },
        complete: () => {
          this.discountForm.reset();
        },
      });
    }
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
  confirmDelete(event: Event, code: DiscountCode) {
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
        this.discountService.deleteDiscountCode(code.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Record deleted',
            });
            this.discountService
              .getDiscountCodesByDiscountId(this.id)
              .subscribe((data) => {
                this.discountCodes = data;
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
}
