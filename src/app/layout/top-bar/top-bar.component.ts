import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '../configs/app.configurator';
import { LayoutService } from '../service/layout.service';
import { SplitButtonModule } from 'primeng/splitbutton';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    StyleClassModule,
    AppConfigurator,
    SplitButtonModule,
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
  items!: MenuItem[];

  constructor(public layoutService: LayoutService) {
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
          window.open('https://angular.io/', '_blank');
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
