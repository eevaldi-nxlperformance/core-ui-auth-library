import { createAction, props } from '@ngrx/store';
// import { AuthUser } from '../../models/auth-user.model';
import { LocalStorageModel } from '../../models/local-storage.model';

// login
export const Login = createAction('[Auth] Login');
export const LoginSuccess = createAction(
  '[Auth] Login Success',
  props<{ payload: {localStorage: LocalStorageModel} }>()
);
export const LoginFailure = createAction(
  '[Auth] Login Failure',
  props<{ payload: string }>()
);
// token - msal
export const AcquireTokenSilent = createAction('[Auth] AcquireTokenSilent');
export const AcquireTokenPopup = createAction('[Auth] AcquireTokenPopup');
// logout
export const Logout = createAction('[Auth] Logout');
export const LogoutSuccess = createAction(
  '[Auth] Logout Success',
  props<{ payload: LocalStorageModel }>()
);
export const LogoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ payload: string }>()
);
// check error code - for password reset
export const LogoutFailureErrorCheck = createAction(
  '[Auth] Logout Failure Error Check',
  props<{ payload: string }>()
);
// password reset
export const PasswordReset = createAction('[Auth] PasswordReset');
// export const PasswordResetSuccess = createAction(
//   '[Auth] PasswordReset Success', props<{payload: AuthUser}>()
// );
// export const PasswordResetFailure = createAction(
//   '[Auth] PasswordReset Failure',
//   props<{ payload: string }>()
// );

// ............. PLACEHOLDER
// set authenticated user state
export const SetAuthenticatedUser = createAction('[Auth] SetAuthenticatedUser',
  props<{ payload: boolean }>());
// set logged in user state
export const SetLoggedIn = createAction('[Auth] SetLoggedIn',
  props<{ payload: boolean }>());
// refresh auth state from local storage
export const RefreshAuthState = createAction('[Auth] RefreshAuthState');
export const RefreshAuthStateSuccess = createAction(
  '[Auth] RefreshAuthState Success',
  props<{ payload: LocalStorageModel }>()
);
export const RefreshAuthStateFailure = createAction(
  '[Auth] RefreshAuthState Failure',
  props<{ payload: string }>()
);
// // signin
// export const Signup = createAction('[Auth] Signin');
// // export const SignupSuccess = createAction(
// //   '[Auth] Signin Success', props<{payload: AuthUser}>()
// // );
// export const SignupFailure = createAction(
//   '[Auth] Signin Failure',
//   props<{ payload: string }>()
// );
// // password reset
// export const PasswordReset = createAction('[Auth] PasswordReset');
// // export const PasswordResetSuccess = createAction(
// //   '[Auth] PasswordReset Success', props<{payload: AuthUser}>()
// // );
// export const PasswordResetFailure = createAction(
//   '[Auth] PasswordReset Failure',
//   props<{ payload: string }>()
// );
