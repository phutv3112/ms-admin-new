import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FluidModule } from 'primeng/fluid';
import { debounceTime, map, of, Subscription, switchMap } from 'rxjs';
import { LayoutService } from '../../layout/service/layout.service';
import { RecentOrdersComponent } from './recent-orders/recent-orders.component';
import { ReportService } from '../../core/service/report.service';
import {
  MonthlySummary,
  ProductSalesRevenueByMonth,
} from '../../shared/models/reports/report';
import { UserService } from '../../core/service/user.service';
import { TopProductsComponent } from './top-products/top-products.component';
import {
  TopBrandTypeByMonth,
  TopItem,
} from '../../shared/models/reports/brand';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    FluidModule,
    RecentOrdersComponent,
    TopProductsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: any[] = [];
  monthlySummary!: MonthlySummary;
  countUser: number = 0;

  monthlySalesRevenueByMonth: ProductSalesRevenueByMonth[] = [];
  topBrandTypeByMonth: TopBrandTypeByMonth[] = [];
  brandsThisMonth: TopItem[] = [];
  typesThisMonth: TopItem[] = [];

  lineData: any;

  barData: any;

  pieDataBrand: any;
  pieDataType: any;

  lineOptions: any;

  barOptions: any;

  pieOptions: any;

  subscription: Subscription;
  constructor(
    private layoutService: LayoutService,
    private reportService: ReportService,
    private userService: UserService
  ) {
    this.subscription = this.layoutService.configUpdate$
      .pipe(debounceTime(25))
      .subscribe(() => {
        this.initCharts();
      });
  }

  ngOnInit() {
    this.getMonthlySummary();

    this.userService.countUserInRole('user').subscribe((data) => {
      this.countUser = data;
    });

    this.getMonthlySold();

    this.getTopBranTypeProducts();

    this.initCharts();
  }
  getMonthlySummary() {
    this.reportService.getMonthlySummary().subscribe((data) => {
      this.monthlySummary = data;
      this.stats = [
        {
          title: 'Orders',
          value: this.monthlySummary.currentOrderCount,
          previousValue: this.monthlySummary.previousOrderCount,
          growthPercentage: this.monthlySummary.orderGrowthPercentage,
          icon: 'pi pi-shopping-cart',
          iconColor: 'text-blue-500',
          iconBg: 'bg-blue-100',
        },
        {
          title: 'Revenue',
          value: this.monthlySummary.currentRevenue,
          previousValue: this.monthlySummary.previousRevenue,
          growthPercentage: this.monthlySummary.revenueGrowthPercentage,
          icon: 'pi pi-dollar',
          iconColor: 'text-orange-500',
          iconBg: 'bg-orange-100',
        },
        {
          title: 'Products Sold',
          value: this.monthlySummary.currentProductSold,
          previousValue: this.monthlySummary.previousProductSold,
          growthPercentage: this.monthlySummary.productSoldGrowthPercentage,
          icon: 'pi pi-box',
          iconColor: 'text-purple-500',
          iconBg: 'bg-purple-100',
        },
      ];
    });
  }
  getMonthlySold() {
    this.reportService.getMonthlySalesReport().subscribe((data) => {
      this.monthlySalesRevenueByMonth = data;
      this.lineData = {
        labels: this.monthlySalesRevenueByMonth.map(
          (item) => `${item.month}/${item.year}`
        ),
        datasets: [
          {
            label: 'Total Revenue',
            data: this.monthlySalesRevenueByMonth.map(
              (item) => item.totalRevenue
            ),
            fill: false,
            backgroundColor: '#4c51bf',
            borderColor: '#4c51bf',
            yAxisID: 'y',
            tension: 0.4,
          },
          {
            label: 'Total Quantity Sold',
            data: this.monthlySalesRevenueByMonth.map(
              (item) => item.totalQuantitySold
            ),
            fill: false,
            backgroundColor: '#a855f7',
            borderColor: '#a855f7',
            yAxisID: 'y1',
            tension: 0.4,
          },
        ],
      };
    });
  }

  getTopBranTypeProducts() {
    this.reportService
      .getMonthlySalesProducts()
      .pipe(
        map((response) => response ?? []),
        switchMap((bestSellingList) => {
          if (!bestSellingList.length) {
            return of([]);
          }
          return this.reportService.getSalesBrandType(bestSellingList);
        })
      )
      .subscribe({
        next: (result) => {
          const res = result as TopBrandTypeByMonth[];

          const data = res.map((item) => {
            const topBrand = item.brands.reduce((a, b) =>
              b.quantity > a.quantity ? b : a
            );
            const topType = item.types.reduce((a, b) =>
              b.quantity > a.quantity ? b : a
            );
            return {
              month: item.month,
              year: item.year,
              topBrand,
              topType,
            };
          });

          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1;
          const currentYear = currentDate.getFullYear();

          const currentMonthData = res.find(
            (item) => item.month === currentMonth && item.year === currentYear
          );

          if (currentMonthData) {
            this.brandsThisMonth = currentMonthData.brands;
            this.typesThisMonth = currentMonthData.types;
          } else {
            this.brandsThisMonth = [];
            this.typesThisMonth = [];
          }

          this.barData = {
            labels: data.map((item) => {
              const monthLabel = item.month.toString().padStart(2, '0');
              return `${monthLabel}/${item.year} (${item.topBrand.name} - ${item.topBrand.quantity} | ${item.topType.name} - ${item.topType.quantity})`;
            }),
            datasets: [
              {
                label: 'Top Brand Quantity',
                backgroundColor: '#4c51bf',
                borderColor: '#4c51bf',
                data: data.map((item) => item.topBrand.quantity),
              },
              {
                label: 'Top Type Quantity',
                backgroundColor: '#a855f7',
                borderColor: '#a855f7',
                data: data.map((item) => item.topType.quantity),
              },
            ],
          };

          this.pieDataBrand = {
            labels: this.brandsThisMonth.map((b) => b.name),
            datasets: [
              {
                data: this.brandsThisMonth.map((b) => b.quantity),
                backgroundColor: this.getDynamicColors(
                  this.brandsThisMonth.length,
                  ['#34d399', '#4c51bf', '#a855f7', '#fbbf24']
                ),
              },
            ],
          };
          this.pieDataType = {
            labels: this.typesThisMonth.map((b) => b.name),
            datasets: [
              {
                data: this.typesThisMonth.map((b) => b.quantity),
                backgroundColor: this.getDynamicColors(
                  this.typesThisMonth.length,
                  ['#34d399', '#4c51bf', '#a855f7', '#fbbf24']
                ),
              },
            ],
          };
        },
        error: (err) => console.error(err),
      });
  }

  getDynamicColors(count: number, baseColors: string[]): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  }

  initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.barData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Product sold',
          backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
          borderColor: documentStyle.getPropertyValue('--p-primary-500'),
          data: [65, 59, 80, 81, 56, 55, 40],
        },
        {
          label: 'Revenue',
          backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
          borderColor: documentStyle.getPropertyValue('--p-primary-200'),
          data: [28, 48, 40, 19, 86, 27, 90],
        },
      ],
    };

    this.barOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    const baseBgColors = [
      '--p-indigo-500',
      '--p-purple-500',
      '--p-teal-500',
      '--p-orange-500',
      '--p-pink-500',
      '--p-bluegray-500',
    ];

    const baseHoverColors = [
      '--p-indigo-400',
      '--p-purple-400',
      '--p-teal-400',
      '--p-orange-400',
      '--p-pink-400',
      '--p-bluegray-400',
    ];

    const bgColors = this.getDynamicColors(
      this.brandsThisMonth.length,
      baseBgColors.map((c) => documentStyle.getPropertyValue(c))
    );

    const hoverColors = this.getDynamicColors(
      this.brandsThisMonth.length,
      baseHoverColors.map((c) => documentStyle.getPropertyValue(c))
    );

    this.pieDataBrand = {
      labels: this.brandsThisMonth.map((b) => b.name),
      datasets: [
        {
          data: this.brandsThisMonth.map((b) => b.quantity),
          backgroundColor: bgColors,
          hoverBackgroundColor: hoverColors,
        },
      ],
    };

    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };

    this.lineOptions = {
      stacked: false,
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            drawOnChartArea: false,
            color: surfaceBorder,
          },
        },
      },
    };
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
