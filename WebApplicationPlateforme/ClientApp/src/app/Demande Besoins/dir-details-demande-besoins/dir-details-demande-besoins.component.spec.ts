import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirDetailsDemandeBesoinsComponent } from './dir-details-demande-besoins.component';

describe('DirDetailsDemandeBesoinsComponent', () => {
  let component: DirDetailsDemandeBesoinsComponent;
  let fixture: ComponentFixture<DirDetailsDemandeBesoinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirDetailsDemandeBesoinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirDetailsDemandeBesoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
