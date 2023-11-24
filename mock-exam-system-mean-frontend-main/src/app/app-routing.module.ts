import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ResetLoginComponent } from './admin/reset-login.component';
import { SignupComponent } from './signup/signup.component';
import { AddTestComponent } from './add-test/add-test.component';
import { StartTestComponent } from './start-test/start-test.component';
import { UserTestsComponent } from './user-tests/user-tests.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './services/auth-guard.service';
import { AdminAuthGuard } from './services/admin-auth-guard.service';
import { GenericAdminAuthGuard } from './services/generic-admin-auth-guard.service';
import { LoginGuard } from './services/login-guard.service';
import { TestOverGuard } from './services/test-over-guard.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [LoginGuard] },
  {
    path: 'add-test',
    component: AddTestComponent,
    canActivate: [AuthGuard, AdminAuthGuard],
  },
  {
    path: 'reset-login',
    component: ResetLoginComponent,
    canActivate: [AuthGuard, GenericAdminAuthGuard],
  },
  {
    path: 'start-test/:id',
    component: StartTestComponent,
    canActivate: [AuthGuard],
    canDeactivate: [TestOverGuard],
  },
  {
    path: 'my-tests',
    component: UserTestsComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
