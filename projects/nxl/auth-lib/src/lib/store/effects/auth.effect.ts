import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  filter,
  first,
  tap,
  take
} from 'rxjs/operators';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as authActions from '../actions/index';
import * as authServices from '../../services/index';
import * as Msal from 'msal';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  tenantConfig = {
    tenant: 'nxlseed.onmicrosoft.com',
    clientID: 'f6a0bc85-cdd2-4425-a5eb-bd24698c2c26',
    signInUpPolicy: 'B2C_1_signupsignin1',
    signUpPolicy: 'B2C_1_signupsignin1',
    passwordResetPolicy: 'B2C_1_PwdReset_1',
    redirectUri: 'http://localhost:4200',
    b2cScopes: [
      'https://nxlseed.onmicrosoft.com/test/demo.read',
      'https://nxlseed.onmicrosoft.com/test/demo.write' // ,
      // 'https://nxlseed.onmicrosoft.com/test/user_impersonation'
    ]
  };

  // B2C SignIn SignUp Policy Configuration
  clientApplication = new Msal.UserAgentApplication(
    this.tenantConfig.clientID,
    `https://login.microsoftonline.com/tfp/${this.tenantConfig.tenant}/${this.tenantConfig.signInUpPolicy}`,
    (errorDesc: any, token: any, error: any, tokenType: any) => {}
  );

  // B2C Password Reset Policy Configuration
  clientApplicationPasswordReset = new Msal.UserAgentApplication(
    this.tenantConfig.clientID,
    `https://login.microsoftonline.com/tfp/${this.tenantConfig.tenant}/${this.tenantConfig.passwordResetPolicy}`,
    (errorDesc: any, token: any, error: any, tokenType: any) => {}
  );

  constructor(
    private actions$: Actions,
    private msalService: authServices.MsalService,
    private tokenServices: authServices.TokenService,
    private router: Router
  ) {}

  // Login
  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.Login),
      switchMap(() =>
        this.msalService.loginPopup(this.clientApplication).pipe(
          map(() => authActions.AcquireTokenSilent()),
          catchError(error =>
            of(
              authActions.LoginFailure({ payload: error }),
              authActions.LogoutFailureErrorCheck({ payload: error })
            )
          )
        )
      )
    )
  );

  // check error code - true, if AADB2C90118
  errorCheck$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.LogoutFailureErrorCheck),
      switchMap(msg =>
        // check for AADB2C90118 - the password reset code
        this.msalService.checkErrorCode(msg.payload).pipe(
          map(reset => {
            if (reset) {
              return authActions.PasswordReset();
            } else {
              return authActions.LoginFailure({ payload: msg.payload });
            }
          }),
          catchError(error => of(authActions.LoginFailure({ payload: error })))
        )
      )
    )
  );

  // password reset
  authPasswordReset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.PasswordReset),
      switchMap(() =>
        this.msalService.loginPopup(this.clientApplicationPasswordReset).pipe(
          map(() => authActions.AcquireTokenSilent()),
          catchError(error => of(authActions.LoginFailure({ payload: error })))
        )
      )
    )
  );

  // AcquireTokenSilent -> LoginSuccess
  msalAuthAcquireTokenSilent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.AcquireTokenSilent),
      switchMap(() =>
        this.msalService.acquireTokenSilent(this.clientApplication).pipe(
          map(token =>
            authActions.LoginSuccess({
              payload: {
                localStorage: {
                  nxl_jwt_token: token,
                  nxl_tenant_id: this.tokenServices.getTenantId(
                    this.clientApplication.getUser().idToken
                  ),
                  nxl_user_id: this.tokenServices.getUserId(
                    this.clientApplication.getUser().idToken
                  )
                }
              }
            })
          ),
          tap(x => {
            this.msalService.saveAccessTokenValuesToCache(
              x.payload.localStorage.nxl_jwt_token,
              x.payload.localStorage.nxl_tenant_id,
              x.payload.localStorage.nxl_user_id
            );
          }),
          catchError(error => of(authActions.AcquireTokenPopup()))
        )
      )
    )
  );

  // AcquireTokenPopup -> LoginSuccess
  msalAuthAcquireTokenPopup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.AcquireTokenPopup),
      switchMap(() =>
        this.msalService.acquireTokenPopup(this.clientApplication).pipe(
          map(token =>
            authActions.LoginSuccess({
              payload: {
                localStorage: {
                  nxl_jwt_token: token,
                  nxl_tenant_id: this.tokenServices.getTenantId(
                    this.clientApplication.getUser().idToken
                  ),
                  nxl_user_id: this.tokenServices.getUserId(
                    this.clientApplication.getUser().idToken
                  )
                }
              }
            })
          ),
          tap(x => {
            // this.msalService.saveAccessTokenToCache(payload.payload.token);
            this.msalService.saveAccessTokenValuesToCache(
              x.payload.localStorage.nxl_jwt_token,
              x.payload.localStorage.nxl_tenant_id,
              x.payload.localStorage.nxl_user_id
            );
          }),
          catchError(error => of(authActions.LoginFailure({ payload: error })))
        )
      )
    )
  );

  // RefreshAuthState
  RefreshAuthState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.RefreshAuthState),
      switchMap(() =>
        this.tokenServices.getTokenValuesObservable().pipe(
          map(storage =>
            authActions.RefreshAuthStateSuccess({
              payload: {
                nxl_jwt_token: storage.nxl_jwt_token,
                nxl_tenant_id: storage.nxl_tenant_id,
                nxl_user_id: storage.nxl_user_id
              }
            })
          ),
          catchError(error =>
            of(authActions.RefreshAuthStateFailure({ payload: error }))
          )
        )
      )
    )
  );

  // Logout
  AuthLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.Logout),
      switchMap(() =>
        // reset local storage values
        this.tokenServices.logoutUser().pipe(
          map(() =>
            authActions.LogoutSuccess({
              payload: {
                nxl_jwt_token: null,
                nxl_tenant_id: null,
                nxl_user_id: null
              }
            })
          ),
          tap(x => {
            // nav to login
            this.router.navigate(['/login']);
          }),
          catchError(error => of(authActions.LogoutFailure({ payload: error })))
        )
      )
    )
  );
}
