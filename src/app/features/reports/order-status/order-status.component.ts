import { Component, inject, OnInit } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DatePicker } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { ReportService } from '../../../core/service/report.service';
import { OrderStatusStat } from '../../../shared/models/reports/report';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RippleModule,
    TagModule,
    DatePicker,
    FormsModule,
    Select,
    ChartModule,
  ],
  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.scss',
})
export class OrderStatusComponent implements OnInit {
  private reportService = inject(ReportService);

  responsiveOptions: any[] | undefined;

  orderStatus: OrderStatusStat[] = [];

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

  chartData: any;
  chartOptions: any;

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
    this.getOrderStatus();
  }
  onDateChange() {
    this.getOrderStatus();
  }

  getOrderStatus() {
    if (this.date) {
      this.day = this.date.getDate();
      this.month = this.date.getMonth() + 1;
      this.year = this.date.getFullYear();
    }
    this.reportService
      .getOrderStatusStats(this.filterType, this.day, this.month, this.year)
      .subscribe({
        next: (result) => {
          const res = result as OrderStatusStat[];
          this.orderStatus = res.filter((s) => s.status !== 'Completed') ?? [];

          const labels = this.orderStatus.map((r) => r.status);
          const values = this.orderStatus.map((r) => r.count);

          this.chartData = {
            labels: labels,
            datasets: [
              {
                label: 'Order Quantity',
                backgroundColor: '#42A5F5',
                data: values,
              },
            ],
          };

          this.chartOptions = {
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: true,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          };
        },
        error: (err) => console.error(err),
      });
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Pending':
        return 'info';
      case 'PaymentReceived':
        return 'success';
      case 'PaymentFailed':
        return 'danger';
      case 'OutOfStock':
        return 'warn';
      case 'Refunded':
        return 'secondary';
      case 'Cancelled':
        return 'warn';
      default:
        return 'contrast';
    }
  }
}
