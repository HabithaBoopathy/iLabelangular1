import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MTapeMachineComponent } from './m-tape-machine.component';

describe('MTapeMachineComponent', () => {
  let component: MTapeMachineComponent;
  let fixture: ComponentFixture<MTapeMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MTapeMachineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MTapeMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
