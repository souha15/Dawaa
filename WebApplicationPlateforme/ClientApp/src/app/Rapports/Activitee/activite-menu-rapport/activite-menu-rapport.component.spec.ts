import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiviteMenuRapportComponent } from './activite-menu-rapport.component';

describe('ActiviteMenuRapportComponent', () => {
  let component: ActiviteMenuRapportComponent;
  let fixture: ComponentFixture<ActiviteMenuRapportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiviteMenuRapportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiviteMenuRapportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
