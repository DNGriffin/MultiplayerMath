import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-discover-genre',
  templateUrl: './discover-genre.component.html',
  styleUrls: ['./discover-genre.component.scss']
})
export class DiscoverGenreComponent implements OnInit {

  constructor(
    private router: Router,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private _Activatedroute:ActivatedRoute
  ) { }

  genre: string

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => { 
      this.genre = params.get('genre');
    });
  }

}
