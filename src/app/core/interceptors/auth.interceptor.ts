import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { catchError, from, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const oauthService = inject(OAuthService);
  const accessToken = oauthService.getAccessToken();
  const refreshToken = oauthService.getRefreshToken();
  const expiresAt = oauthService.getAccessTokenExpiration();
  const currentTime = new Date().getTime();

  // nếu là yêu cầu token thì không vào interceptor này
  if (req.url.includes('/connect/token')) {
    return next(req);
  }
  if (!oauthService.discoveryDocumentLoaded) {
    console.warn('Discovery Document has been loaded, do refresh token.');
    return next(req);
  }

  if (accessToken && currentTime > expiresAt && refreshToken) {
    return from(oauthService.refreshToken()).pipe(
      switchMap(() => {
        const newToken = oauthService.getAccessToken();
        if (!newToken) {
          console.error(
            'New access token is missing after refresh. Logging out...'
          );
          oauthService.logOut(false);
          window.location.href = '/';
          return throwError(() => new Error('New access token is missing'));
        }

        const clonedRequest = req.clone({
          setHeaders: { Authorization: `Bearer ${newToken}` },
        });
        return next(clonedRequest);
      }),
      catchError((refreshError) => {
        console.error('Refresh Token failed', refreshError);
        oauthService.logOut(false);
        return throwError(() => refreshError);
      })
    );
  }

  // Nếu token vẫn còn hạn, cứ gửi request bình thường
  if (accessToken) {
    const clonedRequest = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
    return next(clonedRequest);
  }
  return next(req);
};
