import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent implements OnInit {

  createQuizForm: FormGroup
  numQuestions: number

  constructor(
    private router: Router,
    public fb: FormBuilder
  ) { 
    this.createForm();
  }

  createForm(){
    this.createQuizForm = this.fb.group({
      title: ['', Validators.required],
      question: ['', Validators.required],
      answer: ['', Validators.required],
      fake1: ['', Validators.required],
      fake2: ['', Validators.required],
      fake3: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.numQuestions = 1
  }

  addQuestion() {
    this.numQuestions++;
    console.log("Adding Question #" + this.numQuestions);
  }

  createQuiz(value) {
    console.log("Submitting form with value: " + value.question);
    
  }

}
