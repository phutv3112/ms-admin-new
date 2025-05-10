import { Component, inject, OnInit } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { DatePicker } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import {
  GetProductsResponse,
  GetTopCustomersResponse,
} from '../../../shared/models/reports/bestselling';
import { ReportService } from '../../../core/service/report.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

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
    Select,
  ],
  templateUrl: './top-customer.component.html',
  styleUrl: './top-customer.component.scss',
})
export class TopCustomerComponent implements OnInit {
  private reportService = inject(ReportService);

  responsiveOptions: any[] | undefined;

  customers: any | undefined;

  date: Date | undefined = new Date();

  day: number | undefined;
  month: number | undefined;
  year: number | undefined;

  filterType: 'date' | 'month' | 'year' = 'month';

  filterOptions = [
    { label: 'Day', value: 'date' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
  ];

  getDateFormat(): string {
    switch (this.filterType) {
      case 'month':
        return 'mm/yy';
      case 'year':
        return 'yy';
      case 'date':
        return 'dd/mm/yy';
      default:
        return 'dd/mm/yy';
    }
  }

  ngOnInit(): void {
    this.getTopCustomers();
  }
  onDateChange() {
    this.getTopCustomers();
  }

  getTopCustomers() {
    if (this.date) {
      this.day = this.date.getDate();
      this.month = this.date.getMonth() + 1;
      this.year = this.date.getFullYear();
    }
    this.reportService
      .getTopCustomers(0, 10, this.filterType, this.day, this.month, this.year)
      .subscribe({
        next: (result) => {
          const res = result as GetTopCustomersResponse;
          this.customers = res?.customers?.data ?? [];
        },
        error: (err) => console.error(err),
      });
  }

  exportExcel(table: Table) {
    const worksheet = XLSX.utils.json_to_sheet(table.value);
    const workbook = {
      Sheets: { TopCustomers: worksheet },
      SheetNames: ['TopCustomers'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    FileSaver.saveAs(blob, 'top-customers.xlsx');
  }
}
