import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOtherdetailsComponent } from './m-otherdetails.component';

describe('MOtherdetailsComponent', () => {
  let component: MOtherdetailsComponent;
  let fixture: ComponentFixture<MOtherdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MOtherdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MOtherdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
