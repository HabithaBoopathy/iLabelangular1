import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostingListComponent } from './costing-list.component';

describe('CostingListComponent', () => {
  let component: CostingListComponent;
  let fixture: ComponentFixture<CostingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
