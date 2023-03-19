import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintOccasionComponent } from './print-occasion.component';

describe('PrintOccasionComponent', () => {
  let component: PrintOccasionComponent;
  let fixture: ComponentFixture<PrintOccasionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintOccasionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintOccasionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
