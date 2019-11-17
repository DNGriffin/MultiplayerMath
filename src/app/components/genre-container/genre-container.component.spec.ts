import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreContainerComponent } from './genre-container.component';

describe('GenreContainerComponent', () => {
  let component: GenreContainerComponent;
  let fixture: ComponentFixture<GenreContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenreContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
