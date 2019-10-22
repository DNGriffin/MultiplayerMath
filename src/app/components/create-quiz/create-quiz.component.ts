import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
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
  ) {}

  ngOnInit() {
    this.numQuestions = 0
    this.quizForm = this.fb.group({
      title: '',
      questions: this.fb.array([]),
      userEmail: ['', Validators.required]
    })
  }

  get questionForms() {
    return this.quizForm.get('questions') as FormArray;
  }

  addQuestion() {
    this.numQuestions++;

    const question = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      fake1: ['', Validators.required],
      fake2: ['', Validators.required],
      fake3: ['', Validators.required]
    })
    
    this.questionForms.push(question);
  }

  deletePhone(i) {
    this.questionForms.removeAt(i);
  }

  createQuiz(quizInfo: FormData) {
    this.quizService.createQuiz(quizInfo);
    this.quizForm.reset();
  }

  //TODO: Get correct user email
  getUserEmail(): string {
    return "email@email.com";
  }

}
