import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportMediaCenterMenuComponent } from './rapport-media-center-menu.component';

describe('RapportMediaCenterMenuComponent', () => {
  let component: RapportMediaCenterMenuComponent;
  let fixture: ComponentFixture<RapportMediaCenterMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportMediaCenterMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportMediaCenterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
