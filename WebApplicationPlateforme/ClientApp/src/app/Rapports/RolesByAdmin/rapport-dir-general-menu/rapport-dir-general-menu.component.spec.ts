import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportDirGeneralMenuComponent } from './rapport-dir-general-menu.component';

describe('RapportDirGeneralMenuComponent', () => {
  let component: RapportDirGeneralMenuComponent;
  let fixture: ComponentFixture<RapportDirGeneralMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportDirGeneralMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportDirGeneralMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
