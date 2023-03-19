import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportDotMenuComponent } from './rapport-dot-menu.component';

describe('RapportDotMenuComponent', () => {
  let component: RapportDotMenuComponent;
  let fixture: ComponentFixture<RapportDotMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportDotMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportDotMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
