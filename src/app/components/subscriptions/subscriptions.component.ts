import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscriptionService } from 'src/app/subscriptions/subscription.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  subscribeForm: FormGroup;
  errorMessage: string = '';
  subs: any[];
  subscriptionsDocId: string;

  constructor(
    private router: Router,
    public fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) {
    setTimeout(() => {
      this.getSubscriptionEmails();
      this.createForm();
    }, 300);
    
  }

  ngOnInit() {
  }

  createForm() {
    this.subscribeForm = this.fb.group({
      accessCodes: this.fb.array([
        this.fb.group({
          email: ['', Validators.required],
          quizAccessCode: ['', Validators.required]
        })
      ])
    });
  }

  trySubscribe(value: any) {
    this.subs.push(value.accessCodes[0])
    this.db.doc(`subscriptions/${this.subscriptionsDocId}`).update({
      subs: this.subs
    });
    this.subscribeForm.reset();
  }
  getSubscriptionEmails() {
    var globalData;

    globalData = this.db.collection('subscriptions', ref => ref.where('id', '==', this.afAuth.auth.currentUser.uid)).snapshotChanges();
    globalData.subscribe(
      (res) => {
        var data = res[0].payload.doc.data();
        this.subs = data.subs;
        this.subscriptionsDocId = res[0].payload.doc.id;
      },
      (err) => console.log(err),
      () => console.log("got sub emails")
    );
  }
 
  removeSubscription(email: string, quizAccessCode: string) {
    this.subscriptionService.unsubscribe(email, quizAccessCode);
  }
}
