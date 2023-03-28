import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteGeneralAddComponent } from './visite-general-add.component';

describe('VisiteGeneralAddComponent', () => {
  let component: VisiteGeneralAddComponent;
  let fixture: ComponentFixture<VisiteGeneralAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteGeneralAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteGeneralAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
