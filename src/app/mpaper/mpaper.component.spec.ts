import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpaperComponent } from './mpaper.component';

describe('MpaperComponent', () => {
  let component: MpaperComponent;
  let fixture: ComponentFixture<MpaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MpaperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MpaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
