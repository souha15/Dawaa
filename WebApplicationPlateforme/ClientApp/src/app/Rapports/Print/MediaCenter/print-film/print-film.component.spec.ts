import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintFilmComponent } from './print-film.component';

describe('PrintFilmComponent', () => {
  let component: PrintFilmComponent;
  let fixture: ComponentFixture<PrintFilmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintFilmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintFilmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
