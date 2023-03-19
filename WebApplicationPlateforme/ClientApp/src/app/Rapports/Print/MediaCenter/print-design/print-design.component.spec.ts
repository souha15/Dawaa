import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDesignComponent } from './print-design.component';

describe('PrintDesignComponent', () => {
  let component: PrintDesignComponent;
  let fixture: ComponentFixture<PrintDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintDesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
