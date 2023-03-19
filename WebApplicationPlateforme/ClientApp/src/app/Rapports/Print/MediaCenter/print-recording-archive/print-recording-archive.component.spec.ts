import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintRecordingArchiveComponent } from './print-recording-archive.component';

describe('PrintRecordingArchiveComponent', () => {
  let component: PrintRecordingArchiveComponent;
  let fixture: ComponentFixture<PrintRecordingArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintRecordingArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintRecordingArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
