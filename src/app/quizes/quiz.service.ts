import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { TouchSequence } from 'selenium-webdriver';
import { User } from 'firebase';
import { UserService } from '../components/core/user.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  quizesCollection: AngularFirestoreCollection;
  user: User;
  quizDoc: AngularFirestoreDocument<any>;

  constructor(private db: AngularFirestore) {
    this.getData();
  }

  public getData() {
    this.quizesCollection = this.db.collection("quizes");
    return this.quizesCollection;
  }

  public createQuiz(quizObj: Object) {
    this.quizesCollection.add(quizObj);
  }

  public deleteQuiz(quizId: string){
    this.quizDoc = this.db.doc(`quizes/${quizId}`);
    this.quizDoc.delete();
  }

  public updateQuiz(quizId: string, updatedQuizForm){
    this.db
    .collection('quizes')
    .doc(quizId)
    .set( { questions: updatedQuizForm.questions, title: updatedQuizForm.title }, { merge: true });
  }
}
