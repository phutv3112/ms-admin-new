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
import { MessageService, ConfirmationService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Router, RouterLink } from '@angular/router';
import { TextareaModule } from 'primeng/textarea';
import { Order, OrderItem } from '../../shared/models/orders/order';
import { OrderService } from '../../core/service/order.service';
import { PaymentService } from '../../core/service/payment.service';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-orders',
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
    RouterLink,
    DatePickerModule,
    TextareaModule,
    ReactiveFormsModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);

  statuses: any[] = [];
  paymentTypes: any[] = [];

  totalRecords: number = 0;

  @ViewChild('filter') filter!: ElementRef;

  visible: boolean = false;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.orderService.getAllOrders().subscribe((data) => {
      this.orders = data.orders;
      this.totalRecords = data.orders.length;
    });

    this.statuses = [
      { label: 'Pending', value: 'Pending' },
      { label: 'PaymentReceived', value: 'PaymentReceived' },
      { label: 'PaymentFailed', value: 'PaymentFailed' },
      { label: 'OutOfStock', value: 'OutOfStock' },
      { label: 'Refunded', value: 'Refunded' },
    ];
    this.paymentTypes = [
      { label: 'Cards', value: 0 },
      { label: 'VnPay', value: 1 },
    ];
  }

  confirmDelete(event: Event, order: Order) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure to refund this order?',
      header: 'Warning Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Refund',
        severity: 'warn',
      },

      accept: () => {
        if (order.payment.paymentType === 0) {
          this.refundStripe(order);
        }

        if (order.payment.paymentType === 1) {
          this.refundVnPay(order);
        }
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

  private refundStripe(order: Order) {
    this.paymentService
      .refundStripeOrder(order.payment.paymentIntentId)
      .pipe(
        switchMap((response) => {
          if (response.status === 'succeeded') {
            return this.orderService.refundedOrder(order.id);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Refund failed',
            });
            return EMPTY;
          }
        }),
        switchMap(() => this.orderService.getAllOrders()),
        tap((data) => {
          this.orders = data.orders;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Refunded successfully',
          });
        }),
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Something went wrong',
          });
          return EMPTY;
        })
      )
      .subscribe();
  }

  private refundVnPay(order: Order) {
    this.paymentService
      .refundVnPayOrder(order.payment.vnPayTransaction!)
      .pipe(
        switchMap((response) => {
          if (response.refundResponse.vnp_ResponseCode === '00') {
            return this.orderService.refundedOrder(order.id);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.refundResponse.vnp_Message,
            });
            return EMPTY;
          }
        }),
        switchMap(() => this.orderService.getAllOrders()),
        tap((data) => {
          this.orders = data.orders;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Refunded successfully',
          });
        }),
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Something went wrong',
          });
          return EMPTY;
        })
      )
      .subscribe();
  }

  exportExcel(table: Table) {
    // Flattening the order data
    const flatData = table.value.map((order) => {
      const flatOrder = {
        id: order.id,
        orderDate: order.orderDate,
        buyerEmail: order.buyerEmail,
        shippingAddress: `${order.shippingAddress.line1}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`,
        deliveryMethod: order.deliveryMethod,
        shippingPrice: order.shippingPrice,
        status: order.status,
        subtotal: order.subtotal,
        total: order.total,
        ipAddress: order.ipAddress,
        discount: order.discount,
        // Add orderItems as a string (or you can format it differently if needed)
        orderItems: order.orderItems
          .map(
            (item: OrderItem) =>
              `${item.productName} (Quantity: ${item.quantity}, Price: ${item.price})`
          )
          .join('; '),
      };
      return flatOrder;
    });

    // Tạo sheet từ dữ liệu đã "flatten"
    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = { Sheets: { Orders: worksheet }, SheetNames: ['Orders'] };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    FileSaver.saveAs(blob, 'orders.xlsx');
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

  getSeverity(order: Order) {
    const status = order.status;
    switch (status) {
      case 'Pending':
        return 'info';
      case 'PaymentReceived':
        return 'success';
      case 'PaymentFailed':
        return 'danger';
      case 'OutOfStock':
        return 'warn';
      case 'Refunded':
        return 'secondary';
      default:
        return 'contrast';
    }
  }
}
