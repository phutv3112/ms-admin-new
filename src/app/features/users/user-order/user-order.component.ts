import { Component, inject, OnInit } from '@angular/core';
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
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';
import { OrderService } from '../../../core/service/order.service';
import { Order } from '../../../shared/models/orders/order';

@Component({
  selector: 'app-user-order',
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
  templateUrl: './user-order.component.html',
  styleUrl: './user-order.component.scss',
})
export class UserOrderComponent implements OnInit {
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  orders: Order[] = [];

  statuses!: any[];

  loading: boolean = true;
  totalRecords: number = 0;

  activityValues: number[] = [0, 100];
  buyerEmail: string = '';
  constructor() {
    this.route.params.subscribe((params) => {
      this.buyerEmail = params['email'];
    });
  }

  ngOnInit() {
    this.orderService.getOrdersForUser(this.buyerEmail).subscribe({
      next: (res) => {
        this.orders = res.orders;
        this.totalRecords = res.orders.length;
      },
    });

    this.statuses = [
      { label: 'PaymentReceived', value: 'PaymentReceived' },
      { label: 'Pending', value: 'Pending' },
      { label: 'Cancelled', value: 'Cancelled' },
      { label: 'PaymentFailed', value: 'PaymentFailed' },
    ];
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
      return 'warn';
    } else if (status === 'Refunded') {
      return 'secondary';
    }
    return undefined;
  }
}
