import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    // Don't allow access if user is logged in
    if (!this.authService.isLoggedIn()) return true
    this.router.navigate([''])
    return false
  }
}
