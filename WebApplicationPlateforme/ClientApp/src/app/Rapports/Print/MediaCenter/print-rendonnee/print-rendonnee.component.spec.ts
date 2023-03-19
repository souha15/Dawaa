import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintRendonneeComponent } from './print-rendonnee.component';

describe('PrintRendonneeComponent', () => {
  let component: PrintRendonneeComponent;
  let fixture: ComponentFixture<PrintRendonneeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintRendonneeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintRendonneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
