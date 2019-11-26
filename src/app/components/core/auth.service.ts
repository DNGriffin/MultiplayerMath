import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { resolve } from 'url';

@Injectable()
export class AuthService {

  constructor(
   public afAuth: AngularFireAuth
 ){}

 resetPassword(email: string) {
  const fbAuth = firebase.auth();

  return fbAuth.sendPasswordResetEmail(email)
    .then(() => alert('Rest Email Sent Successfully!'))
    .catch((error) => alert(error))
}

 SendVerificationMail() {
  return this.afAuth.auth.currentUser.sendEmailVerification()
  .then(res => {

  })
}

  doRegister(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        alert('Please validate your email address. Kindly check your inbox.');
        this.SendVerificationMail();
        resolve(res);
      }, err => reject(err))
    })
  }

  doLogin(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(result => {
        if (result.user.emailVerified !== true && result.user.email !== "admin@mmath.com") {
          alert('Please validate your email address. Kindly check your inbox.');
          this.SendVerificationMail();
        } else {
          resolve();
        }
      }, err => reject(err))
    })
  }

  doLogout(){
    return new Promise((resolve, reject) => {
      if(firebase.auth().currentUser){
        this.afAuth.auth.signOut();
        resolve();
      }
      else{
        reject();
      }
    });
  }


}
