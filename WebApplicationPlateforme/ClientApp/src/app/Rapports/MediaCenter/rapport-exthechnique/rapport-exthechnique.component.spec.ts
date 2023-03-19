import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportExthechniqueComponent } from './rapport-exthechnique.component';

describe('RapportExthechniqueComponent', () => {
  let component: RapportExthechniqueComponent;
  let fixture: ComponentFixture<RapportExthechniqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportExthechniqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportExthechniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
