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

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  getImageFromUrl(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // giúp load từ public
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  removeVietnameseTones(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }
  async exportOrderToPdf() {
    const doc = new jsPDF();
    doc.setFont('times', 'normal');
    const order = this.order;
    const marginLeft = 14;
    let y = 20;

    // Logo
    const logoUrl = '/images/ms-logo-no-bg.png';
    try {
      const logoBase64 = await this.getImageFromUrl(logoUrl);
      doc.addImage(logoBase64, 'PNG', marginLeft, y, 30, 15);
    } catch (error) {}

    // Tiêu đề hóa đơn
    doc.setFontSize(18);
    doc.text(this.removeVietnameseTones('ORDER INVOICE'), 105, y + 10, {
      align: 'center',
    });
    y += 25;

    if (order) {
      // Thông tin đơn hàng & địa chỉ giao hàng
      autoTable(doc, {
        startY: y,
        body: [
          ['Order ID:', order.id],
          ['Order Date:', new Date(order.orderDate).toLocaleString('vi-VN')],
          ['Status:', order.status],
          ['Buyer Email:', order.buyerEmail],
          [
            'Shipping Name:',
            this.removeVietnameseTones(order.shippingAddress.name),
          ],
          [
            'Shipping Address:',
            this.removeVietnameseTones(
              `${order.shippingAddress.line1}, ${order.shippingAddress.city}, ${order.shippingAddress.state}`
            ),
          ],
          ['Postal/Zip:', order.shippingAddress.postalCode],
          ['Country:', order.shippingAddress.country],
        ],
        theme: 'plain',
        styles: { fontSize: 11, cellPadding: 2 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 50 },
          1: { cellWidth: 120 },
        },
        tableLineWidth: 0.2,
        tableLineColor: 200,
      });

      y = (doc as any).lastAutoTable.finalY + 6;

      // Bảng sản phẩm
      const itemRows = order.orderItems.map((item) => {
        let variantText = '';
        try {
          const variant =
            typeof item.variant === 'string'
              ? JSON.parse(item.variant)
              : item.variant;
          variantText = `${variant.color || ''} / Size ${variant.size || ''}`;
        } catch {
          variantText = item.variant || '';
        }
        return [
          this.removeVietnameseTones(item.productName),
          variantText,
          item.quantity.toString(),
          item.price.toLocaleString('vi-VN'),
          (item.price * item.quantity).toLocaleString('vi-VN'),
        ];
      });

      autoTable(doc, {
        startY: y,
        head: [['Product', 'Variant', 'Quantity', 'Price', 'Total']],
        body: itemRows,
        styles: { fontSize: 11, cellPadding: 2 },
        headStyles: { fillColor: [76, 81, 191], textColor: 255 },
        columnStyles: {
          0: { cellWidth: 72, halign: 'left' },
          1: { cellWidth: 35, halign: 'center' },
          2: { cellWidth: 25, halign: 'center' },
          3: { cellWidth: 25, halign: 'right' },
          4: { cellWidth: 25, halign: 'right' },
        },
        theme: 'grid',
      });

      // Sau khi autoTable bảng sản phẩm xong:
      y = (doc as any).lastAutoTable.finalY + 10;
      const rightX = marginLeft + 72 + 35 + 25 + 25 + 25; // = 184

      doc.setFont('times', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);

      doc.text(
        `Subtotal: ${order.subtotal.toLocaleString('vi-VN')} VND`,
        rightX,
        y,
        { align: 'right' }
      );
      y += 7;
      doc.text(
        `Shipping: ${order.shippingPrice.toLocaleString('vi-VN')} VND`,
        rightX,
        y,
        { align: 'right' }
      );
      y += 9;
      doc.setFontSize(14);
      doc.text(`Total: ${order.total.toLocaleString('vi-VN')} VND`, rightX, y, {
        align: 'right',
      });

      y += 12;

      doc.setTextColor(60, 60, 60);
      doc.setFontSize(12);
      doc.text('Thank you for your order!', 130, y, { align: 'right' });

      doc.save(`Order_${order.id}.pdf`);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
