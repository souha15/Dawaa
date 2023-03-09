import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BesoinsCrudComponent } from './besoins-crud.component';

describe('BesoinsCrudComponent', () => {
  let component: BesoinsCrudComponent;
  let fixture: ComponentFixture<BesoinsCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BesoinsCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BesoinsCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
