import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { FluidModule } from 'primeng/fluid';

interface Country {
  name: string;
  code: string;
}

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    SelectModule,
    FormsModule,
    TextareaModule,
    FluidModule,
    MultiSelectModule,
    InputNumber,
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
})
export class CreateProductComponent {
  dropdownItems = [
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' },
  ];

  dropdownItem = null;

  countries!: Country[];

  selectedCountries!: Country[];
  value1: number = 151351;
  constructor() {
    this.countries = [
      { name: 'Australia', code: 'AU' },
      { name: 'Brazil', code: 'BR' },
      { name: 'China', code: 'CN' },
      { name: 'Egypt', code: 'EG' },
      { name: 'France', code: 'FR' },
      { name: 'Germany', code: 'DE' },
      { name: 'India', code: 'IN' },
      { name: 'Japan', code: 'JP' },
      { name: 'Spain', code: 'ES' },
      { name: 'United States', code: 'US' },
    ];
  }
}
