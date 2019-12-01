import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { SubscriptionService } from 'src/app/subscriptions/subscription.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-navbar-logged-in',
  templateUrl: './navbar-logged-in.component.html',
  styleUrls: ['./navbar-logged-in.component.scss']
})
export class NavbarLoggedInComponent implements OnInit {
  invites = [];
  requests = [];
  constructor(
    private router: Router,
    public fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) {
    afAuth.auth.onAuthStateChanged((user)=> {
      if (user) {
        this.getData();
      } else {
      }
    });
  }

  ngOnInit() {
  }
  getData() {
    var globalData;
    globalData = this.db.collection('users', ref => ref.where('id', '==', this.afAuth.auth.currentUser.uid)).snapshotChanges();
    globalData.subscribe(
      (res) => {
        var data = res[0].payload.doc.data();
        if(data.invites){
          this.invites = data.invites;
        }
        if(data.requests){
          this.requests = data.requests;
        }
      },
      (err) => console.log(err),
      () => console.log("")
    );
  }

}
