import { Routes } from '@angular/router';
import { ProductsComponent } from './features/products/products.component';
import { CreateProductComponent } from './features/products/create-product/create-product.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { EditProductComponent } from './features/products/edit-product/edit-product.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthCallbackComponent } from './features/auth-callback/auth-callback.component';
import { InventoryComponent } from './features/inventory/inventory.component';
import { InventoryHistoryComponent } from './features/inventory/inventory-history/inventory-history.component';
import { BrandsComponent } from './features/brands/brands.component';
import { TypesComponent } from './features/types/types.component';
import { DiscountsComponent } from './features/discounts/discounts.component';
import { NotFoundPageComponent } from './shared/components/not-found-page/not-found-page.component';
import { ErrorServerPageComponent } from './shared/components/error-server-page/error-server-page.component';
import { DiscountDetailsComponent } from './features/discounts/discount-details/discount-details.component';
import { CreateCouponComponent } from './features/discounts/create-coupon/create-coupon.component';
import { EditCouponComponent } from './features/discounts/edit-coupon/edit-coupon.component';
import { OrdersComponent } from './features/orders/orders.component';
import { OrderDetailsComponent } from './features/orders/order-details/order-details.component';
import { ReviewProductComponent } from './features/products/review-product/review-product.component';
import { CouponsComponent } from './features/discounts/coupons/coupons.component';
import { UsersComponent } from './features/users/users.component';
import { RolesComponent } from './features/roles/roles.component';
import { BestSellingComponent } from './features/reports/best-selling/best-selling.component';
import { TopRatedComponent } from './features/reports/top-rated/top-rated.component';
import { TopCustomerComponent } from './features/reports/top-customer/top-customer.component';
import { adminGuard } from './core/guards/admin.guard';
import { AccessDeniedComponent } from './shared/components/access-denied/access-denied.component';
import { notAllowUserGuard } from './core/guards/not-allow-user.guard';
import { UserOrderComponent } from './features/users/user-order/user-order.component';
import { merchandiserGuard } from './core/guards/merchandiser.guard';
import { storekeeperGuard } from './core/guards/storekeeper.guard';
import { marketerGuard } from './core/guards/marketer.guard';
import { analystGuard } from './core/guards/analyst.guard';
import { AccountProfileComponent } from './shared/components/account-profile/account-profile.component';
import { OrderStatusComponent } from './features/reports/order-status/order-status.component';
import { BrandTypeComponent } from './features/reports/brand-type/brand-type.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [notAllowUserGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [notAllowUserGuard],
  },
  { path: 'auth-callback', component: AuthCallbackComponent },

  { path: 'not-found', component: NotFoundPageComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'errors', component: ErrorServerPageComponent },

  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [notAllowUserGuard],
  },

  {
    path: 'brands',
    component: BrandsComponent,
    canActivate: [notAllowUserGuard, merchandiserGuard],
  },
  {
    path: 'types',
    component: TypesComponent,
    canActivate: [notAllowUserGuard, merchandiserGuard],
  },

  {
    path: 'users',
    component: UsersComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'users/details/:email',
    component: AccountProfileComponent,
    canActivate: [notAllowUserGuard, analystGuard],
  },

  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [adminGuard],
  },

  {
    path: 'products',
    loadChildren: () =>
      import('./features/products/route').then((r) => r.productRoutes),
  },

  {
    path: 'inventories',
    loadChildren: () =>
      import('./features/inventory/route').then((r) => r.inventoryRoutes),
  },

  {
    path: 'discounts',
    loadChildren: () =>
      import('./features/discounts/route').then((r) => r.discountRoutes),
  },

  {
    path: 'orders',
    loadChildren: () =>
      import('./features/orders/route').then((r) => r.orderRoutes),
  },

  {
    path: 'reports',
    loadChildren: () =>
      import('./features/reports/route').then((r) => r.reportRoutes),
  },
];
