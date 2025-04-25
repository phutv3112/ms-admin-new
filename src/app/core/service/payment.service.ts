import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  RefundResponse,
  VnPayRefundModel,
  VnPayTransaction,
} from '../../shared/models/orders/order';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  baseUrl = environment.paymentUrl;
  private http = inject(HttpClient);
  vnPayRefundUrl =
    'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction';

  refundStripeOrder(paymentIntentId: string) {
    return this.http.post<{ status: string }>(
      `${this.baseUrl}/payments/stripe/refund/${paymentIntentId}`,
      {}
    );
  }
  getVnPayRefundModel(request: VnPayTransaction) {
    return this.http.post<{ refundModel: VnPayRefundModel }>(
      `${this.baseUrl}/payments/vnpay/refund-model`,
      { requestModel: request }
    );
  }
  refundVnPayOrder(request: VnPayTransaction) {
    return this.http.post<{ refundResponse: RefundResponse }>(
      `${this.baseUrl}/payments/vnpay/refunded`,
      { requestModel: request }
    );
  }
}
