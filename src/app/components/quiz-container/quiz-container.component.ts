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
  emails: any[];
  quizTitles = [];
  quizIds = [];

  constructor(private quizService: QuizService,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth
    ) { }

  ngOnInit() {
    this.getSubscriptionEmails();
  }

  listenForDeletes() {
    this.db.collection('quizes', ref => ref.where('userEmail', '==', this.emails[0])).snapshotChanges().subscribe(
      (res) => {
        console.log("received a delete notification");
      },
      (err) => {
        console.log(err);
      }
    )
  }

  getQuizesFromEmails(){
    for(var i = 0; i < this.emails.length;i++){
      console.log("made it in loop get quiz");
      var quizCol = this.db.collection('quizes', ref => ref.where('userEmail', '==', this.emails[i])).snapshotChanges();
      quizCol.subscribe(
        (res) => {
          console.log("made it in quizcol sub");
          for(var j = 0;j<res.length;j++){
            var data: any = res[j].payload.doc.data();
            this.quizIds.push(res[j].payload.doc.id);
            this.quizTitles.push(data.title);
            console.log("Pushing now:");
            console.log(data);
          }
          console.log("quizTitles:");
          console.log(this.quizTitles);
        },
        (err) => console.log(err),
        () => console.log("got sub emails")
      );
    }
  }

  getSubscriptionEmails() {
    var subs;

    subs = this.db.collection('subscriptions', ref => ref.where('id', '==', this.afAuth.auth.currentUser.uid)).snapshotChanges();
    subs.subscribe(
      (res) => {
        var data = res[0].payload.doc.data();
        this.emails = data.emails;
        console.log(this.emails);
        this.getQuizesFromEmails();
        this.listenForDeletes();
      },
      (err) => console.log(err),
      () => console.log('finished')
    );
  }
}
