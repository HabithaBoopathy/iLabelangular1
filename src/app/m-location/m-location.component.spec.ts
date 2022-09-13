import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MLocationComponent } from './m-location.component';

describe('MLocationComponent', () => {
  let component: MLocationComponent;
  let fixture: ComponentFixture<MLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
