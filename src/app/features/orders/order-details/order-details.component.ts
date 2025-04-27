import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Tag } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../core/service/order.service';
import { Order } from '../../../shared/models/orders/order';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PaymentService } from '../../../core/service/payment.service';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';

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
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
})
export class OrderDetailsComponent implements OnInit {
  id: string = '';

  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  order: Order | null = null;

  parsedPayment: any;

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

  getStatusSeverity(status: string) {
    switch (status) {
      case 'PaymentReceived':
        return 'success';
      case 'PaymentFailed':
        return 'danger';
      case 'Pending':
        return 'warn';
      default:
        return 'info';
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
}
