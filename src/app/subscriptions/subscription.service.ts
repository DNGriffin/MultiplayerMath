import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from 'firebase';
import { UserService } from '../components/core/user.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  subscriptionsCollection: AngularFirestoreCollection;

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) {
    this.getData();
  }

  public getData() {
    this.subscriptionsCollection = this.db.collection("subscriptions");
    return this.subscriptionsCollection;
  }

  public createSubscription(subscriptionObj: Object) {
    this.subscriptionsCollection.add(subscriptionObj);
  }

  public unsubscribe(emailToDelete: string) {
    var myEmail = this.afAuth.auth.currentUser.email;
    var userId = this.afAuth.auth.currentUser.uid;
    var newEmails = [];
    var doc = this.db.collection('subscriptions', ref => ref.where('id', '==', userId)).snapshotChanges();
    doc.subscribe(
      (res) => {
        var data:any = res[0].payload.doc.data();
        var currentEmails = data.emails;
        newEmails = currentEmails.filter(function(email) {
          return email != emailToDelete;
        })
        this.updateSubscriptions(res[0].payload.doc.id, newEmails);
      }
    )
  }

  public updateSubscriptions(subscriptionsId, newSubscriptions) {
    return this.db
      .collection('subscriptions')
      .doc(subscriptionsId)
      .set( { emails: newSubscriptions }, { merge: true });
    
  }
}
