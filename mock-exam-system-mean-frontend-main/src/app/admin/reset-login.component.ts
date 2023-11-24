import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './reset-login.component.html',
  styleUrls: ['./reset-login.component.css'],
})
export class ResetLoginComponent implements OnInit {
  showSpinner: boolean = false;

  constructor(
    private _snackbar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  onResetLogin(resetLoginForm: NgForm) {
    this.showSpinner = true;
    this.authService
      .resetLogin(resetLoginForm)
      .subscribe({
        next: (response: any) => {
          resetLoginForm.resetForm();
          this._snackbar.open('Login reset successful', 'Dismiss', {
            duration: 3000,
          });
        },
        error: (err: HttpErrorResponse) => {
          this._snackbar.open(
            err.error.message || 'Please try again later',
            'Dismiss',
            { duration: 3000 }
          );
        },
      })
      .add(() => {
        this.showSpinner = false;
      });
  }
  onResetAllLogin(resetAllForm: NgForm) {
    this.showSpinner = true;
    this.authService
      .resetAllLogins()
      .subscribe({
        next: (response: any) => {
          resetAllForm.resetForm();
          this._snackbar.open('All logins reset successful', 'Dismiss', {
            duration: 3000,
          });
        },
        error: (err: HttpErrorResponse) => {
          this._snackbar.open(
            err.error.message || 'Please try again later',
            'Dismiss',
            { duration: 3000 }
          );
        },
      })
      .add(() => {
        this.showSpinner = false;
      });
  }
}
