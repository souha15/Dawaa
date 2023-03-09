import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirListDemandeBesoinsComponent } from './dir-list-demande-besoins.component';

describe('DirListDemandeBesoinsComponent', () => {
  let component: DirListDemandeBesoinsComponent;
  let fixture: ComponentFixture<DirListDemandeBesoinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirListDemandeBesoinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirListDemandeBesoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
