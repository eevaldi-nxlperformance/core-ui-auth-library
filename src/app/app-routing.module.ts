import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, MsalService, TokenService } from '@nxl/auth-lib';

// lazy routes
const routes: Routes = [
  {
    path: 'elements',
    loadChildren: () => import('@nxl/seed-lib').then(mod => mod.SeedLibModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('@nxl/auth-lib').then(mod => mod.AuthLibModule)
  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
  // { path: '', component: LandingComponent },
  //     { path: '**', redirectTo: '/' }
  // },
  // { path: '**', component: HomeComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [AuthGuard, MsalService, TokenService]
})
export class AppRoutingModule { }
