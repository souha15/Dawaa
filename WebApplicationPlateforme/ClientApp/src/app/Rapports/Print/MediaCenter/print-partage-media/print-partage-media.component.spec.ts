import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPartageMediaComponent } from './print-partage-media.component';

describe('PrintPartageMediaComponent', () => {
  let component: PrintPartageMediaComponent;
  let fixture: ComponentFixture<PrintPartageMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintPartageMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPartageMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
