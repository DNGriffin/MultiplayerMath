import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './game/game.component';
import { LoginComponent } from './components/login/login.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { CreateQuizComponent } from './components/create-quiz/create-quiz.component';
import { SingleplayerComponent } from './game/singleplayer/singleplayer.component';
import { NetworkedComponent } from './game/networked/networked.component';
import { EditQuizComponent } from './components/edit-quiz/edit-quiz.component';
import { QuizDetailComponent } from './components/quiz-detail/quiz-detail.component';
import { DiscoverGenreComponent } from './components/discover-genre/discover-genre.component';
import { QuizStatComponent } from './quiz-stat/quiz-stat.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { FriendsComponent } from './components/friends/friends.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';

const routes: Routes = [{
    path: '',
    component: WelcomePageComponent
  }, { 
    path: 'play',
    component: GameComponent
  },{ 
    path: 'play/solo',
    component: SingleplayerComponent
  },{ 
    path: 'play/online',
    component: NetworkedComponent
  },{
    path: 'login',
    component: LoginComponent,
  }, { 
    path: 'register', 
    component: RegisterComponent
  }, {
    path: 'dashboard',
    component: DashboardComponent
  }, {
    path: 'subscriptions',
    component: SubscriptionsComponent
  }, {
    path: 'createQuiz',
    component: CreateQuizComponent
  }, {
    path: 'editQuiz/:id',
    component: EditQuizComponent
  }, {
    path: 'quiz/:id',
    component: QuizDetailComponent
  }, {
    path: 'genres/:genre',
    component: DiscoverGenreComponent
  }, {
    path: 'quizStat/:id',
    component: QuizStatComponent
  }, {
    path: 'forgetPassword',
    component: ForgetPasswordComponent
  }, {
    path: 'friends',
    component: FriendsComponent
  },{
    path: 'searchQuiz/:searchTerm',
    component: SearchResultsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
