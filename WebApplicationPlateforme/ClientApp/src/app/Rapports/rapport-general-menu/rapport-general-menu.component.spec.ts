import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportGeneralMenuComponent } from './rapport-general-menu.component';

describe('RapportGeneralMenuComponent', () => {
  let component: RapportGeneralMenuComponent;
  let fixture: ComponentFixture<RapportGeneralMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportGeneralMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportGeneralMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
