import { createSelector } from '@ngrx/store';
import { getAuthState, AuthState } from '../reducers';
import * as tokenService from '../../services/token.service';
// import * as jwt from '@auth0/angular-jwt';
import * as tokenFunctions from '../../functions';

// gets tenantId
export const getTenantId = createSelector(
  getAuthState,
  x => {
    return x.auth.storageValues ? x.auth.storageValues.nxl_tenant_id : null;
  }
);

// gets userId
export const getUserId = createSelector(
  getAuthState,
  x => {
    return x.auth.storageValues ? x.auth.storageValues.nxl_user_id : null;
  }
);

const getFunctions = () => tokenFunctions;

// validate token
export const validateToken = createSelector(
  getAuthState,
  x => {
    return x.auth ?
    x.auth.storageValues ?
    // validate from store -> not expires of false then true for being valid
    !getFunctions().isTokenExpired(x.auth.storageValues.nxl_jwt_token)
    :
    // validate from local storage -> not expires of false then true for being valid
    !getFunctions().isTokenExpired() ? true : false : false
  ;
  }
);

// gets isAuthenticatedUser
export const getIsAuthenticedUser = (state: AuthState) =>
  state.auth.isAuthenticatedUser;

// gets isLoggedIn
export const getIsLoggedIn = (state: AuthState) => state.auth.isLoggedIn;

// gets errorMessage
export const getErrorMessage = (state: AuthState) => state.auth.errorMessage;
