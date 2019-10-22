import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService } from 'src/app/quizes/quiz.service';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent implements OnInit {

  quizForm: FormGroup
  numQuestions: number

  constructor(
    private router: Router,
    public fb: FormBuilder,
    private quizService: QuizService
  ) { 
    this.createForm();
  }

  createForm(){
    this.quizForm = this.fb.group({
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

  createQuiz(quizInfo: FormData) {
    this.quizService.createQuiz(quizInfo);
    this.quizForm.reset();
  }

}
