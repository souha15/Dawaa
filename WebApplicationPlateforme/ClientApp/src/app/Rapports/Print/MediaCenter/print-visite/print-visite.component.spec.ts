import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintVisiteComponent } from './print-visite.component';

describe('PrintVisiteComponent', () => {
  let component: PrintVisiteComponent;
  let fixture: ComponentFixture<PrintVisiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintVisiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintVisiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
