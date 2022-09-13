import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickerOffsetCostingComponent } from './sticker-offset-costing.component';

describe('StickerOffsetCostingComponent', () => {
  let component: StickerOffsetCostingComponent;
  let fixture: ComponentFixture<StickerOffsetCostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StickerOffsetCostingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StickerOffsetCostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
