import { Route } from '@angular/router';
import { ProductsComponent } from './products.component';
import { notAllowUserGuard } from '../../core/guards/not-allow-user.guard';
import { CreateProductComponent } from './create-product/create-product.component';
import { merchandiserGuard } from '../../core/guards/merchandiser.guard';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ReviewProductComponent } from './review-product/review-product.component';

export const productRoutes: Route[] = [
  {
    path: '',
    component: ProductsComponent,
    canActivate: [notAllowUserGuard],
  },
  {
    path: 'create',
    component: CreateProductComponent,
    canActivate: [notAllowUserGuard, merchandiserGuard],
  },
  {
    path: ':id',
    component: EditProductComponent,
    canActivate: [notAllowUserGuard, merchandiserGuard],
  },
  {
    path: 'reviews/:id',
    component: ReviewProductComponent,
    canActivate: [notAllowUserGuard, merchandiserGuard],
  },
];
