import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintedCostingComponent } from './printed-costing.component';

describe('PrintedCostingComponent', () => {
  let component: PrintedCostingComponent;
  let fixture: ComponentFixture<PrintedCostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintedCostingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintedCostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
