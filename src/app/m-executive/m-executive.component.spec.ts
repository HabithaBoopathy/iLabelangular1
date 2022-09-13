import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MExecutiveComponent } from './m-executive.component';

describe('MExecutiveComponent', () => {
  let component: MExecutiveComponent;
  let fixture: ComponentFixture<MExecutiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MExecutiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MExecutiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
