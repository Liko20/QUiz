import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TestService } from '../services/test.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Title } from '@angular/platform-browser';
import { Observable, Subscriber, observable } from 'rxjs';
import {
  MatSlideToggleModule,
  _MatSlideToggleRequiredValidatorModule,
} from '@angular/material/slide-toggle';

interface question {
  title: any;
  a: any;
  b: any;
  c: any;
  d: any;
  correct: any;
  titledatatype:any;
  adatatype:any;
  bdatatype:any;
  cdatatype:any;
  ddatatype:any;
  
}

@Component({
  selector: 'app-add-test',
  templateUrl: './add-test.component.html',
  styleUrls: ['./add-test.component.css'],
})
export class AddTestComponent implements OnInit {
  questions: question[] = [];
  allowMultipleAttempts: boolean = false;
  showSpinner: boolean = false;
  datatypes: string[]=["string","image"];
  selectedFile:any[]=['','','','',''];
  file_store:any;
  myImage!:Observable<any>;
  base64Code:any;

  constructor(
    public authService: AuthService,
    public testService: TestService,
    private _snackbar: MatSnackBar,
    private router: Router
  ) {
    this.addQuestion();
  }

  ngOnInit(): void {}

  addQuestion() {
    this.questions.push({
      title: '',
      a: '',
      b: '',
      c: '',
      d: '',
      correct: '',
      titledatatype: false,
      adatatype: false,
      bdatatype: false,
      cdatatype: false,
      ddatatype: false,
    });
  }

  removeQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  onCreateTest(test_details: NgForm) {

    this.showSpinner = true;
    this.testService
      .createTest(
        this.authService.currentUser()?.id,
        test_details.value,
        this.questions
      )
      .subscribe({
        next: (response: any) => {
          this._snackbar.open(response.message, 'Dismiss', { duration: 3000 });
          this.router.navigate(['/']);
        },
        error: (err) => {
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

  handleFileInputChange(event: any,index : number ,optionNo:string): void {
    if(event.target.files[0].size < 60000){
      switch(optionNo) { 
        case 'title': { 
          this.selectedFile[0] = event.target.files[0] ?? null;
          this.convertToBase64(this.selectedFile[0],index,optionNo);
           break; 
        } 
        case 'a': { 
          this.selectedFile[1] = event.target.files[0] ?? null;
          this.convertToBase64(this.selectedFile[1],index,optionNo);
           break; 
        } 
        case 'b': { 
          this.selectedFile[2] = event.target.files[0] ?? null;
          this.convertToBase64(this.selectedFile[2],index,optionNo); 
          break; 
       } 
       case 'c': { 
        this.selectedFile[3] = event.target.files[0] ?? null;
          this.convertToBase64(this.selectedFile[3],index,optionNo);
        break; 
     } 
     case 'd': { 
      this.selectedFile[4] = event.target.files[0] ?? null;
      this.convertToBase64(this.selectedFile[4],index,optionNo);
      break; 
   } 
        default: { 
           //statements; 
           break; 
        } 
     } 
      
    }
    else{
      this._snackbar.open('file limit is 40 kb',
        'Dismiss',
        { duration: 3000 }
      );
      
    }
      
      
  }

  convertToBase64(file:File,index:number,optionNo:string){
    const observable = new Observable((subscriber:Subscriber<any>)=>{
      this.readFile(file,subscriber)
    })
    observable.subscribe((d)=>{
      if(optionNo == 'title')
      this.questions[index].title= d;
      else if(optionNo == 'a')
      this.questions[index].a = d;
      else if(optionNo == 'b')
      this.questions[index].b = d;
      else if(optionNo == 'c')
      this.questions[index].c = d;
      else if(optionNo == 'd')
      this.questions[index].d = d;
      else if(optionNo == 'correct')
      this.questions[index].correct = d;
    })
  }
  readFile(file:File,subscriber:Subscriber<any>){
    const filereader = new FileReader();
    filereader.readAsDataURL(file)
    filereader.onload = ()=>{
      subscriber.next(filereader.result);
      subscriber.complete()
    }
    filereader.onerror = () =>{
      subscriber.error()
      subscriber.complete()
    }
  }

  resetValue(index:number,optionNo:string){
    
    if(optionNo == 'title')
      {
        this.questions[index].title='';
        this.selectedFile[0]='';
      }
      else if(optionNo == 'a'){
        this.questions[index].a='';
        this.selectedFile[1]='';
      }
      else if(optionNo == 'b'){
        this.questions[index].b='';
        this.selectedFile[2]='';
      }
      else if(optionNo == 'c'){
        this.questions[index].c='';
        this.selectedFile[3]='';
      }      
      else if(optionNo == 'd'){
        this.questions[index].d='';
        this.selectedFile[4]='';
      }
      
  }
  
}
