import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionContainerComponent } from './subscription-container.component';

describe('SubscriptionContainerComponent', () => {
  let component: SubscriptionContainerComponent;
  let fixture: ComponentFixture<SubscriptionContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
