import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-quiz-window',
  templateUrl: './quiz-window.component.html',
  styleUrls: ['./quiz-window.component.scss']
})
export class QuizWindowComponent implements OnInit {

  @Input() quizTitle: string;

  constructor() { }

  ngOnInit() {
  }

}
