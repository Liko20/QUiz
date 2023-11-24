import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TestService } from '../services/test.service';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-tests',
  templateUrl: './user-tests.component.html',
  styleUrls: ['./user-tests.component.css'],
})
export class UserTestsComponent implements OnInit {
  showSpinner: boolean = false;
  loadedTests: any[] = [];

  constructor(
    private testService: TestService,
    private authService: AuthService,
    public _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.showSpinner = true;
    this.testService
      .showTestsTakenByUser(this.authService.currentUser()?.id)
      .subscribe({
        next: (response: any) => {
          for (let test of response.tests) {
            test['attempted_test_info'] = JSON.parse(test['attempted_test_info'])
          }
          this.loadedTests = response.tests;
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
