import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintInterviewComponent } from './print-interview.component';

describe('PrintInterviewComponent', () => {
  let component: PrintInterviewComponent;
  let fixture: ComponentFixture<PrintInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
