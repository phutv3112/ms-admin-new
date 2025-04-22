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
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { User } from '../../shared/models/users/user';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { UserService } from '../../core/service/user.service';
import { passwordValidator } from '../../shared/common/validator';

@Component({
  selector: 'app-users',
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
    ReactiveFormsModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  private userService = inject(UserService);

  onIconLock = 'pi pi-lock';

  @ViewChild('filter') filter!: ElementRef;

  createVisible: boolean = false;
  editVisible: boolean = false;

  roles: string[] = [];

  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.pattern(/^\+?[0-9]{9,15}$/)]],
      password: [
        '',
        [Validators.required, Validators.minLength(6), passwordValidator()],
      ],
      role: ['', Validators.required],
    });
  }

  get f() {
    return this.userForm.controls;
  }

  showCreateDialog() {
    this.createVisible = true;
  }
  showEditUserDialog(id: string) {}

  ngOnInit() {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
    });
    this.userService.getAllRoles().subscribe((data) => {
      data.filter((role) => {
        if (role.name !== 'admin') {
          this.roles.push(role.name);
        }
      });
    });
  }

  toggleLock(user: User) {
    const isLocked = user.isLocked;

    this.userService.toggleLock(user.id, isLocked).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: `User ${isLocked ? 'locked' : 'unlocked'} successfully`,
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to update user status',
        });

        // Rollback nếu gọi API lỗi
        user.isLocked = !isLocked;
      },
    });
  }
  confirmDelete(event: Event, user: User) {
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
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Record deleted',
            });
            this.userService.getAllUsers().subscribe((data) => {
              this.users = data;
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

  confirmLockUser(event: Event, user: User) {
    const isLocked = user.isLocked;
    let message = `Are you sure to ${
      isLocked ? 'locked' : 'unlocked'
    } this user?`;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: message,
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: isLocked ? 'Lock' : 'Unlock',
        severity: 'warn',
      },

      accept: () => {
        this.userService.toggleLock(user.id, isLocked).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Successfully updated user status',
            });
            this.userService.getAllUsers().subscribe((data) => {
              this.users = data;
            });
          },
          error: (error) => {
            console.error(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update user status',
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

  createUser() {
    if (this.userForm.invalid) return;
    const formValue = this.userForm.value;
    this.userService.createUser(formValue).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User created successfully',
        });
        this.userService.getAllUsers().subscribe((data) => {
          this.users = data;
        });
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create user',
        });
      },
      complete: () => {
        this.createVisible = false;
      },
    });
  }
  updateCategory() {
    // this.categoryService
    //   .updateCategory(
    //     this.selectedCategory.id,
    //     this.selectedCategory.name,
    //     this.selectedCategory.isActived
    //   )
    //   .subscribe({
    //     next: () => {
    //       this.messageService.add({
    //         severity: 'success',
    //         summary: 'Success',
    //         detail: 'Category updated successfully',
    //       });
    //       this.categoryService.getCategories().subscribe((data) => {
    //         this.categories = data;
    //       });
    //     },
    //     error: (error) => {
    //       console.error(error);
    //     },
    //     complete: () => {
    //       this.editVisible = false;
    //     },
    //   });
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
