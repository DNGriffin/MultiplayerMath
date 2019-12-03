import { Component, OnInit, Input } from '@angular/core';
import { QuizService } from 'src/app/quizes/quiz.service';
import { defineBase } from '@angular/core/src/render3';
import { FirebaseApp } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-quiz-container',
  templateUrl: './quiz-container.component.html',
  styleUrls: ['./quiz-container.component.scss']
})
export class QuizContainerComponent implements OnInit {

  @Input() sectionTitle: string;
  @Input() sectionId: string;
  @Input() subAccessCode: string;

  quizes: any
  subs: any[];
  quizIds = [];
  playableQuizes = [];
  quizOwner = [];
  didSubmitLike = false;

  topics: string[] = ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions', 'Decimals', 'Algebra', 'Geometry', 'Calculus', 'Computer Science', 'Miscellaneous'];

  constructor(private quizService: QuizService,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private route : ActivatedRoute,
    private router : Router
    ) { }

  ngOnInit() {
    setTimeout(() => {
    }, 600);
    this.afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.getQuizesToDisplay();
      }
    });
  }

  getQuizesToDisplay() {
    switch(this.sectionId) {
      case 'myQuizzes': {
        this.getMyQuizes();
        break;
      }
      case 'adminQuizzes': {
        this.getAdminQuizzes();
        break;
      }
      case 'subscriptionQuizzes': {
        this.getSubscriptionQuizzes(this.sectionTitle, this.subAccessCode);
        break;
      }
      case 'genreQuizzes': {
        if(this.sectionTitle == "New"){
          this.getNewQuizes();
        } else {
          this.getGenreQuizzes(this.sectionTitle);
        }
        break;
      }
      default: {
        this.getSearchResults(this.sectionTitle);
        break; 
     }
    }
  }

  getMyQuizes(){
    var myQuizes = this.db.collection('quizes', ref => ref.where('userEmail', '==', this.afAuth.auth.currentUser.email).orderBy('numLikes', 'desc')).snapshotChanges();
    myQuizes.subscribe(
      (res) => {
        for(var j = 0;j < res.length; j++){
          var data: any = res[j].payload.doc.data();
          if(!this.quizIds.includes(res[j].payload.doc.id)) {
            this.quizIds.push(res[j].payload.doc.id);
            this.playableQuizes.push(data);
            this.quizOwner.push(true);
          }
        }
      },
      (err) => console.log(err),
      () => console.log("got sub emails")
    );
  }

  getAdminQuizzes() {
    var adminQuizes = this.db.collection('quizes', ref => ref.where('userEmail', '==', "admin@mmath.com").orderBy('numLikes', 'desc')).snapshotChanges();
    adminQuizes.subscribe(
      (res) => {
        for(var j = 0;j < res.length; j++){
          var data: any = res[j].payload.doc.data();
          if(!this.quizIds.includes(res[j].payload.doc.id)) {
            this.quizIds.push(res[j].payload.doc.id);
            this.playableQuizes.push(data);
            this.quizOwner.push(false);
          }
        }
      },
      (err) => console.log(err),
      () => console.log("got sub emails")
    );
  }

  getSubscriptionQuizzes(email: string, accessCode: string){
    var subscriptionQuizzes = this.db.collection('quizes', ref => ref.where('userEmail', '==', email).where('quizAccessCode', '==', accessCode).orderBy('numLikes', 'desc')).snapshotChanges();
    subscriptionQuizzes.subscribe(
      (res) => {
        for(var j = 0;j < res.length; j++){
          var data: any = res[j].payload.doc.data();
          if(!this.quizIds.includes(res[j].payload.doc.id)) {
            this.quizIds.push(res[j].payload.doc.id);
            this.playableQuizes.push(data);
            this.quizOwner.push(false);
          }
        }
      },
      (err) => console.log(err),
      () => console.log("got sub emails")
    );
  }

  getAllSubscriptionQuizzes() {
    this.getSubscriptionEmails();
  }

  getSubscriptionEmails() {
    var subs;

    subs = this.db.collection('subscriptions', ref => ref.where('id', '==', this.afAuth.auth.currentUser.uid)).snapshotChanges();
    subs.subscribe(
      (res) => {
        var data = res[0].payload.doc.data();
        this.subs = data.subs;
        this.getQuizesFromSubs();
      },
      (err) => console.log(err),
      () => console.log('finished')
    );
  }

  getQuizesFromSubs(){
    for(var i = 0; i < this.subs.length; i++){
      var quizCol = this.db.collection('quizes', ref => ref.where('userEmail', '==', this.subs[i].email)).snapshotChanges();
      this.subscribeToQuizCol(i, quizCol);
    }
  }

  subscribeToQuizCol(subsIndex, quizCol) {
    quizCol.subscribe(
      (res) => {
        for(var j = 0;j < res.length; j++){
          var data: any = res[j].payload.doc.data();
          if(this.canAccessPrivateQuiz(subsIndex, data)) {
            if(!this.quizIds.includes(res[j].payload.doc.id)) {
              this.quizIds.push(res[j].payload.doc.id);
              this.playableQuizes.push(data);
              this.quizOwner.push(false);
            }
          }
        }
      },
      (err) => console.log(err),
      () => console.log("got sub emails")
    );
  }

  getNewQuizes(){
    var myQuizes = this.db.collection('quizes', ref => ref.where('quizPublicAccess', '==', true).orderBy('createdAt', 'desc').limit(10)).snapshotChanges();
    myQuizes.subscribe(
      (res) => {
        for(var j = 0;j < res.length; j++){
          var data: any = res[j].payload.doc.data();
          if(!this.quizIds.includes(res[j].payload.doc.id)) {
            this.quizIds.push(res[j].payload.doc.id);
            this.playableQuizes.push(data);
            this.quizOwner.push(false);
          }
        }
      },
      (err) => console.log(err),
      () => console.log("got sub emails")
    );
  }

  getGenreQuizzes(genre: string) {
    var genreQuizzes = this.db.collection('quizes', ref => ref.where('quizTopic', '==', genre).orderBy('numLikes', 'desc')).snapshotChanges();
    genreQuizzes.subscribe(
      (res) => {
        for(var j = 0;j < res.length; j++){
          var data: any = res[j].payload.doc.data();
          if(data.quizPublicAccess) {
            if(!this.quizIds.includes(res[j].payload.doc.id)) {
              this.quizIds.push(res[j].payload.doc.id);
              this.playableQuizes.push(data);
              this.quizOwner.push(false);
            }
          }
        }
      },
      (err) => console.log(err),
      () => console.log("got sub emails")
    );
  }

  getSearchResults(searchTerm: string){
    var searchResults = this.db.collection('quizes', ref => ref.where('quizPublicAccess', '==', true)).snapshotChanges();
    searchResults.subscribe(
      (res) => {
        for(var j = 0;j < res.length; j++){
          var data: any = res[j].payload.doc.data();
          var titleToMatch: string = data.title.toLowerCase().replace(/\s/g, '');
          var termToMatch: string = searchTerm.toLowerCase().replace(/\s/g, '');
          if(titleToMatch.includes(termToMatch) && !this.quizIds.includes(res[j].payload.doc.id)){
            this.quizIds.push(res[j].payload.doc.id);
            this.playableQuizes.push(data);
            this.quizOwner.push(false);
          }
        }
      },
      (err) => console.log(err),
      () => console.log("got sub emails")
    );
  }

  canAccessPrivateQuiz(subsIndex, quizData) {
    return !quizData.quizPublicAccess && (quizData.quizAccessCode == this.subs[subsIndex].quizAccessCode || this.afAuth.auth.currentUser.email == "admin@mmath.com");
  }

  onDeleted(quizId: string) {
    this.quizService.deleteQuiz(quizId);
    this.quizIds = [];
    this.quizOwner = [];
    this.playableQuizes = [];
    this.getQuizesToDisplay()
  }

  onLike(quizId: string) {
    var quiz = this.db.collection('quizes').doc(quizId).snapshotChanges();
    this.didSubmitLike = false;
    quiz.subscribe(
      (res) => {
        var data: any = res.payload.data();
        if(!this.didSubmitLike) {
          this.didSubmitLike = true;
          if(data.likeEmails.includes(this.afAuth.auth.currentUser.email)) {
            var newLikeEmails = data.likeEmails.filter(email => email !== this.afAuth.auth.currentUser.email);
            var newNumLikes = data.numLikes - 1;
            this.quizService.likeQuiz(quizId, newNumLikes, newLikeEmails);
          } else {
            data.likeEmails.push(this.afAuth.auth.currentUser.email);
            var nextNumLikes = data.numLikes + 1;
            this.quizService.likeQuiz(quizId, nextNumLikes, data.likeEmails);
          }
          this.quizIds = [];
          this.quizOwner = [];
          this.playableQuizes = [];
          this.getQuizesToDisplay();
        }
      }
    )
  }
}
