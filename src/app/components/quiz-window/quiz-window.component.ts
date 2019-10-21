import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-window',
  templateUrl: './quiz-window.component.html',
  styleUrls: ['./quiz-window.component.scss']
})
export class QuizWindowComponent implements OnInit {

  @Input() quizTitle: string;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  routeToGame(event) {
    this.router.navigate(['play'])
    console.log(event);
  }
}
