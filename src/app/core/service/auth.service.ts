import { Injectable } from '@angular/core';
import { authConfig } from '../../../auth.config';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private oauthService: OAuthService, private router: Router) {}

  async configureAuth(): Promise<void> {
    this.oauthService.configure(authConfig);
    try {
      await this.oauthService.loadDiscoveryDocumentAndTryLogin();
      console.log('Discovery document loaded successfully');
    } catch (error) {
      this.router.navigate(['/errors']);
      console.error('Error loading discovery document', error);
    }
  }

  login(): void {
    this.oauthService.initLoginFlow();
  }

  logout(): void {
    this.oauthService.logOut();
  }

  get accessToken(): string | null {
    return this.oauthService.getAccessToken();
  }

  get refreshToken(): string | null {
    return this.oauthService.getRefreshToken();
  }

  get isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  get userInfo(): any {
    const claims = this.oauthService.getIdentityClaims();
    return claims ? claims : null;
  }

  get userName(): string {
    const claims = this.oauthService.getIdentityClaims();
    return claims ? claims['userName'] : '';
  }

  get email(): string {
    const claims = this.oauthService.getIdentityClaims();
    return claims ? claims['email'] : '';
  }
  get role(): string {
    const claims = this.oauthService.getIdentityClaims();
    return claims ? claims['role'] : '';
  }
}
