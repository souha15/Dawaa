import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportMontageComponent } from './rapport-montage.component';

describe('RapportMontageComponent', () => {
  let component: RapportMontageComponent;
  let fixture: ComponentFixture<RapportMontageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportMontageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportMontageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
