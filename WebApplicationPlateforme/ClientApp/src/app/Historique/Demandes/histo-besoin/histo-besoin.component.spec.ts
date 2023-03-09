import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoBesoinComponent } from './histo-besoin.component';

describe('HistoBesoinComponent', () => {
  let component: HistoBesoinComponent;
  let fixture: ComponentFixture<HistoBesoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoBesoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoBesoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
