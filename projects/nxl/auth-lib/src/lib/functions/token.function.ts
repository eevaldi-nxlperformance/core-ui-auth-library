import { Injectable } from '@angular/core';
import * as jwt from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';
import { LocalStorageModel } from '../models/local-storage.model';

export const TOKEN_NAME = 'nxl_jwt_token';


export function getTokenStorage(): string {
  return localStorage.getItem(TOKEN_NAME);
}

export function getTokenExpirationDate(token: string): Date {
  const helper = new jwt.JwtHelperService();
  const decodedToken = helper.decodeToken(token);

  if (decodedToken.exp === undefined) {
    return null;
  }

  const date = new Date(0);
  date.setUTCSeconds(decodedToken.exp);
  return date;
}

export function isTokenExpired(token?: string): boolean {
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
