import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  
  quizesCollection: any;

  constructor(private db: AngularFirestore) {
    this.getData();
  }

  public getData() {
    this.quizesCollection = this.db.collection("quizes").snapshotChanges();
    return this.quizesCollection;
  }
}
