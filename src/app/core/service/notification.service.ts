import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RefundRequestMessage } from '../../shared/models/hubs/refundMessage';
import { PaidOrderMessage } from '../../shared/models/hubs/paidOrderMessage';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  baseUrl = environment.orderUrl;
  private http = inject(HttpClient);

  getRefundRequestMessage(isRead?: boolean) {
    return this.http.get<RefundRequestMessage[]>(
      `${this.baseUrl}/orders/get-refund-request-messages?isRead=${isRead}`
    );
  }
  getPaidOrderMessage(isRead?: boolean) {
    return this.http.get<PaidOrderMessage[]>(
      `${this.baseUrl}/orders/get-paid-order-messages?isRead=${isRead}`
    );
  }
  readMessage(id: string) {
    return this.http.put<{ isSuccess: boolean }>(
      `${this.baseUrl}/orders/read-message/${id}`,
      {}
    );
  }
}
