import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportRecordingArchiveComponent } from './rapport-recording-archive.component';

describe('RapportRecordingArchiveComponent', () => {
  let component: RapportRecordingArchiveComponent;
  let fixture: ComponentFixture<RapportRecordingArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportRecordingArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportRecordingArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
