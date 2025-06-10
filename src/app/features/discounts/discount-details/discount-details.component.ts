import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { MessageService, ConfirmationService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Checkbox } from 'primeng/checkbox';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DiscountService } from '../../../core/service/discount.service';
import {
  Discount,
  DiscountCode,
} from '../../../shared/models/catalog/discount';
import { discountUpdateDateValidator } from '../../../shared/common/validator';
import { AuthService } from '../../../core/service/auth.service';
import { SafeUrlPipe } from '../../../shared/pipes/safe-url.pipe';
import { DialogModule } from 'primeng/dialog';

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
    Toast,
    ConfirmDialog,
    Checkbox,
    RouterLink,
    FloatLabel,
    DatePickerModule,
    TextareaModule,
    ReactiveFormsModule,
    FileUploadModule,
    SafeUrlPipe,
    DialogModule,
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

  // Add these properties to your component class
  uploadedFiles: File[] = [];
  fileError: string | null = null;
  displayImageDialog: boolean = false;
  uploading: boolean = false;

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

  loadDiscountDetails() {
    this.discountService.getDiscountById(this.id).subscribe({
      next: (data) => {
        this.discount = data;
        // Set form values with the fetched data
        this.discountForm.patchValue({
          name: this.discount.name,
          description: this.discount.description,
          startDate: new Date(this.discount.startDate),
          endDate: new Date(this.discount.endDate),
          isActive: this.discount.isActive,
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load discount details',
        });
        console.error('Error loading discount details:', error);
      },
    });
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

  // Add these methods to your component class
  openImageUploadDialog() {
    this.displayImageDialog = true;
    this.uploadedFiles = [];
    this.fileError = null;
  }

  closeImageDialog() {
    this.displayImageDialog = false;
    this.uploadedFiles = [];
    this.fileError = null;
  }

  onFileSelect(event: any) {
    const files = event.files;
    this.fileError = null;

    // Check file limit
    if (this.uploadedFiles.length + files.length > 5) {
      this.fileError = 'You can only upload up to 5 images';
      return;
    }

    // Add files to the list
    this.uploadedFiles = [...this.uploadedFiles, ...files];
  }

  removeFile(index: number) {
    this.uploadedFiles = this.uploadedFiles.filter((_, i) => i !== index);
  }

  uploadImages() {
    if (this.uploadedFiles.length === 0) return;

    this.uploading = true;

    this.discountService
      .updateDiscountImages(this.id, this.uploadedFiles)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Images uploaded successfully',
          });

          // Refresh discount data to show newly uploaded images
          this.loadDiscountDetails();

          this.uploading = false;
          this.closeImageDialog();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to upload images',
          });
          console.error('Error uploading images:', error);
          this.uploading = false;
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

  getStatus(discount: DiscountCode): string {
    const now = new Date();
    const endDate = new Date(discount.endDate);

    if (endDate < now) {
      return 'expired';
    }

    return discount.isActive ? 'active' : 'inactive';
  }

  getSeverity(discount: DiscountCode) {
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

  // Add these methods to your component class
  confirmClearImages() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete all images for this discount?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptButtonProps: {
        label: 'Yes',
        severity: 'danger',
      },
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        outlined: true,
      },
      accept: () => {
        this.clearAllImages();
      },
    });
  }

  clearAllImages() {
    this.discountService.clearDiscountImages(this.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'All images have been removed',
        });

        // Refresh discount data to update the UI
        this.loadDiscountDetails();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to remove images',
        });
        console.error('Error clearing images:', error);
      },
    });
  }
}
