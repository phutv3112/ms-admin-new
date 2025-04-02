import { Component } from '@angular/core';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {}
