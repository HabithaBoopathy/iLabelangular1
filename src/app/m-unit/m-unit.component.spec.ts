import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MUnitComponent } from './m-unit.component';

describe('MUnitComponent', () => {
  let component: MUnitComponent;
  let fixture: ComponentFixture<MUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
