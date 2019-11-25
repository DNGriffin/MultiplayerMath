import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { GameComponent } from './game/game.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SiteDescriptionComponent } from './components/site-description/site-description.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { LoginComponent } from './components/login/login.component';
import { environment } from '../environments/environment';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './components/core/auth.guard';
import { AuthService } from './components/core/auth.service';
import { UserService } from './components/core/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarLoggedInComponent } from './components/navbar-logged-in/navbar-logged-in.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { QuizWindowComponent } from './components/quiz-window/quiz-window.component';
import { QuizContainerComponent } from './components/quiz-container/quiz-container.component';
import { CreateQuizComponent } from './components/create-quiz/create-quiz.component';
import { SingleplayerComponent } from './game/singleplayer/singleplayer.component';
import { NetworkedComponent } from './game/networked/networked.component';

import { EditQuizComponent } from './components/edit-quiz/edit-quiz.component';
import { MultiplayerService } from './game/multiplayer.service';
import { QuizDetailComponent } from './components/quiz-detail/quiz-detail.component';
import { GenreContainerComponent } from './components/genre-container/genre-container.component';
import { DiscoverGenreComponent } from './components/discover-genre/discover-genre.component';
import { QuizStatComponent } from './quiz-stat/quiz-stat.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';


var firebaseConfig = {
  apiKey: "AIzaSyBLfTk9x_GXo0frYc-eRwevOntUB2uew8k",
  authDomain: "mulitplayermath.firebaseapp.com",
  databaseURL: "https://mulitplayermath.firebaseio.com",
  projectId: "mulitplayermath",
  storageBucket: "",
  messagingSenderId: "285834359487",
  appId: "1:285834359487:web:da7be87103590429e14c0a"
};

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    NavbarComponent,
    SiteDescriptionComponent,
    WelcomePageComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    NavbarLoggedInComponent,
    SubscriptionsComponent,
    QuizWindowComponent,
    QuizContainerComponent,
    CreateQuizComponent,
    SingleplayerComponent,
    NetworkedComponent,
    EditQuizComponent,
    QuizDetailComponent,
    GenreContainerComponent,
    DiscoverGenreComponent,
    QuizStatComponent,
    ForgetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule // storage
  ],
  providers: [AuthService, UserService, AuthGuard, MultiplayerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
