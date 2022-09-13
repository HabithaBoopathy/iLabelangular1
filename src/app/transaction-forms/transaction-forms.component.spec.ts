import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionFormsComponent } from './transaction-forms.component';

describe('TransactionFormsComponent', () => {
  let component: TransactionFormsComponent;
  let fixture: ComponentFixture<TransactionFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
