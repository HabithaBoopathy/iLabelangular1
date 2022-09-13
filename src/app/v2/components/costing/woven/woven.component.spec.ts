import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WovenComponent } from './woven.component';

describe('WovenComponent', () => {
  let component: WovenComponent;
  let fixture: ComponentFixture<WovenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WovenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WovenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
