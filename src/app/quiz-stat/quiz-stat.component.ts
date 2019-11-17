import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-quiz-stat',
  templateUrl: './quiz-stat.component.html',
  styleUrls: ['./quiz-stat.component.scss']
})
export class QuizStatComponent implements OnInit {

  id: string
  highScore: any
  averageScore: number
  playNum: number
  title: string

  constructor(
    private router: Router,
    private _Activatedroute:ActivatedRoute,
    private db: AngularFirestore
  )
  {}

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => { 
      this.id = params.get('id');
      var myself = this
      this.db.collection('quizStat').doc(this.id).ref.get().then(function(doc) {
        myself.playNum = doc.data().playNum;
        myself.averageScore = doc.data().averageScore
        myself.title = doc.data().title
        myself.highScore = doc.data().highScore
        myself.highScore.sort((a,b) => a.score < b.score);
      });
    });
    
  }

}
