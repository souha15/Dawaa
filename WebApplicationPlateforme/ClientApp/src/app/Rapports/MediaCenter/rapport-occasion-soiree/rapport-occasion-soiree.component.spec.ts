import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportOccasionSoireeComponent } from './rapport-occasion-soiree.component';

describe('RapportOccasionSoireeComponent', () => {
  let component: RapportOccasionSoireeComponent;
  let fixture: ComponentFixture<RapportOccasionSoireeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportOccasionSoireeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportOccasionSoireeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
