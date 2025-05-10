import { Route } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { notAllowUserGuard } from '../../core/guards/not-allow-user.guard';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { analystGuard } from '../../core/guards/analyst.guard';
import { UserOrderComponent } from '../users/user-order/user-order.component';

export const orderRoutes: Route[] = [
  {
    path: '',
    component: OrdersComponent,
    canActivate: [notAllowUserGuard],
  },
  {
    path: 'details/:id',
    component: OrderDetailsComponent,
    canActivate: [notAllowUserGuard, analystGuard],
  },
  {
    path: 'customer/:email',
    component: UserOrderComponent,
    canActivate: [notAllowUserGuard, analystGuard],
  },
];
