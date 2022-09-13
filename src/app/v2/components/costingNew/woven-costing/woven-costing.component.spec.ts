import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WovenCostingComponent } from './woven-costing.component';

describe('WovenCostingComponent', () => {
  let component: WovenCostingComponent;
  let fixture: ComponentFixture<WovenCostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WovenCostingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WovenCostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
