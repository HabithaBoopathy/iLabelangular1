import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MCustomerreferenceComponent } from './m-customerreference.component';

describe('MCustomerreferenceComponent', () => {
  let component: MCustomerreferenceComponent;
  let fixture: ComponentFixture<MCustomerreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MCustomerreferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MCustomerreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
