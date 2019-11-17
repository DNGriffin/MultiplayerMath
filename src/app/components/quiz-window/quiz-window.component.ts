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

  deleteQuiz(quizId) {
    if (confirm("Are you sure you want to delete the quiz: " + this.quizData.title + "?")) {
      this.didDelete.emit(quizId);
    }
  }
}
