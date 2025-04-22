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
import {
  InventoryById,
  InventoryItem,
} from '../../shared/models/catalog/product';
import { ProductService } from '../../core/service/product.service';
import { AuthService } from '../../core/service/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inventory',
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
    RouterLink,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent implements OnInit {
  inventories: InventoryItem[] = [];

  private productService = inject(ProductService);
  private authService = inject(AuthService);

  userProfile: any = null;

  statuses: any[] = [];

  activityValues: number[] = [0, 100];

  loading: boolean = true;

  @ViewChild('filter') filter!: ElementRef;

  editVisible: boolean = false;
  selectedInventory: InventoryById = {
    inventoryId: '',
    quantity: 0,
  };
  editInventory = {
    inventoryId: '',
    oldQuantity: 0,
    newQuantity: 0,
    reason: '',
    userName: '',
  };

  reasonOptions = ['Restock', 'Inventory Adjustment', 'Damaged Items', 'Other'];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.userProfile = this.authService.userInfo;
  }

  showEditInventoryDialog(id: string) {
    this.productService.getInventoryById(id).subscribe({
      next: (res) => {
        this.selectedInventory = res.inventory;
        this.editVisible = true;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  ngOnInit() {
    this.productService.getInventories().subscribe((data) => {
      this.inventories = data.inventoryItems;
    });
    console.log(this.inventories);
    this.statuses = [
      { label: 'Active', value: true },
      { label: 'InActive', value: false },
    ];
  }

  updateInventory() {
    if (this.userProfile) {
      this.editInventory.inventoryId = this.selectedInventory.inventoryId;
      this.editInventory.oldQuantity = this.selectedInventory.quantity;
      this.editInventory.userName = this.userProfile.userName;
      this.productService.updateInventory(this.editInventory).subscribe({
        next: () => {
          this.editVisible = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Record updated',
          });
          this.productService.getInventories().subscribe((data) => {
            this.inventories = data.inventoryItems;
          });
        },
        error: (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update record',
          });
        },
      });
    }
  }

  showHistories(id: string) {}

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
