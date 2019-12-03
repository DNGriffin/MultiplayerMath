import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription-container',
  templateUrl: './subscription-container.component.html',
  styleUrls: ['./subscription-container.component.scss']
})
export class SubscriptionContainerComponent implements OnInit {

  subscriptions: any[]

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router : Router
  ) { }

  ngOnInit() {
    setTimeout(() => {
    }, 600);
    this.afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.getSubscriptionEmails();
      }
    });
  }

  getSubscriptionEmails(){
    var subs = this.db.collection('subscriptions', ref => ref.where('id', '==', this.afAuth.auth.currentUser.uid)).snapshotChanges();
    subs.subscribe(
      (res) => {
        var data: any = res[0].payload.doc.data();
        this.subscriptions = data.subs;
      },
      (err) => console.log(err),
      () => console.log('finished')
    );
  }

  getSubscriptions(){
    return this.subscriptions;
  }

  routeToSubscriptionQuizzes(subsciption: any){
    this.router.navigate(['/subscriptionQuizzes'], {state: {data: {subsciption}}});
  }

}
