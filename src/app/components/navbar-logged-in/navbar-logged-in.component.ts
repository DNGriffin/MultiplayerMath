import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-logged-in',
  templateUrl: './navbar-logged-in.component.html',
  styleUrls: ['./navbar-logged-in.component.scss']
})
export class NavbarLoggedInComponent implements OnInit {

  searchTerm: string;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  searchQuizzes() {
    this.router.navigate([`../searchQuiz/${this.searchTerm}`]);
  }

}
