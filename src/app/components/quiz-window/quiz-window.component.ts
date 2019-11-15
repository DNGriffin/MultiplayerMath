import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from 'src/app/quizes/quiz.service';

@Component({
  selector: 'app-quiz-window',
  templateUrl: './quiz-window.component.html',
  styleUrls: ['./quiz-window.component.scss']
})
export class QuizWindowComponent implements OnInit {

  @Input() quizData: any;
  @Input() id: string;
  @Input() didCreateQuiz: boolean;
  @Output() didDelete: EventEmitter<string> = new EventEmitter();
 
  constructor(private router: Router) { }

  ngOnInit() {
  }

  routeToGame(event) {
    this.router.navigate(['play'], { queryParams: { id: this.id, title: this.quizData.title } });
  }
  routeToSoloGame(event) {
    this.router.navigate(['play/solo'], { queryParams: { id: this.id, title: this.quizData.title} });
  }
  routeToOnlineGame(event) {
    this.router.navigate(['play/online'], { queryParams: { id: this.id, title: this.quizData.title} });
  }

  deleteQuiz(quizId) {
    if (confirm("Are you sure you want to delete the quiz: " + this.quizData.title + "?")) {
      this.didDelete.emit(quizId);
    }
  }
}
