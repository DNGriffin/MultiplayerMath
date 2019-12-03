import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionQuizzesComponent } from './subscription-quizzes.component';

describe('SubscriptionQuizzesComponent', () => {
  let component: SubscriptionQuizzesComponent;
  let fixture: ComponentFixture<SubscriptionQuizzesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionQuizzesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionQuizzesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
