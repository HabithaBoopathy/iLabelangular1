import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTransactionFormsComponent } from './update-transaction-forms.component';

describe('UpdateTransactionFormsComponent', () => {
  let component: UpdateTransactionFormsComponent;
  let fixture: ComponentFixture<UpdateTransactionFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTransactionFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTransactionFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
