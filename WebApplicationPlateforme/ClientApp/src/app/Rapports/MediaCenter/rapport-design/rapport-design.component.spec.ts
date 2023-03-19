import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportDesignComponent } from './rapport-design.component';

describe('RapportDesignComponent', () => {
  let component: RapportDesignComponent;
  let fixture: ComponentFixture<RapportDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportDesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
