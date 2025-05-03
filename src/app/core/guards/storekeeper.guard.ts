import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const storekeeperGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let isAllowed = false;
  const claims = authService.userInfo;
  if (claims) {
    const roles = claims.role || claims.roles;
    if (Array.isArray(roles)) {
      isAllowed = roles.includes('storekeeper') || roles.includes('admin');
    } else if (typeof roles === 'string') {
      isAllowed = roles === 'storekeeper' || roles === 'admin';
    }
  }
  if (!isAllowed) {
    router.navigate(['/access-denied']);
  }
  return isAllowed;
};
