import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz-container',
  templateUrl: './quiz-container.component.html',
  styleUrls: ['./quiz-container.component.scss']
})
export class QuizContainerComponent implements OnInit {

  constructor() { }

  quizes: Array<string> = ["Addition", "Multiplication", "Exponents"]

  private getQuizTitle(quizId: number): string {
    if (quizId < this.quizes.length) {
      return this.quizes[quizId]
    } else {
      return "Quiz not found"
    }
  }

  ngOnInit() {
  }

}
