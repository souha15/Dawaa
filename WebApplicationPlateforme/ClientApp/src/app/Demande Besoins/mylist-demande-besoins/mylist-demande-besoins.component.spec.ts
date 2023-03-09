import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MylistDemandeBesoinsComponent } from './mylist-demande-besoins.component';

describe('MylistDemandeBesoinsComponent', () => {
  let component: MylistDemandeBesoinsComponent;
  let fixture: ComponentFixture<MylistDemandeBesoinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MylistDemandeBesoinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MylistDemandeBesoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
