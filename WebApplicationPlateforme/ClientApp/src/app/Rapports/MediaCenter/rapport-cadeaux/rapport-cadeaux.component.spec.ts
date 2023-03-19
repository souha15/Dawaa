import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportCadeauxComponent } from './rapport-cadeaux.component';

describe('RapportCadeauxComponent', () => {
  let component: RapportCadeauxComponent;
  let fixture: ComponentFixture<RapportCadeauxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportCadeauxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportCadeauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
