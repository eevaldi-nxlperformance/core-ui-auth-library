import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { TokenService } from '../services/token.service';
import { Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { tap, filter, first, switchMap, catchError, take } from 'rxjs/operators';
import * as fromStore from './../store/index';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private tokenService: TokenService, private store: Store<fromStore.AuthState>) {}

  canActivate(): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromStore.validateToken).pipe(
      tap(valid => {
        if (!valid) {
          // set authenticatedUser state to false
          this.store.dispatch(fromStore.SetAuthenticatedUser({payload: false}));
          // nav to login
          this.router.navigate(['/login']);
        } else {
          // refresh store - to ensure that auth state is current
          this.store.dispatch(fromStore.RefreshAuthState());
        }
      }),
      filter(valid => valid),
      take(1)
    );
  }

}
