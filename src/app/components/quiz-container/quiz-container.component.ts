import { Component, OnInit } from '@angular/core';
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

  quizes: any
  subs: any[];
  quizIds = [];
  playableQuizes = [];
  quizOwner = [];

  constructor(private quizService: QuizService,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth
    ) { }

  ngOnInit() {
    setTimeout(() => {
      this.getSubscriptionEmails();
    }, 600);
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
          if(this.canAccessQuiz(subsIndex, data)) {
            if(!this.quizIds.includes(res[j].payload.doc.id)) {
              this.quizIds.push(res[j].payload.doc.id);
              this.playableQuizes.push(data);
              if(data.userEmail == this.afAuth.auth.currentUser.email) {
                this.quizOwner.push(true);
              } else {
                this.quizOwner.push(false);
              }
            }
          }
        }
      },
      (err) => console.log(err),
      () => console.log("got sub emails")
    );
  }

  //TODO strengthen security. This is is not great admin practice
  // As a starting point, we should change the admin checks to use ID rather than email
  canAccessQuiz(subsIndex, quizData) {
    return (quizData.quizAccessCode == this.subs[subsIndex].quizAccessCode || quizData.userEmail == this.afAuth.auth.currentUser.email || this.afAuth.auth.currentUser.email == "admin@mmath.com");
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

  onDeleted(quizId: string) {
    this.quizService.deleteQuiz(quizId);
    this.quizIds = [];
    this.quizOwner = [];
    this.playableQuizes = [];
    this.getQuizesFromSubs();
  }
}
