import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TestService } from '../services/test.service';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TestOverGuard } from '../services/test-over-guard.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-start-test',
  templateUrl: './start-test.component.html',
  styleUrls: ['./start-test.component.css'],
})
export class StartTestComponent implements OnInit, AfterViewInit {
  currentTest: any;
  @ViewChild('testForm') testForm: any;

  constructor(
    public testService: TestService,
    private authService: AuthService,
    public _snackbar: MatSnackBar,
    private router: Router
  ) 
  {
    
    this.currentTest = this.testService.getTest();
    if (!this.currentTest) {
      this.router.navigate(['']);
    }
    this.testService.startTest(this.currentTest.test_duration);
  }

  ngAfterViewInit() {
    this.testService.userAttemptedTest = this.testForm;
  }

  ngOnInit(): void {}

  onTestSubmit() {
    Swal.fire({
      title: 'Submit test?',
      text: 'Are you sure you want to submit your test',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#c8303f',
      cancelButtonColor: '#00b894',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.testService.hasTestEnded = true;
        // onTimerFinished() will be invoked automatically when testTime is alloted 0
        this.testService.testTime = 0;
      }
    });
  }
}
