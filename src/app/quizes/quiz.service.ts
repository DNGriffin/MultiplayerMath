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

  public createQuiz(quizObj: any) {
    this.quizesCollection.add(quizObj);
  }

  public deleteQuiz(quizId: string){
    this.quizDoc = this.db.doc(`quizes/${quizId}`);
    this.quizDoc.delete();
  }

  public likeQuiz(quizId: string, newNumLikes: number, newLikeEmails: any) {
    this.db
      .collection('quizes')
      .doc(quizId)
      .set( {
        numLikes: newNumLikes,
        likeEmails: newLikeEmails
      }, { merge: true });
  }

  public updateQuiz(quizId: string, updatedQuizForm){
    this.db
    .collection('quizes')
    .doc(quizId)
    .set( { 
      questions: updatedQuizForm.questions, 
      title: updatedQuizForm.title, 
      quizAccessCode: updatedQuizForm.quizAccessCode,
      quizLearningObjective: updatedQuizForm.quizLearningObjective,
      quizTopic: updatedQuizForm.quizTopic,
      quizPublicAccess: updatedQuizForm.quizPublicAccess
    }, { merge: true });
  }
}
