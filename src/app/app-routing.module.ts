import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './game/game.component';
import { LoginComponent } from './components/login/login.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { AuthGuard } from './components/core/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { CreateQuizComponent } from './components/create-quiz/create-quiz.component';

const routes: Routes = [{
    path: '',
    component: WelcomePageComponent
  }, { 
    path: 'play',
    component: GameComponent
  }, {
    path: 'login',
    component: LoginComponent,
    // canActivate: [AuthGuard]
  }, { 
    path: 'register', 
    component: RegisterComponent
    // canActivate: [AuthGuard] 
  }, {
    path: 'dashboard',
    component: DashboardComponent
  }, {
    path: 'subscriptions',
    component: SubscriptionsComponent
  }, {
    path: 'createQuiz',
    component: CreateQuizComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
