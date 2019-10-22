import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscriptionService } from 'src/app/subscriptions/subscription.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  subscribeForm: FormGroup;
  errorMessage: string = '';
  subscriptions: any

  constructor(
    private router: Router,
    public fb: FormBuilder,
    private subscriptionService: SubscriptionService
  ) { 
    this.createForm()
  }

  createForm() {
    this.subscribeForm = this.fb.group({
      subscriberEmail: ['', Validators.required],
      subscribedEmail: ['', Validators.required] //check that this email exists in the database before saving to firebase
    });
  }

  ngOnInit() {
    this.subscriptions = this.getSubscriptions();
  }

  trySubscribe(value){
    this.subscriptionService.createSubscription(value);
    this.subscribeForm.reset();
  }

  //TODO: Return only the subscriptions in which the current user's email is subscriber
  getSubscriptions() {
    return this.subscriptionService.subscriptionsCollection.snapshotChanges();
  }

  //TODO: Get correct user email
  getUserEmail() {
    return "coby.drexler@wustl.edu";
  }
}
