import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MColorComponent } from './m-color.component';

describe('MColorComponent', () => {
  let component: MColorComponent;
  let fixture: ComponentFixture<MColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MColorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
