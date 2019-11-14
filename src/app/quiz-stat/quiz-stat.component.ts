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
        myself.playNum = doc.data().playnum;
        myself.averageScore = doc.data().averageScore
        myself.title = doc.data().title
        myself.highScore = doc.data().highScore
        myself.highScore.sort((a,b) => a.score > b.score);
        // for(var i = 0; i < myself.quiz.questions.length; i++) {
        //   myself.createQuestion(
        //     myself.quiz.questions[i].question, 
        //     myself.quiz.questions[i].answer, 
        //     myself.quiz.questions[i].fake1,
        //     myself.quiz.questions[i].fake2,
        //     myself.quiz.questions[i].fake3,
        //     myself.quiz.questions[i].difficulty
        //   );
        // }
        // myself.quizEditForm.patchValue({
        //   title: myself.quiz.title,
        //   quizAccessCode: myself.quiz.quizAccessCode
        // });
      });
    });
    
  }

}
