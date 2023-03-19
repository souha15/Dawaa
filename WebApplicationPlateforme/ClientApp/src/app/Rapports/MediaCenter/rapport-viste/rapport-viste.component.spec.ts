import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportVisteComponent } from './rapport-viste.component';

describe('RapportVisteComponent', () => {
  let component: RapportVisteComponent;
  let fixture: ComponentFixture<RapportVisteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportVisteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportVisteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
