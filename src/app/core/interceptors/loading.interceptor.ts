import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { timeout, catchError, finalize, throwError, TimeoutError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { LoadingService } from '../service/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const messageService = inject(MessageService);

  const DEFAULT_TIMEOUT = 10000; // 10s

  loadingService.setLoading(true);

  return next(req).pipe(
    timeout(DEFAULT_TIMEOUT),
    catchError((error) => {
      if (error instanceof TimeoutError) {
        messageService.add({
          severity: 'error',
          summary: 'Timeout',
          detail: 'Request took too long. Please try again.',
        });
      }
      return throwError(() => error);
    }),
    finalize(() => {
      loadingService.setLoading(false);
    })
  );
};
