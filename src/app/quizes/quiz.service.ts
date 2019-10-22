import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { TouchSequence } from 'selenium-webdriver';
import { User } from 'firebase';
import { UserService } from '../components/core/user.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  
  quizesCollection: AngularFirestoreCollection;
  user: User

  constructor(private db: AngularFirestore) {
    UserService.prototype.getCurrentUser().then (function(result: User) {
      console.log(result);
    }, function(error) {
      console.log("Error retrieving user:");
      console.log(error);
    })
    this.getData();
  }

  public getData() {
    this.quizesCollection = this.db.collection("quizes");
    return this.quizesCollection;
  }

  public createQuiz(quizObj: Object) {
    this.quizesCollection.add(quizObj);
  }
}
