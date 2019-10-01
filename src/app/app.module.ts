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
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule // storage
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
