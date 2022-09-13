import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MTapeComponent } from './m-tape.component';

describe('MTapeComponent', () => {
  let component: MTapeComponent;
  let fixture: ComponentFixture<MTapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MTapeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MTapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
