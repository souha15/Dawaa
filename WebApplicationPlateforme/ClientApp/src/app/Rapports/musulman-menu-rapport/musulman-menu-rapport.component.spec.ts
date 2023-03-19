import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusulmanMenuRapportComponent } from './musulman-menu-rapport.component';

describe('MusulmanMenuRapportComponent', () => {
  let component: MusulmanMenuRapportComponent;
  let fixture: ComponentFixture<MusulmanMenuRapportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusulmanMenuRapportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusulmanMenuRapportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
