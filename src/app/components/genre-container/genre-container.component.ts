import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-genre-container',
  templateUrl: './genre-container.component.html',
  styleUrls: ['./genre-container.component.scss']
})
export class GenreContainerComponent implements OnInit {

  genres: string[] = ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions', 'Decimals', 'Algebra', 'Geometry', 'Calculus', 'Computer Science', 'Miscellaneous'];

  constructor() { }

  ngOnInit() {
  }

}
