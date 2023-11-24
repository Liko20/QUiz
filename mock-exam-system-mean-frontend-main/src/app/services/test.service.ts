import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private url: string = environment.host + '/api';
  hasTestStarted: boolean = false;
  hasTestEnded: boolean = false;
  testTime: number = 0;
  userAttemptedTest: any;

  constructor(private http: HttpClient) {}

  getAllTests(user: any) {
    console.log(user);
    if (user.isAdmin === true && user.isSuperAdmin === false) {
      return this.http.get(this.url + '/get-admin-tests/' + user.id);
    } else {
      return this.http.get(this.url + '/get-tests');
    }
  }

  createTest(user_id: any, test_details: any, questions: any) {
    return this.http.post(
      this.url + '/save-test',
      JSON.stringify({ ...test_details, questions, user: user_id }),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')!,
        },
      }
    );
  }

  saveScore(user_id: any, attempted_test_id: any, attempted_test_info: any) {
    return this.http.post(
      this.url + '/save-score',
      JSON.stringify({ user_id, attempted_test_id, attempted_test_info }),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')!,
        },
      }
    );
  }

  saveAttempt(user_id: any, test_id: any, marks_obtained: any) {
    return this.http.post(
      this.url + '/create-attempt',
      JSON.stringify({ user_id, test_id, marks_obtained }),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')!,
        },
      }
    );
  }

  checkAttemptAllowed(user_id: any, test_id: any) {
    return this.http.post(
      this.url + '/check-attempt-allowed',
      JSON.stringify({ user_id, test_id }),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')!,
        },
      }
    );
  }

  showTestsTakenByUser(user_id: any) {
    return this.http.get(this.url + `/my-tests/${user_id}`, {
      headers: {
        Authorization: localStorage.getItem('token')!,
      },
    });
  }

  deleteTest(id: number) {
    return this.http.delete(this.url + `/delete-test/${id}`, {
      headers: {
        Authorization: localStorage.getItem('token')!,
      },
    });
  }

  setTest(test: any) {
    let val = CryptoJS.AES.encrypt(
      JSON.stringify(test),
      environment.secret_key
    ).toString();
    sessionStorage.setItem('test', val);
  }

  getTest() {
    let data = sessionStorage['test'];
    if (!data) return null;
    const bytes = CryptoJS.AES.decrypt(data, environment.secret_key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  removeTest() {
    sessionStorage.removeItem('test');
    this.hasTestStarted = false;
  }

  startTest(testDuration: number) {
    this.hasTestStarted = true;
    this.testTime = testDuration;
  }

  getResults(test_id: any) {
    return this.http.get(this.url + `/test-results/${test_id}`, {
      headers: {
        Authorization: localStorage.getItem('token')!,
      },
    });
  }
}
