import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss',
})
export class AuthCallbackComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}
  async ngOnInit() {
    try {
      if (this.authService.isAuthenticated) {
        this.router.navigateByUrl('/dashboard');
      }
    } catch (error) {
      console.error('Lỗi khi load user profile:', error);
    }
  }
}
