import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../core/service/user.service';
import { OrderService } from '../../../core/service/order.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/users/user';
import { Order } from '../../models/orders/order';
import { Table } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-account-profile',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    MultiSelectModule,
    SelectModule,
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    RouterModule,
    Tooltip,
  ],
  templateUrl: './account-profile.component.html',
  styleUrl: './account-profile.component.scss',
})
export class AccountProfileComponent implements OnInit {
  private userService = inject(UserService);
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);

  email: string = '';
  userProfile: User = {
    id: '',
    userName: '',
    fullName: 'Tran',
    email: 'phu@gmail.com',
    phoneNumber: '0969820123',
    role: 'user',
    address: {
      line1: '311 tran phu',
      line2: '',
      city: 'Ha Noi',
      state: 'Hanoi City',
      postalCode: '90000',
      country: 'VN',
    },
    isLocked: false,
  };
  userOrders: Order[] = [];
  totalOrders: number = 0;
  totalRevenue: number = 0;
  statuses!: any[];

  constructor() {
    this.route.params.subscribe((params) => {
      this.email = params['email'];
    });
  }
  ngOnInit(): void {
    this.loadUserProfile();
    this.loadUserOrders();

    this.statuses = [
      { label: 'PaymentReceived', value: 'PaymentReceived' },
      { label: 'Pending', value: 'Pending' },
      { label: 'Cancelled', value: 'Cancelled' },
      { label: 'PaymentFailed', value: 'PaymentFailed' },
      { label: 'Refunded', value: 'Refunded' },
    ];
  }

  loadUserProfile() {
    this.userService.getUserDetails(this.email).subscribe((data) => {
      this.userProfile = data;
    });
  }
  loadUserOrders() {
    this.orderService.getOrdersForUser(this.email).subscribe({
      next: (res) => {
        this.userOrders = res.orders;
        this.totalOrders = res.orders.length;
        this.totalRevenue = res.orders.reduce((total, order) => {
          if (order.status === 'PaymentReceived') {
            return total + order.total;
          }
          return total;
        }, 0);
      },
    });
  }

  clear(table: Table) {
    table.clear();
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getSeverity(
    status: string | null
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warn'
    | 'danger'
    | 'contrast'
    | undefined {
    if (status === 'PaymentReceived') {
      return 'success';
    } else if (status === 'Pending') {
      return 'info';
    } else if (status === 'PaymentFailed') {
      return 'danger';
    } else if (status === 'OutOfStock') {
      return 'contrast';
    } else if (status === 'Refunded') {
      return 'secondary';
    } else if (status === 'Cancelled') {
      return 'warn';
    }
    return undefined;
  }
}
