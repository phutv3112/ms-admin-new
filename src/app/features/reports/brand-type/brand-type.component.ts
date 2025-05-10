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
import {
  AggregatedProductStatsResult,
  OrderBrandTypeStat,
  OrderStatusStat,
} from '../../../shared/models/reports/report';
import { ChartModule } from 'primeng/chart';
import { CategoryService } from '../../../core/service/category.service';
import { map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-brand-type',
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
  templateUrl: './brand-type.component.html',
  styleUrl: './brand-type.component.scss',
})
export class BrandTypeComponent implements OnInit {
  private reportService = inject(ReportService);
  private categoryService = inject(CategoryService);

  resultStats: AggregatedProductStatsResult = {
    totalQuantity: 0,
    totalRevenue: 0,
    totalRefunded: 0,
  };

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

  brands: string[] = [];
  types: string[] = [];
  selectedBrand!: string;
  selectedType!: string;

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
    this.categoryService.getAllBrands().subscribe((data) => {
      this.brands = data.brands;
    });
    this.categoryService.getAllProductTypes().subscribe((data) => {
      this.types = data.types;
    });
    this.getBrandTypeStats();
  }
  onDateChange() {
    this.getBrandTypeStats();
  }

  getBrandTypeStats() {
    if (this.date) {
      this.day = this.date.getDate();
      this.month = this.date.getMonth() + 1;
      this.year = this.date.getFullYear();
    }

    this.reportService
      .getOrderBrandTypeStats(this.filterType, this.day, this.month, this.year)
      .pipe(
        switchMap((productStats: OrderBrandTypeStat[]) => {
          if (!productStats.length) {
            return of({
              totalQuantity: 0,
              totalRevenue: 0,
              totalRefunded: 0,
            });
          }

          return this.reportService.getCatalogBrandTypeStats(
            productStats,
            this.selectedBrand,
            this.selectedType
          );
        })
      )
      .subscribe((result: AggregatedProductStatsResult) => {
        this.resultStats = result;
      });
  }
}
