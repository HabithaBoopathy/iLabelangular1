import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationOrdersComponent } from './quotation-orders.component';

describe('QuotationOrdersComponent', () => {
  let component: QuotationOrdersComponent;
  let fixture: ComponentFixture<QuotationOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
