import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartAddComponent } from './depart-add.component';

describe('DepartAddComponent', () => {
  let component: DepartAddComponent;
  let fixture: ComponentFixture<DepartAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
