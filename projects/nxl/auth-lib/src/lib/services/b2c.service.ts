import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import * as Msal from 'msal';
import { Observable, of, from } from 'rxjs';

// npm install @azure/msal-angular --save
// wrapper library to authenticate users in AD, tied to B2C scopes

/*
The reason you're unable to refresh the token is that the Microsoft Authentication Library for JavaScript (MSAL.js)
only supports the OAuth Implicit Grant.

OAuth Implicit Grants, by design, do not support/return a Refresh Token:
*/

@Injectable()
export class MsalService {
  constructor(private router: Router, @Inject('env') private env) {
    console.log('defaults', this.env);
  }
  b2cScopes = this.env.defaults.tenantConfig.b2cScopes;
  passwordResetErrorCode = this.env.defaults.tenantConfig.passwordResetErrorCode;


  loginPopup(clientApp: Msal.UserAgentApplication) {
    return from(clientApp.loginPopup(this.b2cScopes));
  }

  acquireTokenSilent(clientApp: Msal.UserAgentApplication) {
    return from(clientApp.acquireTokenSilent(this.b2cScopes));
  }

  acquireTokenPopup(clientApp: Msal.UserAgentApplication) {
    return from(clientApp.acquireTokenPopup(this.b2cScopes));
  }

  checkErrorCode(error: string): Observable<boolean> {
    console.log('error: ', error);
    // password reset error code:
    if (error.indexOf(this.passwordResetErrorCode) > -1) {
      return of(true);
    } else {
      return of(false);
    }
  }

  public saveAccessTokenValuesToCache(
    accessToken: string,
    tenantId: string,
    userId: string
  ): void {
    localStorage.setItem('nxl_jwt_token', accessToken);
    localStorage.setItem('nxl_tenant_id', tenantId);
    localStorage.setItem('nxl_user_id', userId);
    // temporary routing
    this.router.navigate(['/']);
  }


  // public signup(): Observable<any> {
  //   return of(this.authenticate(this.clientApplication));
  // }

  // redirectPasswordReset() {
  //   this.authenticate(this.clientApplicationPasswordReset);
  // }

  //  // B2C SignIn SignUp Policy Configuration
  //  clientApplication = new Msal.UserAgentApplication(
  //   this.tenantConfig.clientID,
  //   `https://login.microsoftonline.com/tfp/${this.tenantConfig.tenant}/${this.tenantConfig.signInUpPolicy}`,
  //   (errorDesc: any, token: any, error: any, tokenType: any) => {}
  // );

  // // B2C Password Reset Policy Configuration
  // clientApplicationPasswordReset = new Msal.UserAgentApplication(
  //   this.tenantConfig.clientID,
  //   `https://login.microsoftonline.com/tfp/${this.tenantConfig.tenant}/${this.tenantConfig.passwordResetPolicy}`,
  //   (errorDesc: any, token: any, error: any, tokenType: any) => {}
  // );

  // public authenticate(clientApp: Msal.UserAgentApplication): Observable<any> {
  //   // tslint:disable-next-line:variable-name
  //   const _this = this;
  //   clientApp.loginPopup(this.tenantConfig.b2cScopes).then(
  //     (idToken: any) => {
  //       clientApp.acquireTokenSilent(_this.tenantConfig.b2cScopes).then(
  //         (accessToken: any) => {
  //           _this.saveAccessTokenToCache(accessToken);
  //           return of(accessToken);
  //         },
  //         (error: any) => {
  //           clientApp.acquireTokenPopup(_this.tenantConfig.b2cScopes).then(
  //             (accessToken: any) => {
  //               _this.saveAccessTokenToCache(accessToken);
  //               return of(accessToken);
  //             },
  //             // tslint:disable-next-line: no-shadowed-variable
  //             (error: any) => {
  //               console.log('error: ', error);
  //               return of(error);
  //             }
  //           );
  //         }
  //       );
  //     },
  //     (error: any) => {
  //       console.log('error: ', error);
  //       // password reset error code:
  //       if (error.indexOf('AADB2C90118') > -1) {
  //         _this.redirectPasswordReset();
  //       }
  //       return of(error);
  //     }
  //   );
  //   return of(false);
  // }

  // public saveAccessTokenToCache(accessToken: string): void {
  //   localStorage.setItem('nxl_jwt_token', accessToken);
  //   // temporary routing
  //   this.router.navigate(['/']);
  // }
}
