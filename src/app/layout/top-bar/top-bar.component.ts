import { Component, inject, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '../configs/app.configurator';
import { LayoutService } from '../service/layout.service';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AuthService } from '../../core/service/auth.service';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { SignalrService } from '../../core/service/signalr.service';
import { filter, firstValueFrom } from 'rxjs';
import { RefundRequestMessage } from '../../shared/models/hubs/refundMessage';
import { NotificationService } from '../../core/service/notification.service';
import { PaidOrderMessage } from '../../shared/models/hubs/paidOrderMessage';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    StyleClassModule,
    AppConfigurator,
    SplitButtonModule,
    DrawerModule,
    OverlayBadgeModule,
    ButtonModule,
    RouterLink,
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent implements OnInit {
  items!: MenuItem[];

  private signalrService = inject(SignalrService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  refundMessages: RefundRequestMessage[] = [];
  paidOrderMessages: PaidOrderMessage[] = [];
  badgeCount: number = 0;
  showNotification: boolean = false;

  userProfile: any = null;

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.items = [
      {
        label: 'Update',
        icon: 'pi pi-refresh',
        command: () => {
          // this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-times',
        command: () => {
          // this.messageService.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
        },
      },
      {
        separator: true,
      },
      {
        label: 'Quit',
        icon: 'pi pi-power-off',
        command: () => {
          this.authService.logout();
        },
      },
    ];

    this.userProfile = this.authService.userInfo;

    this.notificationService
      .getRefundRequestMessage(false)
      .subscribe((data) => {
        this.refundMessages = data;
      });

    this.notificationService.getPaidOrderMessage(false).subscribe((data) => {
      this.paidOrderMessages = data;
    });
  }

  async ngOnInit(): Promise<void> {
    await this.receiveRefundNotification();
    await this.receivePaidOrderNotification();
  }

  async receiveRefundNotification() {
    console.log('🚀 Starting connection...');
    await this.signalrService.startRefundConnection('Administrator');
    await this.signalrService.waitForRefundConnectionReady();

    console.log('✅ SignalR ready. Waiting for message...');

    this.signalrService.refundRequest$
      .pipe(filter((m): m is RefundRequestMessage => !!m))
      .subscribe((refundMessage) => {
        this.messageService.add({
          severity: 'info',
          summary: 'New message',
          detail: 'New refund request message',
        });
        this.notificationService
          .getRefundRequestMessage(false)
          .subscribe((data) => {
            this.refundMessages = data;
          });
      });
  }

  async receivePaidOrderNotification() {
    console.log('🚀 Starting connection...');
    await this.signalrService.startPaidOrderConnection('Administrator');
    await this.signalrService.waitForPaidOrderConnectionReady();

    console.log('✅ SignalR ready. Waiting for message...');

    this.signalrService.paymentReceived$
      .pipe(filter((m): m is PaidOrderMessage => !!m))
      .subscribe((msg) => {
        this.messageService.add({
          severity: 'info',
          summary: 'New message',
          detail: 'New order has been paid',
        });
        this.notificationService
          .getPaidOrderMessage(false)
          .subscribe((data) => {
            this.paidOrderMessages = data;
          });
      });
  }

  get unreadCount(): number {
    if (this.refundMessages && this.paidOrderMessages) {
      this.badgeCount =
        this.refundMessages.filter((m) => !m.isRead).length +
        this.paidOrderMessages.filter((m) => !m.isRead).length;
    }
    return this.badgeCount;
  }

  markAsRead(message: any) {
    if (!message.isRead) {
      this.notificationService.readMessage(message.id).subscribe((res) => {
        if (res.isSuccess) {
          this.badgeCount = Math.max(0, this.badgeCount - 1);

          this.notificationService
            .getPaidOrderMessage(false)
            .subscribe((data) => {
              this.paidOrderMessages = data;
            });
          this.notificationService
            .getRefundRequestMessage(false)
            .subscribe((data) => {
              this.refundMessages = data;
            });
        }
      });
    }
  }

  seeDetails(message: any) {
    this.showNotification = false;
    this.router.navigate(['/orders/details', message.orderId]);
    this.markAsRead(message);
  }

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({
      ...state,
      darkTheme: !state.darkTheme,
    }));
  }
}
