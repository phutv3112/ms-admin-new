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

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'auth-callback', component: AuthCallbackComponent },

  { path: 'not-found', component: NotFoundPageComponent },
  { path: 'errors', component: ErrorServerPageComponent },

  { path: 'products', component: ProductsComponent },
  { path: 'products/create', component: CreateProductComponent },
  { path: 'products/:id', component: EditProductComponent },
  { path: 'products/reviews/:id', component: ReviewProductComponent },

  { path: 'categories', component: CategoriesComponent },

  { path: 'inventories', component: InventoryComponent },
  { path: 'inventories/history/:id', component: InventoryHistoryComponent },

  { path: 'brands', component: BrandsComponent },
  { path: 'types', component: TypesComponent },

  { path: 'discounts', component: DiscountsComponent },
  { path: 'discounts/coupons', component: CouponsComponent },
  { path: 'discounts/:id', component: DiscountDetailsComponent },
  {
    path: 'discounts/coupon/create/:discountId',
    component: CreateCouponComponent,
  },
  {
    path: 'discounts/coupon/edit/:id',
    component: EditCouponComponent,
  },

  {
    path: 'orders',
    component: OrdersComponent,
  },
  {
    path: 'orders/details/:id',
    component: OrderDetailsComponent,
  },

  {
    path: 'users',
    component: UsersComponent,
  },

  {
    path: 'roles',
    component: RolesComponent,
  },
];
