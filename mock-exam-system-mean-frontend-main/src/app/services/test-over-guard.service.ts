import { Injectable } from '@angular/core';
import { CanDeactivate, Router } from '@angular/router';
import { TestService } from './test.service';

@Injectable({
  providedIn: 'root',
})
export class TestOverGuard implements CanDeactivate<any> {
  constructor(private testService: TestService) {}

  canDeactivate() {    
    if (!this.testService.hasTestEnded) return false;
    this.testService.removeTest();
    return true;
  }
}
