import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService } from 'src/app/quizes/quiz.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent implements OnInit {

  quizForm: FormGroup
  numQuestions: number
  uid: string;
  email: string;
  constructor(
    private router: Router,
    public fb: FormBuilder,
    private quizService: QuizService,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth


  ) {    
    this.uid = afAuth.auth.currentUser.uid;
    this.getEmailAsync();
  }

  difficulties: string[] = ['easy', 'medium', 'hard'];

  ngOnInit() {
    this.numQuestions = 0;
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
      fake3: ['', Validators.required],
      difficulty: ['', Validators.required]
    })
    
    this.questionForms.push(question);
  }

  deleteQuestion(i) {
    this.questionForms.removeAt(i);
  }

  createQuiz(quizInfo: FormData) {
    console.log("lol");
    console.log(quizInfo);
    this.quizService.createQuiz(quizInfo);
    this.quizForm.reset();
  }

  getUserEmail(): string {
    return this.email;
  }

  getEmailAsync(){
    var users;

    users = this.db.collection('users', ref => ref.where('id', '==', this.uid)).snapshotChanges();
    users.subscribe(
      (res) => {
        var data = res[0].payload.doc.data();
        this.email = data.email;
      },
      (err) => console.log(err),
      () => console.log("got email")
    );
  }

}
