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

    console.log(event);
  }
  routeToSoloGame(event) {
    this.router.navigate(['play/solo'], { queryParams: { id: this.id, title: this.quizData.title} });

    console.log(event);
  }
  routeToOnlineGame(event) {
    this.router.navigate(['play/online'], { queryParams: { id: this.id, title: this.quizData.title} });

    console.log(event);
  }

  deleteQuiz(quizId) {
    this.didDelete.emit(quizId);
  }
 
  editQuiz() {
    this.router.navigateByUrl('/editQuiz', { state: { quiz: this.quizData } });
  }

}
