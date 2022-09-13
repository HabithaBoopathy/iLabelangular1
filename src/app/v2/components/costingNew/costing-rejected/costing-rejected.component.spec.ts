import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostingRejectedComponent } from './costing-rejected.component';

describe('CostingRejectedComponent', () => {
  let component: CostingRejectedComponent;
  let fixture: ComponentFixture<CostingRejectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostingRejectedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostingRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
