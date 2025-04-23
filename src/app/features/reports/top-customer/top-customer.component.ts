import { Component, inject, OnInit } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { DatePicker } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import {
  GetProductsResponse,
  GetTopCustomersResponse,
} from '../../../shared/models/reports/bestselling';
import { ReportService } from '../../../core/service/report.service';
@Component({
  selector: 'app-top-customer',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RippleModule,
    TagModule,
    RouterLink,
    DatePicker,
    FormsModule,
  ],
  templateUrl: './top-customer.component.html',
  styleUrl: './top-customer.component.scss',
})
export class TopCustomerComponent implements OnInit {
  private reportService = inject(ReportService);

  responsiveOptions: any[] | undefined;

  customers: any | undefined;

  date: Date | undefined;
  month: number | undefined;
  year: number | undefined;

  ngOnInit(): void {
    this.getBestSellingProducts();
  }
  onDateChange() {
    this.getBestSellingProducts();
  }

  getBestSellingProducts() {
    if (this.date) {
      this.month = this.date.getMonth() + 1;
      this.year = this.date.getFullYear();
    }
    this.reportService.getTopCustomers(0, 10, this.month, this.year).subscribe({
      next: (result) => {
        const res = result as GetTopCustomersResponse;
        this.customers = res?.customers?.data ?? [];
      },
      error: (err) => console.error(err),
    });
  }
}
