import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-subscription-quizzes',
  templateUrl: './subscription-quizzes.component.html',
  styleUrls: ['./subscription-quizzes.component.scss']
})
export class SubscriptionQuizzesComponent implements OnInit {

  subscription: any;

  constructor(
    private router: Router,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private _Activatedroute:ActivatedRoute
  ) { }

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => { 
      var subscriptionEmail = params.get('subscriptionEmail');
      var subscriptionCode = params.get('subscriptionCode');
      this.subscription = {
        email: subscriptionEmail,
        quizAccessCode: subscriptionCode
      }
    });
  }
}
