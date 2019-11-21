import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { QuizService } from 'src/app/quizes/quiz.service';

@Component({
  selector: 'app-quiz-window',
  templateUrl: './quiz-window.component.html',
  styleUrls: ['./quiz-window.component.scss'],
})
export class QuizWindowComponent implements OnInit {

  @Input() quizData: any;
  @Input() id: string;
  @Input() numLikes: number;
  @Input() likeEmails: Array<string>;
  @Input() didCreateQuiz: boolean;
  @Output() didDelete: EventEmitter<string> = new EventEmitter();
  @Output() didLike: EventEmitter<string> = new EventEmitter();
 
  constructor(
    private quizService: QuizService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
  ) { }

  ngOnInit() {
  }

  deleteQuiz(quizId) {
    if (confirm("Are you sure you want to delete the quiz: " + this.quizData.title + "?")) {
      this.didDelete.emit(quizId);
    }
  }
 
  editQuiz() {
    this.router.navigateByUrl('/editQuiz', { state: { quiz: this.quizData } });
  }

  likeQuiz(quizId) {
    this.didLike.emit(quizId);
  }

  didLikedEmail(){
    return this.likeEmails.includes(this.afAuth.auth.currentUser.email);
  }

}
