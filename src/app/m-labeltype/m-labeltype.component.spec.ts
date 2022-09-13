import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MLabeltypeComponent } from './m-labeltype.component';

describe('MLabeltypeComponent', () => {
  let component: MLabeltypeComponent;
  let fixture: ComponentFixture<MLabeltypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MLabeltypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MLabeltypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
