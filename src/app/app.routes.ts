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
    path: 'products',
    component: ProductsComponent,
    canActivate: [notAllowUserGuard],
  },
  {
    path: 'products/create',
    component: CreateProductComponent,
    canActivate: [notAllowUserGuard, merchandiserGuard],
  },
  {
    path: 'products/:id',
    component: EditProductComponent,
    canActivate: [notAllowUserGuard, merchandiserGuard],
  },
  {
    path: 'products/reviews/:id',
    component: ReviewProductComponent,
    canActivate: [notAllowUserGuard, merchandiserGuard],
  },

  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [notAllowUserGuard],
  },

  {
    path: 'inventories',
    component: InventoryComponent,
    canActivate: [notAllowUserGuard, storekeeperGuard],
  },
  {
    path: 'inventories/history/:id',
    component: InventoryHistoryComponent,
    canActivate: [notAllowUserGuard, storekeeperGuard],
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
    path: 'discounts',
    component: DiscountsComponent,
    canActivate: [notAllowUserGuard, marketerGuard],
  },
  {
    path: 'discounts/coupons',
    component: CouponsComponent,
    canActivate: [notAllowUserGuard, marketerGuard],
  },
  {
    path: 'discounts/:id',
    component: DiscountDetailsComponent,
    canActivate: [notAllowUserGuard, marketerGuard],
  },
  {
    path: 'discounts/coupon/create/:discountId',
    component: CreateCouponComponent,
    canActivate: [notAllowUserGuard, marketerGuard],
  },
  {
    path: 'discounts/coupon/edit/:id',
    component: EditCouponComponent,
    canActivate: [notAllowUserGuard, marketerGuard],
  },

  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [notAllowUserGuard],
  },
  {
    path: 'orders/details/:id',
    component: OrderDetailsComponent,
    canActivate: [notAllowUserGuard, analystGuard],
  },
  {
    path: 'orders/customer/:email',
    component: UserOrderComponent,
    canActivate: [notAllowUserGuard, analystGuard],
  },

  {
    path: 'users',
    component: UsersComponent,
    canActivate: [adminGuard],
  },

  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [adminGuard],
  },

  {
    path: 'reports/best-selling',
    component: BestSellingComponent,
    canActivate: [notAllowUserGuard, analystGuard],
  },
  {
    path: 'reports/top-rated',
    component: TopRatedComponent,
    canActivate: [notAllowUserGuard, analystGuard],
  },
  {
    path: 'reports/top-customers',
    component: TopCustomerComponent,
    canActivate: [notAllowUserGuard, analystGuard],
  },
];
