import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Tag } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/service/order.service';
import { Order } from '../../../shared/models/orders/order';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PaymentService } from '../../../core/service/payment.service';
import {
  catchError,
  EMPTY,
  interval,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    Tag,
    PanelModule,
    TableModule,
    ConfirmDialog,
    ToastModule,
    ButtonModule,
    RouterLink,
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  id: string = '';

  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  order: Order | null = null;

  parsedPayment: any;

  showCancelButton = true;
  private subscription!: Subscription;
  minutes = 10;
  seconds = 0;

  constructor(
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id')!;
    });
  }

  ngOnInit(): void {
    if (this.id) {
      this.orderService.getDiscountById(this.id).subscribe((data) => {
        this.order = data.order;
        if (this.isJson(this.order.payment.paymentDetails)) {
          this.parsedPayment = JSON.parse(this.order.payment.paymentDetails);
        }
        if (this.order.status === 'PaymentReceived') {
          this.showCancelButton = true;
          this.startCountdown(this.order);
        }
      });
    }
  }

  confirmRefund(event: Event, order: Order) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure to refund this order?',
      header: 'Warning Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Reject',
      rejectButtonProps: {
        label: 'Reject',
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
        this.paymentService
          .sendMailRefund(order.buyerEmail, true)
          .subscribe((data) => {
            if (data.isSuccess) {
              this.messageService.add({
                severity: 'success',
                summary: 'Rejected',
                detail: 'You have rejected a refund request',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Rejected',
                detail: 'Reject fail',
              });
            }
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
            this.paymentService
              .sendMailRefund(order.buyerEmail, false)
              .subscribe();
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
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Refunded successfully',
          });
          this.router.navigate(['/orders']);
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
            this.paymentService
              .sendMailRefund(order.buyerEmail, false)
              .subscribe();
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
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Refunded successfully',
          });
          this.router.navigate(['/orders']);
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

  startCountdown(order: Order) {
    const orderDate = new Date(order.orderDate).getTime();
    const now = Date.now();
    const timePassed = Math.floor((now - orderDate) / 1000); // giây đã trôi qua
    let timeLeft = 600 - timePassed;

    if (timeLeft <= 0) {
      this.showCancelButton = false;
      return;
    }

    this.updateTime(timeLeft);

    this.subscription = interval(1000).subscribe(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        this.showCancelButton = false;
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
      } else {
        this.updateTime(timeLeft);
      }
    });
  }

  updateTime(timeLeft: number) {
    this.minutes = Math.floor(timeLeft / 60);
    this.seconds = timeLeft % 60;
  }

  getStatusSeverity(status: string) {
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
      case 'Cancelled':
        return 'warn';
      default:
        return 'contrast';
    }
  }

  getPaymentTypeLabel(type: number): string {
    switch (type) {
      case 0:
        return 'Card';
      case 1:
        return 'VnPay';
      default:
        return 'Unknown';
    }
  }

  isJson(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
