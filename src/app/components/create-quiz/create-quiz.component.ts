import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService } from 'src/app/quizes/quiz.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

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
    private afAuth: AngularFireAuth,
  ) {    
    setTimeout(() => {
      this.uid = afAuth.auth.currentUser.uid;
      this.getEmailAsync();
    }, 600);
    
  }

  difficulties: string[] = ['easy', 'medium', 'hard'];
  topics: string[] = ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions', 'Decimals', 'Algebra', 'Geometry', 'Calculus', 'Computer Science', 'Miscellaneous'];

  ngOnInit() {
    this.numQuestions = 0;
    this.quizForm = this.fb.group({
      title: '',
      questions: this.fb.array([]),
      quizAccessCode: '',
      quizLearningObjective: '',
      quizTopic: 'Addition',
      quizPublicAccess: true,
      userEmail: ['', Validators.required],
      createdAt: Date.now(),
      numLikes: 0,
      likeEmails: this.fb.array([])
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
      difficulty: ['easy', Validators.required]
    })
    
    this.questionForms.push(question);
  }

  deleteQuestion(i) {
    this.questionForms.removeAt(i);
  }

  createQuiz(quizInfo: FormData) {
    this.quizService.createQuiz(quizInfo);
    this.quizForm.reset();
    this.router.navigate(['/dashboard']);
  }

  getUserEmail(): string {
    return this.email;
  }

  getTimestamp() {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return timestamp;
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

  quizIsPrivate(): boolean {
    var checkbox = <HTMLInputElement> document.getElementById('quizPublicAccess');
    return !checkbox.checked
  }

}
