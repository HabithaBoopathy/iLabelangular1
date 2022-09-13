import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MCustomerComponent } from './m-customer.component';

describe('MCustomerComponent', () => {
  let component: MCustomerComponent;
  let fixture: ComponentFixture<MCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
