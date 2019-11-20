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
  topScoreList: any
  averagePercentCorrect: number
  numPlays: number

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
      this.db.collection('quizes').doc(this.id).ref.get().then(function(doc) {
        if(doc.data().numPlays) {
          myself.numPlays = doc.data().numPlays;
          myself.averagePercentCorrect = Math.round(doc.data().averagePercentCorrect * 100)
          myself.topScoreList = doc.data().topScoreList
          myself.topScoreList.sort((a,b) => a.score < b.score);
        } else {
          myself.numPlays = 0;
          myself.averagePercentCorrect = 0;
          myself.topScoreList = 0;
        }
        
      });
  
    });
    
  }

}
