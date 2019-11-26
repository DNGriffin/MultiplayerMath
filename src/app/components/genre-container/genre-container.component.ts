import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-genre-container',
  templateUrl: './genre-container.component.html',
  styleUrls: ['./genre-container.component.scss']
})
export class GenreContainerComponent implements OnInit {

  genres: string[] = ['New', 'Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions', 'Decimals', 'Algebra', 'Geometry', 'Calculus', 'CompSci', 'Miscellaneous'];

  constructor() { }

  ngOnInit() {
  }

}
