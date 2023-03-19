import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionMenuRapportComponent } from './transaction-menu-rapport.component';

describe('TransactionMenuRapportComponent', () => {
  let component: TransactionMenuRapportComponent;
  let fixture: ComponentFixture<TransactionMenuRapportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionMenuRapportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionMenuRapportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
