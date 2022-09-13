import { TestBed } from '@angular/core/testing';

import { MotherdetailsService } from './service/motherdetails.service';

describe('MotherdetailsService', () => {
  let service: MotherdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotherdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
