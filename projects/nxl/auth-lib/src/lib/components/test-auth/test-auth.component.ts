import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store/index';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-test-auth',
  templateUrl: './test-auth.component.html',
  styleUrls: ['./test-auth.component.css']
})
export class TestAuthComponent implements OnInit {
  tenantId$: Observable<string>;
  constructor(private store: Store<fromStore.AuthState>) {
    this.tenantId$ = store.pipe(select(fromStore.getTenantId));
  }

  ngOnInit() {}
}
