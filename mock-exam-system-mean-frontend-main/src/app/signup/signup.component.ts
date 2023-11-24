import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  showSpinner: boolean = false;

  constructor(
    private _snackbar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  onSignup(signupForm: NgForm) {
    this.showSpinner = true;
    this.authService
      .signup(signupForm)
      .subscribe({
        next: (response) => {
          signupForm.resetForm();
          this._snackbar.open(response.body?.message!, 'Dismiss', {
            duration: 3000,
          });
          this.router.navigate(['/login']);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
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
