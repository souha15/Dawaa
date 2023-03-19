import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportFinMenuComponent } from './rapport-fin-menu.component';

describe('RapportFinMenuComponent', () => {
  let component: RapportFinMenuComponent;
  let fixture: ComponentFixture<RapportFinMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportFinMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportFinMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
