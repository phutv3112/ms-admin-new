import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private authService = inject(AuthService);

  init(): Promise<void> {
    return this.authService.configureAuth().then(async () => {
      if (!this.authService.isAuthenticated) {
        console.warn('User is not authenticated. Redirecting to login...');
        return;
      }
    });
  }
}
