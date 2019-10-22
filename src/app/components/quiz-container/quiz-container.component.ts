import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/quizes/quiz.service';

@Component({
  selector: 'app-quiz-container',
  templateUrl: './quiz-container.component.html',
  styleUrls: ['./quiz-container.component.scss']
})
export class QuizContainerComponent implements OnInit {

  quizes: any

  constructor(private quizService: QuizService) { }

  ngOnInit() {
    this.quizes = this.quizService.quizesCollection.snapshotChanges();
  }

}
