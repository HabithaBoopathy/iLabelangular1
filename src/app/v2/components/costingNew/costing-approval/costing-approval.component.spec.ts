import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostingApprovalComponent } from './costing-approval.component';

describe('CostingApprovalComponent', () => {
  let component: CostingApprovalComponent;
  let fixture: ComponentFixture<CostingApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostingApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
