import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteGeneralListComponent } from './visite-general-list.component';

describe('VisiteGeneralListComponent', () => {
  let component: VisiteGeneralListComponent;
  let fixture: ComponentFixture<VisiteGeneralListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteGeneralListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteGeneralListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
