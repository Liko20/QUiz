import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GenericAdminAuthGuard implements CanActivate {
 
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    // Don't allow access if current user is not admin
    if (this.authService.currentUser()?.isSuperAdmin || this.authService.currentUser()?.isAdmin) return true;
    this.router.navigate(['']);
    return false;
  }
}
