import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';
import { LocalStorageModel } from '../models/local-storage.model';

export const TOKEN_NAME = 'nxl_jwt_token';
export const TENANT_ID_NAME = 'nxl_tenant_id';
export const USER_ID_NAME = 'nxl_user_id';


@Injectable()
export class TokenService {
  helper: JwtHelperService;

  constructor() {
    this.helper = new JwtHelperService();
  }

  getTokenValuesObservable(): Observable<LocalStorageModel> {
    return of({
      nxl_jwt_token: this.getTokenStorage(),
      nxl_tenant_id: this.getTenantIdStorage(),
      nxl_user_id: this.getUserIdStorage()
    });
  }

  getTokenValueObservable(): Observable<string> {
    return of(this.getTokenStorage());
  }

  getTokenStorage(): string {
    return localStorage.getItem(TOKEN_NAME);
  }

  getTenantIdStorage(): string {
    return localStorage.getItem(TENANT_ID_NAME);
  }

  getUserIdStorage(): string {
    return localStorage.getItem(USER_ID_NAME);
  }

  getTenantId(idToken: object): string {
    return idToken
      ? Object.entries(idToken)
          // tslint:disable-next-line:no-shadowed-variable
          .map(x => {
            const keys = x[0];
            const values = x[1];
            return { key: keys, value: values };
          })
          .find(({ key }) => key === 'extension_TenantId').value
      : null;
  }

  getUserId(idToken: object): string {
    return idToken
      ? Object.entries(idToken)
          // tslint:disable-next-line:no-shadowed-variable
          .map(x => {
            const keys = x[0];
            const values = x[1];
            return { key: keys, value: values };
          })
          .find(({ key }) => key === 'sub').value
      : null;
  }

  public setToken(token: string): void {
    localStorage.setItem(TOKEN_NAME, token);
  }

  getTokenExpirationDate(token: string): Date {
    const decodedToken = this.helper.decodeToken(token);

    if (decodedToken.exp === undefined) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decodedToken.exp);
    return date;
  }

  public isTokenExpired(token?: string): boolean {
    if (!token) {
      token = this.getTokenStorage();
    }
    if (!token) {
      return true;
    }

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) {
      return false;
    }
    return !(date.valueOf() > new Date().valueOf());
  }

  public logoutUser(): Observable<boolean> {
    localStorage.setItem(TOKEN_NAME, '');
    localStorage.setItem(TENANT_ID_NAME, '');
    localStorage.setItem(USER_ID_NAME, '');
    return of(true);
  }
}
