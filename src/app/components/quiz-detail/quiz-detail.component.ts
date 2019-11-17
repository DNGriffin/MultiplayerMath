import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-quiz-detail',
  templateUrl: './quiz-detail.component.html',
  styleUrls: ['./quiz-detail.component.scss']
})
export class QuizDetailComponent implements OnInit {

  uid: string
  email: string
  quiz: any
  id: string

  constructor(
    private router: Router,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private _Activatedroute:ActivatedRoute
  ) { }

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => { 
      this.id = params.get('id');
      var myself = this
      this.db.collection('quizes').doc(this.id).ref.get().then(function(doc) {
        myself.quiz = doc.data();
      });
    });
  }

  routeToGame(event) {
    this.router.navigate(['play'], { queryParams: { id: this.id, title: this.quiz.title } });
  }
  routeToSoloGame(event) {
    this.router.navigate(['play/solo'], { queryParams: { id: this.id, title: this.quiz.title} });
  }
  routeToOnlineGame(event) {
    this.router.navigate(['play/online'], { queryParams: { id: this.id, title: this.quiz.title} });
  }

}
