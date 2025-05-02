import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const notAllowUserGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let isUser = false;
  const claims = authService.userInfo;
  if (claims) {
    const roles = claims.role || claims.roles;
    if (Array.isArray(roles)) {
      isUser = roles.includes('user');
    } else if (typeof roles === 'string') {
      isUser = roles === 'user';
    }
  }
  if (isUser) {
    router.navigate(['/access-denied']);
  }
  return !isUser;
};
