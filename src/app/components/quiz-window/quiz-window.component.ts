import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from 'src/app/quizes/quiz.service';

@Component({
  selector: 'app-quiz-window',
  templateUrl: './quiz-window.component.html',
  styleUrls: ['./quiz-window.component.scss']
})
export class QuizWindowComponent implements OnInit {

  @Input() quizTitle: string;
  @Input() id: string;


  constructor(
    private router: Router,
    private quizService: QuizService,
    ) { }

  ngOnInit() {
  }

  routeToGame(event) {
    this.router.navigate(['play'], { queryParams: { id: this.id, title: this.quizTitle} });

    console.log(event);
  }
  routeToSoloGame(event) {
    this.router.navigate(['play/solo'], { queryParams: { id: this.id, title: this.quizTitle} });

    console.log(event);
  }
  routeToOnlineGame(event) {
    this.router.navigate(['play/online'], { queryParams: { id: this.id, title: this.quizTitle} });

    console.log(event);
  }

  deleteQuiz(event, quizId) {
    this.quizService.deleteQuiz(quizId)
  }
}
