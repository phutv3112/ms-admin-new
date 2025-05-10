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
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
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
import { FileUploadModule } from 'primeng/fileupload';
import { Tooltip } from 'primeng/tooltip';
import { BrandResponse } from '../../shared/models/catalog/product';
import { ProductService } from '../../core/service/product.service';
import { AuthService } from '../../core/service/auth.service';
import { RouterLink } from '@angular/router';
import { LoadingService } from '../../core/service/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-brands',
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
    Tooltip,
    FileUploadModule,
  ],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent implements OnInit {
  brands: BrandResponse[] = [];
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);

  userProfile: any = null;

  statuses: any[] = [];

  activityValues: number[] = [0, 100];

  isLoading = false;
  totalRecords = 0;

  brandUpdateForm: FormGroup;
  brandCreateForm: FormGroup;

  @ViewChild('filter') filter!: ElementRef;
  //loading
  loading$ = this.loadingService.loading$;
  private sub: Subscription;

  editVisible: boolean = false;
  createVisible: boolean = false;

  editBrand: BrandResponse = {
    id: '',
    name: '',
    imageUrl: '',
    isActive: true,
    changedBy: '',
    createdDate: new Date(),
    updatedDate: new Date(),
    productCount: 0,
  };
  createBrand = {
    name: '',
  };

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.userProfile = this.authService.userInfo;
    this.brandUpdateForm = this.fb.group({
      name: ['', Validators.required],
      isActive: [false, Validators.required],
      image: [],
    });
    this.brandCreateForm = this.fb.group({
      name: ['', Validators.required],
      image: [],
    });
    this.sub = this.loading$.subscribe((value) => {
      this.isLoading = value;
    });
  }
  onFileSelect(event: any) {
    const files: File[] = Array.from(event.files);
    if (files.length > 0) {
      this.brandUpdateForm.patchValue({
        image: files[0],
      });
    }
  }
  onCreateFileSelect(event: any) {
    const files: File[] = Array.from(event.files);
    if (files.length > 0) {
      this.brandCreateForm.patchValue({
        image: files[0],
      });
    }
  }

  showEditBrandDialog(id: string) {
    this.productService.getBrandById(id).subscribe({
      next: (res) => {
        this.editBrand = res;
        this.editVisible = true;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  showCreateDialog() {
    this.createVisible = true;
  }

  ngOnInit() {
    this.productService.getAllBrands().subscribe((data) => {
      this.brands = data;
      this.totalRecords = data.length;
    });

    this.statuses = [
      { label: 'Active', value: true },
      { label: 'InActive', value: false },
    ];
  }

  updateBrand() {
    this.isLoading = true;
    if (!this.editBrand.name || !this.userProfile?.userName) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill all required fields',
      });
      return;
    }

    const formData = new FormData();
    formData.append('Name', this.editBrand.name);
    formData.append('ChangedBy', this.userProfile.userName);
    formData.append('IsActive', this.editBrand.isActive.toString());

    const brandImage = this.brandUpdateForm.value.image;
    if (brandImage) {
      formData.append('Image', brandImage, brandImage.name);
    }

    this.productService.updateBrand(formData, this.editBrand.id).subscribe({
      next: () => {
        this.editVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Brand updated successfully',
        });

        this.productService.getAllBrands().subscribe((data) => {
          this.brands = data;
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update brand',
        });
        this.isLoading = false;
      },
    });
  }

  createNewBrand() {
    this.isLoading = true;
    if (!this.createBrand.name || !this.userProfile?.userName) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill all required fields',
      });
      return;
    }

    const formData = new FormData();
    formData.append('Name', this.createBrand.name);
    formData.append('ChangedBy', this.userProfile.userName);

    const brandImage = this.brandCreateForm.value.image;
    if (brandImage) {
      formData.append('Image', brandImage, brandImage.name);
    }

    this.productService.addNewBrand(formData).subscribe({
      next: () => {
        this.createVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Brand create successfully',
        });

        this.productService.getAllBrands().subscribe((data) => {
          this.brands = data;
        });
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update brand',
        });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this.brandCreateForm.reset();
      },
    });
  }

  confirmDelete(event: Event, brand: BrandResponse) {
    var msg = 'Do you want to delete this record?';
    if (brand.productCount > 0) {
      msg =
        'This brand has products!<br>Are you sure you want to delete it and all its products?';
    }
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: msg,
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
        this.productService.deleteBrand(brand.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Record deleted',
            });
            this.productService.getAllBrands().subscribe((data) => {
              this.brands = data;
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
