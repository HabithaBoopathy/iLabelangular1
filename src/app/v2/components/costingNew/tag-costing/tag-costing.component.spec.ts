import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagCostingComponent } from './tag-costing.component';

describe('TagCostingComponent', () => {
  let component: TagCostingComponent;
  let fixture: ComponentFixture<TagCostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagCostingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagCostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
