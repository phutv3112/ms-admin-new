import {
  Directive,
  effect,
  inject,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthService } from '../../core/service/auth.service';

@Directive({
  selector: '[appIsAdmin]',
  standalone: true,
})
export class IsAdminDirective {
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);
  private authService = inject(AuthService);
  constructor() {
    effect(() => {
      let isAdmin = false;
      const claims = this.authService.userInfo;
      if (claims) {
        const roles = claims.role || claims.roles;
        if (Array.isArray(roles)) {
          isAdmin = roles.includes('admin') || roles.includes('administrator');
        } else if (typeof roles === 'string') {
          isAdmin = roles === 'admin' || roles === 'administrator';
        }
      }
      if (isAdmin) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    });
  }
}
