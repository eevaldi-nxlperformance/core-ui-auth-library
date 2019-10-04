import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule, MetaReducer, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor, Error401Interceptor } from '@nxl/auth-lib';

import { MaterialLibModule } from '@nxl/material-lib';

import * as seedStore from '@nxl/seed-lib';
import * as authStore from '@nxl/auth-lib';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';

import { environment } from '../environments/environment';

// // this would be done dynamically with webpack for builds
// const environment = {
//   development: true,
//   production: false
// };

const rootReducer = {
  router: routerReducer,
  auth: authStore.reducers.auth
};

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialLibModule,
    AppRoutingModule,
    StoreModule.forRoot(rootReducer),
    EffectsModule.forRoot(seedStore.effects),
    EffectsModule.forRoot(authStore.effects),
    StoreRouterConnectingModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: authStore.TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: authStore.Error401Interceptor,
      multi: true
    },
    { provide: 'env', useValue: environment }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
