import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportVisiteGeneralComponent } from './rapport-visite-general.component';

describe('RapportVisiteGeneralComponent', () => {
  let component: RapportVisiteGeneralComponent;
  let fixture: ComponentFixture<RapportVisiteGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportVisiteGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportVisiteGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
