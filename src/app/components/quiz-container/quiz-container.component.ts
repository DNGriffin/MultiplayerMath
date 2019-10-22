import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/quizes/quiz.service';
import { defineBase } from '@angular/core/src/render3';
import { FirebaseApp } from '@angular/fire';

@Component({
  selector: 'app-quiz-container',
  templateUrl: './quiz-container.component.html',
  styleUrls: ['./quiz-container.component.scss']
})
export class QuizContainerComponent implements OnInit {

  quizes: any

  constructor(private quizService: QuizService) { }

  ngOnInit() {
    this.quizes = this.getQuizes();
  }

  //TODO: Get quizes that have the same email as the user, one of the user's subscriptions, or that have the canned quiz identifier (special email of some sort)
  getQuizes() {
    return this.quizService.quizesCollection.snapshotChanges();
  }

}
