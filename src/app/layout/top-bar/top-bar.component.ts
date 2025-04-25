import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '../configs/app.configurator';
import { LayoutService } from '../service/layout.service';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AuthService } from '../../core/service/auth.service';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';

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
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
  items!: MenuItem[];

  showNotification: boolean = false;

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService
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
  }

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({
      ...state,
      darkTheme: !state.darkTheme,
    }));
  }
}
