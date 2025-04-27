import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { RefundRequestMessage } from '../../shared/models/hubs/refundMessage';
import { PaidOrderMessage } from '../../shared/models/hubs/paidOrderMessage';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private refundHubUrl = environment.refundHubUrl;
  private paymentReceivedHubUrl = environment.paymentReceivedHubUrl;

  private hubConnectionRefund!: signalR.HubConnection;
  private hubConnectionPaymentReceived!: signalR.HubConnection;

  private refundRequestSubject =
    new BehaviorSubject<RefundRequestMessage | null>(null);
  refundRequest$ = this.refundRequestSubject.asObservable();

  private paymentReceivedSubject = new BehaviorSubject<PaidOrderMessage | null>(
    null
  );
  paymentReceived$ = this.paymentReceivedSubject.asObservable();

  async startRefundConnection(roomName: string) {
    this.hubConnectionRefund = new signalR.HubConnectionBuilder()
      .withUrl(this.refundHubUrl)
      .withAutomaticReconnect()
      .build();

    this.hubConnectionRefund.on(
      'RequestRefundMessage',
      (message: RefundRequestMessage) => {
        console.log('📩 Received Payment URL:', message);
        this.refundRequestSubject.next(message);
      }
    );

    try {
      await this.hubConnectionRefund.start();
      console.log('✅ Connected to Refund Hub');
      await this.hubConnectionRefund.invoke('JoinRefundOrderGroup', roomName);
    } catch (err) {
      console.error('❌ Refund Hub Connection Error:', err);
    }
  }

  async waitForRefundConnectionReady(): Promise<void> {
    while (
      this.hubConnectionRefund.state !== signalR.HubConnectionState.Connected
    ) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  async startPaidOrderConnection(roomName: string) {
    this.hubConnectionPaymentReceived = new signalR.HubConnectionBuilder()
      .withUrl(this.paymentReceivedHubUrl)
      .withAutomaticReconnect()
      .build();

    this.hubConnectionPaymentReceived.on(
      'PaymentReceivedMessage',
      (message: PaidOrderMessage) => {
        console.log('📩 Received Payment URL:', message);
        this.paymentReceivedSubject.next(message);
      }
    );

    try {
      await this.hubConnectionPaymentReceived.start();
      console.log('✅ Connected to Payment Received Hub');
      await this.hubConnectionPaymentReceived.invoke(
        'JoinPaymentReceivedGroup',
        roomName
      );
    } catch (err) {
      console.error('❌ Payment Received Hub Connection Error:', err);
    }
  }

  async waitForPaidOrderConnectionReady(): Promise<void> {
    while (
      this.hubConnectionPaymentReceived.state !==
      signalR.HubConnectionState.Connected
    ) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  stopRefundConnection(roomName: string) {
    if (this.hubConnectionRefund) {
      this.hubConnectionRefund.invoke('LeaveRefundOrderGroup', roomName);
      this.hubConnectionRefund.stop();
    }
  }

  stopPaymentReceivedConnection(roomName: string) {
    if (this.hubConnectionPaymentReceived) {
      this.hubConnectionPaymentReceived.invoke(
        'LeavePaymentReceivedGroup',
        roomName
      );
      this.hubConnectionPaymentReceived.stop();
    }
  }
}
