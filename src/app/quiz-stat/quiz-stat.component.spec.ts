import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizStatComponent } from './quiz-stat.component';

describe('QuizStatComponent', () => {
  let component: QuizStatComponent;
  let fixture: ComponentFixture<QuizStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
