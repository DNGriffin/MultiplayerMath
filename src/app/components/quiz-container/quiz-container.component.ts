import { Component, OnInit, Input } from '@angular/core';
import { QuizService } from 'src/app/quizes/quiz.service';
import { defineBase } from '@angular/core/src/render3';
import { FirebaseApp } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-quiz-container',
  templateUrl: './quiz-container.component.html',
  styleUrls: ['./quiz-container.component.scss']
})
export class QuizContainerComponent implements OnInit {

  @Input() sectionTitle: string;

  quizes: any
  subs: any[];
  quizIds = [];
  playableQuizes = [];
  quizOwner = [];

  topics: string[] = ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions', 'Decimals', 'Algebra', 'Geometry', 'Calculus', 'Computer Science', 'Miscellaneous'];

  constructor(private quizService: QuizService,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth
    ) { }

  ngOnInit() {
    setTimeout(() => {
      this.getQuizesToDisplay();
    }, 600);
  }

  getQuizesToDisplay() {
    switch(this.sectionTitle) {
      case 'My Quizzes': {
        this.getMyQuizes();
        break;
      }
      case 'Quizzes out of the Box': {
        this.getAdminQuizzes();
        break;
      }
      case 'My Subscriptions': {
        this.getSubscriptionQuizzes();
        break;
      }
      default: {
        if(this.topics.includes(this.sectionTitle)) {
          this.getGenreQuizzes(this.sectionTitle);
        }
        break; 
     }
    }
  }

  getMyQuizes(){
    var myQuizes = this.db.collection('quizes', ref => ref.where('userEmail', '==', this.afAuth.auth.currentUser.email)).snapshotChanges();
    myQuizes.subscribe(
      (res) => {
        for(var j = 0;j < res.length; j++){
          var data: any = res[j].payload.doc.data();
          if(!this.quizIds.includes(res[j].payload.doc.id)) {
            this.quizIds.push(res[j].payload.doc.id);
            this.playableQuizes.push(data);
            this.quizOwner.push(true);
          }
        }
      },
      (err) => console.log(err),
      () => console.log("got sub emails")
    );
  }

  getAdminQuizzes() {
    var adminQuizes = this.db.collection('quizes', ref => ref.where('userEmail', '==', "admin@mmath.com")).snapshotChanges();
    adminQuizes.subscribe(
      (res) => {
        for(var j = 0;j < res.length; j++){
          var data: any = res[j].payload.doc.data();
          if(!this.quizIds.includes(res[j].payload.doc.id)) {
            this.quizIds.push(res[j].payload.doc.id);
            this.playableQuizes.push(data);
            this.quizOwner.push(false);
          }
        }
      },
      (err) => console.log(err),
      () => console.log("got sub emails")
    );
  }

  getSubscriptionQuizzes() {
    this.getSubscriptionEmails();
  }

  getSubscriptionEmails() {
    var subs;

    subs = this.db.collection('subscriptions', ref => ref.where('id', '==', this.afAuth.auth.currentUser.uid)).snapshotChanges();
    subs.subscribe(
      (res) => {
        var data = res[0].payload.doc.data();
        this.subs = data.subs;
        this.getQuizesFromSubs();
      },
      (err) => console.log(err),
      () => console.log('finished')
    );
  }

  getQuizesFromSubs(){
    for(var i = 0; i < this.subs.length; i++){
      var quizCol = this.db.collection('quizes', ref => ref.where('userEmail', '==', this.subs[i].email)).snapshotChanges();
      this.subscribeToQuizCol(i, quizCol);
    }
  }

  subscribeToQuizCol(subsIndex, quizCol) {
    quizCol.subscribe(
      (res) => {
        for(var j = 0;j < res.length; j++){
          var data: any = res[j].payload.doc.data();
          if(this.canAccessPrivateQuiz(subsIndex, data)) {
            if(!this.quizIds.includes(res[j].payload.doc.id)) {
              this.quizIds.push(res[j].payload.doc.id);
              this.playableQuizes.push(data);
              this.quizOwner.push(false);
            }
          }
        }
      },
      (err) => console.log(err),
      () => console.log("got sub emails")
    );
  }

  getGenreQuizzes(genre: string) {
    var genreQuizzes = this.db.collection('quizes', ref => ref.where('quizTopic', '==', genre)).snapshotChanges();
    genreQuizzes.subscribe(
      (res) => {
        for(var j = 0;j < res.length; j++){
          var data: any = res[j].payload.doc.data();
          if(data.quizPublicAccess) {
            if(!this.quizIds.includes(res[j].payload.doc.id)) {
              this.quizIds.push(res[j].payload.doc.id);
              this.playableQuizes.push(data);
              this.quizOwner.push(false);
            }
          }
        }
      },
      (err) => console.log(err),
      () => console.log("got sub emails")
    );
  }

  canAccessPrivateQuiz(subsIndex, quizData) {
    return !quizData.quizPublicAccess && (quizData.quizAccessCode == this.subs[subsIndex].quizAccessCode || this.afAuth.auth.currentUser.email == "admin@mmath.com");
  }

  onDeleted(quizId: string) {
    this.quizService.deleteQuiz(quizId);
    this.quizIds = [];
    this.quizOwner = [];
    this.playableQuizes = [];
    this.getQuizesFromSubs();
  }
}
