import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from './environments/environment';

export const authConfig: AuthConfig = {
  issuer: environment.identityServerUrl,
  redirectUri: window.location.origin + '/auth-callback',
  postLogoutRedirectUri: window.location.origin,
  clientId: 'mseadmin',
  responseType: 'code',
  scope: 'openid profile roleBase offline_access IdentityServerApi',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
};
