import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let isAdmin = false;
  const claims = authService.userInfo;
  if (claims) {
    const roles = claims.role || claims.roles;
    if (Array.isArray(roles)) {
      isAdmin = roles.includes('admin') || roles.includes('administrator');
    } else if (typeof roles === 'string') {
      isAdmin = roles === 'admin' || roles === 'administrator';
    }
  }
  if (!isAdmin) {
    router.navigate(['/access-denied']);
  }
  return isAdmin;
};
