import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverGenreComponent } from './discover-genre.component';

describe('DiscoverGenreComponent', () => {
  let component: DiscoverGenreComponent;
  let fixture: ComponentFixture<DiscoverGenreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscoverGenreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoverGenreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
