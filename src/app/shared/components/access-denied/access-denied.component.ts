import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.scss',
})
export class AccessDeniedComponent {
  constructor(private authService: AuthService) {
    // This constructor is intentionally empty. The component does not require any dependencies or services.
  }
  logout() {
    this.authService.logout();
  }
}
