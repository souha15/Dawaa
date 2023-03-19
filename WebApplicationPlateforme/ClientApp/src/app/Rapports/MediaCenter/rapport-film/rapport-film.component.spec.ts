import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportFilmComponent } from './rapport-film.component';

describe('RapportFilmComponent', () => {
  let component: RapportFilmComponent;
  let fixture: ComponentFixture<RapportFilmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportFilmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportFilmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
