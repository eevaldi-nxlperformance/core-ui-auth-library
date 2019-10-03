import { Component, OnInit } from '@angular/core';
import { MsalService } from '../../services/b2c.service';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store/index';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private msalService: MsalService,
    private store: Store<fromStore.AuthState>,
    private router: Router
  ) {}

  ngOnInit() {}

  onLogin() {
    this.store.dispatch(fromStore.Login());
  }

  onSignUp() {
    // this.msalService.signup();
  }

  onHome() {
    this.router.navigate(['/home']);
  }

  onLogout() {
    this.store.dispatch(fromStore.Logout());
  }
}
