import { TestBed } from '@angular/core/testing';

import { McolorService } from './service/mcolor.service';

describe('McolorService', () => {
  let service: McolorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(McolorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
