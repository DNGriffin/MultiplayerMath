import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  searchTerm: string

  constructor(
    private _Activatedroute:ActivatedRoute
  ) { }

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => { 
      this.searchTerm = params.get('searchTerm')
    });
  }

  getSearchTerm(){
    return this.searchTerm;
  }

}
