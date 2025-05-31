import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from '../menuitem/menuitem.component';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  model: MenuItem[] = [];
  private authService = inject(AuthService);

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
            label: 'Product',
            icon: 'pi pi-fw pi-box',
            items: [
              {
                label: 'Products',
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
            label: 'Category',
            icon: 'pi pi-fw pi-list',
            items: [
              {
                label: 'Categories',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/categories'],
              },
            ],
          },
          {
            label: 'Inventory',
            icon: 'pi pi-fw pi-warehouse',
            items: [
              {
                label: 'Inventories',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/inventories'],
              },
            ],
          },
          {
            label: 'Brand & Type',
            icon: 'pi pi-fw pi-slack',
            items: [
              {
                label: 'Brands',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/brands'],
              },
              {
                label: 'Types',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/types'],
              },
            ],
          },
          {
            label: 'Order',
            icon: 'pi pi-fw pi-shopping-cart',
            items: [
              {
                label: 'Orders',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/orders'],
              },
            ],
          },
          {
            label: 'Promotions',
            icon: 'pi pi-fw pi-dollar',
            items: [
              {
                label: 'Discounts',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/discounts'],
              },
              {
                label: 'Coupons',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/discounts/coupons'],
              },
            ],
          },
          {
            label: 'Users & Roles',
            icon: 'pi pi-fw pi-user-edit',
            items: [
              {
                label: 'Users',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/users'],
              },
              {
                label: 'Roles',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/roles'],
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
            label: 'Reports',
            icon: 'pi pi-fw pi-book',
            items: [
              {
                label: 'Best Selling Products',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/reports/best-selling'],
              },
              {
                label: 'Top Rated Products',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/reports/top-rated'],
              },
              {
                label: 'Top Customers',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/reports/top-customers'],
              },
              {
                label: 'Orders Stats',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/reports/orders-status'],
              },
              {
                label: 'Summary Stats',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/reports/summary-stats'],
              },
            ],
          },
          {
            label: 'Auth',
            icon: 'pi pi-fw pi-user',
            items: [
              {
                label: 'Logout',
                icon: 'pi pi-fw pi-sign-out',
                command: () => {
                  this.authService.logout();
                },
              },
            ],
          },
        ],
      },
    ];
  }
}
