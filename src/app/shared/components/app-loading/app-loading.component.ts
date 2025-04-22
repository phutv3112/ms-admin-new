import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Dialog } from 'primeng/dialog';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../../core/service/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [ProgressSpinner, Dialog],
  templateUrl: './app-loading.component.html',
  styleUrl: './app-loading.component.scss',
})
export class AppLoadingComponent implements OnInit, OnDestroy {
  isLoading = false;
  private sub!: Subscription;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.sub = this.loadingService.loading$.subscribe((value) => {
      this.isLoading = value;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
