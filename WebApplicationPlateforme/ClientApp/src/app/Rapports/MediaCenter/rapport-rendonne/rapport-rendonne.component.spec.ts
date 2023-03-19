import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportRendonneComponent } from './rapport-rendonne.component';

describe('RapportRendonneComponent', () => {
  let component: RapportRendonneComponent;
  let fixture: ComponentFixture<RapportRendonneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportRendonneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportRendonneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
