import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickerFlexoCostingComponent } from './sticker-flexo-costing.component';

describe('StickerFlexoCostingComponent', () => {
  let component: StickerFlexoCostingComponent;
  let fixture: ComponentFixture<StickerFlexoCostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StickerFlexoCostingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StickerFlexoCostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
