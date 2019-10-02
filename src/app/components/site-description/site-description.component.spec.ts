import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteDescriptionComponent } from './site-description.component';

describe('SiteDescriptionComponent', () => {
  let component: SiteDescriptionComponent;
  let fixture: ComponentFixture<SiteDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
