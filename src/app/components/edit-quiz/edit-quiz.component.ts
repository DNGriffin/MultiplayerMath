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
    this.quizEditForm = this.fb.group({
      title: '',
      questions: this.fb.array([]),
      userEmail: ['', Validators.required]
    });
    this.numQuestions = 0;

    this._Activatedroute.paramMap.subscribe(params => { 
      this.id = params.get('id');
      var myself = this
      this.db.collection('quizes').doc(this.id).ref.get().then(function(doc) {
        myself.quiz = doc.data();
        for(var i = 0; i < myself.quiz.questions.length; i++) {
          myself.createQuestion(
            myself.quiz.questions[i].question, 
            myself.quiz.questions[i].answer, 
            myself.quiz.questions[i].fake1,
            myself.quiz.questions[i].fake2,
            myself.quiz.questions[i].fake3
          );
        }
        myself.quizEditForm.patchValue({
          title: myself.quiz.title
        });
      });
    });
  }

  get questionForms() {
    return this.quizEditForm.get('questions') as FormArray;
  }

  createQuestion(question, answer, fake1, fake2, fake3) {
    const q = this.fb.group({
      question: [question, Validators.required],
      answer: [answer, Validators.required],
      fake1: [fake1, Validators.required],
      fake2: [fake2, Validators.required],
      fake3: [fake3, Validators.required]
    })
    
    this.questionForms.push(q);
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
