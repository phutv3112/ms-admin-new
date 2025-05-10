import { Route } from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { notAllowUserGuard } from '../../core/guards/not-allow-user.guard';
import { storekeeperGuard } from '../../core/guards/storekeeper.guard';
import { InventoryHistoryComponent } from './inventory-history/inventory-history.component';

export const inventoryRoutes: Route[] = [
  {
    path: '',
    component: InventoryComponent,
    canActivate: [notAllowUserGuard, storekeeperGuard],
  },
  {
    path: 'history/:id',
    component: InventoryHistoryComponent,
    canActivate: [notAllowUserGuard, storekeeperGuard],
  },
];
