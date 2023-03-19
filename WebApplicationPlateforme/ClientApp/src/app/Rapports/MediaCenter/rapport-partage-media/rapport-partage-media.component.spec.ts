import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportPartageMediaComponent } from './rapport-partage-media.component';

describe('RapportPartageMediaComponent', () => {
  let component: RapportPartageMediaComponent;
  let fixture: ComponentFixture<RapportPartageMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportPartageMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportPartageMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
