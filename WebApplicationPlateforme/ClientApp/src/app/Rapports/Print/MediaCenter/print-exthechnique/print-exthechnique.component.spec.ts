import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintExthechniqueComponent } from './print-exthechnique.component';

describe('PrintExthechniqueComponent', () => {
  let component: PrintExthechniqueComponent;
  let fixture: ComponentFixture<PrintExthechniqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintExthechniqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintExthechniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
