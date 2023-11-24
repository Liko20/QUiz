import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TestService } from './test.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url: string = environment.host + '/api';

  constructor(
    private _snackbar: MatSnackBar,
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private testService: TestService
  ) {}

  login(loginForm: NgForm) {
    const token = localStorage.getItem('token');
    return this.http.post(
      this.url + '/login',
      JSON.stringify(loginForm.value),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        observe: 'response',
      }
    );
  }
  resetLogin(loginForm: NgForm) {
    return this.http.post(
      this.url + '/reset-login',
      JSON.stringify(loginForm.value),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        observe: 'response',
      }
    );
  }

  resetAllLogins() {
    return this.http.post(
      this.url + '/reset-all-login',
      JSON.stringify({ user_id: this.currentUser().id }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        observe: 'response',
      }
    );
  }

  logout() {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#c8303f',
      cancelButtonColor: '#00b894',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http
          .post(
            this.url + '/logout',
            JSON.stringify({ user_id: this.currentUser().id }),
            {
              headers: {
                'Content-Type': 'application/json',
              },
              observe: 'response',
            }
          )
          .subscribe(
            (response) => {
              // Update localStorage only if the logout request was successful
              if (response.status === 200) {
                this.testService.hasTestEnded = true;
                localStorage.removeItem('token');
                this._snackbar.open('Successfully logged out', 'Dismiss', {
                  duration: 3000,
                });

                this.router.navigate(['/']);
              } else {
                console.log(response);
                this._snackbar.open(
                  'Error while log out. Please try again',
                  'Dismiss',
                  {
                    duration: 3000,
                  }
                );
              }
            },
            (error) => {
              console.log(error);
              this._snackbar.open(
                'Error while log out. Please try again',
                'Dismiss',
                {
                  duration: 3000,
                }
              );
            }
          );
      }
    });
  }

  isLoggedIn() {
    return !this.jwtHelper.isTokenExpired();
  }

  currentUser() {
    return this.jwtHelper.decodeToken();
  }

  signup(signupForm: NgForm) {
    return this.http.post<{ message: string }>(
      this.url + '/signup',
      JSON.stringify(signupForm.value),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        observe: 'response',
      }
    );
  }
}
