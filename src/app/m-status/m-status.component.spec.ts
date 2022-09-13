import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MStatusComponent } from './m-status.component';

describe('MStatusComponent', () => {
  let component: MStatusComponent;
  let fixture: ComponentFixture<MStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
