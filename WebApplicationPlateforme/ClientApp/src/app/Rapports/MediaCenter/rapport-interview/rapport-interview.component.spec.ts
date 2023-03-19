import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportInterviewComponent } from './rapport-interview.component';

describe('RapportInterviewComponent', () => {
  let component: RapportInterviewComponent;
  let fixture: ComponentFixture<RapportInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
