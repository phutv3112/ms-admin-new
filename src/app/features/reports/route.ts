import { Route } from '@angular/router';
import { BestSellingComponent } from './best-selling/best-selling.component';
import { notAllowUserGuard } from '../../core/guards/not-allow-user.guard';
import { analystGuard } from '../../core/guards/analyst.guard';
import { TopRatedComponent } from './top-rated/top-rated.component';
import { TopCustomerComponent } from './top-customer/top-customer.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { BrandTypeComponent } from './brand-type/brand-type.component';

export const reportRoutes: Route[] = [
  {
    path: 'best-selling',
    component: BestSellingComponent,
    canActivate: [notAllowUserGuard, analystGuard],
  },
  {
    path: 'top-rated',
    component: TopRatedComponent,
    canActivate: [notAllowUserGuard, analystGuard],
  },
  {
    path: 'top-customers',
    component: TopCustomerComponent,
    canActivate: [notAllowUserGuard, analystGuard],
  },
  {
    path: 'orders-status',
    component: OrderStatusComponent,
    canActivate: [notAllowUserGuard, analystGuard],
  },
  {
    path: 'summary-stats',
    component: BrandTypeComponent,
    canActivate: [notAllowUserGuard, analystGuard],
  },
];
