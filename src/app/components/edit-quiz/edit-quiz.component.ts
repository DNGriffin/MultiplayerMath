import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuizService } from 'src/app/quizes/quiz.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-edit-quiz',
  templateUrl: './edit-quiz.component.html',
  styleUrls: ['./edit-quiz.component.scss']
})
export class EditQuizComponent implements OnInit {

  quizEditForm: FormGroup
  numQuestions: number
  uid: string
  email: string
  quiz: any
  id: string

  constructor(
    private router: Router,
    public fb: FormBuilder,
    private quizService: QuizService,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private _Activatedroute:ActivatedRoute
  ) {
    this.uid = afAuth.auth.currentUser.uid;
    this.getEmailAsync();
   }

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => { 
      this.id = params.get('id');
      var myself = this
      this.db.collection('quizes').doc(this.id).ref.get().then(function(doc) {
        myself.quiz = doc.data();
      });
    });

    this.numQuestions = 0;
    this.quizEditForm = this.fb.group({
      title: '',
      questions: this.fb.array([]),
      userEmail: ['', Validators.required]
    })
  }

  get questionForms() {
    return this.quizEditForm.get('questions') as FormArray;
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

  updateQuiz(quizInfo: FormData) {
    // this.quizService.createQuiz(quizInfo);
    this.quizEditForm.reset();
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
