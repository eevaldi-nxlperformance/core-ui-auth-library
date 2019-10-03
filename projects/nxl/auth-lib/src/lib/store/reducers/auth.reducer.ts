import { Action, createReducer, on, State } from '@ngrx/store';
// import { AuthUser } from '../../models/auth-user.model';
import * as fromActions from '../actions/index';
import { LocalStorageModel } from '../../models/local-storage.model';

export const elementFeatureKey = 'auth';

export interface AuthenticationState {
  storageValues: LocalStorageModel;
  isAuthenticatedUser: boolean;
  isLoggedIn: boolean;
  errorMessage: string;
}

export const initialState: AuthenticationState = {
  storageValues: null,
  isAuthenticatedUser: false,
  isLoggedIn: false,
  errorMessage: null
};

const authReducer = createReducer(
  initialState,
  on(fromActions.Login, state => ({ ...state })),
  on(fromActions.LoginSuccess, (state, { payload }) => ({
    ...state,
    storageValues: payload.localStorage,
    isAuthenticatedUser: true,
    isLoggedIn: true,
    errorMessage: null
  })),
  on(fromActions.LoginFailure, (state, { payload }) => ({
    ...state,
    storageValues: null,
    isAuthenticatedUser: false,
    isLoggedIn: false,
    errorMessage: payload
  })),
  on(fromActions.Logout, state => ({ ...state })),
  on(fromActions.LogoutSuccess, (state, { payload }) => ({
    ...state,
    storageValues: payload,
    isAuthenticatedUser: false,
    isLoggedIn: false,
    errorMessage: null
  })),
  on(fromActions.LogoutFailure, (state, { payload }) => ({
    ...state,
    isAuthenticatedUser: false,
    isLoggedIn: false,
    errorMessage: payload
  })),
  on(fromActions.RefreshAuthStateSuccess, (state, { payload }) => ({
    ...state,
    storageValues: payload,
    isAuthenticatedUser: true,
    isLoggedIn: true,
    errorMessage: null
  })),
  on(fromActions.RefreshAuthStateFailure, (state, { payload }) => ({
    ...state,
    errorMessage: payload
  })),
  on(fromActions.SetAuthenticatedUser, (state, { payload }) => ({
    ...state,
    isAuthenticatedUser: payload
  })),
  on(fromActions.SetLoggedIn, (state, { payload }) => ({
    ...state,
    isLoggedIn: payload
  }))
);

export function reducer(
  state: AuthenticationState | undefined,
  action: Action
) {
  return authReducer(state, action);
}

export const getAuthenticateUser = (state: AuthenticationState) =>
  state.isAuthenticatedUser;
