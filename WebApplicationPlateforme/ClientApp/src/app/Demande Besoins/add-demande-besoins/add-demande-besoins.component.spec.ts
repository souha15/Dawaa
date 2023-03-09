import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDemandeBesoinsComponent } from './add-demande-besoins.component';

describe('AddDemandeBesoinsComponent', () => {
  let component: AddDemandeBesoinsComponent;
  let fixture: ComponentFixture<AddDemandeBesoinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDemandeBesoinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDemandeBesoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
