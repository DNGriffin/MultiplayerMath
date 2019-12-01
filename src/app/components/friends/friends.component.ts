import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionService } from 'src/app/subscriptions/subscription.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import {take} from "rxjs/operators";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  friends = [];
  requests = [];
  invites = [];
  docId;
  addFriendForm: FormGroup;
  email;
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
    this.createForm();
    
  }
  ngOnInit() {
  }
  createForm() {
    this.addFriendForm = this.fb.group({
      email: ['', Validators.required]

    });
  }
 
  getData() {
    var globalData;
    globalData = this.db.collection('users', ref => ref.where('id', '==', this.afAuth.auth.currentUser.uid)).snapshotChanges();
    globalData.subscribe(
      (res) => {
        var data = res[0].payload.doc.data();
        console.log(data);
        if(data.friends){
          this.friends = data.friends;
        }
        if(data.requests){
          this.requests = data.requests;

        }
        if(data.invites){
          this.invites = data.invites;
          // this.invites.reverse;

        }
        this.email = data.email;
        console.log(this.friends);
        this.docId = res[0].payload.doc.id;
      },
      (err) => console.log(err),
      () => console.log("got sub emails")
    );
  }
  removeFriend(email) {
    this.friends = this.friends.filter(friend => friend != email);
    this.db.doc(`users/${this.docId}`).update({
      friends: this.friends
    });
    this.getFriendIdToRemoveYou(email);
  }
  makeFriendRemoveYou(id, friends){
    friends = friends.filter(req => req != this.email);
    this.db.doc(`users/${id}`).update({
      friends: friends
    });
  }
  getFriendIdToRemoveYou(email){
    var globalData;
    globalData = this.db.collection('users', ref => ref.where('email', '==', email)).snapshotChanges();
    globalData.pipe(take(1)).subscribe(
      (res) => {
        var data = res[0].payload.doc.data();
        var id = res[0].payload.doc.id;
        var friends = [];
        if(data.friends){
          friends = data.friends;
        }
        this.makeFriendRemoveYou(id, friends);
      },
      (err) => console.log(err),
      () => console.log("got sub emails")
    );
  }
  addFriend(value: any) {
    var id = this.getFriendId(value.email);
    console.log(id);
    this.addFriendForm.reset();
  }
  getFriendId(email){
    var globalData;
    globalData = this.db.collection('users', ref => ref.where('email', '==', email)).snapshotChanges();
    globalData.pipe(take(1)).subscribe(
      (res) => {
        var data = res[0].payload.doc.data();

        var id = res[0].payload.doc.id;
        var requests = [];
        if(data.requests){
          requests = data.requests;
        }
        this.sendRequest(id, requests);
      },
      (err) => console.log(err),
      () => console.log("got sub emails")
    );
  }
  sendRequest(id, requests){
    requests = requests.filter(req => req != this.email);
    requests.push(this.email);
    this.db.doc(`users/${id}`).update({
      requests: requests
    });
  }
  acceptRequest(email){
    this.friends.push(email);
    this.requests = this.requests.filter(req => req != email);

    this.db.doc(`users/${this.docId}`).update({
      friends: this.friends,
      requests: this.requests
    });
    this.getFriendIdForRequest(email);
  }
  ignoreRequest(email){
    this.requests = this.requests.filter(req => req != email);
    this.db.doc(`users/${this.docId}`).update({
      requests: this.requests
    });
  }

  getFriendIdForRequest(email){
    var globalData;
    globalData = this.db.collection('users', ref => ref.where('email', '==', email)).snapshotChanges();
    globalData.pipe(take(1)).subscribe(
      (res) => {
        var data = res[0].payload.doc.data();

        var id = res[0].payload.doc.id;
        var friends = [];
        if(data.friends){
          friends = data.friends;
        }
        this.acceptRequestForOtherUser(id, friends);
      },
      (err) => console.log(err),
      () => console.log("got sub emails")
    );
  }
  acceptRequestForOtherUser(id, friends){
    friends = friends.filter(req => req != this.email);
    friends.push(this.email);
    this.db.doc(`users/${id}`).update({
      friends: friends
    });
  }
  joinFromInvite(index){
    var invite = this.invites.slice().reverse()[index];
    console.log(invite);
    this.router.navigate(['play/online/'], { queryParams: { id: invite.quizId, title: invite.title, room: invite.room} });

  }

}
