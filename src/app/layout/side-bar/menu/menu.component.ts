import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from '../menuitem/menuitem.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  model: MenuItem[] = [];

  ngOnInit() {
    this.model = [
      {
        label: 'Home',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
        ],
      },
      {
        label: 'Catalog',
        items: [
          {
            label: 'Products',
            icon: 'pi pi-fw pi-box',
            items: [
              {
                label: 'List Product',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/products'],
              },
              {
                label: 'Create Product',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/products/create'],
              },
            ],
          },
          {
            label: 'Categories',
            icon: 'pi pi-fw pi-list',
            items: [
              {
                label: 'List Category',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/categories'],
              },
              {
                label: 'Create Category',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/categories/create'],
              },
            ],
          },
          {
            label: 'Inventory',
            icon: 'pi pi-fw pi-warehouse',
            items: [
              {
                label: 'List Category',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/categories'],
              },
              {
                label: 'Create Category',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/categories/create'],
              },
            ],
          },
        ],
      },
      {
        label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        routerLink: ['/pages'],
        items: [
          {
            label: 'Landing',
            icon: 'pi pi-fw pi-globe',
            routerLink: ['/landing'],
          },
          {
            label: 'Auth',
            icon: 'pi pi-fw pi-user',
            items: [
              {
                label: 'Login',
                icon: 'pi pi-fw pi-sign-in',
                routerLink: ['/auth/login'],
              },
              {
                label: 'Error',
                icon: 'pi pi-fw pi-times-circle',
                routerLink: ['/auth/error'],
              },
              {
                label: 'Access Denied',
                icon: 'pi pi-fw pi-lock',
                routerLink: ['/auth/access'],
              },
            ],
          },
          {
            label: 'Crud',
            icon: 'pi pi-fw pi-pencil',
            routerLink: ['/pages/crud'],
          },
          {
            label: 'Not Found',
            icon: 'pi pi-fw pi-exclamation-circle',
            routerLink: ['/pages/notfound'],
          },
          {
            label: 'Empty',
            icon: 'pi pi-fw pi-circle-off',
            routerLink: ['/pages/empty'],
          },
        ],
      },
    ];
  }
}
