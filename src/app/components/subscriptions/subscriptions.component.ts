import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  subscribeForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) { 
    this.createForm()
  }

  createForm() {
    this.subscribeForm = this.fb.group({
      email: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  trySubscribe(value){
    console.log("Subscribing!");
  }
}
