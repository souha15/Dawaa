import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintMontageComponent } from './print-montage.component';

describe('PrintMontageComponent', () => {
  let component: PrintMontageComponent;
  let fixture: ComponentFixture<PrintMontageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintMontageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintMontageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
