import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkedComponent } from './networked.component';

describe('NetworkedComponent', () => {
  let component: NetworkedComponent;
  let fixture: ComponentFixture<NetworkedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
