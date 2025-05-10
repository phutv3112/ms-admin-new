import { Route } from '@angular/router';
import { DiscountsComponent } from './discounts.component';
import { notAllowUserGuard } from '../../core/guards/not-allow-user.guard';
import { marketerGuard } from '../../core/guards/marketer.guard';
import { CouponsComponent } from './coupons/coupons.component';
import { DiscountDetailsComponent } from './discount-details/discount-details.component';
import { CreateCouponComponent } from './create-coupon/create-coupon.component';
import { EditCouponComponent } from './edit-coupon/edit-coupon.component';

export const discountRoutes: Route[] = [
  {
    path: '',
    component: DiscountsComponent,
    canActivate: [notAllowUserGuard, marketerGuard],
  },
  {
    path: 'coupons',
    component: CouponsComponent,
    canActivate: [notAllowUserGuard, marketerGuard],
  },
  {
    path: ':id',
    component: DiscountDetailsComponent,
    canActivate: [notAllowUserGuard, marketerGuard],
  },
  {
    path: 'coupon/create/:discountId',
    component: CreateCouponComponent,
    canActivate: [notAllowUserGuard, marketerGuard],
  },
  {
    path: 'coupon/edit/:id',
    component: EditCouponComponent,
    canActivate: [notAllowUserGuard, marketerGuard],
  },
];
