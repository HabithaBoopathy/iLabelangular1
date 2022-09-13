import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MProductreferenceComponent } from './m-productreference.component';

describe('MProductreferenceComponent', () => {
  let component: MProductreferenceComponent;
  let fixture: ComponentFixture<MProductreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MProductreferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MProductreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
