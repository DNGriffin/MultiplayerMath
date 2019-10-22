import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from 'firebase';
import { UserService } from '../components/core/user.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  
  subscriptionsCollection: AngularFirestoreCollection;

  constructor(private db: AngularFirestore) {
    this.getData();
  }
x
  public getData() {
    this.subscriptionsCollection = this.db.collection("subscriptions");
    return this.subscriptionsCollection;
  }

  public createSubscription(subscriptionObj: Object) {
    this.subscriptionsCollection.add(subscriptionObj);
  }
}
