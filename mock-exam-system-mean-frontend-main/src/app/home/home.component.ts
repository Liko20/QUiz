import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../services/auth.service';
import { TestService } from '../services/test.service';
import Swal from 'sweetalert2';
import csvDownload from 'json-to-csv-export';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  loadedTests: any[] = [];
  showSpinner: boolean = false;
  showDeleteSpinner: boolean = false;
  testToDelete: number = 0;
  noTests: boolean = false;

  constructor(
    public authService: AuthService,
    public _snackbar: MatSnackBar,
    public testService: TestService,
    public router: Router
  ) {
    sessionStorage.clear();
  }

  ngOnInit(): void {
    this.showSpinner = true;
    this.testService
      .getAllTests(this.authService.currentUser())
      .subscribe({
        next: (response: any) => {
          this.loadedTests = response.tests.reverse();
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
    if (!this.loadedTests.length) this.noTests = true;
  }

  onTestDelete(id: number) {
    Swal.fire({
      title: 'Delete your test?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c8303f',
      cancelButtonColor: '#00b894',
      confirmButtonText: 'Yes, delete it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.showDeleteSpinner = true;
        this.testToDelete = id;
        this.testService
          .deleteTest(id)
          .subscribe({
            next: (response: any) => {
              this._snackbar.open(response.message, 'Dismiss', {
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
            this.showDeleteSpinner = false;
            this.ngOnInit();
          });
      }
    });
  }

  onTestResultsDownload(id: number) {
    this.testService
      .getResults(id)
      .subscribe({
        next: (response: any) => {
          const dataToConvert = {
            data: response.results,
            filename: response.test + '_Results',
            delimiter: ',',
            headers: ['Email', 'Marks'],
          };
          csvDownload(dataToConvert);
          this._snackbar.open(response.message, 'Dismiss', {
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
        this.showDeleteSpinner = false;
      });
  }

  async onTestEnter(test: any) {
    this.testService
      .checkAttemptAllowed(this.authService.currentUser().id, test._id)
      .subscribe({
        next: async (response: any) => {
          console.log(response);
          if (response.success === true) {
            let pin = test.test_pin;
            let { value: enteredPin } = await Swal.fire({
              title: 'Enter test pin',
              input: 'number',
              confirmButtonColor: '#00b894',
            });
            enteredPin = parseInt(enteredPin);
            if (!enteredPin) {
            } else if (pin === enteredPin) {
              Swal.fire({
                title: 'Start the test?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#c8303f',
                cancelButtonColor: '#00b894',
                confirmButtonText: 'Yes, Start!',
                cancelButtonText: 'No, I am not ready!',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.testService.setTest(test);
                  this.testService.hasTestEnded = false;
                  this.router.navigate(['start-test', test._id]);
                }
              });
            } else {
              Swal.fire({
                title: 'Wrong pin!',
                text: 'Please enter the correct pin.',
                icon: 'error',
                confirmButtonColor: '#00b894',
              });
            }
          } else {
            this._snackbar.open(
              response.message || 'Please try again later',
              'Dismiss',
              { duration: 3000 }
            );
          }
        },
        error: (err: HttpErrorResponse) => {
          this._snackbar.open(
            err.error.message || 'Please try again later',
            'Dismiss',
            { duration: 3000 }
          );
        },
      });
  }
}
