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
  fixedMaxDiscountValidator,
  percentageMaxDiscountValidator,
  perUserLimitDiscountValidator,
} from '../../../shared/common/validator';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-create-coupon',
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
  templateUrl: './create-coupon.component.html',
  styleUrl: './create-coupon.component.scss',
})
export class CreateCouponComponent implements OnInit {
  codeForm!: FormGroup;
  userProfile: any = null;
  discountId: string = '';

  discountTypes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private discountService: DiscountService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.route.paramMap.subscribe((params) => {
      this.discountId = params.get('discountId')!;
    });
    this.userProfile = this.authService.userInfo;
    this.codeForm = this.fb.group(
      {
        code: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(12),
            Validators.pattern(/^[a-zA-Z0-9]+$/),
          ],
        ],
        type: [null, Validators.required],
        value: [null, [Validators.required, Validators.min(1)]],
        usageLimit: [1, Validators.min(1)],
        perUserLimit: [1, Validators.min(1)],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        minSubtotal: [0],
        maxDiscountAmount: [0],
        isActive: [false],
      },
      {
        validators: [discountDateValidator(), perUserLimitDiscountValidator()],
      }
    );
  }

  get f() {
    return this.codeForm.controls;
  }

  ngOnInit() {
    this.discountTypes = [
      { label: 'Percentage', value: 0 },
      { label: 'Fixed Amount', value: 1 },
    ];
    this.codeForm.get('type')!.valueChanges.subscribe((type) => {
      const maxDiscount = this.codeForm.get('maxDiscountAmount');
      const value = this.codeForm.get('value');
      if (type === 0) {
        maxDiscount!.enable();
        value!.setValidators([Validators.required, Validators.max(100)]);
      } else {
        maxDiscount!.disable();
        value!.clearValidators();
      }
      value!.updateValueAndValidity();
    });
  }

  generateCode(length: number = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(
      { length },
      () => characters[Math.floor(Math.random() * characters.length)]
    ).join('');
  }

  generateCodeAndSet(): void {
    const code = this.generateCode();
    this.codeForm.get('code')?.setValue(code);
  }

  createDiscountCode() {
    if (this.codeForm.invalid) return;
    if (this.userProfile) {
      const formValue = this.codeForm.value;
      const request = {
        ...formValue,
        startDate: new Date(formValue.startDate).toISOString(),
        endDate: new Date(formValue.endDate).toISOString(),
        createdBy: this.userProfile.userName,
        discountId: this.discountId,
      };

      this.discountService.createDiscountCode(request).subscribe({
        next: (data) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Discount code created successfully',
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
          this.codeForm.reset();
          this.router.navigateByUrl('/discounts/' + this.discountId);
        },
      });
    }
  }
}
