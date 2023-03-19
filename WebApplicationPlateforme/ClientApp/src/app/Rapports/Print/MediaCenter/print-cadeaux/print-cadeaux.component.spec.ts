import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCadeauxComponent } from './print-cadeaux.component';

describe('PrintCadeauxComponent', () => {
  let component: PrintCadeauxComponent;
  let fixture: ComponentFixture<PrintCadeauxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintCadeauxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCadeauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
