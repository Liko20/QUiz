import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TestService } from '../services/test.service';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public testService: TestService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onTimerFinished(e: CountdownEvent) {
    if (e.action === 'done') {
      this.testService.hasTestEnded = true;
      let current_test = this.testService.getTest();
      let marks_per_question = +(
        current_test.total_marks / current_test.number_of_questions
      ).toFixed(2);
      let score = 0,
        correct_answers = 0,
        incorrect_answers = 0;
      let user_response = this.testService.userAttemptedTest.value;
      Object.keys(user_response).forEach(function (key, index) {
        if (+user_response[key] === current_test.questions[index].correct) {
          score += marks_per_question;
          correct_answers += 1;
        } else {
          incorrect_answers += 1;
        }
      });
      let test_name = current_test.test_name;
      const attempted_test_info = {
        test_name,
        score,
        correct_answers,
        incorrect_answers,
        marks_per_question,
        total_marks: current_test.total_marks,
      };
      // Store score in database
      this.testService
        .saveScore(
          this.authService.currentUser()?.id,
          current_test._id,
          attempted_test_info
        )
        .subscribe({
          next: () => {},
          error: (err) => {
            this._snackbar.open(
              err.error.message || 'Please try again later',
              'Dismiss',
              { duration: 3000 }
            );
          },
        });
      // Store attempt in database
      this.testService
        .saveAttempt(
          this.authService.currentUser()?.id,
          current_test._id,
          attempted_test_info.score
        )
        .subscribe({
          next: () => {},
          error: (err) => {
            console.log(err);
            this._snackbar.open(
              err.error.message || 'Please try again later',
              'Dismiss',
              { duration: 3000 }
            );
          },
        });

      Swal.fire({
        title: 'Test result',
        icon: 'info',
        text: 'Your score is ' + score + '/' + current_test.total_marks,
        showCancelButton: true,
        confirmButtonColor: '#c8303f',
        cancelButtonColor: '#00b894',
      }).then(() => {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'auto',
        });
      });
    }
  }
}
