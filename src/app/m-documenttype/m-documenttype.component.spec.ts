import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MDocumenttypeComponent } from './m-documenttype.component';

describe('MDocumenttypeComponent', () => {
  let component: MDocumenttypeComponent;
  let fixture: ComponentFixture<MDocumenttypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MDocumenttypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MDocumenttypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
