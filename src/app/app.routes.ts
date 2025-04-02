import { Routes } from '@angular/router';
import { ProductsComponent } from './features/products/products.component';
import { CreateProductComponent } from './features/products/create-product/create-product.component';
import { CategoriesComponent } from './features/categories/categories.component';

export const routes: Routes = [
  { path: 'products', component: ProductsComponent },
  { path: 'products/create', component: CreateProductComponent },
  { path: 'categories', component: CategoriesComponent },
];
