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
    this.getData();
  }
x
  public getData() {
    this.quizesCollection = this.db.collection("quizes");
    return this.quizesCollection;
  }

  public createQuiz(quizObj: Object) {
    this.quizesCollection.add(quizObj);
  }
}