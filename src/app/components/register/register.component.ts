import { Component } from '@angular/core';
import { AuthService } from '../core/auth.service'
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  adminSubscriptionsDocId = '';
  adminSubscriptions = [];

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private db: AngularFirestore, 
  ) {
    this.createForm();
   }

   createForm() {
     this.registerForm = this.fb.group({
       email: ['', Validators.required ],
       password: ['',Validators.required],
       retypePassword: ['', Validators.required]
     });
   }

   tryRegister(value){
    if (value.password != value.retypePassword) {
      this.errorMessage = "Password does not match";
      this.successMessage = "";
      return;
    }
     this.authService.doRegister(value)
     .then(res => {
       console.log(res.user.uid);
       this.errorMessage = "";
       this.successMessage = "Your account has been created";
      this.addUserToCollection(res.user.uid, value.email);
      this.initUserSubscriptions(res.user.uid, value.email);
      this.router.navigate(['/login']);

       
     }, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = "";
     })
   }
   addUserToCollection(id, email){
    this.db.collection('users').add({
      id: id,
      email: email
    }).then(ref => {

    });
   }

   initUserSubscriptions(id, email){
    this.db.collection('subscriptions').add({
      id: id,
      subs: [
        {
        email: email,
        quizAccessCode: ""
        },
        {
          email: "admin@mmath.com",
          quizAccessCode: ""
        }
      ]   
    }).then(ref => {});
    this.addNewUserSubscriptionToAdmin(email);
   }

   addNewUserSubscriptionToAdmin(email) {
    const adminId = "RWPB6aTZcTVqWnHX6TBxgAdEOfP2";
    
    var adminSubscriptionsDoc = this.db.collection('subscriptions', ref => ref.where('id', '==', adminId)).snapshotChanges();
    var addedSubscription = false;
    adminSubscriptionsDoc.subscribe (
      (res) => {
        var data: any = res[0].payload.doc.data();
        this.adminSubscriptions = data.subs;
        this.adminSubscriptionsDocId = res[0].payload.doc.id;
        var newSubscriptionEntry = {
          email: email,
          quizAccessCode: ""
        }
        if (!addedSubscription){
          addedSubscription = true;
          this.adminSubscriptions.push(newSubscriptionEntry);
          this.db.doc(`subscriptions/${this.adminSubscriptionsDocId}`).update({
            subs: this.adminSubscriptions
          });
        }
      },
      (err) => console.log(err),
      () => console.log("finished")
    );
   }

}
