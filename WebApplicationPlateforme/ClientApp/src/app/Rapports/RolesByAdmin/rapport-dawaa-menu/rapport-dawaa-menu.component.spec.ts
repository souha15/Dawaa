import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportDawaaMenuComponent } from './rapport-dawaa-menu.component';

describe('RapportDawaaMenuComponent', () => {
  let component: RapportDawaaMenuComponent;
  let fixture: ComponentFixture<RapportDawaaMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportDawaaMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportDawaaMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
