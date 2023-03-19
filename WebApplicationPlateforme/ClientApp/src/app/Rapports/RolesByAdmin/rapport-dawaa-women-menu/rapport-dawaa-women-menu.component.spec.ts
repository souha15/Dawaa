import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportDawaaWomenMenuComponent } from './rapport-dawaa-women-menu.component';

describe('RapportDawaaWomenMenuComponent', () => {
  let component: RapportDawaaWomenMenuComponent;
  let fixture: ComponentFixture<RapportDawaaWomenMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportDawaaWomenMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportDawaaWomenMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
