import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintVisiteGeneralComponent } from './print-visite-general.component';

describe('PrintVisiteGeneralComponent', () => {
  let component: PrintVisiteGeneralComponent;
  let fixture: ComponentFixture<PrintVisiteGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintVisiteGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintVisiteGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
