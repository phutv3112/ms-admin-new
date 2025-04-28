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
import { ProgressSpinner } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { Dialog } from 'primeng/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Tooltip } from 'primeng/tooltip';
import { ProductTypeResponse } from '../../shared/models/catalog/product';
import { ProductService } from '../../core/service/product.service';
import { AuthService } from '../../core/service/auth.service';
import { LoadingService } from '../../core/service/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-types',
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
  ],
  templateUrl: './types.component.html',
  styleUrl: './types.component.scss',
})
export class TypesComponent implements OnInit {
  types: ProductTypeResponse[] = [];
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);

  userProfile: any = null;

  statuses: any[] = [];

  isLoading = false;
  totalRecords: number = 0;

  @ViewChild('filter') filter!: ElementRef;

  //loading
  loading$ = this.loadingService.loading$;
  private sub: Subscription;

  editVisible: boolean = false;
  createVisible: boolean = false;

  editType: ProductTypeResponse = {
    id: '',
    name: '',
    isActive: true,
    changedBy: '',
    createdDate: new Date(),
    updatedDate: new Date(),
    productCount: 0,
  };
  createType = {
    name: '',
  };

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.userProfile = this.authService.userInfo;

    this.sub = this.loading$.subscribe((value) => {
      this.isLoading = value;
    });
  }

  showEditTypeDialog(id: string) {
    this.productService.getTypeById(id).subscribe({
      next: (res) => {
        this.editType = res;
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
    this.productService.getAllTypes().subscribe((data) => {
      this.types = data;
      this.totalRecords = data.length;
    });

    this.statuses = [
      { label: 'Active', value: true },
      { label: 'InActive', value: false },
    ];
  }

  updateBrand() {
    this.isLoading = true;
    if (!this.editType.name || !this.userProfile?.userName) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill all required fields',
      });
      return;
    }
    this.productService
      .updateType(
        this.editType.id,
        this.editType.name,
        this.userProfile?.userName
      )
      .subscribe({
        next: () => {
          this.editVisible = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Brand updated successfully',
          });

          this.productService.getAllTypes().subscribe((data) => {
            this.types = data;
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

  createNewType() {
    this.isLoading = true;
    if (!this.createType.name || !this.userProfile?.userName) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill all required fields',
      });
      return;
    }

    this.productService
      .addNewType(this.createType.name, this.userProfile?.userName)
      .subscribe({
        next: () => {
          this.createVisible = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Brand create successfully',
          });

          this.productService.getAllTypes().subscribe((data) => {
            this.types = data;
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

  confirmDelete(event: Event, type: ProductTypeResponse) {
    var msg = 'Do you want to delete this record?';
    if (type.productCount > 0) {
      msg =
        'This type has products!<br>Are you sure you want to delete it and all its products?';
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
        this.productService.deleteType(type.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Record deleted',
            });
            this.productService.getAllTypes().subscribe((data) => {
              this.types = data;
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
