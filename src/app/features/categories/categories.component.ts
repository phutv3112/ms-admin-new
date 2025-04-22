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
import { Category } from '../../shared/models/catalog/category';
import { CategoryService } from '../../core/service/category.service';
import { Dialog } from 'primeng/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Checkbox } from 'primeng/checkbox';

@Component({
  selector: 'app-categories',
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
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];

  private categoryService = inject(CategoryService);

  statuses: any[] = [];

  activityValues: number[] = [0, 100];

  loading: boolean = true;

  @ViewChild('filter') filter!: ElementRef;

  visible: boolean = false;
  editVisible: boolean = false;
  selectedCategory: Category = {
    id: '',
    name: '',
    slug: '',
    productCount: 0,
    isActived: false,
    updatedDate: new Date(),
  };
  categoryName = '';

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  showDialog() {
    this.visible = true;
  }
  showEditCategoryDialog(id: string) {
    this.categoryService.getCategoryId(id).subscribe({
      next: (category) => {
        this.selectedCategory = category;
        this.editVisible = true;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });

    this.statuses = [
      { label: 'Active', value: true },
      { label: 'InActive', value: false },
    ];
  }

  confirmDelete(event: Event, category: Category) {
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
        this.categoryService.deleteCategory(category.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Record deleted',
            });
            this.categoryService.getCategories().subscribe((data) => {
              this.categories = data;
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

  createCategory() {
    if (!this.categoryName.trim()) return;
    this.categoryService.createCategory(this.categoryName).subscribe({
      next: (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Category created successfully',
        });
        this.categoryService.getCategories().subscribe((data) => {
          this.categories = data;
        });
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        this.categoryName = '';
        this.visible = false;
      },
    });
  }
  updateCategory() {
    this.categoryService
      .updateCategory(
        this.selectedCategory.id,
        this.selectedCategory.name,
        this.selectedCategory.isActived
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Category updated successfully',
          });
          this.categoryService.getCategories().subscribe((data) => {
            this.categories = data;
          });
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          this.editVisible = false;
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
