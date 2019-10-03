import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as fromComponents from './components/index';
// import * as fromContainers from './containers/index';
import * as fromServices from './services/index';
import * as fromGuards from './guards/index';
import * as fromInterceptors from './interceptors/index';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// import { reducers, effects } from './store';
import * as store from './store';
import { TestAuthComponent } from './components/test-auth/test-auth.component';
// import * as fromPipes from './pipes/index';
// import * as fromResolvers from './resolvers/index';


const routes: Routes = [
  // {
  //   path: 'test-auth',
  //   pathMatch: 'full',
  //   component: fromComponents.TestAuthComponent
  // },
  {
    path: '',
    pathMatch: 'full',
    component: fromComponents.LoginComponent,
    // resolve: { element: fromResolvers.ElementsResolver}
  }
];


@NgModule({
  declarations: [...fromComponents.components, TestAuthComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('auth', store.reducers),
    EffectsModule.forFeature(store.effects)
  ],
  providers: [...fromServices.services, ...fromGuards.guards, ...fromInterceptors.interceptors],
  exports: [RouterModule, ...fromComponents.components]
})
export class AuthLibModule { }
