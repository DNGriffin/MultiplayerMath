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
    this.quizes = this.getQuizes();
    this.getSubscriptionEmails();
  }

  //TODO: Get quizes that have the same email as the user, one of the user's subscriptions, or that have the canned quiz identifier (special email of some sort)
  getQuizes() {
    return this.quizService.quizesCollection.snapshotChanges();
  }
  getQuizesFromEmails(){

    for(var i = 0;i<this.emails.length;i++){
      console.log("made it in loop get quiz");
    var quizCol = this.db.collection('quizes', ref => ref.where('userEmail', '==', this.emails[i])).snapshotChanges();
    quizCol.subscribe(
      (res) => {
        console.log("made it in quizcol sub");
        for(var j = 0;j<res.length;j++){
          var data: any = res[j].payload.doc.data();
          this.quizIds.push(res[j].payload.doc.id);
          this.quizTitles.push(data.title);
          console.log(data.title);
        }
        
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
      },
      (err) => console.log(err),
      () => console.log('finished')
    );
  }
}
