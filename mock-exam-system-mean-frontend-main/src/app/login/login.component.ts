import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  showSpinner: boolean = false;

  constructor(
    private _snackbar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void { }

  onLogin(loginForm: NgForm) {
    this.showSpinner = true
    this.authService.login(loginForm).subscribe({
      next: (response: any) => {        
        loginForm.resetForm()
        this._snackbar.open('You are now logged in', 'Dismiss', { duration: 3000 })
        this.router.navigate(['/'])
        localStorage.setItem('token', response.body?.token)
      },
      error: (err: HttpErrorResponse) => {
        this._snackbar.open(err.error.message || 'Please try again later', 'Dismiss', { duration: 3000 })
      }
    }).add(() => {
      this.showSpinner = false
    })
  }

}
