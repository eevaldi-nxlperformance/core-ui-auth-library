import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromAuthStore from '@nxl/auth-lib';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  tenantId$: Observable<string>;
  userId$: Observable<string>;
  constructor(
    private store: Store<fromAuthStore.AuthState>,
    private router: Router
  ) {
    this.tenantId$ = store.pipe(select(fromAuthStore.getTenantId));
    this.userId$ = store.pipe(select(fromAuthStore.getUserId));
  }

  ngOnInit() {}

  onElements() {
    this.router.navigate(['/elements/table']);
  }
}
